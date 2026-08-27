from pathlib import Path

from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "gao-dehat-product-catalogue.pdf"
PUBLIC = ROOT / "public"
IMAGE_CACHE = ROOT / "tmp" / "catalogue-images"

W, H = A4
MARGIN = 18 * mm
INK = HexColor("#104735")
LEAF = HexColor("#187147")
CREAM = HexColor("#F8F5EC")
CLAY = HexColor("#E74632")
GOLD = HexColor("#F1C95B")
MIST = HexColor("#D9EBC8")
MUTED = HexColor("#557260")

PRODUCTS = {
    "soil": [
        ("Green Force", "Phosphate Rich Organic Manure", "50 kg pack", "products/green-force-packshot.png"),
        ("Super Baan", "Super Prime Granular / Powder PROM", "50 kg pack", "products/super-baan-packshot.png"),
        ("DOP PROM", "Phosphate Rich Organic Manure", "50 kg pack", "products/dop-prom-packshot.png"),
        ("Potash", "Dried Premium Molasses - K2O 14.5%", "50 kg pack", "products/potash-packshot.png"),
        ("Black Gold", "Organic growth stimulator - Humic 98% w/w", "Organic crop support", "products/black-gold.jpeg"),
        ("Bhumi Pakar", "Nitro 35% + Humic Acid 15% + Amino Acid 10%", "Biostimulant product", "products/bhumihar.jpeg"),
    ],
    "growth": [
        ("Super Calcium Gold", "Calcium, magnesium and nutrient elements", "30 kg pack", "products/super-calcium-gold.png"),
        ("GIPL 24 Karat", "Gibberellic Acid 0.001% SL", "100 ml", "products/gipl-24-karat.jpeg"),
        ("Super Power Win", "Plant Growth Promoter", "0.3 L x 10 pack", "products/super-power-win.jpg"),
        ("Surya Super Zinc", "Water-soluble fertilizer for foliar spray", "250 g", "products/surya-super-zinc.jpeg"),
    ],
    "micro": [
        ("Zinc Super Gold", "Micronutrients + Sulphur", "Crop and flower yield", "products/zinc-super-gold.jpeg"),
        ("Mono Zinc", "Zinc Sulphate Monohydrate - Zn 33% min, S 15% min", "Agriculture grade", "products/mono-zinc.jpeg"),
        ("Magnesium Gold", "Magnesium 9.5% + Sulphate 12%", "Crop and flower yield", "products/magnesium-gold.jpeg"),
        ("Fertile Blossom High Zinc", "Micronutrients + Sulphur", "Crop and flower yield", "products/fertile-blossom-high-zinc.jpeg"),
        ("Boron Gold", "Sodium Tetraborate - Boron 10.5% w/w min", "For soil application", "products/boron-gold.jpeg"),
        ("Micro Force", "Ferrous Sulphate - 19%", "Micronutrient fertilizer", "products/micro-force.jpeg"),
        ("Haryali Gold", "Chelated Iron as Fe-EDTA 12%", "Drip and foliar application", "products/haryali-gold.jpeg"),
    ],
}


def pdf_image(source):
    """Create compact display assets so the downloadable catalogue stays lightweight."""
    IMAGE_CACHE.mkdir(parents=True, exist_ok=True)
    destination = IMAGE_CACHE / f"{source.stem}.jpg"
    if destination.exists() and destination.stat().st_mtime >= source.stat().st_mtime:
        return destination
    with Image.open(source) as image:
        image = image.convert("RGBA")
        image.thumbnail((480, 480), Image.Resampling.LANCZOS)
        background = Image.new("RGB", image.size, "white")
        background.paste(image, mask=image.getchannel("A"))
        background.save(destination, "JPEG", quality=78, optimize=True, progressive=True)
    return destination


def fit_text(c, text, x, y, max_width, font="Helvetica", size=10, leading=13, color=MUTED, max_lines=3):
    c.setFont(font, size)
    c.setFillColor(color)
    words = text.split()
    lines = []
    line = ""
    for word in words:
        candidate = word if not line else f"{line} {word}"
        if stringWidth(candidate, font, size) <= max_width:
            line = candidate
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    for index, line in enumerate(lines[:max_lines]):
        c.drawString(x, y - index * leading, line)
    return len(lines[:max_lines])


def footer(c, page):
    c.setStrokeColor(HexColor("#D1E1D0"))
    c.line(MARGIN, 14 * mm, W - MARGIN, 14 * mm)
    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(MARGIN, 8.5 * mm, "GAO DEHAT - PRODUCT CATALOGUE")
    c.drawRightString(W - MARGIN, 8.5 * mm, f"PAGE {page}")


def header(c, section, subtitle, page):
    c.setFillColor(CREAM)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(LEAF)
    c.rect(0, H - 31 * mm, W, 31 * mm, stroke=0, fill=1)
    logo = PUBLIC / "gao-dehat-logo.jpeg"
    if logo.exists():
        c.drawImage(str(pdf_image(logo)), MARGIN, H - 26 * mm, width=19 * mm, height=19 * mm, preserveAspectRatio=True, mask="auto")
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(MARGIN + 25 * mm, H - 15 * mm, "GAO DEHAT PRODUCT RANGE")
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 7.5)
    c.drawRightString(W - MARGIN, H - 15 * mm, "GROW WITH CONFIDENCE")
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 28)
    c.drawString(MARGIN, H - 48 * mm, section)
    fit_text(c, subtitle, MARGIN, H - 56 * mm, W - (2 * MARGIN), font="Helvetica", size=10, leading=13, color=MUTED, max_lines=2)
    footer(c, page)


def product_card(c, product, x, y, card_w, card_h, number, background):
    name, product_type, pack, image = product
    c.setFillColor(background)
    c.roundRect(x, y - card_h, card_w, card_h, 4 * mm, stroke=0, fill=1)
    c.setFillColor(CLAY)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(x + 12, y - 16, f"{number:02d}")
    image_path = PUBLIC / image
    image_x = x + card_w - 67
    image_y = y - card_h + 11
    if image_path.exists():
        c.drawImage(str(pdf_image(image_path)), image_x, image_y, width=54, height=card_h - 22, preserveAspectRatio=True, anchor="c", mask="auto")
    text_w = card_w - 88
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 13)
    fit_text(c, name, x + 12, y - 34, text_w, font="Helvetica-Bold", size=13, leading=15, color=INK, max_lines=2)
    fit_text(c, product_type, x + 12, y - 66, text_w, font="Helvetica", size=8.3, leading=10.5, color=MUTED, max_lines=3)
    c.setFillColor(LEAF)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(x + 12, y - card_h + 18, pack)


def category_page(c, title, subtitle, products, page, colors):
    header(c, title, subtitle, page)
    columns = 2
    gap = 11 * mm
    card_w = (W - (2 * MARGIN) - gap) / columns
    rows = 4 if len(products) > 4 else 2
    card_h = 38 * mm if len(products) > 4 else 53 * mm
    y_start = H - 73 * mm
    for index, product in enumerate(products):
        col = index % columns
        row = index // columns
        x = MARGIN + col * (card_w + gap)
        y = y_start - row * (card_h + 8 * mm)
        product_card(c, product, x, y, card_w, card_h, index + 1, colors[index % len(colors)])
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 8)
    c.drawCentredString(W / 2, 21 * mm, "Use products only as directed on the printed product label and crop-advisor guidance.")
    c.showPage()


def cover(c):
    c.setFillColor(INK)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(LEAF)
    c.circle(W - 8 * mm, H - 13 * mm, 105 * mm, stroke=0, fill=1)
    c.setFillColor(HexColor("#DDEEC6"))
    c.circle(W - 8 * mm, H - 13 * mm, 68 * mm, stroke=0, fill=1)
    logo = PUBLIC / "gao-dehat-logo.jpeg"
    if logo.exists():
        c.setFillColor(white)
        c.circle(MARGIN + 24 * mm, H - 31 * mm, 22 * mm, stroke=0, fill=1)
        c.drawImage(str(pdf_image(logo)), MARGIN + 3 * mm, H - 52 * mm, width=42 * mm, height=42 * mm, preserveAspectRatio=True, mask="auto")
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(MARGIN, H - 80 * mm, "2026 PRODUCT CATALOGUE")
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 42)
    c.drawString(MARGIN, H - 105 * mm, "Gao Dehat")
    c.setFont("Helvetica-Oblique", 35)
    c.drawString(MARGIN, H - 123 * mm, "Made for Indian farms.")
    c.setFillColor(HexColor("#D8EAD3"))
    c.setFont("Helvetica", 13)
    fit_text(c, "A focused range of agricultural inputs for soil nourishment, plant development and micronutrient support.", MARGIN, H - 143 * mm, 110 * mm, font="Helvetica", size=13, leading=18, color=HexColor("#D8EAD3"), max_lines=4)
    c.setFillColor(CREAM)
    c.roundRect(MARGIN, 48 * mm, W - (2 * MARGIN), 46 * mm, 5 * mm, stroke=0, fill=1)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(MARGIN + 13 * mm, 82 * mm, "PRODUCT SUPPORT")
    c.setFont("Helvetica", 10)
    c.drawString(MARGIN + 13 * mm, 68 * mm, "WhatsApp: +91 91967 02525")
    c.drawString(MARGIN + 13 * mm, 57 * mm, "Email: Gaondehat31@gmail.com")
    c.drawRightString(W - MARGIN - 13 * mm, 68 * mm, "Gata No. 5, Palia Masoodpur Par Dew")
    c.drawRightString(W - MARGIN - 13 * mm, 57 * mm, "Barabanki, Uttar Pradesh - 225001")
    c.setFillColor(HexColor("#B5D9AA"))
    c.setFont("Helvetica-Bold", 8.5)
    c.drawCentredString(W / 2, 27 * mm, "SOIL HEALTH  |  PLANT GROWTH  |  MICRONUTRIENTS")
    c.showPage()


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=A4, pageCompression=1)
    c.setTitle("Gao Dehat Product Catalogue")
    c.setAuthor("Gao Dehat Industries Pvt. Ltd.")
    c.setSubject("Gao Dehat agricultural product range")
    cover(c)
    category_page(c, "Soil health", "Support for soil-nutrition and field-preparation programmes.", PRODUCTS["soil"], 2, [HexColor("#E3F0D4"), HexColor("#FDF0CF")])
    category_page(c, "Plant development", "Focused product presentations for plant growth and foliar-support programmes.", PRODUCTS["growth"], 3, [HexColor("#DCECF3"), HexColor("#F6E7B5")])
    category_page(c, "Micronutrients", "A practical range for label-guided crop and flower nutrient programmes.", PRODUCTS["micro"], 4, [HexColor("#E8EEF6"), HexColor("#FCE6EA"), HexColor("#E7F1D7")])
    c.save()


if __name__ == "__main__":
    main()
