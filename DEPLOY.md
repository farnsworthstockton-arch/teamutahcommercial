# Team Utah Commercial Website Deployment Guide

## Live Website: https://teamutahcommercial.pages.dev

## Files Created:
1. `index.html` - Main website with property listings
2. `script.js` - JavaScript for filtering and interactivity
3. `excel-to-json.py` - Script to convert spreadsheet to JSON
4. `DEPLOY.md` - This deployment guide

## How to Deploy to Cloudflare Pages (FREE):

### Option 1: Automatic Deployment (Recommended)
1. Go to https://dash.cloudflare.com/
2. Click "Pages" → "Create a project"
3. Connect your GitHub/GitLab or drag & drop the `teamutahcommercial` folder
4. Cloudflare will automatically deploy your site
5. Your site will be at: `https://teamutahcommercial.pages.dev`

### Option 2: Manual Upload
1. Zip the `teamutahcommercial` folder
2. Go to Cloudflare Pages → Create project → "Direct Upload"
3. Upload the zip file
4. Done!

## How to Connect Your Spreadsheet:

### Step 1: Convert Excel to JSON
1. Save your Excel file as `properties.xlsx` in the website folder
2. Run the converter:
   ```bash
   python3 excel-to-json.py
   ```
3. This creates `properties.json` with all your property data

### Step 2: Update the Website
1. In `script.js`, replace the `getSampleProperties()` function
2. Load from `properties.json` instead:
   ```javascript
   async function loadProperties() {
       const response = await fetch('properties.json');
       allProperties = await response.json();
   }
   ```

### Step 3: Automate Updates
1. Set up a cron job to run `excel-to-json.py` daily
2. Or use Google Sheets → JSON export (more advanced)

## Website Features:
- ✅ Property filtering by type, county, price
- ✅ Search by address/city
- ✅ Responsive design (works on mobile/desktop)
- ✅ Contact via email
- ✅ OM links for each property
- ✅ Professional brokerage branding

## Customization:

### Update Contact Info:
Edit the header and footer in `index.html`:
```html
<p><i class="fas fa-phone"></i> (801) 555-1234</p>
<p><i class="fas fa-envelope"></i> info@teamutahcre.com</p>
```

### Change Colors:
Edit the CSS variables at the top of `index.html`:
```css
:root {
    --primary: #1a365d;  /* Dark blue */
    --accent: #3182ce;   /* Light blue */
}
```

### Add More Property Types:
Update in `script.js`:
```javascript
const typeColors = {
    industrial: '#667eea',
    retail: '#764ba2',
    // Add more...
};
```

## Spreadsheet Format Requirements:
Your Excel file should have these columns (names can vary):
- `Address` - Full property address
- `Type` - industrial/retail/office/land/flex
- `County` - salt lake/utah/weber/davis/elko
- `Price` - Number (e.g., 2850000)
- `SquareFeet` or `SF` - Number
- `CapRate` - Percentage (e.g., "6.8%")
- `OM_Link` - URL to offering memorandum
- `Status` - Available/Under Contract/Sold

## Next Steps:

### 1. Get a Custom Domain (Optional)
- Register `teamutahcommercial.com`
- In Cloudflare Pages, go to Settings → Custom domains
- Add your domain

### 2. Add Analytics
- Add Google Analytics or Cloudflare Analytics
- Free with Cloudflare Pages

### 3. SEO Optimization
- Add meta tags in `index.html`
- Submit to Google Search Console

### 4. Email Integration
- Set up contact form to send emails
- Use Formspark or similar (free tier available)

## Support:
- Cloudflare Pages docs: https://developers.cloudflare.com/pages/
- Website issues: Check browser console (F12)
- Data issues: Run `python3 excel-to-json.py --debug`

## Quick Test:
1. Open `index.html` in your browser
2. You should see 10 sample properties
3. Test filters and search
4. Click "View OM" and "Inquire" buttons

Your website is ready to deploy! 🚀