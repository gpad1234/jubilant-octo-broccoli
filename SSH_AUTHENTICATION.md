# SSH Authentication Setup

This guide helps you set up SSH authentication for seamless deployment. You have two options.

---

## Option 1: Password Authentication (Current Setup)

Use your server's root password for each deployment.

### How to Deploy

```bash
./quick-deploy.sh 165.232.54.109 root
```

When prompted, enter your root password:
```
root@165.232.54.109's password: [enter your password]
```

**Pros:**
- ✅ No setup needed
- ✅ Works immediately

**Cons:**
- ❌ Must enter password each time
- ❌ Can't automate deployments
- ❌ Less secure for automated systems

### Current Status
You're using this method. It works fine for manual deployments!

---

## Option 2: SSH Key Authentication (Recommended for Automation)

Set up passwordless SSH with public key authentication.

### Setup (One-time, takes 2 minutes)

**Step 1: Generate SSH Key Pair**

```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N ""
```

Output will show:
```
Your identification has been saved in /Users/gp/.ssh/id_ed25519
Your public key has been saved in /Users/gp/.ssh/id_ed25519.pub
```

**Step 2: Copy Public Key to Server**

```bash
cat ~/.ssh/id_ed25519.pub | ssh root@165.232.54.109 "cat >> ~/.ssh/authorized_keys"
```

When prompted, enter your root password (this is the LAST time you'll need it):
```
root@165.232.54.109's password: [enter your password]
```

**Step 3: Test Passwordless Connection**

```bash
ssh root@165.232.54.109 "echo 'Success! Passwordless SSH is working.'"
```

You should see output with NO password prompt:
```
Success! Passwordless SSH is working.
```

✅ **Done!** SSH key authentication is now set up.

### How to Deploy (After Setup)

```bash
./quick-deploy.sh 165.232.54.109 root
```

No password prompt! The script runs automatically.

**Pros:**
- ✅ Completely passwordless
- ✅ Can automate deployments (CI/CD, cron jobs, etc.)
- ✅ More secure
- ✅ Faster deployment

**Cons:**
- ⚠️ Requires one-time setup
- ⚠️ Keep private key secure (~/.ssh/id_ed25519)

---

## Option 3: Multiple SSH Keys

If you have different keys for different servers:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_crm -N ""
cat ~/.ssh/id_crm.pub | ssh root@165.232.54.109 "cat >> ~/.ssh/authorized_keys"
```

Then configure ~/.ssh/config:

```
Host crm-server
    HostName 165.232.54.109
    User root
    IdentityFile ~/.ssh/id_crm
    IdentitiesOnly yes
```

Use it:
```bash
ssh crm-server "echo 'Connected with specific key'"
```

---

## Quick Comparison

| Feature | Password Auth | SSH Key Auth |
|---------|---------------|--------------|
| Setup time | 0 min | 2 min |
| Deployment speed | 2-3 min | 2-3 min |
| Password prompt | Every time | Never |
| Automated jobs | ❌ No | ✅ Yes |
| Security | Basic | Better |
| Recommended for | Manual | Production |

---

## Troubleshooting

### "Permission denied (publickey,password)"
The key isn't on the server. Run the setup step 2 again.

### "Permissions denied" on ~/.ssh/authorized_keys
Fix permissions:
```bash
ssh root@165.232.54.109 "chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"
```

### "No such file or directory: ~/.ssh"
Create the directory:
```bash
ssh root@165.232.54.109 "mkdir -p ~/.ssh"
```

### Lost your private key?
Generate a new one:
```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N ""
# Then run the copy step again
cat ~/.ssh/id_ed25519.pub | ssh root@165.232.54.109 "cat >> ~/.ssh/authorized_keys"
```

---

## Which Should You Use?

- **For now (Option 1):** Just use password authentication. It works fine for your current manual deployments.
- **Later (Option 2):** When you want to automate or deploy frequently, set up SSH keys in 2 minutes.

**Our recommendation:** Start with Option 1, upgrade to Option 2 when you're ready.

---

## Next Steps

1. **Using password (Option 1)?** 
   - Run: `./quick-deploy.sh`
   - Enter password when prompted
   
2. **Ready for SSH keys (Option 2)?**
   - Run the setup steps above
   - Then enjoy passwordless deployments!

---

## Additional Resources

- [GitHub SSH Keys Guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [DigitalOcean SSH Key Tutorial](https://docs.digitalocean.com/products/droplets/how-to/add-ssh-keys/)
- [Linux SSH Security Best Practices](https://www.openssh.com/)
