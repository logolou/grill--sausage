#!/bin/bash
# 打包正式版 + 测试版：自动更新资源版本号（防手机缓存）、审计、刷新手机测试目录
set -e
cd "$(dirname "$0")"
STAMP=$(date +%y%m%d%H%M%S)
find app versions -name .DS_Store -delete
build() { # $1 源目录  $2 输出 zip
  local tmp; tmp=$(mktemp -d)
  cp -R "$1"/. "$tmp"/
  sed -i '' "s/?v=BUILD/?v=$STAMP/g" "$tmp/index.html"
  rm -f "$2" && (cd "$tmp" && zip -rqX "$OLDPWD/$2" . -x '*.DS_Store')
  rm -rf "$tmp"
  local audit=.claude/skills/minitool-zip-builder/scripts/audit_artifact.py
  if [ -f "$audit" ]; then python3 "$audit" "$2"; else echo "（未安装 minitool-zip-builder skill，跳过审计）$2"; fi
}
build versions/stable-v30 dist/sausage-stall.zip
build app dist/sausage-stall-test-sticky.zip
# 试玩链接用的目录（同样替换版本号）
rm -rf test-build release-build && mkdir -p test-build release-build
(cd test-build && unzip -q ../dist/sausage-stall-test-sticky.zip) && sed -i '' 's#<title>校门口烤肠摊</title>#<title>烤肠摊粘锅测试版</title>#' test-build/index.html
(cd release-build && unzip -q ../dist/sausage-stall.zip)
SP="$PWD/phone-test"   # 手机局域网测试目录（放在项目里，避免临时目录被系统清掉）
rm -rf "$SP" && mkdir -p "$SP" && (cd "$SP" && unzip -q ../dist/sausage-stall.zip) && echo "手机测试已更新（版本 $STAMP）"
# GitHub Pages 在线试玩（main 分支 /docs）
rm -rf docs && mkdir -p docs && (cd docs && unzip -q ../dist/sausage-stall.zip) && touch docs/.nojekyll
