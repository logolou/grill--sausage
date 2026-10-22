# 去掉人物抠图残留的白底：从透明区域出发，把相连的近白色像素一起抠掉，再把边缘发白的半透明像素压暗
import sys
import numpy as np
from PIL import Image
from collections import deque
src, dst = sys.argv[1], sys.argv[2]
ymax = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0   # 只处理上面这一段（避免误伤白衬衫）
im = np.asarray(Image.open(src).convert('RGBA')).copy()
H, W = im.shape[:2]
rgb = im[..., :3].astype(int); a = im[..., 3].astype(int)
mn = rgb.min(2); mx = rgb.max(2)
white = (mn > 215) & (mx - mn < 28)
lim = int(H * ymax)
seen = np.zeros((H, W), bool); q = deque()
for y in range(lim):
    for x in range(W):
        if a[y, x] < 40: seen[y, x] = True; q.append((y, x))
removed = 0
while q:
    y, x = q.popleft()
    for dy, dx in ((1,0),(-1,0),(0,1),(0,-1)):
        ny, nx = y + dy, x + dx
        if 0 <= ny < lim and 0 <= nx < W and not seen[ny, nx] and white[ny, nx]:
            seen[ny, nx] = True; a[ny, nx] = 0; removed += 1; q.append((ny, nx))
# 边缘一圈：挨着透明的偏白像素，按白的程度降低不透明度
trans = a < 40
edge = np.zeros_like(trans)
edge[1:] |= trans[:-1]; edge[:-1] |= trans[1:]; edge[:, 1:] |= trans[:, :-1]; edge[:, :-1] |= trans[:, 1:]
pale = edge & ~trans & (mn > 190) & (np.arange(H)[:, None] < lim)
a[pale] = (a[pale] * 0.35).astype(int)
im[..., 3] = a.clip(0, 255).astype(np.uint8)
Image.fromarray(im).save(dst, 'WEBP', quality=88, method=6)
print(src, 'removed', removed, 'edge', int(pale.sum()))
