#!/bin/bash

# Quick Deploy from Current Git Repository
# Usage: ./quick-deploy.sh [server-ip] [user]

GIT_REPO="https://github.com/gpad1234/jubilant-octo-broccoli.git"
SERVER_IP="${1:-165.232.54.109}"
SSH_USER="${2:-root}"

echo "🚀 Quick Deploy - CRM Application from Git"
echo "================================================"
echo "Repository: $GIT_REPO"
echo "Server:     $SERVER_IP"
echo "User:       $SSH_USER"
echo "================================================"
echo ""

# Run the git deployment script
./deploy-from-git.sh "$GIT_REPO" "$SERVER_IP" "$SSH_USER"
