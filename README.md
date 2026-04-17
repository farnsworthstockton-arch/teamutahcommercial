# Team Utah Commercial Property Website

A modern, responsive website for showcasing commercial real estate listings from Team Utah Commercial.

## 🚀 Quick Start

1. **Download all files** in this folder to your computer
2. **Open `index.html`** in your web browser
3. **See your properties** displayed with filters and search

## 📊 Connect Your Spreadsheet

### Easy Method:
1. Save your Excel file as `properties.xlsx` in this folder
2. Run the converter:
   ```bash
   python3 excel-to-json.py
   ```
3. Refresh the website - your real data will appear!

### Manual Method:
Edit `script.js` and replace the sample data with your property information.

## 🌐 Deploy to Cloudflare (FREE)

### Step 1: Create Cloudflare Account
- Go to https://dash.cloudflare.com/sign-up
- Free account includes unlimited bandwidth

### Step 2: Deploy Website
1. Zip this entire folder
2. Go to Cloudflare Pages → "Create project"
3. Choose "Direct upload"
4. Upload your zip file
5. Your site goes live instantly at: `https://your-site.pages.dev`

### Step 3: Custom Domain (Optional)
- Add `teamutahcommercial.com` in Cloudflare settings
- Point DNS to Cloudflare

## 🏢 Website Features

### For Buyers/Investors:
- **Filter properties** by type, county, price
- **Search** by address or city
- **View details** - price, SF, cap rate, description
- **Download OM** - offering memorandum links
- **Contact broker** - one-click email inquiry

### For Your Team:
- **Auto-update** from spreadsheet
- **Mobile responsive** - works on phones/tablets
- **Professional design** - reflects brokerage quality
- **Fast loading** - optimized for speed
- **SEO ready** - Google-friendly structure

## 📁 File Structure

```
teamutahcommercial/
├── index.html          # Main website
├── script.js           # Property filtering & interactivity
├── excel-to-json.py    # Spreadsheet converter
├── properties.json     # Property data (auto-generated)
├── DEPLOY.md          # Deployment instructions
└── README.md          # This file
```

## 🔧 Customization

### Update Contact Info:
Edit `index.html` - search for:
- `(801) 555-1234` - Phone number
- `info@teamutahcommercial.com` - Email
- `Team Utah Commercial` - Brokerage name

### Change Colors:
Edit CSS at top of `index.html`:
```css
:root {
    --primary: #1a365d;  /* Main blue */
    --accent: #3182ce;   /* Highlight blue */
}
```

### Add Property Types:
Edit `script.js`:
```javascript
const typeColors = {
    industrial: '#667eea',
    retail: '#764ba2',
    office: '#38a169',
    // Add more...
};
```

## 📈 Spreadsheet Requirements

Your Excel file should include these columns (names can vary):

| Column | Example | Required |
|--------|---------|----------|
| Address | "123 Main St, City, UT" | ✅ Yes |
| Type | "industrial", "retail", "office" | ✅ Yes |
| County | "salt lake", "utah", "weber" | ✅ Yes |
| Price | 2850000 | ✅ Yes |
| Square Feet | 45000 | ✅ Yes |
| Cap Rate | "6.8%" | ✅ Yes |
| OM Link | "https://..." | ✅ Yes |
| Description | "Modern facility..." | ❌ Optional |

## 🔄 Auto-Update from Spreadsheet

### Option A: Manual Update
1. Update Excel file
2. Run `python3 excel-to-json.py`
3. Re-deploy to Cloudflare

### Option B: Automated (Advanced)
1. Host spreadsheet on Google Sheets
2. Use Google Apps Script to export as JSON
3. Cloudflare fetches updated JSON daily

## 📱 Mobile Preview

The website is fully responsive:
- **Desktop**: 3-column grid
- **Tablet**: 2-column grid  
- **Mobile**: 1-column stack
- **Touch-friendly** buttons and filters

## 🛠️ Troubleshooting

### "No properties found"
- Check `properties.json` exists
- Run `python3 excel-to-json.py` again
- Verify Excel file has data

### "Filters not working"
- Clear browser cache (Ctrl+F5)
- Check browser console for errors (F12 → Console)

### "Python not found"
- Install Python: https://www.python.org/downloads/
- Or manually create `properties.json` from your data

### "Deployment failed"
- Ensure all files are in the folder
- Zip the folder, not individual files
- Check Cloudflare Pages status page

## 📞 Support

For issues or questions:
1. Check browser console (F12)
2. Run converter with debug: `python3 excel-to-json.py --debug`
3. Contact: Team Utah Commercial operations

## 🎯 Next Enhancements

Planned features (let us know priorities):
- [ ] Contact form with email capture
- [ ] Property comparison tool
- [ ] Market statistics dashboard
- [ ] Broker team profiles
- [ ] Virtual tour integration
- [ ] Mortgage calculator
- [ ] Newsletter signup

---

**Team Utah Commercial**  
*Utah's premier commercial real estate brokerage*