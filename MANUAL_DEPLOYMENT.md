# Manual Deployment Instructions

If you prefer to deploy manually instead of using the `deploy.sh` script, follow these steps:

## Step 1: SSH into the Server

```bash
ssh root@165.232.54.109
```

## Step 2: Create Application Directory

```bash
sudo mkdir -p /var/www/crm-app
sudo chown -R $USER:$USER /var/www/crm-app
cd /var/www/crm-app
```

## Step 3: Upload Application Files

From your local machine:

```bash
# Build frontend first
npm run build

# Upload files using scp
scp -r dist/ root@165.232.54.109:/var/www/crm-app/
scp -r backend/ root@165.232.54.109:/var/www/crm-app/
scp package.json root@165.232.54.109:/var/www/crm-app/
scp nginx-crm.conf root@165.232.54.109:/var/www/crm-app/
scp crm-backend.service root@165.232.54.109:/var/www/crm-app/
scp .env.production root@165.232.54.109:/var/www/crm-app/.env
```

## Step 4: Install Backend Dependencies

Back on the server:

```bash
cd /var/www/crm-app/backend
npm install --production
```

## Step 5: Configure Nginx

```bash
# Copy nginx configuration
sudo cp /var/www/crm-app/nginx-crm.conf /etc/nginx/sites-available/crm

# Enable the site
sudo ln -sf /etc/nginx/sites-available/crm /etc/nginx/sites-enabled/crm

# Disable default site if needed
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

## Step 6: Set Up Backend Service

```bash
# Copy service file
sudo cp /var/www/crm-app/crm-backend.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable and start the service
sudo systemctl enable crm-backend
sudo systemctl start crm-backend

# Check status
sudo systemctl status crm-backend
```

## Step 7: Set Permissions

```bash
sudo chown -R www-data:www-data /var/www/crm-app
sudo chmod -R 755 /var/www/crm-app
```

## Step 8: Verify Deployment

```bash
# Check backend service
sudo systemctl status crm-backend

# Check nginx
sudo systemctl status nginx

# Test API
curl http://localhost:5000/api/customers

# Test frontend through nginx
curl http://localhost/crm
```

## Step 9: Access the Application

Open your browser and navigate to:
```
http://165.232.54.109/crm
```

## Troubleshooting

### Backend service won't start
```bash
# Check logs
sudo journalctl -u crm-backend -n 50

# Check if port 5000 is in use
sudo lsof -i :5000

# Try starting manually
cd /var/www/crm-app/backend
node server.js
```

### Nginx errors
```bash
# Check nginx error log
sudo tail -f /var/log/nginx/error.log

# Check if port 80 is in use
sudo lsof -i :80

# Restart nginx
sudo systemctl restart nginx
```

### API not responding
```bash
# Check if backend is listening
sudo netstat -tlnp | grep 5000

# Test localhost connection
curl http://127.0.0.1:5000/api/customers

# Check firewall
sudo ufw status
```

### Frontend not loading
```bash
# Verify files exist
ls -la /var/www/crm-app/dist/

# Check file permissions
ls -la /var/www/crm-app/

# Check nginx access log
sudo tail -f /var/log/nginx/access.log
```

## Updating the Application

When you need to update the application:

```bash
# On your local machine, build frontend
npm run build

# Upload new dist folder
scp -r dist/ root@165.232.54.109:/var/www/crm-app/

# If backend changed, update backend files
scp -r backend/ root@165.232.54.109:/var/www/crm-app/

# On server, install new backend dependencies if needed
ssh root@165.232.54.109 "cd /var/www/crm-app/backend && npm install --production"

# Restart backend service
ssh root@165.232.54.109 "sudo systemctl restart crm-backend"

# Clear browser cache and test
```

## Rollback Procedure

If something goes wrong:

```bash
# Stop the service
sudo systemctl stop crm-backend

# Check what went wrong
sudo journalctl -u crm-backend -n 100

# Restore from backup if available
# sudo cp /var/backups/crm/crm_YYYYMMDD_HHMMSS.db /var/www/crm-app/backend/crm.db

# Start service again
sudo systemctl start crm-backend
```

## SSL/HTTPS Setup

Once your domain is working, set up HTTPS:

```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d 165.232.54.109
```

The certificate will be automatically configured by certbot.
