// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            // Smooth scroll to section
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Initialize flowcharts
    initFlowcharts();
    
    // Add scroll-to-top button
    createScrollToTop();
});

// Copy code function
function copyCode(codeId) {
    const codeElement = document.getElementById(codeId);
    const code = codeElement.textContent;
    
    navigator.clipboard.writeText(code).then(function() {
        // Find the button that was clicked
        const button = event.target;
        const originalText = button.textContent;
        
        // Change button text temporarily
        button.textContent = '✓ Copied!';
        button.style.background = '#10b981';
        
        setTimeout(function() {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }).catch(function(err) {
        console.error('Failed to copy:', err);
    });
}

// Initialize flowcharts with simplified SVG representations
function initFlowcharts() {
    // Flowchart 1: Setup
    const flowchart1 = document.getElementById('flowchart1');
    flowchart1.innerHTML = `
        <div class="flow-item flow-start">START</div>
        <div class="flow-arrow">↓</div>
        <div class="flow-item flow-process">Import Libraries<br><small>xarray, pandas, numpy, scipy, geopandas</small></div>
        <div class="flow-arrow">↓</div>
        <div class="flow-item flow-process">Define File Paths<br><small>Station, shapefile, output directories</small></div>
        <div class="flow-arrow">↓</div>
        <div class="flow-item flow-process">Define Spatial Domain<br><small>2°-12°N, 76°-86°E, 0.05° resolution</small></div>
        <div class="flow-arrow">↓</div>
        <div class="flow-item flow-process">Create Target Grid<br><small>200 × 200 points (40,000 total)</small></div>
        <div class="flow-arrow">↓</div>
        <div class="flow-item flow-end">Grid Ready</div>
    `;
    
    // Flowchart 2: Land Mask
    const flowchart2 = document.getElementById('flowchart2');
    flowchart2.innerHTML = `
        <div class="flow-item flow-start">START</div>
        <div class="flow-arrow">↓</div>
        <div class="flow-item flow-process">Load Shapefile<br><small>Sri Lanka district boundaries</small></div>
        <div class="flow-arrow">↓</div>
        <div class="flow-item flow-decision">Mask File<br>Exists?</div>
        <div class="flow-branch">
            <div class="flow-path">
                <div class="flow-label">NO</div>
                <div class="flow-arrow">↓</div>
                <div class="flow-item flow-process">Create Boolean Mask<br><small>Check 40K points</small></div>
                <div class="flow-arrow">↓</div>
                <div class="flow-item flow-process">Distance Transform<br><small>Calculate distances to land</small></div>
                <div class="flow-arrow">↓</div>
                <div class="flow-item flow-process">Apply Buffer Gradient<br><small>15km coastal zone (0.7 → 0.3)</small></div>
                <div class="flow-arrow">↓</div>
                <div class="flow-item flow-process">Save to NetCDF</div>
            </div>
            <div class="flow-path">
                <div class="flow-label">YES</div>
                <div class="flow-arrow">↓</div>
                <div class="flow-item flow-process">Load Existing Mask</div>
            </div>
        </div>
        <div class="flow-arrow">↓</div>
        <div class="flow-item flow-end">Weight Map Ready</div>
    `;
    
    // Flowchart 3: Distance
    const flowchart3 = document.getElementById('flowchart3');
    flowchart3.innerHTML = `
        <div class="flow-item flow-start">START</div>
        <div class="flow-arrow">↓</div>
        <div class="flow-item flow-process">Load Station CSV<br><small>Read coordinates and rainfall data</small></div>
        <div class="flow-arrow">↓</div>
        <div class="flow-item flow-process">Filter Stations<br><small>Keep only stations within domain</small></div>
        <div class="flow-arrow">↓</div>
        <div class="flow-item flow-decision">Distance File<br>Exists?</div>
        <div class="flow-branch">
            <div class="flow-path">
                <div class="flow-label">NO</div>
                <div class="flow-arrow">↓</div>
                <div class="flow-item flow-process">Initialize 3D Array<br><small>200 × 200 × N_stations</small></div>
                <div class="flow-arrow">↓</div>
                <div class="flow-item flow-process">Calculate Distances<br><small>Euclidean: √[(Δlat)² + (Δlon)²]</small></div>
                <div class="flow-arrow">↓</div>
                <div class="flow-item flow-process">Save to Disk<br><small>.npy file for reuse</small></div>
            </div>
            <div class="flow-path">
                <div class="flow-label">YES</div>
                <div class="flow-arrow">↓</div>
                <div class="flow-item flow-process">Load Distances</div>
            </div>
        </div>
        <div class="flow-arrow">↓</div>
        <div class="flow-item flow-end">Distance Array Ready</div>
    `;
    
    // Flowchart 4: Daily Merging
    const flowchart4 = document.getElementById('flowchart4');
    flowchart4.innerHTML = `
        <div class="flow-item flow-start">START DAY LOOP (1-31)</div>
        <div class="flow-arrow">↓</div>
        <div class="flow-item flow-process">Load Satellite NetCDF<br><small>GPM IMERG daily file</small></div>
        <div class="flow-arrow">↓</div>
        <div class="flow-item flow-process">Crop to Domain<br><small>Extract target region</small></div>
        <div class="flow-arrow">↓</div>
        <div class="flow-item flow-process">Interpolate to 5km Grid<br><small>Cubic spline method</small></div>
        <div class="flow-arrow">↓</div>
        <div class="flow-item flow-decision">Station Data<br>Available?</div>
        <div class="flow-branch">
            <div class="flow-path">
                <div class="flow-label">NO</div>
                <div class="flow-arrow">↓</div>
                <div class="flow-item flow-process">Use Satellite Only</div>
            </div>
            <div class="flow-path">
                <div class="flow-label">YES</div>
                <div class="flow-arrow">↓</div>
                <div class="flow-item flow-process">Load Station Data</div>
                <div class="flow-arrow">↓</div>
                <div class="flow-item flow-loop">CRESSMAN LOOP<br><small>3 passes: r = 0.5, 0.3, 0.1°</small></div>
                <div class="flow-arrow">↓</div>
                <div class="flow-item flow-process">Compute Residuals<br><small>station - grid</small></div>
                <div class="flow-arrow">↓</div>
                <div class="flow-item flow-process">Apply Cressman Weights<br><small>w = (r² - d²)/(r² + d²)</small></div>
                <div class="flow-arrow">↓</div>
                <div class="flow-item flow-process">Apply Buffer Weights<br><small>Fade in coastal zone</small></div>
                <div class="flow-arrow">↓</div>
                <div class="flow-item flow-process">Update Grid<br><small>Add weighted corrections</small></div>
            </div>
        </div>
        <div class="flow-arrow">↓</div>
        <div class="flow-item flow-process">Clip to Non-Negative<br><small>Remove negative values</small></div>
        <div class="flow-arrow">↓</div>
        <div class="flow-item flow-process">Store Daily Grid</div>
        <div class="flow-arrow">↓</div>
        <div class="flow-item flow-end">Next Day (Loop 31x)</div>
    `;
    
    // Flowchart 5: Output
    const flowchart5 = document.getElementById('flowchart5');
    flowchart5.innerHTML = `
        <div class="flow-item flow-start">START</div>
        <div class="flow-arrow">↓</div>
        <div class="flow-item flow-process">Stack Daily Grids<br><small>31 arrays → 3D (31, 200, 200)</small></div>
        <div class="flow-arrow">↓</div>
        <div class="flow-item flow-process">Create xarray Dataset<br><small>precip[time, lat, lon]</small></div>
        <div class="flow-arrow">↓</div>
        <div class="flow-item flow-process">Add Coordinate Attributes<br><small>CF-compliant metadata</small></div>
        <div class="flow-arrow">↓</div>
        <div class="flow-item flow-process">Add Variable Attributes<br><small>units, long_name</small></div>
        <div class="flow-arrow">↓</div>
        <div class="flow-item flow-process">Add Global Attributes<br><small>history, creation_date</small></div>
        <div class="flow-arrow">↓</div>
        <div class="flow-item flow-process">Define Encoding<br><small>Fill values, data types</small></div>
        <div class="flow-arrow">↓</div>
        <div class="flow-item flow-process">Write NetCDF File<br><small>merged_5km_precip_IMERG.nc</small></div>
        <div class="flow-arrow">↓</div>
        <div class="flow-item flow-end">SUCCESS</div>
    `;
}

// Create scroll to top button
function createScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.transform = 'translateY(0)';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.transform = 'translateY(10px)';
        }
    });
    
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    scrollBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.1)';
    });
    
    scrollBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
}

// Add CSS for flowchart items
const style = document.createElement('style');
style.textContent = `
    .flow-item {
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        text-align: center;
        font-weight: 500;
        margin: 0.5rem 0;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        max-width: 400px;
        animation: fadeIn 0.6s ease-out backwards;
    }
    
    .flow-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
    
    .flow-start {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        font-weight: bold;
    }
    
    .flow-end {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        font-weight: bold;
    }
    
    .flow-process {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        color: white;
    }
    
    .flow-decision {
        background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
        color: white;
        border-radius: 50%;
        width: 180px;
        height: 180px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 1rem auto;
    }
    
    .flow-loop {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: white;
        border: 3px dashed white;
    }
    
    .flow-arrow {
        font-size: 2rem;
        color: #6b7280;
        margin: 0.5rem 0;
    }
    
    .flow-branch {
        display: flex;
        gap: 2rem;
        justify-content: center;
        margin: 1rem 0;
        flex-wrap: wrap;
    }
    
    .flow-path {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        min-width: 250px;
    }
    
    .flow-label {
        background: #ef4444;
        color: white;
        padding: 0.3rem 1rem;
        border-radius: 1rem;
        font-weight: bold;
        font-size: 0.9rem;
        margin: 0.5rem 0;
    }
    
    .flow-path:nth-child(2) .flow-label {
        background: #10b981;
    }
    
    .flow-item small {
        display: block;
        font-size: 0.8rem;
        opacity: 0.9;
        margin-top: 0.3rem;
        font-weight: normal;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .flow-item:nth-child(1) { animation-delay: 0.1s; }
    .flow-item:nth-child(3) { animation-delay: 0.2s; }
    .flow-item:nth-child(5) { animation-delay: 0.3s; }
    .flow-item:nth-child(7) { animation-delay: 0.4s; }
    .flow-item:nth-child(9) { animation-delay: 0.5s; }
    .flow-item:nth-child(11) { animation-delay: 0.6s; }
    .flow-item:nth-child(13) { animation-delay: 0.7s; }
`;
document.head.appendChild(style);

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    const sections = Array.from(document.querySelectorAll('.content-section'));
    const currentIndex = sections.findIndex(section => {
        const rect = section.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= window.innerHeight / 2;
    });
    
    if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
        e.preventDefault();
        sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
    } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        e.preventDefault();
        sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
    }
});

// Add print styles
const printStyle = document.createElement('style');
printStyle.textContent = `
    @media print {
        .navbar, .scroll-to-top, .copy-btn {
            display: none !important;
        }
        .content-section {
            page-break-inside: avoid;
            box-shadow: none;
        }
        body {
            background: white;
        }
    }
`;
document.head.appendChild(printStyle);

console.log('🌧️ Rainfall Data Blending System loaded successfully!');
