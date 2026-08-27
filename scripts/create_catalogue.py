from pathlib import Path
import re

from PIL import Image
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "gao-dehat-product-catalogue.pdf"
PUBLIC = ROOT / "public"
IMAGE_CACHE = ROOT / "tmp" / "catalogue-images"

W, H = A4
MARGIN = 15 * mm
INK = HexColor("#104735")
LEAF = HexColor("#187147")
CREAM = HexColor("#F8F5EC")
CLAY = HexColor("#E74632")
GOLD = HexColor("#F1C95B")
MUTED = HexColor("#557260")
LINE = HexColor("#D7E3D3")

CATEGORY_DATA = {
    "soil": ("SOIL HEALTH", "Soil nutrition and field-preparation support", HexColor("#DCEBC7")),
    "growth": ("PLANT GROWTH", "Plant development and crop-growth support", HexColor("#F6D478")),
    "micro": ("MICRONUTRIENTS", "Focused micronutrient product profiles", HexColor("#D8EAF0")),
}
SOIL_PRODUCTS = {"green-force", "super-baan", "dop-prom", "potash", "black-gold", "bhumi-pakar"}
GROWTH_PRODUCTS = {"super-calcium-gold", "gipl-24-karat", "super-power-win"}


def safe_text(value):
    """Keep catalogue text compatible with the built-in PDF fonts."""
    replacements = {
        "·": " - ",
        "×": "x",
        "₂": "2",
        "₅": "5",
        "–": "-",
        "—": "-",
        "’": "'",
        "“": '"',
        "”": '"',
    }
    for source, target in replacements.items():
        value = value.replace(source, target)
    return value.encode("latin-1", "replace").decode("latin-1")


def parse_products():
    """Use the website's canonical product data so the catalogue stays in sync."""
    source = (ROOT / "app" / "product-data.ts").read_text(encoding="utf-8")
    products_source = source.split("export const products: Product[] = [", 1)[1].split("];", 1)[0]
    blocks = re.findall(r"  \{\n(.*?)\n  \},", products_source, flags=re.S)

    def prop(block, key):
        match = re.search(rf"\b{key}:\s*'([^']*)'", block)
        if not match:
            raise ValueError(f"Missing {key} in product data")
        return match.group(1)

    products = []
    for block in blocks:
        benefits_match = re.search(r"\bbenefits:\s*\[([^\]]+)\]", block, flags=re.S)
        if not benefits_match:
            raise ValueError("Missing benefits in product data")
        benefits = re.findall(r"'([^']*)'", benefits_match.group(1))
        product = {
            "slug": prop(block, "slug"),
            "name": prop(block, "name"),
            "type": prop(block, "type"),
            "image": prop(block, "image"),
            "pack": prop(block, "pack"),
            "overview": prop(block, "overview"),
            "benefits": benefits,
            "suitable": prop(block, "suitable"),
        }
        product["category"] = "soil" if product["slug"] in SOIL_PRODUCTS else "growth" if product["slug"] in GROWTH_PRODUCTS else "micro"
        products.append(product)

    if len(products) != 17:
        raise ValueError(f"Expected 17 products, found {len(products)}")
    return products


def pdf_image(source):
    """Create compact display assets so the downloadable catalogue stays lightweight."""
    IMAGE_CACHE.mkdir(parents=True, exist_ok=True)
    destination = IMAGE_CACHE / f"{source.stem}.jpg"
    if destination.exists() and destination.stat().st_mtime >= source.stat().st_mtime:
        return destination
    with Image.open(source) as image:
        image = image.convert("RGBA")
        image.thumbnail((900, 900), Image.Resampling.LANCZOS)
        background = Image.new("RGB", image.size, "white")
        background.paste(image, mask=image.getchannel("A"))
        background.save(destination, "JPEG", quality=82, optimize=True, progressive=True)
    return destination


def wrapped_lines(text, font, size, max_width):
    words = safe_text(text).split()
    lines, line = [], ""
    for word in words:
        candidate = word if not line else f"{line} {word}"
        if stringWidth(candidate, font, size) <= max_width:
            line = candidate
        elif line:
            lines.append(line)
            line = word
        else:
            lines.append(word)
            line = ""
    if line:
        lines.append(line)
    return lines


def draw_wrapped(c, text, x, y, max_width, font="Helvetica", size=10, leading=13, color=MUTED, max_lines=None):
    lines = wrapped_lines(text, font, size, max_width)
    if max_lines and len(lines) > max_lines:
        lines = lines[:max_lines]
        lines[-1] = lines[-1].rstrip(".") + "..."
    c.setFillColor(color)
    c.setFont(font, size)
    for index, line in enumerate(lines):
        c.drawString(x, y - index * leading, line)
    return y - len(lines) * leading


def draw_image_contain(c, image_path, x, y, width, height):
    if not image_path.exists():
        return
    image_path = pdf_image(image_path)
    with Image.open(image_path) as image:
        image_width, image_height = image.size
    scale = min(width / image_width, height / image_height)
    draw_width = image_width * scale
    draw_height = image_height * scale
    c.drawImage(
        str(image_path),
        x + (width - draw_width) / 2,
        y + (height - draw_height) / 2,
        width=draw_width,
        height=draw_height,
        mask="auto",
    )


def draw_logo(c, x, y, size):
    logo = PUBLIC / "gao-dehat-logo.jpeg"
    if logo.exists():
        c.setFillColor(white)
        c.circle(x + size / 2, y + size / 2, size / 2, stroke=0, fill=1)
        draw_image_contain(c, logo, x + 1.5 * mm, y + 1.5 * mm, size - 3 * mm, size - 3 * mm)


def footer(c, page, total):
    c.setStrokeColor(LINE)
    c.setLineWidth(0.7)
    c.line(MARGIN, 15 * mm, W - MARGIN, 15 * mm)
    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 7.2)
    c.drawString(MARGIN, 9.2 * mm, "GAO DEHAT  |  PRODUCT CATALOGUE")
    c.drawRightString(W - MARGIN, 9.2 * mm, f"PRODUCT PROFILE  {page:02d} / {total:02d}")


def section_header(c, category, number, total):
    label, _descriptor, accent = CATEGORY_DATA[category]
    c.setFillColor(CREAM)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(INK)
    c.rect(0, H - 28 * mm, W, 28 * mm, stroke=0, fill=1)
    draw_logo(c, MARGIN, H - 24 * mm, 17 * mm)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 8.5)
    c.drawString(MARGIN + 22 * mm, H - 16 * mm, "GAO DEHAT PRODUCT CATALOGUE")
    c.setFillColor(accent)
    c.setFont("Helvetica-Bold", 7.5)
    c.drawRightString(W - MARGIN, H - 16 * mm, f"{label}  ·  PROFILE {number:02d}")
    footer(c, number + 2, total)
    return label, accent


def draw_cover(c, total_products):
    c.setFillColor(INK)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(HexColor("#DDEEC6"))
    c.circle(W - 6 * mm, H - 7 * mm, 79 * mm, stroke=0, fill=1)
    c.setFillColor(LEAF)
    c.circle(W - 6 * mm, H - 7 * mm, 60 * mm, stroke=0, fill=1)
    c.setFillColor(GOLD)
    c.circle(W - 6 * mm, H - 7 * mm, 41 * mm, stroke=0, fill=1)
    draw_logo(c, MARGIN, H - 48 * mm, 38 * mm)
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 9.5)
    c.drawString(MARGIN, H - 70 * mm, "PRODUCT CATALOGUE")
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 38)
    c.drawString(MARGIN, H - 94 * mm, "Gao Dehat")
    c.setFont("Helvetica-Oblique", 30)
    c.drawString(MARGIN, H - 112 * mm, "for better crop care.")
    draw_wrapped(
        c,
        f"{total_products} focused agricultural product profiles for soil nourishment, plant development and micronutrient support.",
        MARGIN,
        H - 136 * mm,
        105 * mm,
        size=12.5,
        leading=17,
        color=HexColor("#D8EAD3"),
        max_lines=4,
    )
    c.setFillColor(CREAM)
    c.roundRect(MARGIN, 43 * mm, W - 2 * MARGIN, 47 * mm, 4 * mm, stroke=0, fill=1)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(MARGIN + 11 * mm, 78 * mm, "CLEAR INFORMATION. LABEL-GUIDED USE.")
    c.setFont("Helvetica", 10)
    c.drawString(MARGIN + 11 * mm, 65 * mm, "WhatsApp: +91 91967 02525")
    c.drawString(MARGIN + 11 * mm, 54 * mm, "Email: Gaondehat31@gmail.com")
    c.setFillColor(HexColor("#B5D9AA"))
    c.setFont("Helvetica-Bold", 8.2)
    c.drawCentredString(W / 2, 24 * mm, "A VANSH GROUP COMPANY  |  GAO DEHAT INDUSTRIES PVT. LTD.")
    c.showPage()


def draw_catalogue_guide(c, products, total):
    c.setFillColor(CREAM)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(INK)
    c.rect(0, H - 28 * mm, W, 28 * mm, stroke=0, fill=1)
    draw_logo(c, MARGIN, H - 24 * mm, 17 * mm)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 8.5)
    c.drawString(MARGIN + 22 * mm, H - 16 * mm, "GAO DEHAT PRODUCT CATALOGUE")
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 7.5)
    c.drawRightString(W - MARGIN, H - 16 * mm, "CATALOGUE GUIDE")
    footer(c, 2, total)

    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 29)
    c.drawString(MARGIN, H - 49 * mm, "A profile for every product.")
    draw_wrapped(
        c,
        "Each following page puts product-pack information, benefits and label-guided use in one easy reference.",
        MARGIN,
        H - 61 * mm,
        166 * mm,
        size=10.8,
        leading=14,
        color=MUTED,
        max_lines=3,
    )

    cards = [
        ("01", "PRODUCT SNAPSHOT", "Product type, pack and crop programme information shown together."),
        ("02", "KEY BENEFITS", "Three practical benefits taken from the product range information."),
        ("03", "USE WITH CARE", "The product label and a qualified crop advisor remain the primary guidance."),
    ]
    card_y, card_h = H - 129 * mm, 43 * mm
    card_w, card_gap = 53 * mm, 6 * mm
    for index, (number, title, copy) in enumerate(cards):
        x = MARGIN + index * (card_w + card_gap)
        c.setFillColor(HexColor("#EEF5E6"))
        c.roundRect(x, card_y, card_w, card_h, 3 * mm, stroke=0, fill=1)
        c.setFillColor(CLAY)
        c.setFont("Helvetica-Bold", 8)
        c.drawString(x + 6 * mm, card_y + card_h - 10 * mm, number)
        c.setFillColor(INK)
        c.setFont("Helvetica-Bold", 8.5)
        c.drawString(x + 6 * mm, card_y + card_h - 18 * mm, title)
        draw_wrapped(c, copy, x + 6 * mm, card_y + card_h - 28 * mm, card_w - 12 * mm, size=7.7, leading=10.2, color=MUTED, max_lines=3)

    list_top = H - 155 * mm
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(MARGIN, list_top, "PRODUCT DIRECTORY")
    columns, rows = 3, 6
    column_gap = 6 * mm
    column_width = (W - 2 * MARGIN - (columns - 1) * column_gap) / columns
    for index, product in enumerate(products):
        col = index // rows
        row = index % rows
        x = MARGIN + col * (column_width + column_gap)
        y = list_top - 14 * mm - row * 13 * mm
        c.setStrokeColor(LINE)
        c.line(x, y - 5 * mm, x + column_width, y - 5 * mm)
        c.setFillColor(CLAY)
        c.setFont("Helvetica-Bold", 7.5)
        c.drawString(x, y, f"{index + 1:02d}")
        c.setFillColor(INK)
        c.setFont("Helvetica-Bold", 8.1)
        c.drawString(x + 10 * mm, y, safe_text(product["name"]))

    c.setFillColor(HexColor("#F7E9C5"))
    c.roundRect(MARGIN, 31 * mm, W - 2 * MARGIN, 25 * mm, 3 * mm, stroke=0, fill=1)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 8.5)
    c.drawString(MARGIN + 7 * mm, 47 * mm, "IMPORTANT")
    draw_wrapped(
        c,
        "Product specifications are presented from the respective product pack. Use only as directed on the printed label and by qualified crop-advisor guidance.",
        MARGIN + 7 * mm,
        40 * mm,
        W - 2 * MARGIN - 14 * mm,
        size=8.2,
        leading=10,
        color=MUTED,
        max_lines=2,
    )
    c.showPage()


def draw_benefit(c, x, y, width, index, value, accent):
    c.setStrokeColor(LINE)
    c.line(x, y + 7 * mm, x + width, y + 7 * mm)
    c.setFillColor(accent)
    c.circle(x + 4.2 * mm, y + 15 * mm, 4.2 * mm, stroke=0, fill=1)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 7.2)
    c.drawCentredString(x + 4.2 * mm, y + 13.9 * mm, f"{index + 1}")
    draw_wrapped(c, value, x + 11 * mm, y + 17.5 * mm, width - 13 * mm, font="Helvetica-Bold", size=8.5, leading=10.4, color=INK, max_lines=2)


def draw_use_step(c, x, y, width, index, value):
    c.setStrokeColor(HexColor("#E8D7A8"))
    c.line(x, y + 6 * mm, x + width, y + 6 * mm)
    c.setFillColor(LEAF)
    c.circle(x + 4.2 * mm, y + 14.3 * mm, 4.2 * mm, stroke=0, fill=1)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 7.3)
    c.drawCentredString(x + 4.2 * mm, y + 13.1 * mm, str(index + 1))
    draw_wrapped(c, value, x + 11 * mm, y + 17 * mm, width - 13 * mm, font="Helvetica", size=8.15, leading=10.1, color=INK, max_lines=2)


def draw_product_profile(c, product, number, total):
    category_label, accent = section_header(c, product["category"], number, total)
    image_x, image_y, image_w, image_h = MARGIN, 133 * mm, 73 * mm, 103 * mm
    c.setFillColor(white)
    c.roundRect(image_x, image_y, image_w, image_h, 4 * mm, stroke=0, fill=1)
    c.setStrokeColor(HexColor("#DCE5D9"))
    c.setLineWidth(0.9)
    c.roundRect(image_x, image_y, image_w, image_h, 4 * mm, stroke=1, fill=0)
    image_path = PUBLIC / product["image"].lstrip("/")
    draw_image_contain(c, image_path, image_x + 5 * mm, image_y + 5 * mm, image_w - 10 * mm, image_h - 10 * mm)
    c.setFillColor(INK)
    c.roundRect(image_x + 5 * mm, image_y + 5 * mm, 34 * mm, 8 * mm, 1.5 * mm, stroke=0, fill=1)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 6.8)
    c.drawCentredString(image_x + 22 * mm, image_y + 7.8 * mm, "PRODUCT PACK")

    detail_x = image_x + image_w + 11 * mm
    detail_w = W - MARGIN - detail_x
    top_y = H - 47 * mm
    c.setFillColor(CLAY)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(detail_x, top_y, f"{number:02d}  |  {category_label}")
    title_size = 27 if len(product["name"]) < 20 else 23
    title_lines = wrapped_lines(product["name"], "Helvetica-Bold", title_size, detail_w)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", title_size)
    title_y = top_y - 14 * mm
    for index, line in enumerate(title_lines[:2]):
        c.drawString(detail_x, title_y - index * (title_size + 3), safe_text(line))
    content_y = title_y - len(title_lines[:2]) * (title_size + 3) - 4 * mm
    type_end = draw_wrapped(c, product["type"], detail_x, content_y, detail_w, font="Helvetica-Bold", size=10.5, leading=13, color=LEAF, max_lines=3)
    c.setStrokeColor(LINE)
    c.line(detail_x, type_end - 4 * mm, detail_x + detail_w, type_end - 4 * mm)
    overview_end = draw_wrapped(c, product["overview"], detail_x, type_end - 12 * mm, detail_w, size=9.2, leading=12.2, color=MUTED, max_lines=4)
    snapshot_y = max(image_y + 10 * mm, overview_end - 13 * mm)
    c.setFillColor(HexColor("#EDF5E5"))
    c.roundRect(detail_x, snapshot_y - 31 * mm, detail_w, 30 * mm, 2.5 * mm, stroke=0, fill=1)
    c.setFillColor(CLAY)
    c.setFont("Helvetica-Bold", 7.1)
    c.drawString(detail_x + 5 * mm, snapshot_y - 8 * mm, "PRODUCT SNAPSHOT")
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 8.7)
    c.drawString(detail_x + 5 * mm, snapshot_y - 16 * mm, "PACKING")
    c.setFont("Helvetica", 8.7)
    c.drawString(detail_x + 27 * mm, snapshot_y - 16 * mm, safe_text(product["pack"]))
    c.setFont("Helvetica-Bold", 8.7)
    c.drawString(detail_x + 5 * mm, snapshot_y - 24 * mm, "SUITABLE FOR")
    draw_wrapped(c, product["suitable"], detail_x + 32 * mm, snapshot_y - 24 * mm, detail_w - 37 * mm, size=7.4, leading=8.5, color=INK, max_lines=2)

    panel_y, panel_h = 31 * mm, 77 * mm
    gap = 7 * mm
    panel_w = (W - 2 * MARGIN - gap) / 2
    benefits_x = MARGIN
    use_x = MARGIN + panel_w + gap
    c.setFillColor(white)
    c.roundRect(benefits_x, panel_y, panel_w, panel_h, 3 * mm, stroke=0, fill=1)
    c.setStrokeColor(LINE)
    c.roundRect(benefits_x, panel_y, panel_w, panel_h, 3 * mm, stroke=1, fill=0)
    c.setFillColor(HexColor("#FEF5DB"))
    c.roundRect(use_x, panel_y, panel_w, panel_h, 3 * mm, stroke=0, fill=1)
    c.setStrokeColor(HexColor("#EBD8A3"))
    c.roundRect(use_x, panel_y, panel_w, panel_h, 3 * mm, stroke=1, fill=0)

    c.setFillColor(CLAY)
    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(benefits_x + 7 * mm, panel_y + panel_h - 11 * mm, "KEY BENEFITS")
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 8.2)
    c.drawString(benefits_x + 7 * mm, panel_y + panel_h - 18 * mm, "What this product is presented to support")
    benefit_y = panel_y + panel_h - 47 * mm
    for index, benefit in enumerate(product["benefits"][:3]):
        draw_benefit(c, benefits_x + 7 * mm, benefit_y - index * 18 * mm, panel_w - 14 * mm, index, benefit, accent)

    c.setFillColor(CLAY)
    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(use_x + 7 * mm, panel_y + panel_h - 11 * mm, "USE WITH CARE")
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 8.2)
    c.drawString(use_x + 7 * mm, panel_y + panel_h - 18 * mm, "Follow the label as the primary instruction")
    use_steps = [
        "Read the printed product label completely before use.",
        "Follow the pack's dose, crop stage and method, or consult a crop advisor.",
        "Keep the pack sealed, dry and away from direct sunlight after use.",
    ]
    use_y = panel_y + panel_h - 47 * mm
    for index, instruction in enumerate(use_steps):
        draw_use_step(c, use_x + 7 * mm, use_y - index * 18 * mm, panel_w - 14 * mm, index, instruction)

    c.showPage()


def main():
    products = parse_products()
    total_pages = len(products) + 2
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=A4, pageCompression=1)
    c.setTitle("Gao Dehat Product Catalogue")
    c.setAuthor("Gao Dehat Industries Pvt. Ltd.")
    c.setSubject("Dedicated product profiles for the Gao Dehat agricultural range")
    c.setCreator("Gao Dehat")
    draw_cover(c, len(products))
    draw_catalogue_guide(c, products, total_pages)
    for index, product in enumerate(products, start=1):
        draw_product_profile(c, product, index, total_pages)
    c.save()


if __name__ == "__main__":
    main()
