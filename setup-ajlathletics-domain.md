# Complete Setup Guide for ajlathletics.com

## 🎯 Your Domain: ajlathletics.com
## 🔗 Firebase Project: statistics-1dfa4
## 🌐 Current Firebase URL: https://statistics-1dfa4.web.app

---

## Step 1: Firebase Console Setup (5 minutes)

### 1.1 Go to Firebase Console
**Click this link**: https://console.firebase.google.com/project/statistics-1dfa4/hosting

### 1.2 Add Custom Domain
1. Click **"Add custom domain"**
2. Enter: `ajlathletics.com`
3. Click **"Continue"**
4. **Copy the DNS records** that Firebase shows you (they might be different from the ones below)

---

## Step 2: Namecheap DNS Configuration (10 minutes)

### 2.1 Login to Namecheap
**Go to**: https://namecheap.com → Login → Domain List

### 2.2 Manage Your Domain
1. Find `ajlathletics.com` in your domain list
2. Click **"Manage"** next to it
3. Go to **"Advanced DNS"** tab

### 2.3 Delete Existing Records
**Delete any existing A records** for `@` (root domain)

### 2.4 Add New DNS Records
**Add these records** (use the ones Firebase provides if different):

```
Record 1:
Type: A
Host: @
Value: 151.101.1.195
TTL: Automatic

Record 2:
Type: A
Host: @
Value: 151.101.65.195
TTL: Automatic

Record 3:
Type: CNAME
Host: www
Value: statistics-1dfa4.web.app
TTL: Automatic
```

### 2.5 Save Changes
Click **"Save All Changes"**

---

## Step 3: Verification Commands

### 3.1 Check DNS Propagation
Run these commands in your terminal to check when DNS updates:

```bash
# Check A records
nslookup ajlathletics.com

# Check CNAME records
nslookup www.ajlathletics.com

# Check with different DNS server
nslookup ajlathletics.com 8.8.8.8
```

### 3.2 Online DNS Checker
**Visit**: https://whatsmydns.net/#A/ajlathletics.com

---

## Step 4: Timeline & What to Expect

### 4.1 Immediate (0-1 hour)
- ✅ DNS changes saved in Namecheap
- ✅ Firebase domain added to console

### 4.2 Short Term (1-24 hours)
- 🔄 DNS propagation begins
- 🔄 Firebase starts SSL certificate process

### 4.3 Complete (24-48 hours)
- ✅ Domain fully propagated
- ✅ SSL certificate active
- ✅ Site accessible at https://ajlathletics.com

---

## Step 5: Testing Your Domain

### 5.1 Test URLs
Once setup is complete, these should work:
- `https://ajlathletics.com` (main site)
- `https://www.ajlathletics.com` (www redirect)

### 5.2 Firebase Console Status
Check: https://console.firebase.google.com/project/statistics-1dfa4/hosting
- Look for "Certificate status: Active"

---

## Troubleshooting

### If Domain Doesn't Work After 48 Hours:

#### Check 1: DNS Records
```bash
nslookup ajlathletics.com
```
Should show: `151.101.1.195` or `151.101.65.195`

#### Check 2: Firebase Console
- Go to Hosting → Custom domains
- Check for any error messages

#### Check 3: SSL Certificate
- Look for "Certificate status: Active"
- If "Pending", wait longer or contact Firebase support

---

## Quick Reference

### Your Current Setup:
- **Domain**: ajlathletics.com
- **Firebase Project**: statistics-1dfa4
- **Firebase URL**: https://statistics-1dfa4.web.app
- **Target**: https://ajlathletics.com

### DNS Records to Add:
```
A    @    151.101.1.195
A    @    151.101.65.195
CNAME www statistics-1dfa4.web.app
```

### Important Links:
- **Firebase Console**: https://console.firebase.google.com/project/statistics-1dfa4/hosting
- **Namecheap**: https://namecheap.com
- **DNS Checker**: https://whatsmydns.net/#A/ajlathletics.com

---

## Need Help?

If you run into issues:
1. Check the troubleshooting section above
2. Verify DNS records are correct
3. Wait for full propagation (48 hours)
4. Check Firebase Console for error messages

**Your app is already deployed and ready!** 🚀
