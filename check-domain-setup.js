// Domain Setup Verification Script
// Run with: node check-domain-setup.js

const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

const domain = 'ajlathletics.com';
const firebaseProject = 'statistics-1dfa4';
const expectedIPs = ['151.101.1.195', '151.101.65.195'];

async function checkDNS() {
  console.log('🔍 Checking DNS setup for ajlathletics.com...\n');
  
  try {
    // Check A records
    console.log('📋 Checking A records...');
    const { stdout: aRecords } = await execAsync(`nslookup ${domain}`);
    console.log(aRecords);
    
    // Check CNAME records
    console.log('📋 Checking CNAME records for www...');
    const { stdout: cnameRecords } = await execAsync(`nslookup www.${domain}`);
    console.log(cnameRecords);
    
    // Check with Google DNS
    console.log('📋 Checking with Google DNS (8.8.8.8)...');
    const { stdout: googleDNS } = await execAsync(`nslookup ${domain} 8.8.8.8`);
    console.log(googleDNS);
    
    console.log('\n✅ DNS check completed!');
    console.log('\n📝 What to look for:');
    console.log('- A records should show: 151.101.1.195 or 151.101.65.195');
    console.log('- CNAME should show: statistics-1dfa4.web.app');
    console.log('- If you see different IPs, DNS hasn\'t propagated yet');
    
  } catch (error) {
    console.error('❌ Error checking DNS:', error.message);
  }
}

async function checkFirebaseStatus() {
  console.log('\n🔥 Checking Firebase deployment status...\n');
  
  try {
    const { stdout } = await execAsync('firebase hosting:sites:list');
    console.log(stdout);
    
    console.log('\n📝 Next steps:');
    console.log('1. Go to Firebase Console: https://console.firebase.google.com/project/statistics-1dfa4/hosting');
    console.log('2. Click "Add custom domain"');
    console.log('3. Enter: ajlathletics.com');
    console.log('4. Follow the DNS setup instructions');
    
  } catch (error) {
    console.error('❌ Error checking Firebase:', error.message);
  }
}

async function main() {
  console.log('🚀 AJL Athletics Domain Setup Checker\n');
  console.log('Domain: ajlathletics.com');
  console.log('Firebase Project: statistics-1dfa4');
  console.log('Current Firebase URL: https://statistics-1dfa4.web.app\n');
  
  await checkFirebaseStatus();
  await checkDNS();
  
  console.log('\n🎯 Summary:');
  console.log('1. ✅ Your app is deployed to Firebase');
  console.log('2. ⏳ Add custom domain in Firebase Console');
  console.log('3. ⏳ Update DNS records in Namecheap');
  console.log('4. ⏳ Wait 24-48 hours for propagation');
  console.log('5. ✅ Your site will be live at https://ajlathletics.com');
}

main().catch(console.error);
