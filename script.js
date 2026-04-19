// Team Utah Commercial Property Website
// Using real data from listings.json

// Property data storage
let allProperties = [];
let filteredProperties = [];

// DOM Elements
const propertiesGrid = document.getElementById('propertiesGrid');
const propertyCount = document.getElementById('propertyCount');
const loadingElement = document.getElementById('loading');
const noResultsElement = document.getElementById('noResults');
const typeFilter = document.getElementById('typeFilter');
const priceFilter = document.getElementById('priceFilter');
const searchFilter = document.getElementById('searchFilter');

// Color mapping for property types
const typeColors = {
    'Retail': '#667eea',
    'RETAIL': '#667eea',
    'Res. Land': '#38a169',
    'Retail Land': '#38a169',
    'Industrial Land': '#d69e2e',
    'Commercial Land': '#d69e2e',
    'Ag. Land': '#38a169',
    'IND': '#764ba2',
    'Industrial': '#764ba2',
    'OFFICE': '#3182ce',
    'Office': '#3182ce',
    'FARM': '#38a169',
    'Farm': '#38a169',
    'Agricultural': '#38a169',
    'Income': '#dd6b20',
    'Commercial': '#4a5568',
    'default': '#4a5568'
};

// Type display names
const typeNames = {
    'Retail': 'Retail',
    'RETAIL': 'Retail',
    'Res. Land': 'Residential Land',
    'Retail Land': 'Retail Land',
    'Industrial Land': 'Industrial Land',
    'Commercial Land': 'Commercial Land',
    'Ag. Land': 'Agricultural Land',
    'IND': 'Industrial',
    'Industrial': 'Industrial',
    'OFFICE': 'Office',
    'Office': 'Office',
    'FARM': 'Farm',
    'Farm': 'Farm',
    'Agricultural': 'Agricultural',
    'Income': 'Income',
    'Commercial': 'Commercial'
};

// Land types that should show acres
const landTypes = ['Res. Land', 'Retail Land', 'Industrial Land', 'Commercial Land', 'Ag. Land', 'Agricultural Land'];

// Initialize the application
async function init() {
    console.log('Team Utah Commercial website initializing...');
    
    // Load real properties from JSON
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

// Load properties from real data
async function loadProperties() {
    try {
        const response = await fetch('real-listings.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const rawData = await response.json();

        allProperties = rawData.map((item, index) => {
            // Format price
            let priceFormatted = 'Call for pricing';
            if (item.price) {
                if (typeof item.price === 'number') {
                    if (item.section === 'FOR LEASE') {
                        priceFormatted = `$${item.price.toFixed(2)}/SF/YR`;
                    } else {
                        priceFormatted = `$${item.price.toLocaleString()}`;
                    }
                } else if (typeof item.price === 'string' && item.price.trim() !== '') {
                    priceFormatted = item.price;
                }
            }

            // Determine if this is a land type
            const isLandType = landTypes.includes(item.type);

            // Format acres if available
            let acresFormatted = '';
            if (item.acres && typeof item.acres === 'number') {
                acresFormatted = `${item.acres.toLocaleString()} Acres`;
            }

            // Clean up type for filtering
            const cleanType = item.type ? item.type.trim() : 'Unknown';

            return {
                id: index + 1,
                address: String(item.address || 'Address not available'),
                type: cleanType,
                section: item.section || 'FOR SALE',
                status: item.status || '',
                price: item.price || 0,
                priceFormatted: priceFormatted,
                acres: item.acres,
                acresFormatted: acresFormatted,
                isLandType: isLandType,
                omLink: item.om || '#',
                crexiLink: item.crexi || '#',
                hasOM: !!(item.om && item.om.trim() !== '' && !item.om.startsWith('Put link')),
                hasCrexi: !!(item.crexi && item.crexi.trim() !== '' && !item.crexi.startsWith('Put link')),
                imageUrl: item.photo ? item.photo : getImageForType(cleanType)
            };
        });

        console.log(`Loaded ${allProperties.length} real properties`);

        // Populate type filter (only FOR SALE and FOR LEASE)
        populateTypeFilter();

    } catch (error) {
        console.error('Error loading properties:', error);
        allProperties = [];
    }
}

// Get appropriate image based on property type
function getImageForType(type) {
    const typeLower = type.toLowerCase();
    
    if (typeLower.includes('land')) {
        return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    } else if (typeLower.includes('retail')) {
        return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    } else if (typeLower.includes('industrial') || typeLower.includes('ind')) {
        return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    } else if (typeLower.includes('office')) {
        return 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    } else if (typeLower.includes('farm') || typeLower.includes('agricultural')) {
        return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    }
    
    // Default image
    return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
}

// Populate type filter dropdown
function populateTypeFilter() {
    // Get unique types
    const types = [...new Set(allProperties.map(p => p.type).filter(t => t))];
    
    // Clear existing options except "All"
    while (typeFilter.options.length > 1) {
        typeFilter.remove(1);
    }
    
    // Add type options
    types.sort().forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = typeNames[type] || type;
        typeFilter.appendChild(option);
    });
}

// Set up event listeners for filters
function setupEventListeners() {
    typeFilter.addEventListener('change', filterAndRenderProperties);
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
    const priceValue = priceFilter.value;
    const searchValue = searchFilter.value.toLowerCase();
    
    filteredProperties = allProperties.filter(property => {
        // Past Projects are never filtered — always shown at the bottom
        if (property.section === 'PAST PROJECTS') return false;

        // Type filter
        if (typeValue !== 'all' && property.type !== typeValue) {
            return false;
        }

        // Price filter (only for properties with numeric prices > 0)
        if (priceValue !== 'all' && property.price && typeof property.price === 'number' && property.price > 0) {
            const maxPrice = parseInt(priceValue);
            if (property.price > maxPrice) {
                return false;
            }
        }

        // Search filter - search multiple fields
        if (searchValue) {
            const searchFields = [
                property.address.toLowerCase(),
                property.type.toLowerCase()
            ];

            if (!searchFields.some(field => field.includes(searchValue))) {
                return false;
            }
        }

        return true;
    });
}

// Render filtered properties to the grid
function renderProperties() {
    propertiesGrid.innerHTML = '';
    
    const pastProjects = allProperties.filter(p => p.section === 'PAST PROJECTS');

    if (filteredProperties.length === 0 && pastProjects.length === 0) {
        noResultsElement.style.display = 'block';
        propertiesGrid.style.display = 'none';
        propertyCount.textContent = '0';
        return;
    }

    noResultsElement.style.display = 'none';
    propertiesGrid.style.display = 'grid';
    propertyCount.textContent = filteredProperties.length;
    
    // Group by section
    const forSale = filteredProperties.filter(p => p.section === 'FOR SALE');
    const forLease = filteredProperties.filter(p => p.section === 'FOR LEASE');

    // Render FOR SALE section
    if (forSale.length > 0) {
        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'section-header';
        sectionHeader.innerHTML = '<h3>For Sale</h3>';
        propertiesGrid.appendChild(sectionHeader);

        forSale.forEach(property => {
            const card = createPropertyCard(property);
            propertiesGrid.appendChild(card);
        });
    }

    // Render FOR LEASE section
    if (forLease.length > 0) {
        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'section-header';
        sectionHeader.innerHTML = '<h3>For Lease</h3>';
        propertiesGrid.appendChild(sectionHeader);

        forLease.forEach(property => {
            const card = createPropertyCard(property);
            propertiesGrid.appendChild(card);
        });
    }

    // Render PAST PROJECTS section (always shown, not filtered)
    if (pastProjects.length > 0) {
        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'section-header past-projects-header';
        sectionHeader.innerHTML = '<h3>Past Projects</h3>';
        propertiesGrid.appendChild(sectionHeader);

        pastProjects.forEach(property => {
            const card = createPropertyCard(property);
            card.classList.add('past-project-card');
            propertiesGrid.appendChild(card);
        });
    }
}

// Create a property card element
function createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = 'property-card';
    
    const typeColor = typeColors[property.type] || typeColors.default;
    const typeName = typeNames[property.type] || property.type;
    
    // Use appropriate image
    const imageStyle = `background-image: url('${property.imageUrl}'); background-size: cover; background-position: center;`;
    
    card.innerHTML = `
        <div class="property-image" style="${imageStyle}">
            <div class="property-type">${typeName}</div>
            ${property.status ? `<div class="property-status">${property.status}</div>` : `<div class="property-section">${property.section}</div>`}
        </div>
        <div class="property-content">
            <h3 class="property-address">${property.address}</h3>

            <div class="property-details">
                <div class="detail-item">
                    <span class="detail-label">Price</span>
                    <span class="detail-value">${property.priceFormatted}</span>
                </div>
                ${property.acresFormatted ? `
                <div class="detail-item">
                    <span class="detail-label">Acres</span>
                    <span class="detail-value">${property.acresFormatted}</span>
                </div>
                ` : ''}
                <div class="detail-item">
                    <span class="detail-label">Type</span>
                    <span class="detail-value">${typeName}</span>
                </div>
            </div>
            
            <div class="property-actions">
                ${property.hasOM ? `
                <a href="${property.omLink}" class="btn btn-primary" target="_blank">
                    <i class="fas fa-file-pdf"></i> View OM
                </a>
                ` : `
                <button class="btn btn-primary disabled" disabled>
                    <i class="fas fa-file-pdf"></i> OM Not Available
                </button>
                `}
                
                ${property.hasCrexi ? `
                <a href="${property.crexiLink}" class="btn btn-secondary" target="_blank">
                    <i class="fas fa-external-link-alt"></i> Crexi Listing
                </a>
                ` : `
                <button class="btn btn-secondary disabled" disabled>
                    <i class="fas fa-external-link-alt"></i> No Crexi Link
                </button>
                `}
                
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

// Sample data fallback
function getSampleProperties() {
    return [
        {
            id: 1,
            address: "Wellsville Recovery Center",
            type: "Retail",
            section: "FOR SALE",
            price: 8500000,
            priceFormatted: "$8,500,000",
            acres: 23.12,
            acresFormatted: "23.12 Acres",
            isLandType: false,
            notes: "Auction w. FRE 3.18.26",
            omLink: "https://marketedge.realnex.com/ePublish.aspx?propid=167851-1",
            crexiLink: "https://www.crexi.com/properties/2167364/utah-sherwood-hills",
            hasOM: true,
            hasCrexi: true,
            imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            description: "Retail property available for sale"
        }
    ];
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);