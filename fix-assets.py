#!/usr/bin/env python3
import os
import re
import sys
from PIL import Image

if not os.path.exists("content.js") or not os.path.exists("assets"):
    sys.exit("Запускайте из корня репозитория plair (рядом должны быть content.js и assets/).")

# --- 1. Маска логотипа ---
src = Image.open("assets/logo-original.png").convert("RGBA")
alpha = src.split()[3].point(lambda v: min(255, round(v * 255 / 250)))
glyphs = alpha.crop((52, 223, 1575, 935)).resize((800, 374), Image.LANCZOS)
Image.merge("RGBA", (glyphs, glyphs, glyphs, glyphs)).save(
    "assets/logo-mask.webp", format="WEBP", lossless=True, quality=95, method=6
)
print("маска: assets/logo-mask.webp", os.path.getsize("assets/logo-mask.webp") // 1024, "КБ")

# --- 2. Адаптивные варианты ---
VARIANT_WIDTHS = [800, 1400]
content = open("content.js", encoding="utf-8").read()
made = 0

for path, declared in re.findall(r'src: "(/assets/[^"]+\.webp)", w: (\d+)', content):
    source = path.lstrip("/")
    if not os.path.exists(source):
        print("пропуск, нет исходника:", source)
        continue
    img = Image.open(source)
    img.load()
    if img.width != int(declared):
        print(f"внимание: {source} — в content.js w={declared}, фактически {img.width}")
    for width in VARIANT_WIDTHS:
        if width >= int(declared):
            continue
        out = source.replace(".webp", f"-{width}.webp")
        height = round(img.height * width / img.width)
        img.resize((width, height), Image.LANCZOS).save(
            out, format="WEBP", quality=80, method=6
        )
        made += 1

print("вариантов сгенерировано:", made)

# --- 3. CSS и версия статики ---
css = open("styles.css", encoding="utf-8").read()
old = (
    '.logo{position:relative;display:block;width:145px;aspect-ratio:1523/712;overflow:hidden}'
    '.logo:before{content:"";position:absolute;left:-3.4143%;top:-31.3202%;'
    'width:105.7124%;height:137.2191%;background:var(--ink)'
)
new = (
    '.logo{position:relative;display:block;width:145px;aspect-ratio:1523/712}'
    '.logo:before{content:"";position:absolute;inset:0;background:var(--ink)'
)
if old in css:
    open("styles.css", "w", encoding="utf-8").write(css.replace(old, new))
    print("styles.css: геометрия логотипа упрощена")
elif new in css:
    print("styles.css: уже поправлен")
else:
    print("styles.css: правило .logo не найдено, поправьте вручную")

bumped = 0
for root, dirs, files in os.walk("."):
    dirs[:] = [d for d in dirs if d != ".git"]
    for name in files:
        if not name.endswith(".html"):
            continue
        full = os.path.join(root, name)
        text = open(full, encoding="utf-8").read()
        if "?v=2" in text:
            open(full, "w", encoding="utf-8").write(text.replace("?v=2", "?v=3"))
            bumped += 1
print("версия статики поднята в файлах:", bumped)
