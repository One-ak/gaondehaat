from pathlib import Path
import re

from PIL import Image
from reportlab.lib.colors import HexColor, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfbase.ttfonts import TTFont
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
SERIF = "GaoSerif"
SERIF_BOLD = "GaoSerifBold"

CATEGORY_DATA = {
    "soil": {
        "label": "SOIL HEALTH",
        "description": "Soil nutrition and field-preparation support",
        "accent": HexColor("#B9D98A"),
        "wash": HexColor("#EDF5E0"),
        "deep": HexColor("#3B6E46"),
    },
    "growth": {
        "label": "PLANT GROWTH",
        "description": "Plant development and crop-growth support",
        "accent": HexColor("#F3C95C"),
        "wash": HexColor("#FFF3D3"),
        "deep": HexColor("#8A5B18"),
    },
    "micro": {
        "label": "MICRONUTRIENTS",
        "description": "Focused micronutrient product profiles",
        "accent": HexColor("#B9DDE8"),
        "wash": HexColor("#EAF4F6"),
        "deep": HexColor("#2B6672"),
    },
}
SOIL_PRODUCTS = {"green-force", "super-baan", "dop-prom", "potash", "black-gold", "bhumi-pakar"}
GROWTH_PRODUCTS = {"super-calcium-gold", "gipl-24-karat", "super-power-win"}


def register_fonts():
    """Use the installed Georgia faces for an editorial, non-generic catalogue feel."""
    font_root = Path("/System/Library/Fonts/Supplemental")
    pdfmetrics.registerFont(TTFont(SERIF, str(font_root / "Georgia.ttf")))
    pdfmetrics.registerFont(TTFont(SERIF_BOLD, str(font_root / "Georgia Bold.ttf")))


def safe_text(value):
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
        product = {
            "slug": prop(block, "slug"),
            "name": prop(block, "name"),
            "type": prop(block, "type"),
            "image": prop(block, "image"),
            "pack": prop(block, "pack"),
            "overview": prop(block, "overview"),
            "benefits": re.findall(r"'([^']*)'", benefits_match.group(1)),
            "suitable": prop(block, "suitable"),
        }
        product["category"] = "soil" if product["slug"] in SOIL_PRODUCTS else "growth" if product["slug"] in GROWTH_PRODUCTS else "micro"
        products.append(product)

    if len(products) != 17:
        raise ValueError(f"Expected 17 products, found {len(products)}")
    return products


def product_by_slug(products, slug):
    return next(product for product in products if product["slug"] == slug)


def pdf_image(source):
    """Create compact display assets so the downloadable catalogue stays lightweight."""
    IMAGE_CACHE.mkdir(parents=True, exist_ok=True)
    destination = IMAGE_CACHE / f"{source.stem}.jpg"
    if destination.exists() and destination.stat().st_mtime >= source.stat().st_mtime:
        return destination
    with Image.open(source) as image:
        image = image.convert("RGBA")
        image.thumbnail((1000, 1000), Image.Resampling.LANCZOS)
        background = Image.new("RGB", image.size, "white")
        background.paste(image, mask=image.getchannel("A"))
        background.save(destination, "JPEG", quality=84, optimize=True, progressive=True)
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


def draw_pack_card(c, image_path, x, y, width, height, accent, angle=0):
    """A slightly tilted product-pack card used as an editorial visual accent."""
    c.saveState()
    c.translate(x + width / 2, y + height / 2)
    c.rotate(angle)
    c.translate(-width / 2, -height / 2)
    c.setFillColor(white)
    c.roundRect(0, 0, width, height, 4 * mm, stroke=0, fill=1)
    c.setStrokeColor(accent)
    c.setLineWidth(1.1)
    c.roundRect(0, 0, width, height, 4 * mm, stroke=1, fill=0)
    draw_image_contain(c, image_path, 5 * mm, 7 * mm, width - 10 * mm, height - 16 * mm)
    c.setFillColor(INK)
    c.roundRect(5 * mm, 5 * mm, 27 * mm, 6.2 * mm, 1.2 * mm, stroke=0, fill=1)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 5.6)
    c.drawCentredString(18.5 * mm, 7.1 * mm, "GAO DEHAT")
    c.restoreState()


def footer(c, page, total):
    c.setStrokeColor(HexColor("#B8D0BA"))
    c.setLineWidth(0.65)
    c.line(MARGIN, 15 * mm, W - MARGIN, 15 * mm)
    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 7)
    c.drawString(MARGIN, 9.2 * mm, "GAO DEHAT  |  PRODUCT CATALOGUE")
    c.drawRightString(W - MARGIN, 9.2 * mm, f"PROFILE  {page:02d} / {total:02d}")


def draw_cover(c, products):
    c.setFillColor(INK)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(LEAF)
    c.circle(W - 13 * mm, H - 21 * mm, 72 * mm, stroke=0, fill=1)
    c.setStrokeColor(GOLD)
    c.setLineWidth(2)
    c.arc(104 * mm, H - 103 * mm, W + 52 * mm, H + 35 * mm, startAng=133, extent=167)
    c.setStrokeColor(HexColor("#BBD889"))
    c.setLineWidth(1.1)
    c.arc(96 * mm, H - 111 * mm, W + 60 * mm, H + 27 * mm, startAng=132, extent=169)
    draw_logo(c, MARGIN, H - 52 * mm, 39 * mm)

    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(MARGIN, H - 76 * mm, "2026  |  PRODUCT CATALOGUE")
    c.setFillColor(white)
    c.setFont(SERIF_BOLD, 39)
    c.drawString(MARGIN, H - 103 * mm, "Gao Dehat")
    c.setFont(SERIF, 29)
    c.drawString(MARGIN, H - 122 * mm, "grow with care.")
    draw_wrapped(
        c,
        "An agricultural range created for soil nourishment, confident crop development and practical nutrient support.",
        MARGIN,
        H - 143 * mm,
        100 * mm,
        font="Helvetica",
        size=11,
        leading=15,
        color=HexColor("#D8EAD3"),
        max_lines=4,
    )

    green_force = product_by_slug(products, "green-force")
    gipl = product_by_slug(products, "gipl-24-karat")
    potash = product_by_slug(products, "potash")
    draw_pack_card(c, PUBLIC / green_force["image"].lstrip("/"), 121 * mm, 128 * mm, 50 * mm, 70 * mm, HexColor("#F4CF6B"), -8)
    draw_pack_card(c, PUBLIC / gipl["image"].lstrip("/"), 140 * mm, 83 * mm, 52 * mm, 68 * mm, HexColor("#D8E8C5"), 6)
    draw_pack_card(c, PUBLIC / potash["image"].lstrip("/"), 107 * mm, 63 * mm, 49 * mm, 66 * mm, HexColor("#EBD5A4"), -3)

    c.setFillColor(HexColor("#F8F5EC"))
    c.roundRect(MARGIN, 42 * mm, 93 * mm, 43 * mm, 5 * mm, stroke=0, fill=1)
    c.setFillColor(CLAY)
    c.setFont("Helvetica-Bold", 7.5)
    c.drawString(MARGIN + 8 * mm, 75 * mm, "THE GAO DEHAT PROMISE")
    c.setFillColor(INK)
    c.setFont(SERIF_BOLD, 16)
    c.drawString(MARGIN + 8 * mm, 62 * mm, "Clear details. Better choices.")
    c.setFont("Helvetica", 8.5)
    c.drawString(MARGIN + 8 * mm, 51 * mm, "17 product profiles with pack details and label-guided use.")
    c.setFillColor(HexColor("#CDE1B5"))
    c.setFont("Helvetica-Bold", 7.7)
    c.drawCentredString(W / 2, 23 * mm, "A VANSH GROUP COMPANY  |  GAO DEHAT INDUSTRIES PVT. LTD.")
    c.showPage()


def draw_category_card(c, category, products, x, y, width, height):
    style = CATEGORY_DATA[category]
    c.setFillColor(style["wash"])
    c.roundRect(x, y, width, height, 5 * mm, stroke=0, fill=1)
    c.setFillColor(style["deep"])
    c.roundRect(x, y + height - 13 * mm, width, 13 * mm, 5 * mm, stroke=0, fill=1)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 6.8)
    c.drawString(x + 7 * mm, y + height - 8.6 * mm, style["label"])
    c.setFillColor(INK)
    c.setFont(SERIF_BOLD, 18)
    c.drawString(x + 7 * mm, y + height - 25 * mm, style["label"].title())
    draw_wrapped(c, style["description"], x + 7 * mm, y + height - 34 * mm, width - 14 * mm, size=7.6, leading=9.5, color=MUTED, max_lines=2)
    for index, product in enumerate(products):
        row_y = y + height - 54 * mm - index * 9.3 * mm
        c.setStrokeColor(HexColor("#C9D8C7"))
        c.line(x + 7 * mm, row_y - 3 * mm, x + width - 7 * mm, row_y - 3 * mm)
        c.setFillColor(CLAY)
        c.setFont("Helvetica-Bold", 6.2)
        c.drawString(x + 7 * mm, row_y, f"{index + 1:02d}")
        c.setFillColor(INK)
        c.setFont("Helvetica-Bold", 7.3)
        c.drawString(x + 15 * mm, row_y, safe_text(product["name"]))
    draw_image_contain(c, PUBLIC / products[0]["image"].lstrip("/"), x + width - 34 * mm, y + 7 * mm, 27 * mm, 33 * mm)


def draw_catalogue_guide(c, products, total):
    c.setFillColor(CREAM)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(INK)
    c.rect(0, H - 25 * mm, W, 25 * mm, stroke=0, fill=1)
    draw_logo(c, MARGIN, H - 22 * mm, 15 * mm)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(MARGIN + 20 * mm, H - 14.5 * mm, "GAO DEHAT PRODUCT CATALOGUE")
    c.setFillColor(GOLD)
    c.drawRightString(W - MARGIN, H - 14.5 * mm, "START HERE")
    footer(c, 2, total)

    c.setFillColor(INK)
    c.setFont(SERIF_BOLD, 29)
    c.drawString(MARGIN, H - 46 * mm, "Choose by crop need.")
    c.setFillColor(CLAY)
    c.setFont(SERIF, 18)
    c.drawString(MARGIN, H - 57 * mm, "Then use the product label with care.")
    draw_wrapped(
        c,
        "The range is organised into three clear product families. Every profile includes the same practical information for easy comparison.",
        MARGIN,
        H - 70 * mm,
        161 * mm,
        size=9.3,
        leading=12.5,
        color=MUTED,
        max_lines=3,
    )

    grouped = {category: [product for product in products if product["category"] == category] for category in CATEGORY_DATA}
    card_y, card_h = 51 * mm, 135 * mm
    gap = 6 * mm
    card_w = (W - 2 * MARGIN - 2 * gap) / 3
    for index, category in enumerate(("soil", "growth", "micro")):
        draw_category_card(c, category, grouped[category], MARGIN + index * (card_w + gap), card_y, card_w, card_h)

    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 7.3)
    c.drawCentredString(W / 2, 32 * mm, "PRODUCT SPECIFICATIONS ARE SHOWN FROM THE RESPECTIVE PACK. USE ONLY AS DIRECTED.")
    c.showPage()


def draw_benefit_card(c, x, y, width, height, index, value, style):
    c.setFillColor(white)
    c.roundRect(x, y, width, height, 3 * mm, stroke=0, fill=1)
    c.setStrokeColor(style["accent"])
    c.setLineWidth(1.1)
    c.roundRect(x, y, width, height, 3 * mm, stroke=1, fill=0)
    c.setFillColor(style["accent"])
    c.circle(x + 10 * mm, y + height - 12 * mm, 6 * mm, stroke=0, fill=1)
    c.setFillColor(style["deep"])
    c.setFont("Helvetica-Bold", 8)
    c.drawCentredString(x + 10 * mm, y + height - 14.5 * mm, f"0{index + 1}")
    c.setFillColor(CLAY)
    c.setFont("Helvetica-Bold", 6.7)
    c.drawString(x + 7 * mm, y + height - 25 * mm, "KEY BENEFIT")
    draw_wrapped(c, value, x + 7 * mm, y + height - 36 * mm, width - 14 * mm, font=SERIF_BOLD, size=10.5, leading=13, color=INK, max_lines=3)


def draw_use_step(c, x, y, width, index, value):
    c.setFillColor(HexColor("#1E5A40"))
    c.circle(x + 4.6 * mm, y + 15 * mm, 4.6 * mm, stroke=0, fill=1)
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 7.3)
    c.drawCentredString(x + 4.6 * mm, y + 13.2 * mm, str(index + 1))
    draw_wrapped(c, value, x + 12 * mm, y + 18.5 * mm, width - 14 * mm, font="Helvetica", size=7.5, leading=9.3, color=white, max_lines=3)


def draw_product_profile(c, product, number, total):
    style = CATEGORY_DATA[product["category"]]
    c.setFillColor(style["wash"])
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(style["accent"])
    c.circle(W - 2 * mm, H - 44 * mm, 35 * mm, stroke=0, fill=1)
    c.setFillColor(HexColor("#FFFFFF"))
    c.circle(W - 2 * mm, H - 44 * mm, 26 * mm, stroke=0, fill=1)
    c.setFillColor(INK)
    c.rect(0, H - 25 * mm, W, 25 * mm, stroke=0, fill=1)
    draw_logo(c, MARGIN, H - 22 * mm, 15 * mm)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(MARGIN + 20 * mm, H - 14.5 * mm, "GAO DEHAT PRODUCT CATALOGUE")
    c.setFillColor(style["accent"])
    c.setFont("Helvetica-Bold", 7.5)
    c.drawRightString(W - MARGIN, H - 14.5 * mm, f"{style['label']}  |  {number:02d}")

    image_x, image_y, image_w, image_h = MARGIN, 142 * mm, 74 * mm, 95 * mm
    c.setFillColor(INK)
    c.roundRect(image_x, image_y, image_w, image_h, 6 * mm, stroke=0, fill=1)
    c.setFillColor(style["accent"])
    c.circle(image_x + image_w - 2 * mm, image_y + image_h - 7 * mm, 28 * mm, stroke=0, fill=1)
    c.setFillColor(HexColor("#F7F3E6"))
    c.roundRect(image_x + 5 * mm, image_y + 7 * mm, image_w - 10 * mm, image_h - 14 * mm, 4 * mm, stroke=0, fill=1)
    draw_image_contain(c, PUBLIC / product["image"].lstrip("/"), image_x + 8 * mm, image_y + 12 * mm, image_w - 16 * mm, image_h - 28 * mm)
    c.setFillColor(style["accent"])
    c.roundRect(image_x + 6 * mm, image_y + 5 * mm, 36 * mm, 7 * mm, 1.5 * mm, stroke=0, fill=1)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 6.2)
    c.drawCentredString(image_x + 24 * mm, image_y + 7.4 * mm, "PRODUCT PACK")

    detail_x = image_x + image_w + 11 * mm
    detail_w = W - MARGIN - detail_x
    c.setFillColor(CLAY)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(detail_x, H - 47 * mm, f"PRODUCT PROFILE  |  {number:02d}")
    c.setFillColor(style["deep"])
    c.setFont(SERIF_BOLD, 38)
    c.drawRightString(W - MARGIN, H - 47 * mm, f"{number:02d}")
    title_size = 27 if len(product["name"]) < 19 else 22
    title_lines = wrapped_lines(product["name"], SERIF_BOLD, title_size, detail_w)
    title_y = H - 63 * mm
    c.setFillColor(INK)
    c.setFont(SERIF_BOLD, title_size)
    for index, line in enumerate(title_lines[:2]):
        c.drawString(detail_x, title_y - index * (title_size + 4), safe_text(line))
    type_y = title_y - len(title_lines[:2]) * (title_size + 4) - 5 * mm
    type_end = draw_wrapped(c, product["type"], detail_x, type_y, detail_w, font="Helvetica-Bold", size=10.2, leading=12.5, color=style["deep"], max_lines=3)
    c.setStrokeColor(style["accent"])
    c.setLineWidth(1.1)
    c.line(detail_x, type_end - 4 * mm, detail_x + detail_w, type_end - 4 * mm)
    overview_end = draw_wrapped(c, product["overview"], detail_x, type_end - 13 * mm, detail_w, font="Helvetica", size=9.2, leading=12.2, color=MUTED, max_lines=4)

    essentials_top = max(image_y + 10 * mm, overview_end - 10 * mm)
    c.setFillColor(white)
    c.roundRect(detail_x, essentials_top - 35 * mm, detail_w, 34 * mm, 3 * mm, stroke=0, fill=1)
    c.setFillColor(CLAY)
    c.setFont("Helvetica-Bold", 7)
    c.drawString(detail_x + 6 * mm, essentials_top - 8 * mm, "THE ESSENTIALS")
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(detail_x + 6 * mm, essentials_top - 17 * mm, "PACK")
    c.setFont(SERIF_BOLD, 11)
    c.drawString(detail_x + 22 * mm, essentials_top - 17 * mm, safe_text(product["pack"]))
    c.setFont("Helvetica-Bold", 8)
    c.drawString(detail_x + 6 * mm, essentials_top - 26 * mm, "SUITABLE")
    draw_wrapped(c, product["suitable"], detail_x + 22 * mm, essentials_top - 26 * mm, detail_w - 28 * mm, size=7.4, leading=8.6, color=MUTED, max_lines=2)

    benefit_y, benefit_h = 68 * mm, 51 * mm
    benefit_gap = 5 * mm
    benefit_w = (W - 2 * MARGIN - 2 * benefit_gap) / 3
    for index, benefit in enumerate(product["benefits"][:3]):
        draw_benefit_card(c, MARGIN + index * (benefit_w + benefit_gap), benefit_y, benefit_w, benefit_h, index, benefit, style)

    use_y, use_h = 20 * mm, 44 * mm
    c.setFillColor(INK)
    c.roundRect(MARGIN, use_y, W - 2 * MARGIN, use_h, 4 * mm, stroke=0, fill=1)
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 7.3)
    c.drawString(MARGIN + 7 * mm, use_y + use_h - 10 * mm, "LABEL-GUIDED USE")
    c.setFillColor(HexColor("#D8EAD3"))
    c.setFont("Helvetica", 7.3)
    c.drawString(MARGIN + 7 * mm, use_y + use_h - 17 * mm, "Read the pack first. Use only as directed.")
    use_steps = [
        "Read the printed label fully before using the product.",
        "Follow the pack's dose, crop stage and application method.",
        "Keep the pack sealed, dry and away from direct sunlight.",
    ]
    step_start = MARGIN + 7 * mm
    step_width = (W - 2 * MARGIN - 14 * mm) / 3
    for index, instruction in enumerate(use_steps):
        draw_use_step(c, step_start + index * step_width, use_y + 6 * mm, step_width - 3 * mm, index, instruction)

    footer(c, number + 2, total)
    c.showPage()


def main():
    register_fonts()
    products = parse_products()
    total_pages = len(products) + 2
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=A4, pageCompression=1)
    c.setTitle("Gao Dehat Product Catalogue")
    c.setAuthor("Gao Dehat Industries Pvt. Ltd.")
    c.setSubject("Dedicated product profiles for the Gao Dehat agricultural range")
    c.setCreator("Gao Dehat")
    draw_cover(c, products)
    draw_catalogue_guide(c, products, total_pages)
    for index, product in enumerate(products, start=1):
        draw_product_profile(c, product, index, total_pages)
    c.save()


if __name__ == "__main__":
    main()
