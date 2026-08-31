from hashlib import sha1
from pathlib import Path
import re

from PIL import Image, ImageDraw, ImageFont
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
# Devanagari MT has cleaner, more open glyphs at the small sizes used in the
# catalogue. Hindi copy is rasterised at print resolution because ReportLab
# cannot shape Devanagari reliably on its own.
DEVANAGARI_FONT = Path("/System/Library/Fonts/Supplemental/DevanagariMT.ttc")

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


def has_devanagari(value):
    return any("\u0900" <= character <= "\u097f" for character in value)


def color_hex(color):
    return f"#{int(color.red * 255):02x}{int(color.green * 255):02x}{int(color.blue * 255):02x}"


def normalise_native_text(value):
    return value.replace("·", " - ").replace("×", "x").replace("–", "-").replace("—", "-")


def native_text_image(text, font_size, max_width, color, max_lines=None):
    """Render pack names in their original Devanagari, not a translated substitute."""
    if not DEVANAGARI_FONT.exists():
        raise FileNotFoundError(f"Required Devanagari font is unavailable: {DEVANAGARI_FONT}")

    text = normalise_native_text(text)
    # Keep the Hindi assets well above print resolution so they stay crisp in
    # the PDF viewer and when the catalogue is printed.
    pixels_per_point = 8
    font = ImageFont.truetype(str(DEVANAGARI_FONT), size=round(font_size * pixels_per_point))
    measure = ImageDraw.Draw(Image.new("RGB", (1, 1)))
    max_width_px = round(max_width * pixels_per_point)
    lines, line = [], ""
    for word in text.split():
        candidate = word if not line else f"{line} {word}"
        candidate_width = measure.textbbox((0, 0), candidate, font=font)[2]
        if candidate_width <= max_width_px or not line:
            line = candidate
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    if max_lines:
        lines = lines[:max_lines]

    padding = round(1.5 * pixels_per_point)
    line_height = round(font_size * pixels_per_point * 1.23)
    text_width = max(measure.textbbox((0, 0), item, font=font)[2] for item in lines)
    image = Image.new("RGBA", (text_width + padding * 2, line_height * len(lines) + padding * 2), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    for index, item in enumerate(lines):
        draw.text(
            (padding, padding + index * line_height),
            item,
            font=font,
            fill=color_hex(color),
            stroke_width=1,
            stroke_fill=color_hex(color),
        )

    IMAGE_CACHE.mkdir(parents=True, exist_ok=True)
    destination = IMAGE_CACHE / f"name-{sha1((text + str(font_size) + color_hex(color) + str(max_lines)).encode()).hexdigest()[:12]}.png"
    image.save(destination)
    return destination, image.width / pixels_per_point, image.height / pixels_per_point


def draw_exact_name(c, text, x, y_top, max_width, size, color):
    """Draw a product name in the exact script printed on its pack."""
    if not has_devanagari(text):
        lines = wrapped_lines(text, SERIF_BOLD, size, max_width)
        c.setFillColor(color)
        c.setFont(SERIF_BOLD, size)
        leading = size + 4
        for index, line in enumerate(lines[:2]):
            c.drawString(x, y_top - index * leading, safe_text(line))
        return y_top - len(lines[:2]) * leading

    image_path, image_width, image_height = native_text_image(text, size, max_width, color)
    c.drawImage(str(image_path), x, y_top - image_height, width=image_width, height=image_height, mask="auto")
    return y_top - image_height


def draw_exact_name_row(c, text, x, y, max_width, size, color):
    if not has_devanagari(text):
        c.setFillColor(color)
        c.setFont("Helvetica-Bold", size)
        c.drawString(x, y, safe_text(text))
        return
    image_path, image_width, image_height = native_text_image(text, size, max_width, color)
    c.drawImage(str(image_path), x, y - image_height * 0.76, width=image_width, height=image_height, mask="auto")


def draw_exact_wrapped(c, text, x, y, max_width, size, leading, color, max_lines=None, font="Helvetica"):
    """Draw English and Hindi copy at the same visual level without losing the Hindi script."""
    if not has_devanagari(text):
        return draw_wrapped(c, text, x, y, max_width, font=font, size=size, leading=leading, color=color, max_lines=max_lines)
    image_path, image_width, image_height = native_text_image(text, size, max_width, color, max_lines=max_lines)
    c.drawImage(str(image_path), x, y - image_height, width=image_width, height=image_height, mask="auto")
    return y - image_height


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
        benefits_hi_match = re.search(r"\bbenefitsHi:\s*\[([^\]]+)\]", block, flags=re.S)
        if not benefits_hi_match:
            raise ValueError("Missing benefitsHi in product data")
        product = {
            "slug": prop(block, "slug"),
            "name": prop(block, "name"),
            "nameHi": prop(block, "nameHi"),
            "type": prop(block, "type"),
            "typeHi": prop(block, "typeHi"),
            "image": prop(block, "image"),
            "pack": prop(block, "pack"),
            "packHi": prop(block, "packHi"),
            "overview": prop(block, "overview"),
            "overviewHi": prop(block, "overviewHi"),
            "benefits": re.findall(r"'([^']*)'", benefits_match.group(1)),
            "benefitsHi": re.findall(r"'([^']*)'", benefits_hi_match.group(1)),
            "suitable": prop(block, "suitable"),
            "suitableHi": prop(block, "suitableHi"),
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
        draw_exact_name_row(c, product["name"], x + 15 * mm, row_y, width - 22 * mm, 7.3, INK)

    # Keep the guide card strictly for scanning the range. A large pack visual
    # here covered the lower product names for longer product families.


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


def draw_benefit_card(c, x, y, width, height, index, value, value_hi, style):
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
    # Reserve enough lower padding for two lines of Hindi copy.
    english_end = draw_wrapped(c, value, x + 7 * mm, y + height - 33 * mm, width - 14 * mm, font=SERIF_BOLD, size=9, leading=11, color=INK, max_lines=2)
    draw_exact_wrapped(c, value_hi, x + 7 * mm, english_end - 1.5 * mm, width - 14 * mm, size=7.8, leading=9.5, color=INK, max_lines=2)


def draw_use_step(c, x, y, width, index, value, value_hi):
    c.setFillColor(HexColor("#1E5A40"))
    c.circle(x + 4.6 * mm, y + 15 * mm, 4.6 * mm, stroke=0, fill=1)
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 7.3)
    c.drawCentredString(x + 4.6 * mm, y + 13.2 * mm, str(index + 1))
    english_end = draw_wrapped(c, value, x + 12 * mm, y + 18.5 * mm, width - 14 * mm, font="Helvetica", size=7.2, leading=8.6, color=white, max_lines=2)
    draw_exact_wrapped(c, value_hi, x + 12 * mm, english_end - 1.5 * mm, width - 14 * mm, size=7.1, leading=8.5, color=white, max_lines=2)


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
    title_y = H - 63 * mm
    title_end = draw_exact_name(c, product["name"], detail_x, title_y, detail_w, title_size, INK)
    type_y = title_end - 5 * mm
    type_end = draw_wrapped(c, product["type"], detail_x, type_y, detail_w, font="Helvetica-Bold", size=9.5, leading=11.3, color=style["deep"], max_lines=2)
    type_hi_end = draw_exact_wrapped(c, product["typeHi"], detail_x, type_end - 2 * mm, detail_w, size=9.2, leading=10.8, color=style["deep"], max_lines=2)
    c.setStrokeColor(style["accent"])
    c.setLineWidth(1.1)
    c.line(detail_x, type_hi_end - 3 * mm, detail_x + detail_w, type_hi_end - 3 * mm)
    overview_end = draw_wrapped(c, product["overview"], detail_x, type_hi_end - 11 * mm, detail_w, font="Helvetica", size=8.5, leading=10.4, color=MUTED, max_lines=2)
    overview_hi_end = draw_exact_wrapped(c, product["overviewHi"], detail_x, overview_end - 1.8 * mm, detail_w, size=8.3, leading=10, color=INK, max_lines=2)

    essentials_top = 160 * mm
    c.setFillColor(white)
    c.roundRect(detail_x, essentials_top - 44 * mm, detail_w, 43 * mm, 3 * mm, stroke=0, fill=1)
    c.setFillColor(CLAY)
    c.setFont("Helvetica-Bold", 7)
    c.drawString(detail_x + 6 * mm, essentials_top - 8 * mm, "THE ESSENTIALS")
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(detail_x + 6 * mm, essentials_top - 17 * mm, "PACK")
    c.setFont(SERIF_BOLD, 10)
    c.drawString(detail_x + 26 * mm, essentials_top - 17 * mm, safe_text(product["pack"]))
    draw_exact_wrapped(c, product["packHi"], detail_x + 26 * mm, essentials_top - 22 * mm, detail_w - 32 * mm, size=7.8, leading=9.3, color=INK, max_lines=1)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(detail_x + 6 * mm, essentials_top - 31 * mm, "SUITABLE")
    suitable_end = draw_wrapped(c, product["suitable"], detail_x + 32 * mm, essentials_top - 31 * mm, detail_w - 38 * mm, size=6.6, leading=7.7, color=MUTED, max_lines=2)
    draw_exact_wrapped(c, product["suitableHi"], detail_x + 32 * mm, suitable_end - 1 * mm, detail_w - 38 * mm, size=7.1, leading=8.5, color=INK, max_lines=2)

    # The Hindi Suitable line ends below the essentials card on longer labels.
    # Move the benefit row down slightly so the two sections never touch.
    benefit_y, benefit_h = 64 * mm, 50 * mm
    benefit_gap = 5 * mm
    benefit_w = (W - 2 * MARGIN - 2 * benefit_gap) / 3
    for index, benefit in enumerate(product["benefits"][:3]):
        draw_benefit_card(c, MARGIN + index * (benefit_w + benefit_gap), benefit_y, benefit_w, benefit_h, index, benefit, product["benefitsHi"][index], style)

    use_y, use_h = 18 * mm, 42 * mm
    c.setFillColor(INK)
    c.roundRect(MARGIN, use_y, W - 2 * MARGIN, use_h, 4 * mm, stroke=0, fill=1)
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 7.3)
    c.drawString(MARGIN + 7 * mm, use_y + use_h - 10 * mm, "LABEL-GUIDED USE")
    use_steps = [
        "Read the printed label fully before using the product.",
        "Follow the pack's dose, crop stage and application method.",
        "Keep the pack sealed, dry and away from direct sunlight.",
    ]
    use_steps_hi = [
        "उपयोग से पहले उत्पाद का लेबल पूरा पढ़ें।",
        "पैक पर दी गई मात्रा, फसल अवस्था और उपयोग विधि का पालन करें।",
        "पैक को बंद, सूखी जगह और सीधी धूप से दूर रखें।",
    ]
    step_start = MARGIN + 7 * mm
    step_width = (W - 2 * MARGIN - 14 * mm) / 3
    for index, instruction in enumerate(use_steps):
        draw_use_step(c, step_start + index * step_width, use_y + 6 * mm, step_width - 3 * mm, index, instruction, use_steps_hi[index])

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
