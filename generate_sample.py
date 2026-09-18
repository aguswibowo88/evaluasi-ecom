"""Buat file sampel EVALUASI E-COM.xlsx jika file asli belum tersedia."""
from __future__ import annotations

from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill

PLATFORMS = ["Shopee", "Tokopedia", "Alfagift", "PCA", "Bli Bli", "BTB", "Lazada"]
HEADERS = ["No", "Item", "2024", "2025", "TARGET 2026", "YTD AUG 26", "KURANG TARGET", "Sales Trend"]

# Skala platform terhadap target nasional (demo)
PLATFORM_WEIGHT = {
    "Shopee": 0.32,
    "Tokopedia": 0.22,
    "Lazada": 0.14,
    "Bli Bli": 0.12,
    "Alfagift": 0.09,
    "PCA": 0.07,
    "BTB": 0.04,
}

# Geser YoY per platform agar line chart Brand Growth tidak datar
PLATFORM_TREND_SHIFT = {
    "Shopee": 0.05,
    "Tokopedia": 0.02,
    "Lazada": -0.04,
    "Bli Bli": -0.06,
    "Alfagift": 0.01,
    "PCA": -0.09,
    "BTB": 0.04,
}

CATALOG = {
    "BANANA BOAT": [
        ("Banana Boat SPF 50 Lotion 180ml", 0.34, 0.48, -0.11),
        ("Banana Boat Kids SPF 50 120ml", 0.22, 0.41, -0.18),
        ("Banana Boat Sport Cool SPF 30", 0.18, 0.62, -0.04),
        ("Banana Boat After Sun Gel", 0.14, 0.71, 0.06),
        ("Banana Boat Dry Oil SPF 15", 0.12, 0.39, -0.21),
    ],
    "FREEMAN": [
        ("Freeman Charcoal Black Sugar Mask", 0.28, 0.44, -0.16),
        ("Freeman Avocado Oatmeal Mask", 0.22, 0.58, -0.07),
        ("Freeman Feeling Beautiful Peel-Off", 0.20, 0.36, -0.22),
        ("Freeman Dead Sea Minerals Mask", 0.16, 0.67, 0.03),
        ("Freeman Cucumber Facial Mask", 0.14, 0.51, -0.09),
    ],
    "INTUITION": [
        ("Intuition Sensitive Care Razor", 0.38, 0.42, -0.14),
        ("Intuition Tropical Citrus Razor", 0.27, 0.55, -0.05),
        ("Intuition Lemon Rain Refill", 0.20, 0.33, -0.25),
        ("Intuition Coconut Milk Razor", 0.15, 0.61, 0.02),
    ],
    "SCHICK": [
        ("Schick Hydro Silk Razor", 0.30, 0.46, -0.12),
        ("Schick Extreme3 Disposable", 0.24, 0.57, -0.03),
        ("Schick Quattro Titanium", 0.18, 0.38, -0.19),
        ("Schick Hydro 5 Sense", 0.16, 0.64, 0.05),
        ("Schick Exacta 2", 0.12, 0.40, -0.17),
    ],
}

BRAND_BASE = {
    "BANANA BOAT": 18_500_000_000,
    "FREEMAN": 12_200_000_000,
    "INTUITION": 9_800_000_000,
    "SCHICK": 14_400_000_000,
}


def build_workbook(path: Path) -> Path:
    wb = Workbook()
    default = wb.active
    wb.remove(default)

    for platform in PLATFORMS:
        ws = wb.create_sheet(platform)
        ws["A1"] = f"EVALUASI PENJUALAN E-COMMERCE {platform.upper()} 2026"
        ws["A1"].font = Font(bold=True, size=14, color="0F2744")
        ws.merge_cells("A1:H1")
        for col, header in enumerate(HEADERS, start=1):
            cell = ws.cell(2, col, header)
            cell.font = Font(bold=True, color="FFFFFF")
            cell.fill = PatternFill("solid", fgColor="0F2744")
            cell.alignment = Alignment(horizontal="center")

        row_idx = 3
        no = 1
        weight = PLATFORM_WEIGHT[platform]
        for brand, items in CATALOG.items():
            brand_target = 0.0
            brand_ytd = 0.0
            brand_gap = 0.0
            brand_y2024 = 0.0
            brand_y2025 = 0.0
            brand_trend_acc = 0.0
            item_rows: list[tuple] = []

            for name, share, ach, trend in items:
                target = round(BRAND_BASE[brand] * weight * share)
                ytd = round(target * ach)
                gap = ytd - target
                trend_adj = round(trend + PLATFORM_TREND_SHIFT[platform], 4)
                sales_2025 = round(ytd / (1 + trend_adj)) if trend_adj > -0.9 else round(ytd * 1.12)
                sales_2024 = round(sales_2025 / (1.03 + share * 0.06))
                brand_target += target
                brand_ytd += ytd
                brand_gap += gap
                brand_y2024 += sales_2024
                brand_y2025 += sales_2025
                brand_trend_acc += trend_adj
                item_rows.append((name, sales_2024, sales_2025, target, ytd, gap, trend_adj))

            avg_trend = brand_trend_acc / len(items)
            ws.cell(row_idx, 1, no)
            ws.cell(row_idx, 2, brand).font = Font(bold=True)
            ws.cell(row_idx, 3, brand_y2024)
            ws.cell(row_idx, 4, brand_y2025)
            ws.cell(row_idx, 5, brand_target)
            ws.cell(row_idx, 6, brand_ytd)
            ws.cell(row_idx, 7, brand_gap)
            ws.cell(row_idx, 8, round(avg_trend, 4))
            row_idx += 1
            no += 1

            for name, sales_2024, sales_2025, target, ytd, gap, trend in item_rows:
                ws.cell(row_idx, 1, no)
                ws.cell(row_idx, 2, name)
                ws.cell(row_idx, 3, sales_2024)
                ws.cell(row_idx, 4, sales_2025)
                ws.cell(row_idx, 5, target)
                ws.cell(row_idx, 6, ytd)
                ws.cell(row_idx, 7, gap)
                ws.cell(row_idx, 8, trend)
                row_idx += 1
                no += 1

        ws.cell(row_idx, 2, "TOTAL").font = Font(bold=True)
        col_letters = {1: "A", 2: "B", 3: "C", 4: "D", 5: "E", 6: "F", 7: "G", 8: "H"}
        for col in range(1, 9):
            ws.column_dimensions[col_letters[col]].width = 18
        ws.column_dimensions["B"].width = 42

    path.parent.mkdir(parents=True, exist_ok=True)
    wb.save(path)
    return path


if __name__ == "__main__":
    out = Path(__file__).resolve().parent / "data" / "EVALUASI E-COM.xlsx"
    build_workbook(out)
    print(f"Sample written: {out}")
