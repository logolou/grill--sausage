# 按锅槽角度生成每槽烤肠图：s_{熟度}_{槽号}.webp
# 用法：python3 tools/make_skewers.py <输出目录>
import glob, re, math, sys
import numpy as np
from PIL import Image, ImageFilter
SRC = 'art-src/skewer'
TARGET = {1: 12.0, 2: 4.0, 3: -4.0, 4: -13.0}   # 锅槽倾角：+ 为上端偏右
SOURCE = {1: 4, 2: 3, 3: 2, 4: 1}               # 各槽取倾角最接近的原图
CW, CH = 150, 240

def axis(a):
    ys, xs = np.nonzero(a[..., 3] > 128)
    c = np.cov(np.vstack([xs - xs.mean(), ys - ys.mean()]))
    vx, vy = np.linalg.eigh(c)[1][:, 1]
    if vy > 0: vx, vy = -vx, -vy
    return math.degrees(math.atan2(vx, -vy))

def fill_holes(im):
    # 原图肠身内部有一串半透明像素（会透出锅底，看着像灰色划痕），把内部补成不透明
    a = np.asarray(im).copy()
    al = a[..., 3]
    h, w = al.shape
    outside = np.zeros((h, w), bool)
    stack = [(0, 0), (0, w - 1), (h - 1, 0), (h - 1, w - 1)]
    while stack:
        y, x = stack.pop()
        if y < 0 or x < 0 or y >= h or x >= w or outside[y, x] or al[y, x] >= 250: continue
        outside[y, x] = True
        stack += [(y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)]
    inner = ~outside & (al < 255)
    # 连同洞边一圈杂色一起，用周围肠皮颜色由外向内补
    bad = inner & (al < 200)   # 真正的洞：重新补色；其余近乎不透明的只把 alpha 补满
    for _ in range(1):
        bad = bad | np.roll(bad, 1, 0) | np.roll(bad, -1, 0) | np.roll(bad, 1, 1) | np.roll(bad, -1, 1)
    bad &= ~outside
    rgb = a[..., :3].astype(float)
    known = ~bad & ~outside
    while bad.any():
        acc = np.zeros_like(rgb); cnt = np.zeros((h, w))
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                k = np.roll(np.roll(known, dy, 0), dx, 1)
                acc += np.roll(np.roll(rgb, dy, 0), dx, 1) * k[..., None]; cnt += k
        grow = bad & (cnt > 0)
        if not grow.any(): break
        rgb[grow] = acc[grow] / cnt[grow][:, None]
        known |= grow; bad &= ~grow
    a[..., :3] = rgb.round().astype(np.uint8)
    al[inner] = 255
    a[..., 3] = al
    return Image.fromarray(a), inner.sum()

def bleed(im):
    # 透明像素的 RGB 用邻近不透明色填充，避免缩放时边缘出现灰线
    a = im.getchannel('A')
    rgb = im.convert('RGB')
    solid = Image.new('RGB', im.size)
    solid.paste(rgb, mask=a.point(lambda v: 255 if v > 0 else 0))
    acc = solid
    for _ in range(8):
        acc = acc.filter(ImageFilter.MaxFilter(3))
        acc.paste(solid, mask=a.point(lambda v: 255 if v > 0 else 0))
    acc.putalpha(a)
    return acc

files = {re.search(r'skewer_(\w+?)_s(\d)', f).groups(): f for f in glob.glob(SRC + '/*.png')}
for (state, s), f in sorted(files.items()):
    for slot, src in SOURCE.items():
        if int(s) != src: continue
        im = Image.open(f).convert('RGBA')
        im, n = fill_holes(im)
        print(state, s, '->', slot, 'holes', n)
        im = im.rotate(-(TARGET[slot] - axis(np.asarray(im))), Image.BICUBIC, expand=True)
        a = np.asarray(im)
        ys, xs = np.nonzero(a[..., 3] > 128)
        cx, cy = xs.mean(), ys.mean()
        out = Image.new('RGBA', (CW, CH), (0, 0, 0, 0))
        out.paste(im, (int(round(CW / 2 - cx)), int(round(CH / 2 - cy))), im)
        bleed(out).save('%s/s_%s_%d.webp' % (sys.argv[1], state, slot), 'WEBP', quality=85, method=6, exact=True)
