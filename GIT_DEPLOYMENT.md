# Git-Based Deployment Guide

Deploy your CRM application directly from a git repository - no manual file uploads needed!

## Quick Start (15 seconds)

### Option 1: Using Current Repository (Recommended)

```bash
# From project root
./quick-deploy.sh 165.232.54.109 root
```

That's it! The script will:
1. Clone your git repo from GitHub
2. Install dependencies
3. Build frontend
4. Configure nginx and systemd
5. Start services
6. Verify everything works

**Time:** 2-3 minutes total

### Option 2: Using Any Git Repository

```bash
./deploy-from-git.sh https://github.com/your-repo/url.git 165.232.54.109 root
```

## How It Works

```
┌──────────────────────────────────────────┐
│ Your Local Machine                       │
│                                          │
│ 1. git push origin main                  │
│ 2. ./quick-deploy.sh                     │
└────────────────┬─────────────────────────┘
                 │
                 │ SSH Connection
                 │
┌────────────────▼─────────────────────────┐
│ Remote Server (165.232.54.109)          │
│                                          │
│ 1. git clone <repo>                      │
│ 2. npm install                           │
│ 3. npm run build                         │
│ 4. Configure nginx                       │
│ 5. Setup systemd service                 │
│ 6. Start services                        │
└──────────────────────────────────────────┘
```

## Prerequisites

**Local Machine:**
- Git initialized in project: ✅ (already done)
- Repository pushed to GitHub: Push your changes first

**Remote Server:**
- Node.js 18+
- npm 9+
- Nginx installed
- Git installed

See `SERVER_SETUP.md` for complete server setup if needed.

## Before Deployment

### Step 1: Commit and Push Changes

```bash
cd /Users/gp/react-work/jubilant-octo-broccoli

# Make sure everything is committed
git status

# If there are changes, commit them
git add .
git commit -m "Your message"

# Push to GitHub
git push origin main
```

### Step 2: Verify Server Access

```bash
# Test SSH connection
ssh root@165.232.54.109 "echo 'Server ready!'"

# Should output: Server ready!
```

### Step 3: Verify Server Prerequisites

```bash
ssh root@165.232.54.109 "
  echo '=== Node.js ===' && node -v &&
  echo '=== npm ===' && npm -v &&
  echo '=== Nginx ===' && nginx -v &&
  echo '=== Git ===' && git --version
"
```

All should show version numbers (not errors).

## Deployment Methods

### Method 1: Quick Deploy (Easiest)

For the current repository (gpad1234/jubilant-octo-broccoli):

```bash
./quick-deploy.sh
```

Or specify server:

```bash
./quick-deploy.sh 165.232.54.109 root
```

### Method 2: Deploy from Any Git Repo

```bash
./deploy-from-git.sh https://github.com/your-user/your-repo.git 165.232.54.109 root
```

Supports:
- GitHub HTTPS: `https://github.com/user/repo.git`
- GitHub SSH: `git@github.com:user/repo.git`
- GitLab HTTPS: `https://gitlab.com/user/repo.git`
- Any Git URL

### Method 3: Manual Deployment (if needed)

See `MANUAL_DEPLOYMENT.md`

## After Deployment

### Verify Deployment

```bash
# Check services
ssh root@165.232.54.109 "sudo systemctl status crm-backend nginx"

# Test API
curl http://165.232.54.109/api/customers

# Open in browser
open http://165.232.54.109/crm
```

### View Logs

```bash
# Real-time backend logs
ssh root@165.232.54.109 "sudo journalctl -u crm-backend -f"

# Nginx error logs
ssh root@165.232.54.109 "sudo tail -f /var/log/nginx/crm-error.log"

# Nginx access logs
ssh root@165.232.54.109 "sudo tail -f /var/log/nginx/crm-access.log"
```

## Updating After Code Changes

The beauty of git-based deployment is super-easy updates:

### 1. Make code changes locally

```bash
# Edit files, test locally
npm run dev   # Test in development
npm run build # Test production build
```

### 2. Commit and push

```bash
git add .
git commit -m "Describe your changes"
git push origin main
```

### 3. Redeploy

```bash
./quick-deploy.sh
```

That's it! New code is live.

## Deployment Workflow Comparison

### Old Way (File Upload)
1. Build locally: `npm run build`
2. SCP dist/: `scp -r dist/ root@...`
3. SSH in: `ssh root@...`
4. Install deps: `npm install`
5. Configure: Manual steps
6. Restart: `systemctl restart`

**Time:** 5-10 minutes

### New Way (Git-based)
1. Git push: `git push origin main`
2. Deploy: `./quick-deploy.sh`

**Time:** 2-3 minutes (automatic!)

## Scripts Included

### `quick-deploy.sh`
Simplest deployment for current repository.

```bash
./quick-deploy.sh
./quick-deploy.sh 165.232.54.109
./quick-deploy.sh 165.232.54.109 root
```

### `deploy-from-git.sh`
Flexible deployment from any git repository.

```bash
./deploy-from-git.sh <git-url> [server-ip] [user]
```

### `deploy.sh`
Original file-upload deployment (still works).

```bash
./deploy.sh 165.232.54.109 root
```

## What the Script Does

1. **Clones/Updates Repository**
   - If first time: `git clone <repo>`
   - If already deployed: `git fetch && git reset --hard`

2. **Installs Dependencies**
   - Frontend: `npm install --production`
   - Backend: `cd backend && npm install --production`

3. **Builds Frontend**
   - Runs: `npm run build`
   - Output: `dist/` with optimized files

4. **Configures Infrastructure**
   - Copies nginx config to `/etc/nginx/sites-available/crm`
   - Copies systemd service to `/etc/systemd/system/crm-backend.service`

5. **Sets Up Services**
   - Backend service: `systemctl enable crm-backend`
   - Auto-restart on reboot: ✅ Enabled
   - Auto-restart on crash: ✅ Enabled

6. **Restarts Services**
   - Stops and starts backend
   - Reloads nginx

7. **Verifies Deployment**
   - Checks backend API responding
   - Checks nginx running
   - Reports status

## Troubleshooting

### "Repository not found"
```bash
# Verify git URL
git remote -v

# Make sure repo is public or SSH key is configured
ssh -T git@github.com
```

### "npm install fails"
```bash
# Check Node.js version on server
ssh root@165.232.54.109 "node -v"

# Should be 18+, not lower
```

### "Build fails"
```bash
# Check build works locally first
npm run build

# If local build works, check server logs
ssh root@165.232.54.109 "sudo journalctl -u crm-backend -n 50"
```

### "Backend not responding"
```bash
# Check service status
ssh root@165.232.54.109 "sudo systemctl status crm-backend"

# View error logs
ssh root@165.232.54.109 "sudo journalctl -u crm-backend -n 100"
```

## Advanced Options

### Deploy from Specific Branch

Edit `deploy-from-git.sh` line with:
```bash
git reset --hard origin/main
```

Change `main` to your branch name:
```bash
git reset --hard origin/production
git reset --hard origin/develop
```

### Deploy to Different Droplet

```bash
./quick-deploy.sh 123.45.67.89 root
```

### Use Different SSH User

```bash
./quick-deploy.sh 165.232.54.109 ubuntu
```

(Instead of root, if you have a different user)

## Architecture

```
GitHub Repository
  ↓
./quick-deploy.sh
  ↓
SSH to server
  ↓
├─ git clone/update
├─ npm install (frontend & backend)
├─ npm run build
├─ configure nginx
├─ setup systemd service
├─ restart services
└─ verify deployment
  ↓
Application running at:
  http://165.232.54.109/crm
```

## Security Considerations

✅ **Secure:**
- Uses HTTPS git URLs (not SSH keys exposed)
- Builds happen on server (not transmitted)
- Files owned by www-data user
- No credentials in scripts

🔐 **Recommended:**
- Make GitHub repo private if needed
- Use GitHub deploy keys for private repos
- Enable branch protection on main
- Review code before merging to main

## Performance Notes

- **First deployment:** 3-4 minutes (npm install)
- **Subsequent deployments:** 1-2 minutes (fast!)
- **Total time to live:** < 5 minutes from git push

## Files Created/Modified

```
New files:
  - deploy-from-git.sh (flexible git deployment)
  - quick-deploy.sh (simple, for current repo)
  - GIT_DEPLOYMENT.md (this file)

Existing files used:
  - nginx-crm.conf (already in repo)
  - crm-backend.service (already in repo)
  - vite.config.js (already optimized)
```

## Workflow Example

```bash
# 1. Make code changes
vim src/components/CustomersList.jsx

# 2. Test locally
npm run dev
# Test in browser, looks good

# 3. Build for production
npm run build

# 4. Commit changes
git add .
git commit -m "Add new customer filtering feature"

# 5. Push to GitHub
git push origin main

# 6. Deploy to production
./quick-deploy.sh

# 7. Verify
curl http://165.232.54.109/api/customers
open http://165.232.54.109/crm
```

Done! Your changes are live! 🚀

## FAQ

**Q: Do I need to SSH to the server?**
A: No! The scripts handle everything automatically.

**Q: Can I deploy without pushing to GitHub?**
A: Yes, use `./deploy.sh` if files are local, or manually set up SSH deploy keys.

**Q: What if deployment fails halfway?**
A: Previous version stays running. Fix the issue and redeploy.

**Q: How do I rollback to previous version?**
A: Revert commit on GitHub, then `./quick-deploy.sh`

**Q: Do I need to update the scripts?**
A: No! Once set up, just use `./quick-deploy.sh` for all future deployments.

**Q: Can I use this with private GitHub repos?**
A: Yes, set up GitHub deploy keys on the server.

## Next Steps

1. **Push your code to GitHub**
   ```bash
   git push origin main
   ```

2. **Run deployment**
   ```bash
   ./quick-deploy.sh 165.232.54.109 root
   ```

3. **Verify it works**
   ```bash
   open http://165.232.54.109/crm
   ```

4. **Future updates** (just repeat steps 1-3)

---

**Happy Deploying!** 🚀
