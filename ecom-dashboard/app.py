"""E-Commerce Sales Evaluation Dashboard — Streamlit."""
from __future__ import annotations

import html
from io import BytesIO
from pathlib import Path

import pandas as pd
import plotly.graph_objects as go
import streamlit as st

from data_ingest import (
    PLATFORMS,
    brand_growth,
    brand_performance,
    ingest_evaluasi_ecom,
    kpi_summary,
    platform_contribution,
    resolve_excel_path,
    support_program_table,
)
from generate_sample import build_workbook

NAVY = "#0F2744"
TEAL = "#1A9B8E"
SOFT_RED = "#C0392B"
AXIS_BLACK = "#000000"
BG = "#F3F6FA"
MUTED = "#64748B"
PLATFORM_COLORS = {
    "Shopee": "#EE4D2D",
    "Tokopedia": "#42B549",
    "Lazada": "#0F146D",
    "Bli Bli": "#0095DA",
    "Alfagift": "#E11D2E",
    "PCA": "#6B7C93",
    "BTB": "#1A9B8E",
}
BRAND_COLORS = {
    "BANANA BOAT": "#0F2744",
    "FREEMAN": "#1A9B8E",
    "INTUITION": "#3B82F6",
    "SCHICK": "#C0392B",
}

st.set_page_config(
    page_title="E-Com Sales Evaluation 2026",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="collapsed",
)

st.markdown(
    f"""
    <style>
      .stApp {{ background: {BG}; }}
      [data-testid="stSidebar"] {{ background: {NAVY}; }}
      [data-testid="stSidebar"] * {{ color: #E8EEF5 !important; }}
      [data-testid="stSidebar"] .stSelectbox label,
      [data-testid="stSidebar"] .stFileUploader label,
      [data-testid="stSidebar"] p, [data-testid="stSidebar"] span {{
        color: #D5DEE8 !important;
      }}
      header[data-testid="stHeader"] {{ background: transparent; }}
      .hero {{
        background: linear-gradient(120deg, {NAVY} 0%, #163A5F 58%, {TEAL} 145%);
        color: #fff; padding: 1.35rem 1.6rem; border-radius: 16px;
        margin-bottom: 1.1rem; box-shadow: 0 10px 30px rgba(15,39,68,.18);
      }}
      .hero h1 {{ font-size: 1.55rem; margin: 0 0 .25rem 0; letter-spacing: .2px; }}
      .hero p {{ margin: 0; opacity: .86; font-size: .92rem; }}
      .kpi {{
        background: #fff; border-radius: 14px; padding: 1.05rem 1.15rem;
        border: 1px solid #E4EAF2; box-shadow: 0 4px 14px rgba(15,39,68,.05);
        min-height: 118px; border-left: 4px solid {TEAL};
      }}
      .kpi.target {{ border-left-color: {NAVY}; }}
      .kpi.shortfall {{ border-left-color: {SOFT_RED}; }}
      .kpi .label {{
        color: {MUTED}; font-size: .78rem; font-weight: 600;
        letter-spacing: .4px; text-transform: uppercase;
      }}
      .kpi .value {{ color: {NAVY}; font-size: 1.55rem; font-weight: 700; margin: .28rem 0 .1rem; }}
      .kpi .value.neg {{ color: {SOFT_RED}; }}
      .kpi .hint {{ font-size: .82rem; font-weight: 600; }}
      .section-title {{
        color: {NAVY}; font-size: 1.05rem; font-weight: 700; margin: .1rem 0 .15rem;
      }}
      .section-sub {{ color: {MUTED}; font-size: .82rem; margin: 0 0 .45rem; }}
      div[data-testid="stPlotlyChart"] {{
        background: #fff; border: 1px solid #E4EAF2; border-radius: 14px;
        padding: .35rem .45rem .15rem; box-shadow: 0 4px 14px rgba(15,39,68,.05);
        margin-bottom: .7rem;
      }}
      .badge-demo {{
        display: inline-block; background: #FEF3C7; color: #92400E;
        font-size: .75rem; font-weight: 700; padding: .2rem .55rem; border-radius: 999px;
        margin-left: .5rem;
      }}
      .table-wrap {{
        max-height: 440px;
        overflow: auto;
        border: 1px solid #E4EAF2;
        border-radius: 12px;
        background: #fff;
        margin: .35rem 0 1rem;
      }}
      table.action-table {{
        width: 100%; border-collapse: separate; border-spacing: 0;
        font-size: .86rem; color: {NAVY};
      }}
      table.action-table thead th {{
        position: sticky; top: 0; z-index: 4;
        background: {NAVY}; color: #fff; text-align: left; padding: .7rem .75rem;
        font-weight: 600; letter-spacing: .2px; white-space: nowrap;
        box-shadow: 0 1px 0 {NAVY};
      }}
      table.action-table tbody td {{
        padding: .58rem .75rem; border-bottom: 1px solid #EDF1F6; vertical-align: middle;
      }}
      table.action-table tbody tr:nth-child(even) {{ background: #F8FAFC; }}
      table.action-table tbody tr:hover {{ background: #EEF6F5; }}
      table.action-table td.num {{ text-align: right; font-variant-numeric: tabular-nums; }}
      table.action-table td.neg {{ color: {SOFT_RED}; font-weight: 700; }}
      table.action-table td.rank {{ color: {MUTED}; font-weight: 600; width: 52px; }}
    </style>
    """,
    unsafe_allow_html=True,
)


def fmt_idr(n: float) -> str:
    abs_n = abs(n)
    sign = "-" if n < 0 else ""
    if abs_n >= 1_000_000_000:
        return f"{sign}Rp {abs_n / 1_000_000_000:,.2f} M"
    if abs_n >= 1_000_000:
        return f"{sign}Rp {abs_n / 1_000_000:,.1f} jt"
    return f"{sign}Rp {abs_n:,.0f}"


@st.cache_data(show_spinner=False)
def load_from_bytes(data: bytes, version: int = 5) -> dict[str, pd.DataFrame]:
    return ingest_evaluasi_ecom(BytesIO(data))


@st.cache_data(show_spinner=False)
def load_from_path(path_str: str, mtime: float, version: int = 5) -> dict[str, pd.DataFrame]:
    return ingest_evaluasi_ecom(path_str)


def ensure_sample_file(path: Path) -> Path:
    if not path.exists():
        build_workbook(path)
    return path


# Chart statis: tanpa zoom / pan; hover tetap aktif
CHART_CFG = {
    "displayModeBar": False,
    "displaylogo": False,
    "responsive": True,
    "scrollZoom": False,
    "doubleClick": False,
}


def _lock_axes(fig: go.Figure) -> go.Figure:
    fig.update_layout(dragmode=False, uirevision="static")
    fig.update_xaxes(
        fixedrange=True,
        color=AXIS_BLACK,
        tickfont=dict(color=AXIS_BLACK, size=12),
        title=dict(font=dict(color=AXIS_BLACK)),
    )
    fig.update_yaxes(
        fixedrange=True,
        color=AXIS_BLACK,
        tickfont=dict(color=AXIS_BLACK, size=12),
        title=dict(font=dict(color=AXIS_BLACK)),
    )
    return fig


def plot_platform_donut(df: pd.DataFrame) -> go.Figure:
    colors = [PLATFORM_COLORS.get(p, TEAL) for p in df["platform"]]
    fig = go.Figure(
        data=[
            go.Pie(
                labels=df["platform"],
                values=df["target_2026"],
                hole=0.62,
                marker=dict(colors=colors, line=dict(color="#fff", width=2)),
                textinfo="percent",
                hovertemplate="<b>%{label}</b><br>Target: %{customdata}<br>%{percent}<extra></extra>",
                customdata=[fmt_idr(v) for v in df["target_2026"]],
            )
        ]
    )
    fig.update_layout(
        margin=dict(t=10, b=10, l=10, r=10),
        legend=dict(orientation="h", y=-0.08, font=dict(size=12, color=NAVY)),
        paper_bgcolor="rgba(0,0,0,0)",
        font=dict(family="Segoe UI, sans-serif"),
        annotations=[
            dict(
                text="<b>Target 2026</b><br>by platform",
                x=0.5,
                y=0.5,
                font=dict(size=13, color=MUTED),
                showarrow=False,
            )
        ],
    )
    return fig


def plot_brand_bars(df: pd.DataFrame) -> go.Figure:
    fig = go.Figure()
    fig.add_trace(
        go.Bar(
            name="TARGET 2026",
            x=df["brand"],
            y=df["target_2026"],
            marker_color=NAVY,
            hovertemplate="%{x}<br>Target: %{customdata}<extra></extra>",
            customdata=[fmt_idr(v) for v in df["target_2026"]],
        )
    )
    fig.add_trace(
        go.Bar(
            name="YTD AUG 26",
            x=df["brand"],
            y=df["ytd_aug_26"],
            marker_color=TEAL,
            hovertemplate="%{x}<br>YTD: %{customdata}<extra></extra>",
            customdata=[fmt_idr(v) for v in df["ytd_aug_26"]],
        )
    )
    fig.update_layout(
        barmode="group",
        margin=dict(t=10, b=10, l=10, r=10),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        legend=dict(orientation="h", y=1.12, x=0, font=dict(color=NAVY)),
        font=dict(family="Segoe UI, sans-serif", color=AXIS_BLACK),
        bargap=0.28,
        bargroupgap=0.08,
        yaxis=dict(gridcolor="#E6EDF4", separatethousands=True, zeroline=False),
        xaxis=dict(showgrid=False),
    )
    return _lock_axes(fig)


def plot_brand_growth(df: pd.DataFrame) -> go.Figure:
    fig = go.Figure()
    if df.empty or "tahun" not in df.columns:
        return fig
    years = sorted(int(y) for y in df["tahun"].dropna().unique())
    year_labels = [str(y) for y in years]
    brands = list(df["brand"].drop_duplicates())
    palette = [NAVY, TEAL, "#3B82F6", SOFT_RED, "#0EA5A4", "#7C3AED"]
    for idx, brand in enumerate(brands):
        subset = df[df["brand"] == brand].set_index("tahun").reindex(years)
        values = subset["value"].fillna(0)
        fig.add_trace(
            go.Scatter(
                name=str(brand).title(),
                x=year_labels,
                y=values,
                mode="lines+markers",
                line=dict(
                    width=2.8,
                    shape="spline",
                    smoothing=1.05,
                    color=BRAND_COLORS.get(str(brand), palette[idx % len(palette)]),
                ),
                marker=dict(size=10, symbol="circle"),
                hovertemplate="Tahun %{x}<br>%{fullData.name}: %{customdata}<extra></extra>",
                customdata=[fmt_idr(float(v)) for v in values],
            )
        )
    fig.update_layout(
        margin=dict(t=10, b=10, l=10, r=10),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        legend=dict(orientation="h", y=1.12, x=0, font=dict(color=NAVY)),
        font=dict(family="Segoe UI, sans-serif", color=AXIS_BLACK),
        yaxis=dict(
            title="Revenue (agregat 7 platform)",
            gridcolor="#E6EDF4",
            zeroline=False,
            separatethousands=True,
        ),
        xaxis=dict(
            title="Tahun",
            type="category",
            categoryorder="array",
            categoryarray=year_labels,
            showgrid=False,
        ),
    )
    return _lock_axes(fig)


def render_kpi(title: str, value: str, hint: str, hint_color: str, kind: str = "", neg: bool = False) -> None:
    value_cls = "value neg" if neg else "value"
    st.markdown(
        f"""
        <div class="kpi {kind}">
          <div class="label">{title}</div>
          <div class="{value_cls}">{value}</div>
          <div class="hint" style="color:{hint_color}">{hint}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def _num_td(value: float) -> str:
    cls = "num neg" if value < 0 else "num"
    return f'<td class="{cls}">{value:,.0f}</td>'


def _pct_td(value: float) -> str:
    cls = "num neg" if value < 0 else "num"
    return f'<td class="{cls}">{value * 100:.0f}%</td>'


def render_action_table(df: pd.DataFrame) -> None:
    rows: list[str] = []
    for _, row in df.iterrows():
        rows.append(
            "<tr>"
            f'<td class="rank">{int(row["rank"])}</td>'
            f"<td>{html.escape(str(row['platform']))}</td>"
            f"<td>{html.escape(str(row['brand']).title())}</td>"
            f"<td>{html.escape(str(row['name']))}</td>"
            f"{_num_td(float(row['target_2026']))}"
            f"{_num_td(float(row['ytd_aug_26']))}"
            f"{_num_td(float(row['kurang_target']))}"
            f"{_pct_td(float(row['sales_trend']))}"
            "</tr>"
        )
    table_html = f"""
    <div class="table-wrap">
      <table class="action-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Platform</th>
            <th>Brand</th>
            <th>Item</th>
            <th>TARGET 2026</th>
            <th>YTD AUG 26</th>
            <th>KURANG TARGET</th>
            <th>Sales Trend</th>
          </tr>
        </thead>
        <tbody>
          {''.join(rows)}
        </tbody>
      </table>
    </div>
    """
    st.markdown(table_html, unsafe_allow_html=True)


with st.sidebar:
    st.markdown("### Evaluasi E-Com")
    st.caption("YTD Agustus 2026 · 7 platform")
    uploaded = st.file_uploader("Unggah EVALUASI E-COM.xlsx", type=["xlsx"])
    st.caption("Brands: Banana Boat, Freeman, Intuition, Schick")

sample_path = Path(__file__).resolve().parent / "data" / "EVALUASI E-COM.xlsx"
source_label = "File lokal"
is_demo = False
error_msg = None
payload = None

if uploaded is not None:
    payload = load_from_bytes(uploaded.getvalue())
    source_label = uploaded.name
else:
    found = resolve_excel_path()
    try:
        if found is None:
            ensure_sample_file(sample_path)
            found = sample_path
            is_demo = True
        payload = load_from_path(str(found), found.stat().st_mtime)
        source_label = found.name
        if found == sample_path:
            is_demo = True
    except Exception as exc:  # koneksi/file rusak
        error_msg = str(exc)

if error_msg or payload is None:
    st.error(f"Gagal memuat data: {error_msg or 'payload kosong'}")
    st.stop()

brands = payload["brands"]
items = payload["items"]
kpis = kpi_summary(brands)
plat = platform_contribution(brands)
perf = brand_performance(brands)
growth = brand_growth(brands)

demo_badge = '<span class="badge-demo">DATA SAMPEL</span>' if is_demo else ""
st.markdown(
    f"""
    <div class="hero">
      <h1>E-Commerce Sales Evaluation 2026 {demo_badge}</h1>
      <p>Executive dashboard · agregasi Shopee, Tokopedia, Alfagift, PCA, Bli Bli, BTB, Lazada · sumber: {html.escape(source_label)}</p>
    </div>
    """,
    unsafe_allow_html=True,
)

ach = kpis["achievement"]
k1, k2, k3 = st.columns(3)
with k1:
    render_kpi("Total Target 2026", fmt_idr(kpis["target_2026"]), "Agregat 7 platform · level brand", MUTED, "target")
with k2:
    render_kpi("YTD Aug 2026 Revenue", fmt_idr(kpis["ytd_aug_26"]), f"Achievement {ach:.1f}%", TEAL)
with k3:
    render_kpi(
        "Total Shortfall (Kurang Target)",
        fmt_idr(kpis["kurang_target"]),
        "YTD minus Target · nilai negatif = gap",
        SOFT_RED,
        "shortfall",
        neg=kpis["kurang_target"] < 0,
    )
st.write("")

c1, c2 = st.columns(2)
with c1:
    st.markdown(
        '<div class="section-title">Platform Contribution</div>'
        '<p class="section-sub">Distribusi TARGET 2026 antar 7 platform.</p>',
        unsafe_allow_html=True,
    )
    if plat.empty:
        st.info("Tidak ada data platform.")
    else:
        st.plotly_chart(plot_platform_donut(plat), width="stretch", config=CHART_CFG)
with c2:
    st.markdown(
        '<div class="section-title">Brand Performance</div>'
        '<p class="section-sub">Perbandingan TARGET 2026 vs YTD AUG 26 per brand.</p>',
        unsafe_allow_html=True,
    )
    if perf.empty:
        st.info("Tidak ada data brand.")
    else:
        st.plotly_chart(plot_brand_bars(perf), width="stretch", config=CHART_CFG)

st.markdown(
    '<div class="section-title">Brand Growth</div>'
    '<p class="section-sub">Pertumbuhan penjualan per brand berdasarkan tahun (Tahun), diagregasi dari semua platform.</p>',
    unsafe_allow_html=True,
)
if growth.empty:
    st.info("Tidak ada data pertumbuhan brand.")
else:
    st.plotly_chart(plot_brand_growth(growth), width="stretch", config=CHART_CFG)

st.markdown(
    '<div class="section-title">Support Program Action Table</div>'
    '<p class="section-sub">Hanya item dengan Sales Trend negatif. Diurut dari KURANG TARGET paling besar (negatif), lalu Sales Trend terendah. Header tabel tetap terlihat saat scroll.</p>',
    unsafe_allow_html=True,
)
platform_filter = st.selectbox("Filter by Platform", ["Semua Platform"] + PLATFORMS)
action = support_program_table(items, platform_filter)

if action.empty:
    st.success("Tidak ada item dengan Sales Trend negatif pada filter ini.")
else:
    render_action_table(action)

if is_demo:
    st.info(
        "File asli `EVALUASI E-COM.xlsx` belum ditemukan. Dashboard memakai data sampel. "
        "Unggah file di sidebar atau taruh di `ecom-dashboard/data/`."
    )
