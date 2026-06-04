#!/bin/bash
# ============================================
# 项目初始化脚本 - 运维学习第1步
# 功能：安装Docker、配置环境
# ============================================

set -e

echo "=========================================="
echo "🚀 我的网站 - 开发环境初始化"
echo "=========================================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查是否是Ubuntu/Debian
if [ -f /etc/debian_version ]; then
    echo -e "${BLUE}检测到Debian/Ubuntu系统${NC}"

    # 更新包列表
    echo -e "${YELLOW}更新系统包...${NC}"
    sudo apt-get update -y

    # 安装必要工具
    echo -e "${YELLOW}安装基础工具 (curl, ca-certificates)...${NC}"
    sudo apt-get install -y curl ca-certificates gnupg lsb-release

    # 检查Docker是否已安装
    if ! command -v docker &> /dev/null; then
        echo -e "${YELLOW}Docker未安装，开始安装...${NC}"

        # 添加Docker官方GPG key
        sudo install -m 0755 -d /etc/apt/keyrings
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
        sudo chmod a+r /etc/apt/keyrings/docker.gpg

        # 设置Docker仓库
        echo \
          "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
          $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
          sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

        # 安装Docker
        sudo apt-get update -y
        sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

        # 将当前用户加入docker组
        sudo usermod -aG docker $USER
        echo -e "${GREEN}Docker安装成功！${NC}"
        echo -e "${YELLOW}注意：请重新登录或运行 'newgrp docker' 来应用用户组变更${NC}"
    else
        echo -e "${GREEN}Docker已安装${NC}"
    fi

    # 检查Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        echo -e "${YELLOW}Docker Compose未找到${NC}"
    else
        echo -e "${GREEN}Docker Compose已就绪${NC}"
    fi
else
    echo -e "${RED}此脚本主要针对Ubuntu/Debian系统${NC}"
    echo -e "${YELLOW}请手动安装Docker和Docker Compose${NC}"
fi

echo -e "${BLUE}"
echo "=========================================="
echo "✅ 环境检查完成！"
echo "=========================================="
echo ""
echo "下一步操作："
echo "  1. 如果刚安装Docker，运行：newgrp docker"
echo "  2. 然后运行：./scripts/start.sh"
echo ""
echo "详细文档见 README.md"
echo "=========================================="
echo -e "${NC}"
