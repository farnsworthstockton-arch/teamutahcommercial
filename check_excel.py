#!/usr/bin/env python3
import sys
import os
sys.path.append('/usr/lib/python3/dist-packages')

try:
    import pandas as pd
    HAS_PANDAS = True
except ImportError:
    HAS_PANDAS = False

def check_excel_file():
    excel_path = '/home/claw/.openclaw/media/inbound/9f5ad03a-8033-425e-8584-7dc20cee18c6.xlsx'
    
    if not os.path.exists(excel_path):
        print("Excel file not found!")
        return
    
    print(f"File exists: {excel_path}")
    print(f"File size: {os.path.getsize(excel_path)} bytes")
    
    if HAS_PANDAS:
        try:
            # Read Excel file
            df = pd.read_excel(excel_path)
            
            print(f"\n=== SPREADSHEET DATA ===")
            print(f"Rows: {len(df)}, Columns: {len(df.columns)}")
            
            print("\nColumns found:")
            for i, col in enumerate(df.columns, 1):
                print(f"  {i:2}. {col}")
            
            print("\nFirst 5 rows:")
            for i in range(min(5, len(df))):
                print(f"\nRow {i+1}:")
                for col in df.columns:
                    value = df.iloc[i][col]
                    if pd.notna(value):
                        print(f"  {col}: {value}")
            
            # Check for OM links
            om_columns = [col for col in df.columns if 'om' in str(col).lower() or 'link' in str(col).lower()]
            print(f"\nPossible OM link columns: {om_columns}")
            
            # Save sample data
            sample_data = df.head(10).to_dict(orient='records')
            import json
            with open('sample_properties.json', 'w') as f:
                json.dump(sample_data, f, indent=2)
            print(f"\n✓ Saved sample data to sample_properties.json")
            
        except Exception as e:
            print(f"Error reading Excel: {e}")
    else:
        print("\nPandas not available. Checking file manually...")
        # Try to read as text
        import zipfile
        try:
            with zipfile.ZipFile(excel_path, 'r') as z:
                # List contents
                print("Excel file contents:")
                for name in z.namelist():
                    if 'xl/worksheets' in name:
                        print(f"  Worksheet: {name}")
        except:
            print("Could not examine Excel structure")

if __name__ == "__main__":
    check_excel_file()