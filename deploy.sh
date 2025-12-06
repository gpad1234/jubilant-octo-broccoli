#!/bin/bash

# CRM Application Deployment Script
# This script automates the deployment of the CRM application to a remote server
# Usage: ./deploy.sh [server-ip] [user]

set -e  # Exit on error

# Configuration
SERVER_IP="${1:-165.232.54.109}"
SSH_USER="${2:-root}"
APP_DIR="/var/www/crm-app"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR"

echo "🚀 Starting CRM deployment to $SERVER_IP..."
echo "================================================"

# Check if server is reachable
echo "📡 Checking server connectivity..."
if ! ping -c 1 "$SERVER_IP" &> /dev/null; then
    echo "❌ Cannot reach server at $SERVER_IP"
    exit 1
fi
echo "✅ Server is reachable"

# Build frontend locally
echo ""
echo "📦 Building frontend..."
npm run build
echo "✅ Frontend built successfully"

# Prepare deployment files
echo ""
echo "📋 Preparing deployment files..."
DEPLOY_DIR=$(mktemp -d)
echo "Temp directory: $DEPLOY_DIR"

# Copy files to temp directory
cp -r dist/ "$DEPLOY_DIR/"
cp -r backend/ "$DEPLOY_DIR/"
cp package.json "$DEPLOY_DIR/"
cp .env.example "$DEPLOY_DIR/.env" 2>/dev/null || true
cp nginx-crm.conf "$DEPLOY_DIR/"
cp crm-backend.service "$DEPLOY_DIR/"

echo "✅ Files prepared"

# Deploy to remote server
echo ""
echo "📤 Deploying to remote server..."

# Create app directory and upload files
ssh "$SSH_USER@$SERVER_IP" "mkdir -p $APP_DIR"
scp -r "$DEPLOY_DIR/"* "$SSH_USER@$SERVER_IP:$APP_DIR/"

echo "✅ Files uploaded"

# Configure and start services on remote server
echo ""
echo "⚙️  Configuring services on remote server..."

ssh "$SSH_USER@$SERVER_IP" << 'REMOTE_COMMANDS'
set -e

APP_DIR="/var/www/crm-app"
BACKEND_DIR="$APP_DIR/backend"

echo "📦 Installing backend dependencies..."
cd "$BACKEND_DIR"
npm install --production
echo "✅ Backend dependencies installed"

echo "📝 Setting up nginx configuration..."
sudo cp "$APP_DIR/nginx-crm.conf" /etc/nginx/sites-available/crm
sudo ln -sf /etc/nginx/sites-available/crm /etc/nginx/sites-enabled/crm

# Test nginx config
if ! sudo nginx -t; then
    echo "❌ Nginx configuration error"
    exit 1
fi
echo "✅ Nginx configuration valid"

echo "📝 Setting up backend service..."
sudo cp "$APP_DIR/crm-backend.service" /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable crm-backend
echo "✅ Backend service registered"

echo "🔐 Setting permissions..."
sudo chown -R www-data:www-data "$APP_DIR"
sudo chmod -R 755 "$APP_DIR"
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
    echo "⚠️  Backend might not be responding (will retry)"
fi

# Check nginx
if sudo systemctl is-active --quiet nginx; then
    echo "✅ Nginx is running"
else
    echo "❌ Nginx is not running"
    exit 1
fi

echo ""
echo "✅ Deployment completed successfully!"

REMOTE_COMMANDS

# Cleanup
echo ""
echo "🧹 Cleaning up..."
rm -rf "$DEPLOY_DIR"
echo "✅ Cleanup complete"

# Summary
echo ""
echo "================================================"
echo "✨ Deployment Summary"
echo "================================================"
echo "Server: $SERVER_IP"
echo "Application URL: http://$SERVER_IP/crm"
echo "API URL: http://$SERVER_IP/api"
echo "Backend Service: crm-backend (systemd)"
echo "Web Server: nginx"
echo ""
echo "🔍 To verify, run:"
echo "   ssh $SSH_USER@$SERVER_IP"
echo "   sudo systemctl status crm-backend"
echo "   curl http://localhost/api/customers"
echo ""
echo "📋 For more info, see DEPLOYMENT.md"
echo "================================================"
