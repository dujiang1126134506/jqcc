#!/bin/sh
# 部署构建脚本：安装依赖 + 构建 H5 产物
set -e

echo "=== 安装依赖 ==="
pnpm install --no-frozen-lockfile

echo "=== 构建 H5 ==="
pnpm run build

echo "=== 构建完成 ==="
ls -la dist/
