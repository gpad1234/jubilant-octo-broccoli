#!/bin/bash

# CRM Application Git-based Deployment Script
# This script deploys directly from a git repository
# Usage: ./deploy-from-git.sh [git-repo-url] [server-ip] [user]

set -e  # Exit on error

# Configuration
GIT_REPO="${1}"
SERVER_IP="${2:-165.232.54.109}"
SSH_USER="${3:-root}"
APP_DIR="/var/www/crm-app"
BACKEND_DIR="$APP_DIR/backend"

# Validate arguments
if [ -z "$GIT_REPO" ]; then
    echo "Usage: ./deploy-from-git.sh <git-repo-url> [server-ip] [user]"
    echo ""
    echo "Examples:"
    echo "  ./deploy-from-git.sh https://github.com/user/repo.git 165.232.54.109 root"
    echo "  ./deploy-from-git.sh git@github.com:user/repo.git"
    echo ""
    echo "Current git remote:"
    git remote -v
    exit 1
fi

echo "🚀 Starting git-based deployment..."
echo "================================================"
echo "Git Repo: $GIT_REPO"
echo "Server:   $SERVER_IP"
echo "User:     $SSH_USER"
echo "================================================"
echo ""

# Check if server is reachable
echo "📡 Checking server connectivity..."
if ! ping -c 1 "$SERVER_IP" &> /dev/null; then
    echo "❌ Cannot reach server at $SERVER_IP"
    exit 1
fi
echo "✅ Server is reachable"

# Deploy to remote server
echo ""
echo "📤 Deploying from git repository..."

ssh "$SSH_USER@$SERVER_IP" << REMOTE_COMMANDS
set -e

APP_DIR="$APP_DIR"
BACKEND_DIR="$BACKEND_DIR"
GIT_REPO="$GIT_REPO"

echo "📁 Creating application directory..."
# If app directory exists with old structure, backup and remove it
if [ -d "\$APP_DIR/.git" ]; then
    echo "   Detected existing repository..."
    cd "\$APP_DIR"
    
    # Try to update first
    git fetch origin 2>/dev/null || true
    
    # Check if we're on main branch and can update
    if git branch -r | grep -q origin/main; then
        echo "   Cleaning and resetting to latest..."
        git clean -fd
        git reset --hard origin/main
        echo "✅ Repository cleaned and updated"
    else
        # If branch doesn't exist, do a complete re-clone
        cd ..
        echo "   Doing complete re-clone (old structure detected)..."
        rm -rf "\$APP_DIR"
        mkdir -p "\$APP_DIR"
        cd "\$APP_DIR"
        git clone "\$GIT_REPO" .
        echo "✅ Repository cloned fresh"
    fi
else
    # First time - create and clone
    mkdir -p "\$APP_DIR"
    cd "\$APP_DIR"
    echo "📥 Cloning git repository..."
    git clone "\$GIT_REPO" .
    echo "✅ Repository cloned"
fi

echo "📦 Installing frontend dependencies..."
npm install --production
echo "✅ Frontend dependencies installed"

echo "🔨 Building frontend..."
npm run build
echo "✅ Frontend built"

echo "📦 Installing backend dependencies..."
cd "\$BACKEND_DIR"
npm install --production
echo "✅ Backend dependencies installed"

# Return to app directory
cd "\$APP_DIR"

echo "📝 Setting up nginx configuration..."
if [ ! -f "nginx-crm.conf" ]; then
    echo "❌ nginx-crm.conf not found in \$APP_DIR"
    echo "   Current directory: \$(pwd)"
    echo "   Files in directory:"
    ls -la
    exit 1
fi

sudo cp nginx-crm.conf /etc/nginx/sites-available/crm
sudo ln -sf /etc/nginx/sites-available/crm /etc/nginx/sites-enabled/crm

# Test nginx config
if ! sudo nginx -t; then
    echo "❌ Nginx configuration error"
    exit 1
fi
echo "✅ Nginx configuration valid"

echo "📝 Setting up backend service..."
if [ ! -f "crm-backend.service" ]; then
    echo "❌ crm-backend.service not found in \$APP_DIR"
    echo "   Current directory: \$(pwd)"
    exit 1
fi

sudo cp crm-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable crm-backend
echo "✅ Backend service registered"

echo "🔐 Setting permissions..."
sudo chown -R www-data:www-data "\$APP_DIR"
sudo chmod -R 755 "\$APP_DIR"
echo "✅ Permissions set"

echo "🔄 Restarting services..."
sudo systemctl stop crm-backend 2>/dev/null || true
sleep 1
sudo systemctl start crm-backend
sudo systemctl reload nginx

echo "✅ Services restarted"

echo ""
echo "📊 Verifying deployment..."
sleep 2

# Check backend
if curl -s http://127.0.0.1:5000/api/customers > /dev/null; then
    echo "✅ Backend is responding"
else
    echo "⚠️  Backend might not be responding yet (starting up...)"
fi

# Check nginx
if sudo systemctl is-active --quiet nginx; then
    echo "✅ Nginx is running"
else
    echo "❌ Nginx is not running"
    exit 1
fi

REMOTE_COMMANDS

# Summary
echo ""
echo "================================================"
echo "✨ Deployment Completed Successfully!"
echo "================================================"
echo ""
echo "📍 Server: $SERVER_IP"
echo "🌐 Application URL: http://$SERVER_IP/crm"
echo "📡 API URL: http://$SERVER_IP/api"
echo "🔧 Backend Service: crm-backend (systemd)"
echo "🌍 Web Server: nginx"
echo ""
echo "✅ Next Steps:"
echo "   1. Open http://$SERVER_IP/crm in your browser"
echo "   2. Test API: curl http://$SERVER_IP/api/customers"
echo "   3. Check logs: ssh $SSH_USER@$SERVER_IP 'sudo journalctl -u crm-backend -f'"
echo ""
echo "🔄 For future updates:"
echo "   git push origin main"
echo "   ./deploy-from-git.sh $GIT_REPO $SERVER_IP $SSH_USER"
echo ""
echo "📚 Documentation: See DEPLOYMENT_README.md"
echo "================================================"
