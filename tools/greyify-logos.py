#!/usr/bin/env python3
"""Приводит логотипы клиентов к одному серому силуэту.

Исходники приходят разными: у одного прозрачный фон, у другого белый,
третий сам по себе цветной. На тёмной полосе такой набор выглядит
случайным, поэтому каждый логотип сводится к маске и заливается одним
серым — различается только форма.

Маска берётся из альфы, если она есть; если картинка непрозрачная —
из расстояния до цвета фона (его подсматриваем в углу). Дальше обрезка
по краям рисунка и приведение к общей высоте: строка ставит логотипы
по высоте, и запас в два раза нужен для экранов с плотными точками.

    python3 tools/greyify-logos.py вход/ assets/clients/
"""
import sys
from pathlib import Path

from PIL import Image

INK = (198, 204, 198)   # светло-серый: CSS приглушает его до нужного
HEIGHT = 120            # 2× от самой крупной высоты в вёрстке
PAD = 2                 # поля, чтобы сглаженный край не срезался


def mask_of(img: Image.Image) -> Image.Image:
    """Чёрно-белая маска: 255 там, где у логотипа есть краска."""
    rgba = img.convert('RGBA')
    alpha = rgba.getchannel('A')
    lo, hi = alpha.getextrema()
    if lo < 245:                      # прозрачный фон — маска готова
        return alpha

    # Непрозрачная картинка: фоном считаем цвет левого верхнего угла,
    # краской — всё, что от него заметно отличается.
    rgb = rgba.convert('RGB')
    bg = rgb.getpixel((0, 0))
    px = rgb.load()
    w, h = rgb.size
    out = Image.new('L', (w, h))
    op = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            d = abs(r - bg[0]) + abs(g - bg[1]) + abs(b - bg[2])
            op[x, y] = 255 if d > 210 else int(d * 255 / 210)
    return out


def convert(src: Path, dst: Path) -> tuple[int, int]:
    with Image.open(src) as img:
        mask = mask_of(img)

    box = mask.getbbox()
    if box:
        mask = mask.crop(box)

    w, h = mask.size
    new_w = max(1, round(w * HEIGHT / h))
    mask = mask.resize((new_w, HEIGHT), Image.LANCZOS)

    out = Image.new('RGBA', (new_w + PAD * 2, HEIGHT + PAD * 2), (*INK, 0))
    ink = Image.new('RGBA', mask.size, (*INK, 255))
    out.paste(ink, (PAD, PAD), mask)
    dst.parent.mkdir(parents=True, exist_ok=True)
    out.save(dst, 'PNG', optimize=True)
    return out.size


if __name__ == '__main__':
    src_dir, dst_dir = Path(sys.argv[1]), Path(sys.argv[2])
    for src in sorted(src_dir.iterdir()):
        if src.suffix.lower() not in {'.png', '.jpg', '.jpeg', '.webp'}:
            continue
        dst = dst_dir / (src.stem + '.png')
        size = convert(src, dst)
        print(f'{dst.name}  {size[0]}×{size[1]}')
