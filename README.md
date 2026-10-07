# 校门口烤肠摊

放学铃一响，实验二小门口的烤肠摊就开张了。这是一个竖屏手机小游戏：烤肠、翻面、挤酱撒料、装盒递给客人，盯住火候别烤焦，还要提防逃单的小孩。

做成了 **小红书小工具**（离线 zip 包），纯原生 HTML / CSS / JS，没有任何依赖。

**在线试玩：https://logolou.github.io/grill--sausage/** （建议用手机打开，竖屏玩）

## 玩法

- 10 个关卡 + 无尽模式，第 1 关是摊主老王的手把手教学
- 点锅里的烤肠翻面；两面都烤到刻度才算熟，分「嫩 / 脆 / 微焦」
- 把番茄酱、蜂蜜芥末、孜然、辣椒拖到烤肠上，按客人要求装盒递过去
- 油少了会粘锅，锅用久了结锅巴要来回蹭掉，有人扫码不付钱要喊住
- 赚的钱可以升级小摊（多一个打包盒、可调火力、智能涂抹机……）或买道具救急

## 目录

| 路径 | 内容 |
| --- | --- |
| `versions/stable-v30/` | 正式版源码（上传小红书用这个） |
| `app/` | 粘锅手感测试版源码 |
| `audio-src/` | 背景音乐原文件和裁剪后的片段 |
| `icon/` | 小工具图标 |
| `docs/` | 在线试玩页面（由 `build.sh` 生成，GitHub Pages 发布） |
| `build.sh` | 打包脚本 |

每个版本目录里：`index.html` 入口，`assets/main.js` 游戏逻辑，`assets/style.css` 样式，`assets/bgm-data.js` 背景音乐。

## 本地运行

```bash
cd versions/stable-v30 && python3 -m http.server 8765
```

浏览器打开 http://localhost:8765 。

## 打包

```bash
./build.sh
```

生成 `dist/sausage-stall.zip`（正式版）和 `dist/sausage-stall-test-sticky.zip`（测试版），并把正式版同步到 `docs/`（GitHub Pages 在线试玩用），会自动给资源加版本号防缓存。装了 minitool-zip-builder skill 时会顺便跑包体审计。

## 音乐

背景音乐为《天真的橡皮》，版权归原作者所有，仅用于本游戏。
