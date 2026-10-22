# 把旧版「着急/生气」顾客图缩放对齐到当前半身像（以头顶到肩的宽度为准，底边对齐）
import glob, os, sys
import numpy as np
from PIL import Image
OUT = sys.argv[1]
K = 1.12   # 旧图人物略小，放大到和半身像差不多
def top_width(im, frac=.3):
    a = np.asarray(im)[..., 3] > 128
    ys, xs = np.nonzero(a); top = ys.min(); h = ys.max() - top
    band = a[top:top + int(h * frac)]
    cols = np.nonzero(band.any(0))[0]
    return cols.max() - cols.min(), cols.mean()
for f in sorted(glob.glob('art-src/cust_mood/*.webp')):
    cid, mood = os.path.basename(f)[:-5].rsplit('_', 1)
    base = Image.open('%s/%s.webp' % (OUT, cid)).convert('RGBA')
    im = Image.open(f).convert('RGBA')
    k = K
    bcx = np.nonzero((np.asarray(base)[..., 3] > 128).any(0))[0].mean()
    mcx = np.nonzero((np.asarray(im)[..., 3] > 128).any(0))[0].mean()
    im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    ba = np.asarray(base)[..., 3] > 128; ma = np.asarray(im)[..., 3] > 128
    out = Image.new('RGBA', base.size)
    out.paste(im, (round(bcx - mcx * k), base.height - im.height), im)   # 底边对齐
    out.save('%s/%s_%s.webp' % (OUT, cid, mood), 'WEBP', quality=82, method=6)
    print(cid, mood, round(k, 2))
