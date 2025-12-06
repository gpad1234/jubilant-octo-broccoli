# Pre-Deployment Checklist

## Local Development (Before Deployment)

### Code Quality
- [ ] No compilation errors: `npm run build` succeeds
- [ ] Linting passes: `npm run lint` (if configured)
- [ ] All AI features working locally
- [ ] API endpoints tested at `http://localhost:5000/api`
- [ ] Frontend accessible at `http://localhost:5173`
- [ ] Database initialized with sample data

### Build Verification
```bash
npm run build
# dist/ folder created with index.html, assets, etc.
ls -la dist/
```

### Backend Testing
```bash
cd backend
npm start
# Server starts on http://localhost:5000
curl http://localhost:5000/api/customers
```

### Environment Configuration
- [ ] `.env` file configured for local development
- [ ] `.env.production` ready for server
- [ ] `VITE_API_BASE_URL` will be set to `http://165.232.54.109/api`

### Git Status
- [ ] All changes committed: `git status` shows clean working directory
- [ ] Ready to push: `git log --oneline | head -5`

## Server Prerequisites

### SSH Access
```bash
# Verify you can access the server
ssh root@165.232.54.109
```

### Server Requirements
- [ ] Ubuntu 20.04+ with sudo access
- [ ] Nginx installed: `nginx -v`
- [ ] Node.js 18+ installed: `node -v`
- [ ] npm installed: `npm -v`
- [ ] Git installed: `git --version`

### Check Server
```bash
ssh root@165.232.54.109 "
  echo '--- System Info ---'
  cat /etc/os-release | head -2
  echo '--- Node.js ---'
  node -v && npm -v
  echo '--- Nginx ---'
  nginx -v
  echo '--- Git ---'
  git --version
"
```

## Deployment Options

### Option 1: Automated Deployment (Recommended)
```bash
# From your local machine
./deploy.sh 165.232.54.109 root
```

**What this does:**
- Builds React frontend locally
- Uploads dist/, backend/, and config files
- Installs backend dependencies on server
- Configures nginx as reverse proxy
- Sets up backend as systemd service
- Verifies everything is working

**Time:** ~2-3 minutes

### Option 2: Manual Deployment
Follow steps in `MANUAL_DEPLOYMENT.md`

**Time:** ~10-15 minutes

## Post-Deployment Verification

### Immediate Checks
```bash
ssh root@165.232.54.109 "
  echo '1. Backend Service Status:'
  sudo systemctl status crm-backend --no-pager
  
  echo '2. Nginx Status:'
  sudo systemctl status nginx --no-pager
  
  echo '3. Backend Listening:'
  sudo lsof -i :5000 | head -2
  
  echo '4. Nginx Listening:'
  sudo lsof -i :80 | head -2
"
```

### API Testing
```bash
# Test backend API
curl http://165.232.54.109/api/customers

# Test with user agent (browser simulation)
curl -H "User-Agent: Mozilla" http://165.232.54.109/api/customers
```

### Frontend Testing
```bash
# Test nginx health check
curl http://165.232.54.109/health

# Test frontend redirect
curl -i http://165.232.54.109/

# Test frontend static files
curl http://165.232.54.109/crm
```

### Browser Testing
- Open: `http://165.232.54.109/crm`
- Verify page loads without errors
- Open DevTools (F12) → Console
  - Check for JavaScript errors
  - Check network tab for API calls
- Test customer list loads
- Try adding/editing customer
- Check AI insights component (if applicable)

## Monitoring

### View Logs
```bash
# Backend service logs
ssh root@165.232.54.109 "sudo journalctl -u crm-backend -n 50 -f"

# Nginx access logs
ssh root@165.232.54.109 "sudo tail -f /var/log/nginx/crm-access.log"

# Nginx error logs
ssh root@165.232.54.109 "sudo tail -f /var/log/nginx/crm-error.log"
```

### Check Resource Usage
```bash
ssh root@165.232.54.109 "
  echo '--- Disk Usage ---'
  df -h
  echo '--- Process Memory ---'
  ps aux | grep node
  echo '--- Top Processes ---'
  top -b -n 1 | head -10
"
```

## Troubleshooting

### Backend Not Starting
```bash
# Check logs
ssh root@165.232.54.109 "sudo journalctl -u crm-backend -n 100"

# Try manual start to see errors
ssh root@165.232.54.109 "cd /var/www/crm-app/backend && node server.js"

# Check if port 5000 already in use
ssh root@165.232.54.109 "sudo lsof -i :5000"
```

### Frontend Not Loading
```bash
# Check if files exist
ssh root@165.232.54.109 "ls -la /var/www/crm-app/dist/"

# Check nginx config
ssh root@165.232.54.109 "sudo nginx -t"

# Check nginx error log
ssh root@165.232.54.109 "sudo tail -f /var/log/nginx/crm-error.log"
```

### API Returning 404
```bash
# Check backend is running
ssh root@165.232.54.109 "curl http://127.0.0.1:5000/api/customers"

# Check nginx proxy configuration
ssh root@165.232.54.109 "grep -A 20 'location /api' /etc/nginx/sites-available/crm"

# Check firewall
ssh root@165.232.54.109 "sudo ufw status"
```

## Rollback Plan

If deployment fails:

```bash
# Stop services
ssh root@165.232.54.109 "
  sudo systemctl stop crm-backend
  sudo systemctl stop nginx
"

# Restore from backup (if available)
ssh root@165.232.54.109 "
  # Check backups
  ls -la /var/backups/crm/
  # Restore if needed
  sudo cp /var/backups/crm/crm_YYYYMMDD_HHMMSS.db /var/www/crm-app/backend/crm.db
"

# Start services again
ssh root@165.232.54.109 "
  sudo systemctl start crm-backend
  sudo systemctl start nginx
"
```

## Update Process

When you need to update the application:

```bash
# 1. Make code changes locally
# 2. Test locally
npm run build

# 3. Redeploy
./deploy.sh 165.232.54.109 root

# 4. Verify
curl http://165.232.54.109/api/customers
```

## SSL/HTTPS (Optional but Recommended)

```bash
ssh root@165.232.54.109 "
  sudo apt-get update
  sudo apt-get install -y certbot python3-certbot-nginx
  sudo certbot --nginx -d 165.232.54.109
"
```

## Final Checklist Before Going Live

- [ ] Local build succeeds without errors
- [ ] Backend works locally
- [ ] Frontend works locally
- [ ] Can SSH to server
- [ ] Server has Node.js, nginx, git
- [ ] Deployment script is executable
- [ ] No sensitive data in code
- [ ] .env.production configured correctly
- [ ] Database initialized with sample data
- [ ] All git commits pushed
- [ ] Ready to run: `./deploy.sh 165.232.54.109 root`
- [ ] Frontend loads at http://165.232.54.109/crm
- [ ] API responds at http://165.232.54.109/api
- [ ] Monitoring configured
- [ ] Backup strategy in place
- [ ] SSL/HTTPS configured (optional)

## Deployment Command

When everything is ready:

```bash
# From project root directory
./deploy.sh 165.232.54.109 root
```

Then verify at: **http://165.232.54.109/crm**

---

**Documentation:**
- `QUICK_START_DEPLOYMENT.md` - Quick reference
- `DEPLOYMENT.md` - Full guide
- `MANUAL_DEPLOYMENT.md` - Manual steps
