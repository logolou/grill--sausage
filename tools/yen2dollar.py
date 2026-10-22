# 把金币图上的「¥」换成「$」：找到金币，盖一层金色内圆，再写一个 $
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
FONT = '/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf'
def fix(src, dst, xfrac=1.0):
    im = Image.open(src).convert('RGBA'); a = np.asarray(im).astype(int)
    H, W = a.shape[:2]; lim = int(W * xfrac)
    r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
    gold = (r > 190) & (g > 120) & (b < 110) & (r - b > 90) & (al > 200)
    gold[:, lim:] = False
    ys, xs = np.nonzero(gold)
    cx, cy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
    R = min(xs.max() - xs.min(), ys.max() - ys.min()) / 2
    yy, xx = np.mgrid[0:H, 0:W]; d = np.hypot(xx - cx, yy - cy)
    ring = gold & (d > R * .45) & (d < R * .62)
    col = a[ring][:, :3].mean(0)
    inner = R * .62
    out = im.copy(); dr = ImageDraw.Draw(out)
    # 内圆：中间亮一点、边缘暗一点
    for k in range(int(inner), 0, -1):
        t = k / inner
        c = tuple(int(min(255, v * (1.08 - .12 * t))) for v in col) + (255,)
        dr.ellipse([cx - k, cy - k, cx + k, cy + k], fill=c)
    fs = int(R * 1.25); font = ImageFont.truetype(FONT, fs)
    txt = '$'; bb = dr.textbbox((0, 0), txt, font=font)
    tx = cx - (bb[0] + bb[2]) / 2; ty = cy - (bb[1] + bb[3]) / 2
    shade = tuple(int(v * .62) for v in col) + (255,)
    dr.text((tx + R * .04, ty + R * .06), txt, font=font, fill=shade)
    dr.text((tx, ty), txt, font=font, fill=(255, 250, 225, 255))
    out.putalpha(im.getchannel('A'))
    out.save(dst, 'WEBP', quality=90, method=6)
    print(src, 'coin', round(cx), round(cy), round(R))
for spec in sys.argv[1:]:
    p, xf = (spec.split(':') + ['1'])[:2]
    fix(p, p, float(xf))
