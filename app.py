"""E-Commerce Sales Evaluation Dashboard — Streamlit."""
from __future__ import annotations

from io import BytesIO
from pathlib import Path

import pandas as pd
import plotly.graph_objects as go
import streamlit as st

from data_ingest import (
    PLATFORMS,
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
SOFT_RED = "#D46565"
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
      [data-testid="stSidebar"] {{
        background: {NAVY};
      }}
      [data-testid="stSidebar"] * {{ color: #E8EEF5 !important; }}
      [data-testid="stSidebar"] .stSelectbox label,
      [data-testid="stSidebar"] .stFileUploader label,
      [data-testid="stSidebar"] p, [data-testid="stSidebar"] span {{
        color: #D5DEE8 !important;
      }}
      .hero {{
        background: linear-gradient(120deg, {NAVY} 0%, #163A5F 60%, {TEAL} 140%);
        color: #fff; padding: 1.35rem 1.6rem; border-radius: 16px;
        margin-bottom: 1.1rem; box-shadow: 0 10px 30px rgba(15,39,68,.18);
      }}
      header[data-testid="stHeader"] {{ background: transparent; }}
      .hero h1 {{ font-size: 1.55rem; margin: 0 0 .25rem 0; letter-spacing: .2px; }}
      .hero p {{ margin: 0; opacity: .86; font-size: .92rem; }}
      .kpi {{
        background: #fff; border-radius: 14px; padding: 1.05rem 1.15rem;
        border: 1px solid #E4EAF2; box-shadow: 0 4px 14px rgba(15,39,68,.05);
        min-height: 118px;
      }}
      .kpi .label {{ color: {MUTED}; font-size: .78rem; font-weight: 600; letter-spacing: .4px; text-transform: uppercase; }}
      .kpi .value {{ color: {NAVY}; font-size: 1.55rem; font-weight: 700; margin: .28rem 0 .1rem; }}
      .kpi .hint {{ font-size: .82rem; font-weight: 600; }}
      .section-title {{
        color: {NAVY}; font-size: 1.05rem; font-weight: 700; margin: .2rem 0 .6rem;
      }}
      .badge-demo {{
        display: inline-block; background: #FEF3C7; color: #92400E;
        font-size: .75rem; font-weight: 700; padding: .2rem .55rem; border-radius: 999px;
        margin-left: .5rem;
      }}
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
def load_from_bytes(data: bytes, version: int = 2) -> dict[str, pd.DataFrame]:
    return ingest_evaluasi_ecom(BytesIO(data))


@st.cache_data(show_spinner=False)
def load_from_path(path_str: str, mtime: float, version: int = 2) -> dict[str, pd.DataFrame]:
    return ingest_evaluasi_ecom(path_str)


def ensure_sample_file(path: Path) -> Path:
    if not path.exists():
        build_workbook(path)
    return path


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


def render_kpi(title: str, value: str, hint: str, hint_color: str) -> None:
    st.markdown(
        f"""
        <div class="kpi">
          <div class="label">{title}</div>
          <div class="value">{value}</div>
          <div class="hint" style="color:{hint_color}">{hint}</div>
        </div>
        """,
        unsafe_allow_html=True,
    )


CHART_CFG = {"displayModeBar": False, "responsive": True}


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
        yaxis=dict(gridcolor="#E6EDF4", tickprefix="", separatethousands=True, color=MUTED),
        xaxis=dict(color=NAVY),
        font=dict(family="Segoe UI, sans-serif"),
        bargap=0.28,
        bargroupgap=0.08,
    )
    return fig


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

demo_badge = '<span class="badge-demo">DATA SAMPEL</span>' if is_demo else ""
st.markdown(
    f"""
    <div class="hero">
      <h1>E-Commerce Sales Evaluation 2026 {demo_badge}</h1>
      <p>Executive dashboard · agregasi Shopee, Tokopedia, Alfagift, PCA, Bli Bli, BTB, Lazada · sumber: {source_label}</p>
    </div>
    """,
    unsafe_allow_html=True,
)

ach = kpis["achievement"]
k1, k2, k3 = st.columns(3)
with k1:
    render_kpi("Total Target 2026", fmt_idr(kpis["target_2026"]), "Agregat 7 platform · level brand", MUTED)
with k2:
    render_kpi("YTD Aug 2026 Revenue", fmt_idr(kpis["ytd_aug_26"]), f"Achievement {ach:.1f}%", TEAL)
with k3:
    render_kpi(
        "Total Shortfall (Kurang Target)",
        fmt_idr(kpis["kurang_target"]),
        "YTD minus Target · nilai negatif = gap",
        SOFT_RED,
    )
st.write("")

c1, c2 = st.columns(2)
with c1:
    st.markdown('<div class="section-title">Platform Contribution</div>', unsafe_allow_html=True)
    st.caption("Distribusi TARGET 2026 antar 7 platform.")
    if plat.empty:
        st.info("Tidak ada data platform.")
    else:
        st.plotly_chart(plot_platform_donut(plat), width="stretch", config=CHART_CFG)
with c2:
    st.markdown('<div class="section-title">Brand Performance</div>', unsafe_allow_html=True)
    st.caption("Perbandingan TARGET 2026 vs YTD AUG 26 per brand.")
    if perf.empty:
        st.info("Tidak ada data brand.")
    else:
        st.plotly_chart(plot_brand_bars(perf), width="stretch", config=CHART_CFG)

st.markdown('<div class="section-title">Support Program Action Table</div>', unsafe_allow_html=True)
st.caption(
    "Item yang perlu intervensi marketing: gap (KURANG TARGET) paling negatif, lalu Sales Trend terendah."
)
f1, f2 = st.columns([2, 1])
with f1:
    platform_filter = st.selectbox("Filter by Platform", ["Semua Platform"] + PLATFORMS)
with f2:
    top_n = st.slider("Jumlah item prioritas", 10, 50, 25, 5)
action = support_program_table(items, platform_filter, top_n)

if action.empty:
    st.success("Tidak ada item under-target pada filter ini.")
else:
    view = action.copy()
    display = pd.DataFrame(
        {
            "Rank": view["rank"],
            "Platform": view["platform"],
            "Brand": view["brand"],
            "Item": view["name"],
            "TARGET 2026": view["target_2026"],
            "YTD AUG 26": view["ytd_aug_26"],
            "KURANG TARGET": view["kurang_target"],
            "Sales Trend": view["sales_trend"],
            "Ach %": view["achievement"],
        }
    )
    st.dataframe(
        display,
        width="stretch",
        hide_index=True,
        column_config={
            "Rank": st.column_config.NumberColumn(width="small"),
            "TARGET 2026": st.column_config.NumberColumn(format="Rp %d"),
            "YTD AUG 26": st.column_config.NumberColumn(format="Rp %d"),
            "KURANG TARGET": st.column_config.NumberColumn(format="Rp %d"),
            "Sales Trend": st.column_config.NumberColumn(format="%.1%"),
            "Ach %": st.column_config.ProgressColumn(min_value=0, max_value=100, format="%.1f%%"),
        },
    )

if is_demo:
    st.info(
        "File asli `EVALUASI E-COM.xlsx` belum ditemukan. Dashboard memakai data sampel. "
        "Unggah file di sidebar atau taruh di `ecom-dashboard/data/`."
    )
