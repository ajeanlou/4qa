# Custom Domain Setup Guide for Firebase Hosting

## Overview
This guide will help you connect your custom domain from Namecheap to Firebase Hosting for your 4QA Hoops application.

## Prerequisites
- ✅ Firebase CLI installed and logged in
- ✅ Project built successfully (`npm run build`)
- ✅ Custom domain purchased from Namecheap
- ✅ Firebase project created

## Step 1: Initialize Firebase Hosting

### 1.1 Initialize Firebase in your project
```bash
firebase init hosting
```

### 1.2 Select your Firebase project
- Choose your existing project (statistics-1dfa4) or create a new one
- If creating new: Use project ID like "4qa-hoops" or your domain name

### 1.3 Configure hosting settings
- **Public directory**: `dist` (this is where Vite builds your app)
- **Single-page app**: `Yes` (for React routing)
- **Overwrite index.html**: `No` (keep existing)

## Step 2: Deploy to Firebase Hosting

### 2.1 Deploy your application
```bash
firebase deploy --only hosting
```

### 2.2 Note your Firebase hosting URL
After deployment, you'll get a URL like: `https://your-project-id.web.app`

## Step 3: Add Custom Domain in Firebase Console

### 3.1 Go to Firebase Console
1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click "Hosting" in the left sidebar

### 3.2 Add custom domain
1. Click "Add custom domain"
2. Enter your domain name (e.g., `yourdomain.com`)
3. Click "Continue"

### 3.3 Verify domain ownership
Firebase will provide you with DNS records to add to Namecheap.

## Step 4: Configure DNS in Namecheap

### 4.1 Log into Namecheap
1. Go to [Namecheap.com](https://namecheap.com)
2. Log into your account
3. Go to "Domain List"
4. Click "Manage" next to your domain

### 4.2 Add DNS records
You'll need to add these records in Namecheap:

#### For Apex Domain (yourdomain.com):
```
Type: A
Host: @
Value: 151.101.1.195
TTL: Automatic

Type: A  
Host: @
Value: 151.101.65.195
TTL: Automatic
```

#### For WWW Subdomain (www.yourdomain.com):
```
Type: CNAME
Host: www
Value: your-project-id.web.app
TTL: Automatic
```

### 4.3 Alternative: Use Firebase's provided records
Firebase will give you specific records - use those instead of the generic ones above.

## Step 5: SSL Certificate Setup

### 5.1 Firebase automatically provisions SSL
- Firebase will automatically request an SSL certificate
- This process can take 24-48 hours
- You'll receive an email when it's ready

### 5.2 Verify SSL status
- Check Firebase Console > Hosting > Custom domains
- Look for "Certificate status: Active"

## Step 6: Test Your Custom Domain

### 6.1 Wait for DNS propagation
- DNS changes can take up to 48 hours to propagate globally
- Use tools like [whatsmydns.net](https://whatsmydns.net) to check propagation

### 6.2 Test your domain
1. Visit `https://yourdomain.com`
2. Visit `https://www.yourdomain.com`
3. Both should redirect to your Firebase-hosted app

## Step 7: Update Firebase Configuration (Optional)

### 7.1 Update authorized domains
In Firebase Console > Authentication > Settings > Authorized domains:
- Add your custom domain
- Add www.yourdomain.com

### 7.2 Update Firestore security rules (if needed)
If you have domain-specific rules, update them to include your custom domain.

## Troubleshooting

### Common Issues:

#### 1. "Domain not verified"
- **Cause**: DNS records not properly configured
- **Solution**: Double-check DNS records in Namecheap
- **Check**: Use `nslookup yourdomain.com` to verify

#### 2. "SSL certificate pending"
- **Cause**: Certificate provisioning in progress
- **Solution**: Wait 24-48 hours
- **Check**: Firebase Console > Hosting > Custom domains

#### 3. "Site not loading"
- **Cause**: DNS propagation not complete
- **Solution**: Wait for DNS propagation
- **Check**: Use [whatsmydns.net](https://whatsmydns.net)

#### 4. "Redirect loop"
- **Cause**: Incorrect CNAME configuration
- **Solution**: Ensure CNAME points to Firebase hosting URL

### DNS Propagation Check:
```bash
# Check A records
nslookup yourdomain.com

# Check CNAME records  
nslookup www.yourdomain.com
```

## Security Considerations

### 1. HTTPS Enforcement
- Firebase automatically enforces HTTPS
- All HTTP traffic redirects to HTTPS

### 2. Security Headers
- Firebase includes security headers by default
- Consider adding custom headers in `firebase.json`

### 3. Domain Validation
- Only add domains you own
- Verify domain ownership before adding

## Performance Optimization

### 1. CDN Benefits
- Firebase Hosting uses Google's CDN
- Global edge locations for fast loading

### 2. Caching
- Static assets cached at edge locations
- Automatic compression enabled

### 3. HTTP/2 Support
- Automatic HTTP/2 support
- Better performance for modern browsers

## Monitoring and Analytics

### 1. Firebase Analytics
- Automatic integration with Firebase Analytics
- Track custom domain traffic

### 2. Performance Monitoring
- Monitor site performance
- Track Core Web Vitals

### 3. Error Tracking
- Monitor for 404s and other errors
- Set up alerts for downtime

## Next Steps After Setup

1. **Test all functionality** on your custom domain
2. **Set up monitoring** and alerts
3. **Configure backups** if needed
4. **Update any hardcoded URLs** in your app
5. **Set up redirects** from old URLs if applicable

## Support Resources

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Namecheap DNS Management](https://www.namecheap.com/support/knowledgebase/article.aspx/319/2237/how-can-i-set-up-an-a-address-record-for-my-domain)
- [DNS Propagation Checker](https://whatsmydns.net)

---

**Note**: The entire process can take 24-48 hours due to DNS propagation and SSL certificate provisioning. Be patient and monitor the Firebase Console for status updates.
