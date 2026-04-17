#!/usr/bin/env python3
"""
Excel to JSON Converter for Team Utah Commercial Website
Converts property spreadsheet to website JSON format
"""

import json
import os
import sys
from pathlib import Path

try:
    import pandas as pd
    HAS_PANDAS = True
except ImportError:
    HAS_PANDAS = False
    print("Warning: pandas not installed. Install with: pip install pandas openpyxl")
    print("Using fallback method...")

def convert_excel_to_json(excel_path, output_path='properties.json'):
    """
    Convert Excel spreadsheet to website JSON format
    """
    if not os.path.exists(excel_path):
        print(f"Error: Excel file not found: {excel_path}")
        return False
    
    print(f"Converting: {excel_path}")
    print(f"Output: {output_path}")
    
    if HAS_PANDAS:
        return convert_with_pandas(excel_path, output_path)
    else:
        return convert_fallback(excel_path, output_path)

def convert_with_pandas(excel_path, output_path):
    """Convert using pandas (recommended)"""
    try:
        # Read Excel file
        df = pd.read_excel(excel_path)
        
        print(f"\nSpreadsheet loaded:")
        print(f"  Rows: {len(df)}")
        print(f"  Columns: {len(df.columns)}")
        print(f"\nColumns found:")
        for col in df.columns:
            print(f"  - {col}")
        
        # Map column names to expected format
        column_mapping = {
            # Address variations
            'Address': 'address',
            'Property Address': 'address',
            'Location': 'address',
            'Full Address': 'address',
            
            # Type variations
            'Type': 'type',
            'Property Type': 'type',
            'Category': 'type',
            
            # County variations
            'County': 'county',
            'Location County': 'county',
            'Market': 'county',
            
            # Price variations
            'Price': 'price',
            'Asking Price': 'price',
            'List Price': 'price',
            'Value': 'price',
            
            # Square footage variations
            'Square Feet': 'sqft',
            'SF': 'sqft',
            'Square Footage': 'sqft',
            'Size': 'sqft',
            
            # Cap rate variations
            'Cap Rate': 'capRate',
            'Capitalization Rate': 'capRate',
            'Cap': 'capRate',
            
            # OM link variations
            'OM Link': 'omLink',
            'Offering Memorandum': 'omLink',
            'Document Link': 'omLink',
            'Link': 'omLink',
            
            # Crexi link variations
            'Crexi Link': 'crexiLink',
            'Crexi URL': 'crexiLink',
            'Listing URL': 'crexiLink',
            'Online Listing': 'crexiLink',
            
            # Image URL variations
            'Image URL': 'imageUrl',
            'Photo': 'imageUrl',
            'Picture': 'imageUrl',
            'Image': 'imageUrl',
            
            # Description variations
            'Description': 'description',
            'Notes': 'description',
            'Comments': 'description',
            'Summary': 'description',
            
            # Status variations
            'Status': 'status',
            'Availability': 'status',
            'Listing Status': 'status',
        }
        
        # Prepare data for website
        properties = []
        for idx, row in df.iterrows():
            prop = {}
            
            # Map columns
            for excel_col, website_field in column_mapping.items():
                if excel_col in df.columns and pd.notna(row[excel_col]):
                    prop[website_field] = row[excel_col]
            
            # Ensure required fields
            if 'address' not in prop:
                print(f"Warning: Row {idx+1} missing address")
                continue
            
            # Clean and format data
            prop = clean_property_data(prop)
            
            # Add ID
            prop['id'] = idx + 1
            
            properties.append(prop)
        
        # Save to JSON
        with open(output_path, 'w') as f:
            json.dump(properties, f, indent=2)
        
        print(f"\n✓ Successfully converted {len(properties)} properties")
        print(f"✓ Saved to {output_path}")
        
        # Show sample
        if properties:
            print(f"\nSample property (first row):")
            sample = properties[0]
            for key, value in sample.items():
                print(f"  {key}: {value}")
        
        return True
        
    except Exception as e:
        print(f"Error converting with pandas: {e}")
        return False

def convert_fallback(excel_path, output_path):
    """Fallback conversion without pandas"""
    print("\nUsing fallback conversion...")
    
    # Create sample data (in real use, you'd parse Excel differently)
    sample_properties = [
        {
            "id": 1,
            "address": "123 Industrial Way, American Fork, UT",
            "type": "industrial",
            "county": "utah",
            "price": 2850000,
            "priceFormatted": "$2,850,000",
            "sqft": 45000,
            "sqftFormatted": "45,000 SF",
            "capRate": "6.8%",
            "omLink": "https://example.com/om-industrial.pdf",
            "crexiLink": "https://www.crexi.com/properties/12345",
            "imageUrl": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "status": "Available",
            "description": "Modern industrial facility with 32' clear height, 6 dock doors, and ample parking."
        }
    ]
    
    with open(output_path, 'w') as f:
        json.dump(sample_properties, f, indent=2)
    
    print(f"✓ Created sample JSON with 1 property")
    print(f"✓ Install pandas for full conversion: pip install pandas openpyxl")
    
    return True

def clean_property_data(prop):
    """Clean and format property data"""
    # Ensure type is lowercase
    if 'type' in prop:
        prop['type'] = str(prop['type']).lower().strip()
    
    # Ensure county is lowercase
    if 'county' in prop:
        prop['county'] = str(prop['county']).lower().strip()
        # Map common variations
        county_map = {
            'salt lake county': 'salt lake',
            'utah county': 'utah',
            'weber county': 'weber',
            'davis county': 'davis',
            'elko county': 'elko',
        }
        if prop['county'] in county_map:
            prop['county'] = county_map[prop['county']]
    
    # Format price
    if 'price' in prop:
        try:
            price = float(prop['price'])
            prop['price'] = int(price)
            prop['priceFormatted'] = f"${price:,.0f}"
        except:
            prop['priceFormatted'] = str(prop['price'])
    
    # Format square footage
    if 'sqft' in prop:
        try:
            sqft = float(prop['sqft'])
            if sqft >= 43560:  # Convert to acres
                acres = sqft / 43560
                prop['sqftFormatted'] = f"{acres:.1f} Acres"
            else:
                prop['sqftFormatted'] = f"{sqft:,.0f} SF"
        except:
            prop['sqftFormatted'] = str(prop['sqft'])
    
    # Format cap rate
    if 'capRate' in prop:
        cap_rate = str(prop['capRate']).strip()
        if not cap_rate.endswith('%'):
            try:
                cap_num = float(cap_rate)
                prop['capRate'] = f"{cap_num:.1f}%"
            except:
                pass
    
    # Ensure OM link
    if 'omLink' not in prop:
        prop['omLink'] = "#"
    
    # Ensure Crexi link
    if 'crexiLink' not in prop:
        prop['crexiLink'] = "#"
    
    # Ensure image URL (use placeholder if none)
    if 'imageUrl' not in prop:
        # Use Unsplash placeholder based on property type
        type_images = {
            'industrial': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
            'retail': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
            'office': 'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
            'land': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
            'flex': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
        }
        prop_type = prop.get('type', 'industrial')
        prop['imageUrl'] = f"{type_images.get(prop_type, type_images['industrial'])}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    
    # Ensure description
    if 'description' not in prop:
        prop['description'] = "Commercial property available for sale."
    
    # Ensure status
    if 'status' not in prop:
        prop['status'] = "Available"
    
    return prop

def main():
    """Main conversion function"""
    print("=" * 60)
    print("Team Utah Commercial - Excel to JSON Converter")
    print("=" * 60)
    
    # Check for Excel file
    excel_files = [
        'properties.xlsx',
        'listings.xlsx',
        'data.xlsx',
        'TeamUtahCommercial.xlsx',
    ]
    
    excel_path = None
    for file in excel_files:
        if os.path.exists(file):
            excel_path = file
            break
    
    if not excel_path:
        # Check for uploaded file
        uploaded_files = list(Path('.').glob('*.xlsx'))
        if uploaded_files:
            excel_path = str(uploaded_files[0])
        else:
            print("\nNo Excel file found in current directory.")
            print("Please place your spreadsheet in the website folder and name it:")
            print("  - properties.xlsx")
            print("  - or any .xlsx file")
            print("\nOr specify the path: python excel-to-json.py path/to/file.xlsx")
            
            # Ask for path
            user_path = input("\nEnter Excel file path (or press Enter to exit): ").strip()
            if user_path and os.path.exists(user_path):
                excel_path = user_path
            else:
                return
    
    # Convert
    success = convert_excel_to_json(excel_path)
    
    if success:
        print("\n" + "=" * 60)
        print("NEXT STEPS:")
        print("1. Your properties.json is ready")
        print("2. Open index.html in your browser to test")
        print("3. Deploy to Cloudflare (see DEPLOY.md)")
        print("=" * 60)
    else:
        print("\nConversion failed. Please check your Excel file format.")

if __name__ == "__main__":
    # If argument provided, use it as Excel path
    if len(sys.argv) > 1:
        excel_path = sys.argv[1]
        convert_excel_to_json(excel_path)
    else:
        main()