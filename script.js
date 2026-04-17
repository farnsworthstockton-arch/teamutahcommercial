// Team Utah Commercial Property Website
// Data will be loaded from spreadsheet JSON

// Property data storage
let allProperties = [];
let filteredProperties = [];

// DOM Elements
const propertiesGrid = document.getElementById('propertiesGrid');
const propertyCount = document.getElementById('propertyCount');
const loadingElement = document.getElementById('loading');
const noResultsElement = document.getElementById('noResults');
const typeFilter = document.getElementById('typeFilter');
const countyFilter = document.getElementById('countyFilter');
const priceFilter = document.getElementById('priceFilter');
const searchFilter = document.getElementById('searchFilter');

// Color mapping for property types
const typeColors = {
    industrial: '#667eea',
    retail: '#764ba2',
    office: '#38a169',
    land: '#d69e2e',
    flex: '#3182ce',
    default: '#4a5568'
};

// Type display names
const typeNames = {
    industrial: 'Industrial',
    retail: 'Retail',
    office: 'Office',
    land: 'Land',
    flex: 'Flex Space'
};

// Initialize the application
async function init() {
    console.log('Team Utah Commercial website initializing...');
    
    // Load properties (for now, use sample data - will be replaced with spreadsheet data)
    await loadProperties();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initial render
    filterAndRenderProperties();
    
    // Hide loading
    setTimeout(() => {
        loadingElement.style.display = 'none';
    }, 500);
}

// Load properties from data source
async function loadProperties() {
    try {
        // TODO: Replace with actual spreadsheet data loading
        // For now, use sample data
        allProperties = getSampleProperties();
        console.log(`Loaded ${allProperties.length} properties`);
    } catch (error) {
        console.error('Error loading properties:', error);
        allProperties = getSampleProperties(); // Fallback to sample data
    }
}

// Get sample properties (temporary - will be replaced with spreadsheet data)
function getSampleProperties() {
    return [
        {
            id: 1,
            address: "123 Industrial Way, American Fork, UT",
            type: "industrial",
            county: "utah",
            price: 2850000,
            priceFormatted: "$2,850,000",
            capRate: "6.8%",
            omLink: "https://example.com/om-industrial.pdf",
            crexiLink: "https://www.crexi.com/properties/12345",
            imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            status: "Available",
            description: "Modern industrial facility with 32' clear height, 6 dock doors, and ample parking. Built in 2018 with Class A construction."
        },
        {
            id: 2,
            address: "456 Retail Center, Salt Lake City, UT",
            type: "retail",
            county: "salt lake",
            price: 4200000,
            priceFormatted: "$4,200,000",
            capRate: "7.2%",
            omLink: "https://example.com/om-retail.pdf",
            crexiLink: "https://www.crexi.com/properties/67890",
            imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            status: "Available",
            description: "Strip retail center with national anchor tenant and strong traffic count. 95% occupied with long-term leases."
        },
        {
            id: 3,
            address: "789 Office Plaza, Ogden, UT",
            type: "office",
            county: "weber",
            price: 1850000,
            priceFormatted: "$1,850,000",
            capRate: "6.5%",
            omLink: "https://example.com/om-office.pdf",
            crexiLink: "https://www.crexi.com/properties/11223",
            imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=4.0.3&auto=format&fit=crop&w=800&q=80",
            status: "Available",
            description: "Class B office building with recent renovations and convenient freeway access. Tenant improvement allowance available."
        },
        {
            id: 4,
            address: "101 Commercial Land, Lehi, UT",
            type: "land",
            county: "utah",
            price: 950000,
            priceFormatted: "$950,000",
            acres: 5.0,
            acresFormatted: "5.0 Acres",
            capRate: "N/A",
            omLink: "https://example.com/om-land.pdf",
            crexiLink: "https://www.crexi.com/properties/33445",
            imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            status: "Available",
            description: "Prime commercial land parcel zoned for mixed-use development. All utilities available at site."
        },
        {
            id: 5,
            address: "202 Flex Space, Sandy, UT",
            type: "flex",
            county: "salt lake",
            price: 3200000,
            priceFormatted: "$3,200,000",
            capRate: "6.9%",
            omLink: "https://example.com/om-flex.pdf",
            crexiLink: "https://www.crexi.com/properties/55667",
            imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            status: "Available",
            description: "Flex industrial/office space with multiple tenant suites and drive-in doors. Ideal for light manufacturing."
        },
        {
            id: 6,
            address: "303 Warehouse District, West Valley City, UT",
            type: "industrial",
            county: "salt lake",
            price: 5500000,
            priceFormatted: "$5,500,000",
            capRate: "6.5%",
            omLink: "https://example.com/om-warehouse.pdf",
            crexiLink: "https://www.crexi.com/properties/77889",
            imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            status: "Available",
            description: "Distribution warehouse with cross-dock loading and rail access. 28' clear height, ESFR sprinklers."
        },
        {
            id: 7,
            address: "404 Main Street Retail, Provo, UT",
            type: "retail",
            county: "utah",
            price: 2750000,
            priceFormatted: "$2,750,000",
            capRate: "7.5%",
            omLink: "https://example.com/om-downtown.pdf",
            crexiLink: "https://www.crexi.com/properties/99001",
            imageUrl: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            status: "Available",
            description: "Downtown retail building with high foot traffic and visibility. Historic building with modern updates."
        },
        {
            id: 8,
            address: "505 Medical Office, Murray, UT",
            type: "office",
            county: "salt lake",
            price: 4200000,
            priceFormatted: "$4,200,000",
            capRate: "6.2%",
            omLink: "https://example.com/om-medical.pdf",
            crexiLink: "https://www.crexi.com/properties/11223",
            imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            status: "Available",
            description: "Medical office building near hospital campus with ample parking. Built-out for medical tenants."
        },
        {
            id: 9,
            address: "Elko Industrial Park, Elko, NV",
            type: "industrial",
            county: "elko",
            price: 1850000,
            priceFormatted: "$1,850,000",
            capRate: "8.5%",
            omLink: "https://example.com/om-elko.pdf",
            crexiLink: "https://www.crexi.com/properties/33445",
            imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            status: "Available",
            description: "Industrial facility serving the mining and logistics sectors. Heavy power available, rail spur possible."
        },
        {
            id: 10,
            address: "Davis County Flex Building, Layton, UT",
            type: "flex",
            county: "davis",
            price: 2450000,
            priceFormatted: "$2,450,000",
            capRate: "7.0%",
            omLink: "https://example.com/om-davis.pdf",
            crexiLink: "https://www.crexi.com/properties/55667",
            imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            status: "Available",
            description: "Multi-tenant flex building with office and warehouse components. Recent roof and HVAC updates."
        }
    ];
}

// Set up event listeners for filters
function setupEventListeners() {
    typeFilter.addEventListener('change', filterAndRenderProperties);
    countyFilter.addEventListener('change', filterAndRenderProperties);
    priceFilter.addEventListener('change', filterAndRenderProperties);
    searchFilter.addEventListener('input', debounce(filterAndRenderProperties, 300));
}

// Debounce function for search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Filter properties based on current filter values
function filterProperties() {
    const typeValue = typeFilter.value;
    const countyValue = countyFilter.value;
    const priceValue = priceFilter.value;
    const searchValue = searchFilter.value.toLowerCase();
    
    filteredProperties = allProperties.filter(property => {
        // Type filter
        if (typeValue !== 'all' && property.type !== typeValue) {
            return false;
        }
        
        // County filter
        if (countyValue !== 'all' && property.county !== countyValue) {
            return false;
        }
        
        // Price filter
        if (priceValue !== 'all' && property.price > parseInt(priceValue)) {
            return false;
        }
        
        // Search filter
        if (searchValue && !property.address.toLowerCase().includes(searchValue)) {
            return false;
        }
        
        return true;
    });
}

// Render filtered properties to the grid
function renderProperties() {
    propertiesGrid.innerHTML = '';
    
    if (filteredProperties.length === 0) {
        noResultsElement.style.display = 'block';
        propertiesGrid.style.display = 'none';
        propertyCount.textContent = '0';
        return;
    }
    
    noResultsElement.style.display = 'none';
    propertiesGrid.style.display = 'grid';
    propertyCount.textContent = filteredProperties.length;
    
    filteredProperties.forEach(property => {
        const card = createPropertyCard(property);
        propertiesGrid.appendChild(card);
    });
}

// Create a property card element
function createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = 'property-card';
    
    const typeColor = typeColors[property.type] || typeColors.default;
    const typeName = typeNames[property.type] || property.type;
    
    // Use actual image if available, otherwise use colored gradient
    const imageStyle = property.imageUrl 
        ? `background-image: url('${property.imageUrl}'); background-size: cover; background-position: center;`
        : `background: linear-gradient(45deg, ${typeColor} 0%, ${darkenColor(typeColor, 20)} 100%);`;
    
    card.innerHTML = `
        <div class="property-image" style="${imageStyle}">
            <div class="property-type">${typeName}</div>
            ${!property.imageUrl ? '<i class="fas fa-building fa-3x"></i>' : ''}
        </div>
        <div class="property-content">
            <h3 class="property-address">${property.address}</h3>
            <p class="property-description">${property.description}</p>
            
            <div class="property-details">
                <div class="detail-item">
                    <span class="detail-label">Price</span>
                    <span class="detail-value">${property.priceFormatted}</span>
                </div>
                ${property.type === 'land' && property.acres ? `
                <div class="detail-item">
                    <span class="detail-label">Acres</span>
                    <span class="detail-value">${property.acresFormatted || property.acres}</span>
                </div>` : ''}
                <div class="detail-item">
                    <span class="detail-label">Cap Rate</span>
                    <span class="detail-value">${property.capRate}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">County</span>
                    <span class="detail-value">${property.county.charAt(0).toUpperCase() + property.county.slice(1)}</span>
                </div>
            </div>
            
            <div class="property-actions">
                <a href="${property.omLink}" class="btn btn-primary" target="_blank">
                    <i class="fas fa-file-pdf"></i> View OM
                </a>
                <a href="${property.crexiLink}" class="btn btn-secondary" target="_blank">
                    <i class="fas fa-external-link-alt"></i> Crexi Listing
                </a>
                <button class="btn btn-secondary" onclick="inquireAboutProperty(${property.id})">
                    <i class="fas fa-envelope"></i> Inquire
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Helper function to darken a color
function darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    
    return "#" + (
        0x1000000 +
        (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)
    ).toString(16).slice(1);
}

// Filter and render properties
function filterAndRenderProperties() {
    filterProperties();
    renderProperties();
}

// Inquire about a property
function inquireAboutProperty(propertyId) {
    const property = allProperties.find(p => p.id === propertyId);
    if (!property) return;
    
    const subject = encodeURIComponent(`Inquiry: ${property.address}`);
    const body = encodeURIComponent(`Hello Team Utah Commercial,\n\nI'm interested in learning more about this property:\n\n${property.address}\n${property.priceFormatted}\nCap Rate: ${property.capRate}${property.type === 'land' && property.acresFormatted ? `\n${property.acresFormatted}` : ''}\n\nPlease contact me with more information.\n\nThank you,`);
    
    window.location.href = `mailto:info@teamutahcommercial.com?subject=${subject}&body=${body}`;
}

// Export data to JSON (for spreadsheet integration)
function exportPropertiesToJSON() {
    const dataStr = JSON.stringify(allProperties, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'team-utah-commercial-properties.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Make