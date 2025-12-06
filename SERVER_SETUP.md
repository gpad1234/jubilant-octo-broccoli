# Server Setup Guide for DigitalOcean Droplet

One-time setup guide for preparing your Ubuntu server to run the CRM application.

## Prerequisites

- DigitalOcean droplet with Ubuntu 20.04+ 
- SSH access as root (or sudo user)
- IP: 165.232.54.109

## Initial Server Setup

### Step 1: Connect to Your Droplet

```bash
ssh root@165.232.54.109
```

### Step 2: Update System Packages

```bash
apt-get update
apt-get upgrade -y
```

### Step 3: Install Node.js

```bash
# Download Node.js installer script
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js (includes npm)
apt-get install -y nodejs

# Verify installation
node -v    # Should show v20.x or higher
npm -v     # Should show v10.x or higher
```

### Step 4: Install Nginx

```bash
apt-get install -y nginx

# Enable nginx service
systemctl enable nginx
systemctl start nginx

# Test nginx
curl http://localhost
```

### Step 5: Install Git

```bash
apt-get install -y git
```

### Step 6: Create Application Directory

```bash
mkdir -p /var/www/crm-app
cd /var/www/crm-app

# Create www-data user if doesn't exist
useradd -r -s /bin/bash -d /var/www www-data 2>/dev/null || true
```

### Step 7: Install Additional Packages (Optional)

```bash
# Certbot for SSL certificates
apt-get install -y certbot python3-certbot-nginx

# Build essentials (needed for native npm modules)
apt-get install -y build-essential python3

# Process manager (alternative to systemd)
npm install -g pm2
```

## Firewall Configuration

### Enable UFW (Uncomplicated Firewall)

```bash
# Enable firewall
ufw enable

# Allow SSH
ufw allow 22/tcp

# Allow HTTP
ufw allow 80/tcp

# Allow HTTPS
ufw allow 443/tcp

# Allow custom ports if needed
ufw allow 5000/tcp    # Backend API (internal use)

# Check status
ufw status

# Disable if needed
# ufw disable
```

## Directory Structure Setup

```bash
# Create necessary directories
mkdir -p /var/www/crm-app
mkdir -p /var/www/crm-app/backend
mkdir -p /var/log/crm
mkdir -p /var/backups/crm

# Set permissions
chown -R www-data:www-data /var/www/crm-app
chmod -R 755 /var/www/crm-app
```

## Database Setup (Optional Pre-population)

If you want to seed the database before deployment:

```bash
cd /var/www/crm-app/backend

# Create sample database
node seed.js

# Verify database exists
ls -la crm.db
```

## SSL/HTTPS Setup (Recommended)

### Option 1: Let's Encrypt (Free)

```bash
# Install certbot
apt-get install -y certbot python3-certbot-nginx

# Generate certificate
certbot --nginx -d 165.232.54.109

# Enable auto-renewal
systemctl enable certbot.timer
systemctl start certbot.timer

# Test renewal
certbot renew --dry-run
```

### Option 2: Manual Certificate

If you have a domain, use:
```bash
certbot certonly --nginx -d yourdomain.com
```

## Monitoring & Logs Setup

### Create Log Directory

```bash
mkdir -p /var/log/crm
touch /var/log/crm/app.log
touch /var/log/crm/error.log

# Set permissions
chmod 755 /var/log/crm
chown www-data:www-data /var/log/crm
```

### Logrotate Configuration

Create `/etc/logrotate.d/crm`:

```bash
sudo tee /etc/logrotate.d/crm > /dev/null << 'EOF'
/var/log/crm/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
EOF
```

## Performance Tuning (Optional)

### Increase File Descriptors

Edit `/etc/security/limits.conf`:

```bash
sudo tee -a /etc/security/limits.conf > /dev/null << 'EOF'
* soft nofile 65536
* hard nofile 65536
* soft nproc 32768
* hard nproc 32768
EOF
```

### Nginx Configuration Optimization

Edit `/etc/nginx/nginx.conf`:

```bash
# Increase worker connections
worker_processes auto;
worker_connections 2048;

# Enable gzip
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript 
            application/x-javascript application/xml+rss 
            application/javascript application/json;
```

## Verification Checklist

Before deploying the application:

```bash
# Check all services
node -v           # Node.js 18+
npm -v            # npm 9+
nginx -v          # Nginx 1.18+
git --version     # Git 2.x+

# Check ports
lsof -i :80       # Nginx should be listening
lsof -i :5000     # Backend will listen after deploy

# Check directories
ls -la /var/www/crm-app
ls -la /var/backups/crm
```

## Security Hardening (Optional)

### Disable Root Login (if you have sudo user)

Edit `/etc/ssh/sshd_config`:
```bash
PermitRootLogin no
PasswordAuthentication no
```

Then restart SSH:
```bash
systemctl restart sshd
```

### Fail2Ban Installation

```bash
apt-get install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

## Backup Strategy

### Create Backup Directory

```bash
mkdir -p /var/backups/crm
chmod 700 /var/backups/crm
```

### Automated Backup Script

Create `/usr/local/bin/crm-backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/crm"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup database
cp /var/www/crm-app/backend/crm.db $BACKUP_DIR/crm_$DATE.db

# Backup configuration
tar czf $BACKUP_DIR/crm-config_$DATE.tar.gz /var/www/crm-app

# Keep only last 30 days
find $BACKUP_DIR -mtime +30 -delete

echo "Backup completed: $DATE"
```

### Make executable and add to crontab

```bash
chmod +x /usr/local/bin/crm-backup.sh

# Run daily at 2 AM
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/crm-backup.sh") | crontab -
```

## Test Everything

```bash
# Create test directory
mkdir -p /var/www/crm-app/dist

# Create test index.html
cat > /var/www/crm-app/dist/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head><title>CRM - Ready for Deployment</title></head>
<body><h1>✅ Server is ready for CRM deployment</h1></body>
</html>
EOF

# Set permissions
chown -R www-data:www-data /var/www/crm-app

# Test with browser or curl
curl http://165.232.54.109/crm
```

## Ready for Deployment!

Your server is now ready. To deploy:

1. **From your local machine:**
   ```bash
   ./deploy.sh 165.232.54.109 root
   ```

2. **Or manually follow:** `MANUAL_DEPLOYMENT.md`

3. **Access the application:** http://165.232.54.109/crm

## Quick Reference Commands

```bash
# Check all services running
systemctl status nginx
systemctl status crm-backend

# View logs
journalctl -u crm-backend -f
tail -f /var/log/nginx/crm-error.log

# Check resource usage
top
df -h
free -h

# Restart services
systemctl restart nginx
systemctl restart crm-backend

# Check ports
netstat -tlnp | grep -E ':(80|5000)'
```

## Troubleshooting Setup

| Issue | Solution |
|-------|----------|
| Nginx won't start | `sudo nginx -t` to check config |
| Permission denied | Check directory ownership: `ls -la /var/www/crm-app` |
| Node.js not found | Reinstall: `curl -fsSL https://deb.nodesource.com/setup_20.x \| sudo -E bash -` |
| Port already in use | `sudo lsof -i :PORT_NUMBER` |
| Firewall issues | `sudo ufw status` and check rules |

---

**Your server is now ready for deployment!**

Next step: Run `./deploy.sh 165.232.54.109 root` from your local machine.
