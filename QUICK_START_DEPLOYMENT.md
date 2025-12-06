# Quick Start Deployment Guide

Deploy your CRM app to `http://165.232.54.109/crm` in 2 minutes.

## Prerequisites
- SSH access to server: `ssh root@165.232.54.109`
- Nginx already running on the server
- Node.js installed on the server

## Automated Deployment (Recommended)

### 1. From Your Local Machine

```bash
cd /Users/gp/react-work/jubilant-octo-broccoli

# Run the automated deployment script
./deploy.sh 165.232.54.109 root
```

That's it! The script will:
- ✅ Build the React frontend
- ✅ Upload files to the server
- ✅ Install backend dependencies
- ✅ Configure nginx as reverse proxy
- ✅ Set up backend as systemd service
- ✅ Verify everything works

### 2. Access Your Application

Open browser: **http://165.232.54.109/crm**

## Manual Deployment (Alternative)

If you prefer to deploy step-by-step, see `MANUAL_DEPLOYMENT.md`

## Verification Checklist

After deployment, verify everything:

```bash
# SSH into server
ssh root@165.232.54.109

# Check backend service
sudo systemctl status crm-backend

# Check nginx
sudo systemctl status nginx

# Test backend API
curl http://localhost:5000/api/customers

# View backend logs
sudo journalctl -u crm-backend -n 20

# View nginx logs
sudo tail -f /var/log/nginx/crm-error.log
```

## Common Issues

| Issue | Solution |
|-------|----------|
| Backend won't start | `sudo journalctl -u crm-backend -n 50` |
| Nginx error | `sudo nginx -t` then `sudo systemctl restart nginx` |
| API not responding | `curl http://127.0.0.1:5000/api/customers` |
| Frontend blank | Clear browser cache or check `/var/www/crm-app/dist/` exists |

## Update Deployment

To update after code changes:

```bash
# Build and redeploy
npm run build
./deploy.sh 165.232.54.109 root
```

## Detailed Documentation

- Full deployment guide: `DEPLOYMENT.md`
- Manual steps: `MANUAL_DEPLOYMENT.md`
- Nginx config: `nginx-crm.conf`
- Backend service: `crm-backend.service`

## Architecture

```
User: http://165.232.54.109/crm
        ↓
    [Nginx Reverse Proxy]
        ↓
    ├─→ /crm → React SPA (dist/) on Port 80
    └─→ /api → Backend API (Port 5000)
```

## Support

For detailed information, see:
- `DEPLOYMENT.md` - Complete deployment guide with troubleshooting
- `MANUAL_DEPLOYMENT.md` - Step-by-step manual instructions
- Backend logs: `sudo journalctl -u crm-backend -f`
- Nginx logs: `sudo tail -f /var/log/nginx/crm-error.log`
