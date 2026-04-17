@echo off
echo ========================================
echo TEAM UTAH COMMERCIAL WEBSITE SETUP
echo ========================================
echo.

echo Step 1: Checking Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo Python not found. Installing required packages...
    echo Please install Python from: https://www.python.org/downloads/
    echo Then run this script again.
    pause
    exit /b 1
)

echo ✓ Python found
echo.

echo Step 2: Installing required packages...
pip install pandas openpyxl 2>nul || (
    echo Installing pandas and openpyxl...
    python -m pip install pandas openpyxl
)
echo ✓ Packages installed
echo.

echo Step 3: Looking for Excel spreadsheet...
if exist "properties.xlsx" (
    echo Found properties.xlsx
    echo Converting to website format...
    python excel-to-json.py
) else (
    echo No properties.xlsx found.
    echo.
    echo Please place your Excel file in this folder and name it:
    echo   properties.xlsx
    echo   OR
    echo   listings.xlsx
    echo   OR
    echo   data.xlsx
    echo.
    echo Then run this script again.
)

echo.
echo Step 4: Opening website...
if exist "index.html" (
    start index.html
    echo ✓ Website opened in your browser
) else (
    echo Error: index.html not found
)

echo.
echo ========================================
echo SETUP COMPLETE!
echo ========================================
echo.
echo Next steps:
echo 1. Review your properties in the browser
echo 2. Customize contact info in index.html
echo 3. Deploy to Cloudflare (see DEPLOY.md)
echo.
pause