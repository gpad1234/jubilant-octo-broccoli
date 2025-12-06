# Deployment Guide for CRM Application

## Overview
This guide deploys the React CRM application to a DigitalOcean droplet at `http://165.232.54.109/crm` with nginx as a reverse proxy.

## Architecture
```
┌─────────────────────────────────────────┐
│       User Browser                      │
│    http://165.232.54.109/crm            │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│       Nginx Reverse Proxy                │
│   (Port 80/443 on Ubuntu Server)        │
└────────────────┬────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
┌───────▼──────┐  ┌──────▼────────┐
│  React SPA   │  │  Backend API   │
│  Port 3000   │  │   Port 5000    │
│ /crm path    │  │  /api path     │
└──────────────┘  └────────────────┘
```

## Prerequisites
- Ubuntu 20.04+ server with nginx installed
- Node.js 18+ installed on the server
- SSH access to the server
- Git installed on the server

## Deployment Steps

### 1. Connect to Droplet
```bash
ssh root@165.232.54.109
```

### 2. Set Up Application Directory
```bash
# Create application directory
mkdir -p /var/www/crm-app
cd /var/www/crm-app

# Clone or upload your repository
git clone <your-repo-url> .
# OR upload files manually
```

### 3. Install Dependencies
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..
```

### 4. Build Frontend
```bash
npm run build
```

The production build will be in the `dist/` directory.

### 5. Configure Environment Variables

Create `.env` files for both frontend and backend:

**Frontend `.env`:**
```
VITE_API_BASE_URL=http://165.232.54.109/api
```

**Backend `.env`:**
```
NODE_ENV=production
PORT=5000
DATABASE_URL=/var/www/crm-app/backend/crm.db
```

### 6. Set Up Nginx Configuration

Copy `nginx-crm.conf` to nginx sites-available:
```bash
sudo cp nginx-crm.conf /etc/nginx/sites-available/crm
sudo ln -s /etc/nginx/sites-available/crm /etc/nginx/sites-enabled/crm

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 7. Set Up Backend as a Service

Copy `crm-backend.service` to systemd:
```bash
sudo cp crm-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable crm-backend
sudo systemctl start crm-backend

# Check status
sudo systemctl status crm-backend
```

### 8. Set Up Frontend Service (Optional)

For serving the React SPA, you can either:

**Option A: Use Nginx to serve static files (Recommended)**
- Nginx will serve files from `/var/www/crm-app/dist`
- No separate frontend service needed

**Option B: Use Node/Express for frontend**
```bash
sudo cp crm-frontend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable crm-frontend
sudo systemctl start crm-frontend
```

### 9. Verify Deployment

```bash
# Check backend service
curl http://165.232.54.109:5000/api/customers

# Check frontend access
curl http://165.232.54.109/crm

# Check nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 10. Access the Application

Open browser: `http://165.232.54.109/crm`

## Troubleshooting

### Backend not responding
```bash
# Check service status
sudo systemctl status crm-backend

# View service logs
sudo journalctl -u crm-backend -n 50 -f

# Restart service
sudo systemctl restart crm-backend
```

### Frontend not loading
```bash
# Check nginx status
sudo systemctl status nginx

# View nginx error logs
sudo tail -f /var/log/nginx/error.log

# Verify build files exist
ls -la /var/www/crm-app/dist/
```

### API calls failing
```bash
# Check if backend is listening
sudo netstat -tlnp | grep 5000

# Check firewall
sudo ufw status

# Allow port 5000 if needed
sudo ufw allow 5000
```

### Database issues
```bash
# Check database file permissions
ls -la /var/www/crm-app/backend/crm.db

# Fix permissions if needed
sudo chown -R www-data:www-data /var/www/crm-app
```

## SSL/HTTPS Setup (Optional but Recommended)

### Using Let's Encrypt with Certbot
```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d 165.232.54.109
```

Update nginx configuration to redirect HTTP to HTTPS:
```nginx
server {
    listen 80;
    server_name 165.232.54.109;
    return 301 https://$server_name$request_uri;
}
```

## Monitoring and Maintenance

### Check Resource Usage
```bash
# CPU and Memory
top

# Disk usage
df -h

# Node process memory
ps aux | grep node
```

### Rotate Backend Service Logs
Edit `/etc/logrotate.d/crm-backend`:
```
/var/www/crm-app/backend/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

### Auto-restart on Server reboot
Both services are set to auto-start with `systemctl enable`:
- `crm-backend` service
- Nginx (system default)

## Backup Strategy

### Backup database and files
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/crm"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
cp /var/www/crm-app/backend/crm.db $BACKUP_DIR/crm_$DATE.db

# Backup configuration
tar czf $BACKUP_DIR/crm-config_$DATE.tar.gz /var/www/crm-app

# Keep only last 30 days of backups
find $BACKUP_DIR -mtime +30 -delete
```

## Quick Deployment Checklist

- [ ] Server connectivity verified
- [ ] Node.js installed
- [ ] Application cloned/uploaded
- [ ] Dependencies installed (frontend + backend)
- [ ] Frontend built (`npm run build`)
- [ ] Environment variables configured
- [ ] Nginx configuration deployed
- [ ] Backend service running (`systemctl status crm-backend`)
- [ ] Frontend accessible at `http://165.232.54.109/crm`
- [ ] Backend API responding at `/api`
- [ ] Database initialized with sample data
- [ ] SSL/HTTPS configured (optional)
- [ ] Monitoring and logging configured

## Useful Commands

```bash
# View all running services
systemctl list-units --type=service --state=running

# Stop backend service
sudo systemctl stop crm-backend

# Start backend service
sudo systemctl start crm-backend

# Restart backend service
sudo systemctl restart crm-backend

# View backend logs
sudo journalctl -u crm-backend -n 100 -f

# Reload nginx
sudo systemctl reload nginx

# Test nginx config
sudo nginx -t

# Check process listening on port 5000
sudo lsof -i :5000

# Check process listening on port 80
sudo lsof -i :80
```
