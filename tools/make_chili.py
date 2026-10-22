# 用孜然盒同一张图生成辣椒盒：盒子、勺子完全一样，只把里面的孜然染成红辣椒色
import sys
import numpy as np
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGBA')
hsv = np.asarray(im.convert('RGB').convert('HSV')).astype(float)
a = np.asarray(im)[..., 3]
h, s, v = hsv[..., 0], hsv[..., 1] / 255, hsv[..., 2] / 255
H, Wd = a.shape
yy, xx = np.mgrid[0:H, 0:Wd]
inside = (xx > Wd * .10) & (xx < Wd * .90) & (yy > H * .05) & (yy < H * .82)   # 只染盒子里面，盒沿不动
spice = (s > .28) & (v < .9) & (a > 0) & inside     # 偏棕、偏深的是孜然；奶白色盒子和白勺子饱和度低，不动
w = np.clip((s - .28) / .12, 0, 1) * spice         # 边缘渐变，避免硬边
h2 = np.where(spice, 9 / 360 * 255, h)   # 色相拉到辣椒红
s2 = np.clip(s * (1 + .75 * w), 0, 1)
v2 = np.clip(v * (1 + .12 * w), 0, 1)
hh = h * (1 - w) + h2 * w
out = np.stack([hh, s2 * 255, v2 * 255], -1).astype(np.uint8)
rgb = Image.fromarray(out, 'HSV').convert('RGB')
rgb.putalpha(Image.fromarray(a))
rgb.save(sys.argv[2], 'WEBP', quality=85, method=6)
