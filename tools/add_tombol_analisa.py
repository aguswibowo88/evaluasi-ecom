"""Tombol TOMBOL ANALISA di atas sel A1."""
from __future__ import annotations

from pathlib import Path

SRC = Path(r"D:\E-COMM\EVALUASI & ANALISA\DATA E-COM.xlsx")
URL = "https://aguswibowo88.github.io/evaluasi-ecom/"
BTN_NAME = "btnTombolAnalisa"
LABEL = "TOMBOL ANALISA"


def rgb(r: int, g: int, b: int) -> int:
    return r + (g << 8) + (b << 16)


def add_button() -> None:
    import win32com.client as win32

    excel = None
    started_excel = False
    opened_workbook = False
    try:
        try:
            excel = win32.GetActiveObject("Excel.Application")
        except Exception:
            excel = win32.Dispatch("Excel.Application")
            started_excel = True

        excel.DisplayAlerts = False
        wb = None
        for book in excel.Workbooks:
            if book.Name == SRC.name:
                wb = book
                break
        if wb is None:
            wb = excel.Workbooks.Open(str(SRC))
            opened_workbook = True

        ws = wb.Worksheets(1)
        if ws.Cells(1, 1).Value is None and ws.Cells(2, 1).Value == "TAHUN":
            ws.Rows(1).Delete()

        shp = None
        for item in ws.Shapes:
            if item.Name == BTN_NAME:
                shp = item
                break
        cell = ws.Range("A1")
        if shp is None:
            shp = ws.Shapes.AddShape(5, cell.Left + 2, cell.Top + 2, 148, 22)
            shp.Name = BTN_NAME
            shp.Fill.Solid()
            shp.Fill.ForeColor.RGB = rgb(22, 163, 74)
            shp.Line.ForeColor.RGB = rgb(21, 128, 61)
            tf = shp.TextFrame
            tf.Characters().Text = LABEL
            tf.Characters().Font.Bold = True
            tf.Characters().Font.Size = 11
            tf.Characters().Font.Color = rgb(255, 255, 255)
            tf.HorizontalAlignment = -4108
            tf.VerticalAlignment = -4108
            ws.Hyperlinks.Add(Anchor=shp, Address=URL, ScreenTip=URL)

        for i in range(1, ws.Hyperlinks.Count + 1):
            link = ws.Hyperlinks(i)
            on_button = False
            try:
                on_button = link.Shape.Name == BTN_NAME
            except Exception:
                on_button = False
            addr = str(link.Address)
            if on_button or "127.0.0.1:8765" in addr or "trycloudflare.com" in addr:
                link.Address = URL
                link.ScreenTip = URL

        shp.Placement = 3
        shp.Left = cell.Left + 2
        shp.Top = cell.Top + 2
        shp.Width = 148
        shp.Height = 22

        wb.Save()
        a1 = ws.Cells(1, 1).Value
        link = ""
        for i in range(1, ws.Hyperlinks.Count + 1):
            item = ws.Hyperlinks(i)
            try:
                if item.Shape.Name == BTN_NAME:
                    link = item.Address
            except Exception:
                continue
        if opened_workbook:
            wb.Close(SaveChanges=True)
        if started_excel:
            excel.Quit()
        print("Tombol TOMBOL ANALISA ada di A1.")
        print("A1", a1, "link", link)
    except Exception:
        if excel is not None and started_excel:
            try:
                excel.Quit()
            except Exception:
                pass
        raise


if __name__ == "__main__":
    add_button()
