"""Ingest EVALUASI E-COM.xlsx — pisahkan Brand vs Item, agregasi KPI."""
from __future__ import annotations

from io import BytesIO
from pathlib import Path
from typing import BinaryIO

import pandas as pd

PLATFORMS = ["Shopee", "Tokopedia", "Alfagift", "PCA", "Bli Bli", "BTB", "Lazada"]
KNOWN_BRANDS = ["BANANA BOAT", "FREEMAN", "INTUITION", "SCHICK"]

SHEET_ALIASES = {
    "SHOPEE": "Shopee",
    "TOKOPEDIA": "Tokopedia",
    "TOKPED": "Tokopedia",
    "ALFAGIFT": "Alfagift",
    "ALFA GIFT": "Alfagift",
    "PCA": "PCA",
    "BLI BLI": "Bli Bli",
    "BLIBLI": "Bli Bli",
    "BLI-BLI": "Bli Bli",
    "BTB": "BTB",
    "B2B": "BTB",
    "LAZADA": "Lazada",
}

TOTAL_MARKERS = {"TOTAL", "GRAND TOTAL", "GRANDTOTAL", "JUMLAH", "SUBTOTAL", "OVERALL"}
SKIP_MARKERS = {"NAN", "NONE", "NULL", "-", "—"}

NAME_KEYS = ("ITEM", "NAMA", "PRODUCT", "PRODUK", "DESCRIPTION", "KETERANGAN", "SKU")
TARGET_KEYS = ("TARGET 2026", "TARGET2026", "TGT 2026")
YTD_KEYS = ("YTD AUG 26", "YTD AUG 2026", "YTD AUG", "YTD 26", "YTD AUG26")
GAP_KEYS = ("KURANG TARGET", "SHORTFALL", "SELISIH TARGET")
TREND_KEYS = ("SALES TREND", "TREND SALES", "TREND %", "% TREND")
BRAND_KEYS = ("BRAND", "MEREK")


def _norm(value: object) -> str:
    text = str(value).replace("\n", " ").strip().upper()
    return " ".join(text.split())


def resolve_excel_path(base_dir: Path | None = None) -> Path | None:
    root = Path(base_dir) if base_dir else Path(__file__).resolve().parent
    candidates = [
        root / "data" / "EVALUASI E-COM.xlsx",
        root / "EVALUASI E-COM.xlsx",
        root.parent / "EVALUASI E-COM.xlsx",
        root.parent / "data" / "EVALUASI E-COM.xlsx",
    ]
    for path in candidates:
        if path.exists():
            return path
    return None


def _canonical_platform(sheet_name: str) -> str | None:
    key = _norm(sheet_name)
    if key in SHEET_ALIASES:
        return SHEET_ALIASES[key]
    for alias, platform in SHEET_ALIASES.items():
        if alias in key or key in alias:
            return platform
    return None


def _to_number(value: object) -> float:
    if value is None or (isinstance(value, float) and pd.isna(value)):
        return 0.0
    if isinstance(value, (int, float)):
        return float(value)
    text = str(value).strip()
    if not text or text in {"-", "—", "NA", "N/A"}:
        return 0.0
    negative = text.startswith("(") and text.endswith(")")
    text = text.replace("(", "").replace(")", "")
    text = text.replace("%", "").replace("Rp", "").replace("IDR", "")
    text = text.replace(" ", "")
    if text.count(",") == 1 and text.count(".") >= 1:
        text = text.replace(".", "").replace(",", ".")
    elif text.count(",") > 1:
        text = text.replace(".", "").replace(",", "")
    elif text.count(".") > 1:
        text = text.replace(".", "")
    else:
        text = text.replace(",", "")
    try:
        number = float(text)
    except ValueError:
        return 0.0
    return -abs(number) if negative else number


def _match_column(columns: list[str], keys: tuple[str, ...], fallbacks: tuple[str, ...] = ()) -> str | None:
    normalized = {col: _norm(col) for col in columns}
    for key in keys:
        for col, label in normalized.items():
            if label == key:
                return col
    for key in keys:
        for col, label in normalized.items():
            if key in label:
                return col
    for key in fallbacks:
        for col, label in normalized.items():
            if key in label:
                return col
    return None


def _pick_name_column(df: pd.DataFrame, columns: list[str]) -> str | None:
    named = _match_column(columns, NAME_KEYS)
    if named:
        return named
    best_col, best_score = None, -1
    for col in df.columns:
        series = df[col]
        if series.dtype != object and not pd.api.types.is_string_dtype(series):
            sample = series.dropna().head(8)
            if not sample.empty and not all(isinstance(v, str) for v in sample):
                continue
        values = series.dropna().astype(str).str.strip()
        values = values[~values.str.upper().isin(SKIP_MARKERS | TOTAL_MARKERS)]
        if values.empty:
            continue
        unique_ratio = values.nunique() / max(len(values), 1)
        alpha_ratio = values.str.contains(r"[A-Za-z]", regex=True).mean()
        score = unique_ratio + alpha_ratio
        if score > best_score:
            best_col, best_score = col, score
    return best_col


def _infer_brand(name: str) -> str | None:
    label = _norm(name)
    for brand in KNOWN_BRANDS:
        if label == brand or label.startswith(brand + " ") or brand in label:
            return brand
    return None


def _is_brand_row(name: str) -> bool:
    label = _norm(name)
    return label in KNOWN_BRANDS


def _is_total_row(name: str) -> bool:
    label = _norm(name)
    return label in TOTAL_MARKERS or label.startswith("TOTAL")


def _classify_sheet(df: pd.DataFrame, platform: str) -> tuple[pd.DataFrame, pd.DataFrame]:
    work = df.copy()
    work.columns = [str(c).replace("\n", " ").strip() for c in work.columns]
    columns = list(work.columns)

    name_col = _pick_name_column(work, columns)
    if name_col is None:
        return pd.DataFrame(), pd.DataFrame()

    brand_col = _match_column(columns, BRAND_KEYS)
    target_col = _match_column(columns, TARGET_KEYS, ("TARGET", "TGT"))
    ytd_col = _match_column(columns, YTD_KEYS, ("YTD", "NET SALES"))
    gap_col = _match_column(columns, GAP_KEYS, ("KURANG", "GAP", "SHORTFALL", "SELISIH", "VARIANCE"))
    trend_col = _match_column(columns, TREND_KEYS, ("TREND", "GROWTH"))

    records: list[dict] = []
    current_brand: str | None = None

    for _, row in work.iterrows():
        raw_name = row.get(name_col, "")
        if pd.isna(raw_name):
            continue
        name = str(raw_name).strip()
        if not name or _norm(name) in SKIP_MARKERS or _is_total_row(name):
            continue

        explicit_brand = ""
        if brand_col and not pd.isna(row.get(brand_col)):
            explicit_brand = _infer_brand(row.get(brand_col)) or str(row.get(brand_col)).strip().upper()

        if _is_brand_row(name):
            current_brand = _norm(name)
            row_type = "brand"
            brand = current_brand
        else:
            row_type = "item"
            brand = explicit_brand or _infer_brand(name) or current_brand or "UNASSIGNED"

        target = _to_number(row.get(target_col)) if target_col else 0.0
        ytd = _to_number(row.get(ytd_col)) if ytd_col else 0.0
        gap = _to_number(row.get(gap_col)) if gap_col else (ytd - target)
        trend = _to_number(row.get(trend_col)) if trend_col else 0.0
        if trend_col and isinstance(row.get(trend_col), str) and "%" in str(row.get(trend_col)) and abs(trend) > 1:
            trend = trend / 100.0

        records.append(
            {
                "platform": platform,
                "row_type": row_type,
                "brand": brand,
                "name": name,
                "target_2026": target,
                "ytd_aug_26": ytd,
                "kurang_target": gap,
                "sales_trend": trend,
            }
        )

    out = pd.DataFrame(records)
    if out.empty:
        return out, out

    # Samakan tanda gap: shortfall selalu negatif (YTD - Target)
    positive_gap_share = (out["kurang_target"] >= 0).mean()
    under_target = out["ytd_aug_26"] < out["target_2026"]
    if positive_gap_share > 0.8 and under_target.any():
        out.loc[under_target, "kurang_target"] = (
            out.loc[under_target, "ytd_aug_26"] - out.loc[under_target, "target_2026"]
        )
        out.loc[~under_target, "kurang_target"] = (
            out.loc[~under_target, "ytd_aug_26"] - out.loc[~under_target, "target_2026"]
        )

    brands = out[out["row_type"] == "brand"].copy()
    items = out[out["row_type"] == "item"].copy()
    if brands.empty and not items.empty:
        brands = (
            items.groupby(["platform", "brand"], as_index=False)
            .agg(
                target_2026=("target_2026", "sum"),
                ytd_aug_26=("ytd_aug_26", "sum"),
                kurang_target=("kurang_target", "sum"),
                sales_trend=("sales_trend", "mean"),
            )
        )
        brands["row_type"] = "brand"
        brands["name"] = brands["brand"]
    return brands, items


def ingest_evaluasi_ecom(source: str | Path | BytesIO | BinaryIO | None = None) -> dict[str, pd.DataFrame]:
    """Baca 7 sheet (header=1), pisahkan Brands dan Items."""
    if source is None:
        found = resolve_excel_path()
        if found is None:
            raise FileNotFoundError(
                "File EVALUASI E-COM.xlsx tidak ditemukan. Unggah file atau taruh di folder data/."
            )
        source = found

    xls = pd.ExcelFile(source)
    brand_frames: list[pd.DataFrame] = []
    item_frames: list[pd.DataFrame] = []
    used_platforms: set[str] = set()

    for sheet in xls.sheet_names:
        platform = _canonical_platform(sheet)
        if platform is None or platform in used_platforms:
            continue
        used_platforms.add(platform)
        raw = pd.read_excel(xls, sheet_name=sheet, header=1)
        brands, items = _classify_sheet(raw, platform)
        if not brands.empty:
            brand_frames.append(brands)
        if not items.empty:
            item_frames.append(items)

    brands_df = pd.concat(brand_frames, ignore_index=True) if brand_frames else pd.DataFrame()
    items_df = pd.concat(item_frames, ignore_index=True) if item_frames else pd.DataFrame()
    return {"brands": brands_df, "items": items_df}


def kpi_summary(brands: pd.DataFrame) -> dict[str, float]:
    if brands.empty:
        return {"target_2026": 0.0, "ytd_aug_26": 0.0, "kurang_target": 0.0, "achievement": 0.0}
    target = float(brands["target_2026"].sum())
    ytd = float(brands["ytd_aug_26"].sum())
    gap = float(brands["kurang_target"].sum())
    achievement = (ytd / target * 100.0) if target else 0.0
    return {
        "target_2026": target,
        "ytd_aug_26": ytd,
        "kurang_target": gap,
        "achievement": achievement,
    }


def platform_contribution(brands: pd.DataFrame) -> pd.DataFrame:
    if brands.empty:
        return pd.DataFrame(columns=["platform", "target_2026"])
    return (
        brands.groupby("platform", as_index=False)["target_2026"]
        .sum()
        .sort_values("target_2026", ascending=False)
    )


def brand_performance(brands: pd.DataFrame) -> pd.DataFrame:
    if brands.empty:
        return pd.DataFrame(columns=["brand", "target_2026", "ytd_aug_26", "kurang_target"])
    return (
        brands.groupby("brand", as_index=False)
        .agg(target_2026=("target_2026", "sum"), ytd_aug_26=("ytd_aug_26", "sum"), kurang_target=("kurang_target", "sum"))
        .sort_values("target_2026", ascending=False)
    )


def support_program_table(items: pd.DataFrame, platform: str | None = None, limit: int = 25) -> pd.DataFrame:
    """Item underperformer: gap paling negatif, lalu sales trend terendah."""
    if items.empty:
        return items
    table = items.copy()
    if platform and platform != "Semua Platform":
        table = table[table["platform"] == platform]
    table = table[table["kurang_target"] < 0]
    table["achievement"] = table.apply(
        lambda r: round((r["ytd_aug_26"] / r["target_2026"] * 100.0) if r["target_2026"] else 0.0, 1),
        axis=1,
    )
    table = table.sort_values(["kurang_target", "sales_trend"], ascending=[True, True])
    table = table.head(limit).reset_index(drop=True)
    table.insert(0, "rank", table.index + 1)
    return table
