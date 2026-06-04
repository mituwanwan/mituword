#!/bin/bash
# 网络问题诊断和解决脚本

echo "=== 个人网站项目 - 网络问题诊断 ==="
echo ""

# 检查网络连接
echo "1. 检查网络连接..."
if ping -c 1 google.com &> /dev/null; then
    echo "   ✅ 网络连接正常"
else
    echo "   ❌ 网络连接失败"
    echo "   建议: 检查网络设置或使用VPN"
fi

echo ""

# 检查npm配置
echo "2. 检查npm配置..."
npm config list

echo ""

# 检查DNS解析
echo "3. 检查DNS解析..."
if nslookup registry.npmjs.org &> /dev/null; then
    echo "   ✅ DNS解析正常"
else
    echo "   ❌ DNS解析失败"
    echo "   建议: 更换DNS服务器（如8.8.8.8）"
fi

echo ""

# 检查代理设置
echo "4. 检查代理设置..."
if [ -n "$HTTP_PROXY" ]; then
    echo "   HTTP代理: $HTTP_PROXY"
else
    echo "   HTTP代理: 未设置"
fi

if [ -n "$HTTPS_PROXY" ]; then
    echo "   HTTPS代理: $HTTPS_PROXY"
else
    echo "   HTTPS代理: 未设置"
fi

echo ""

# 提供解决方案
echo "=== 解决方案 ==="
echo ""
echo "如果遇到网络问题，请尝试以下方案:"
echo ""
echo "1. 使用国内镜像:"
echo "   npm config set registry https://registry.npmmirror.com"
echo ""
echo "2. 使用代理:"
echo "   export HTTP_PROXY=http://your-proxy:port"
echo "   export HTTPS_PROXY=http://your-proxy:port"
echo ""
echo "3. 手动下载依赖:"
echo "   - Prisma引擎: https://github.com/prisma/prisma-engines/releases"
echo "   - SWC二进制: https://github.com/nickel-org/nickel.rs/releases"
echo ""
echo "4. 使用Docker:"
echo "   docker-compose up -d"
echo ""
echo "5. 使用云端IDE:"
echo "   - GitHub Codespaces"
echo "   - GitPod"
echo ""
