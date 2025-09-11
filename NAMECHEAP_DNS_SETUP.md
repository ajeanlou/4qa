# Namecheap DNS Setup Instructions for ajlathletics.com

## 🎯 Goal: Update DNS records to point to Firebase Hosting

**Current Problem**: Your domain points to `66.29.141.173` (old server)
**Solution**: Update DNS to point to Firebase servers

---

## Step 1: Login to Namecheap

1. **Go to**: https://namecheap.com
2. **Click "Sign In"** (top right corner)
3. **Enter your credentials** and login

---

## Step 2: Access Domain Management

1. **Click "Account"** (top right corner)
2. **Click "Domain List"** from the dropdown menu
3. **Find `ajlathletics.com`** in your domain list
4. **Click "Manage"** button next to your domain

---

## Step 3: Navigate to DNS Settings

1. **Click "Advanced DNS"** tab
2. You'll see a list of current DNS records

---

## Step 4: Delete Old DNS Records

**Look for existing A records** that point to `66.29.141.173`:

1. **Find any A records** with:
   - **Type**: A
   - **Host**: @
   - **Value**: 66.29.141.173 (or similar)

2. **Click the trash/delete icon** (🗑️) next to these records
3. **Confirm deletion** when prompted

---

## Step 5: Add New DNS Records

**Add these 3 new records** by clicking "Add New Record":

### Record 1: A Record (Root Domain)
```
Type: A
Host: @
Value: 151.101.1.195
TTL: Automatic
```

### Record 2: A Record (Root Domain - Second IP)
```
Type: A
Host: @
Value: 151.101.65.195
TTL: Automatic
```

### Record 3: CNAME Record (WWW Subdomain)
```
Type: CNAME
Host: www
Value: statistics-1dfa4.web.app
TTL: Automatic
```

---

## Step 6: Save Changes

1. **Click "Save All Changes"** (green button)
2. **Wait for confirmation** that changes are saved
3. **You should see a success message**

---

## Step 7: Verify Changes

**Your DNS records should now look like this:**

```
Type    Host    Value
A       @       151.101.1.195
A       @       151.101.65.195
CNAME   www     statistics-1dfa4.web.app
```

---

## Step 8: Wait for DNS Propagation

1. **DNS changes take 15-30 minutes** to start propagating
2. **Full propagation takes 24-48 hours**
3. **You can check status** at: https://whatsmydns.net/#A/ajlathletics.com

---

## Step 9: Retry Firebase Domain Setup

**After 15-30 minutes:**

1. **Go back to Firebase Console**: https://console.firebase.google.com/project/statistics-1dfa4/hosting
2. **Click "Add custom domain"** again
3. **Enter**: `ajlathletics.com`
4. **The ACME challenge should now succeed**

---

## Troubleshooting

### If you can't find the delete button:
- Look for a **trash icon** (🗑️) or **red X**
- Some interfaces show **"Remove"** or **"Delete"** text

### If you can't add new records:
- Make sure you're in the **"Advanced DNS"** tab
- Look for **"Add New Record"** button
- Some interfaces show **"Add Record"** or **"+"** button

### If changes don't save:
- Make sure all required fields are filled
- Check that TTL is set to "Automatic"
- Try refreshing the page and trying again

---

## What This Fixes

**Before (BROKEN):**
```
ajlathletics.com → 66.29.141.173 (old server)
Firebase ACME challenge fails → No SSL certificate
```

**After (WORKING):**
```
ajlathletics.com → 151.101.1.195 (Firebase server)
ajlathletics.com → 151.101.65.195 (Firebase server)
www.ajlathletics.com → statistics-1dfa4.web.app
Firebase ACME challenge succeeds → SSL certificate issued
```

---

## Timeline

- **DNS Update**: 5 minutes
- **DNS Propagation Start**: 15-30 minutes
- **ACME Challenge Success**: 30-60 minutes
- **SSL Certificate Active**: 24-48 hours
- **Full Domain Working**: 24-48 hours

---

## Quick Checklist

- [ ] Login to Namecheap
- [ ] Go to Domain List
- [ ] Click "Manage" for ajlathletics.com
- [ ] Go to "Advanced DNS" tab
- [ ] Delete old A records pointing to 66.29.141.173
- [ ] Add new A record: @ → 151.101.1.195
- [ ] Add new A record: @ → 151.101.65.195
- [ ] Add new CNAME record: www → statistics-1dfa4.web.app
- [ ] Click "Save All Changes"
- [ ] Wait 15-30 minutes
- [ ] Retry Firebase domain setup

**Your domain will be working at https://ajlathletics.com once DNS propagates!** 🚀
