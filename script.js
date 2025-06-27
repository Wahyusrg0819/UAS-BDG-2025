// Neo4j Recipe Visualization with Popoto.js
// Configuration and initialization

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        // Neo4j Connection - Replace with your actual credentials
        neo4j: {
            uri: "neo4j+s://12292818.databases.neo4j.io", // Replace with your Neo4j URI
            username: "neo4j", // Replace with your username
            password: "JVTCYO3RSfmRjqx3U_sKHL4yKRTp5YfGdBPmNFLPtPk", // Replace with your password
            // Connection optimization
            connectionTimeout: 30000, // 30 seconds
            maxConnectionPoolSize: 10,
            connectionAcquisitionTimeout: 60000
        },
        
        // UI Configuration
        ui: {
            resultsPageSize: 10, // Reduced for better performance
            enableFullscreen: true,
            showLoadingModal: true,
            enableDebugMode: false // Disable debug for production
        }
    };

    // Initialize Neo4j driver
    let driver;
    
    // Initialize the application with performance optimization
    function initializeApp() {
        console.time("Database Connection"); // Performance tracking
        showLoadingModal();
        
        // Create Neo4j driver with optimized settings
        driver = neo4j.driver(
            CONFIG.neo4j.uri,
            neo4j.auth.basic(CONFIG.neo4j.username, CONFIG.neo4j.password),
            {
                connectionTimeout: CONFIG.neo4j.connectionTimeout,
                maxConnectionPoolSize: CONFIG.neo4j.maxConnectionPoolSize,
                connectionAcquisitionTimeout: CONFIG.neo4j.connectionAcquisitionTimeout,
                disableLosslessIntegers: true // Performance optimization
            }
        );

        // Set driver for Popoto
        popoto.runner.DRIVER = driver;

        // Configure Popoto providers
        configureProviders();
        
        // Configure UI settings
        configureUI();
        
        // Setup event listeners
        setupEventListeners();
        
        // Initialize responsive behavior
        initializeResponsive();
        
        // Start the application with timeout
        startVisualizationWithTimeout();
    }

    // Configure node providers with performance optimization and taxonomy
    function configureProviders() {
        popoto.provider.node.Provider = {
            "Recipe": {
                "returnAttributes": ["nama", "waktu_masak", "tingkat_kesulitan", "kalori"],
                "constraintAttribute": "nama",
                "children": ["Chef", "Country", "Category"], // Taxonomy relationships
                // Optimize display function
                "displayResults": function(pResultElmt) {
                    // Use more efficient DOM manipulation
                    const fragment = document.createDocumentFragment();
                    
                    pResultElmt.each(function(result) {
                        const cardDiv = document.createElement('div');
                        cardDiv.className = 'recipe-card';
                        
                        // Recipe title
                        const titleH4 = document.createElement('h4');
                        titleH4.className = 'recipe-title';
                        titleH4.textContent = result.attributes.nama || "Unknown Recipe";
                        cardDiv.appendChild(titleH4);
                        
                        // Recipe details
                        const detailsDiv = document.createElement('div');
                        detailsDiv.className = 'recipe-details';
                        
                        if (result.attributes.waktu_masak) {
                            const timeSpan = document.createElement('span');
                            timeSpan.className = 'recipe-time';
                            timeSpan.innerHTML = `⏱️ ${result.attributes.waktu_masak} min`;
                            detailsDiv.appendChild(timeSpan);
                        }
                        
                        if (result.attributes.tingkat_kesulitan) {
                            const difficultySpan = document.createElement('span');
                            difficultySpan.className = 'recipe-difficulty';
                            difficultySpan.innerHTML = `📊 ${result.attributes.tingkat_kesulitan}`;
                            detailsDiv.appendChild(difficultySpan);
                        }
                        
                        if (result.attributes.kalori) {
                            const caloriesSpan = document.createElement('span');
                            caloriesSpan.className = 'recipe-calories';
                            caloriesSpan.innerHTML = `🔥 ${result.attributes.kalori} cal`;
                            detailsDiv.appendChild(caloriesSpan);
                        }
                        
                        cardDiv.appendChild(detailsDiv);
                        this.appendChild(cardDiv);
                    });
                }
            },
            
            "Chef": {
                "returnAttributes": ["nama", "kebangsaan", "tahun_lahir"],
                "constraintAttribute": "nama",
                "parent": "Recipe", // Taxonomy parent relationship
                "displayResults": function(pResultElmt) {
                    pResultElmt.each(function(result) {
                        const cardDiv = document.createElement('div');
                        cardDiv.className = 'chef-card';
                        
                        // Chef name with icon
                        const nameH4 = document.createElement('h4');
                        nameH4.className = 'chef-name';
                        nameH4.innerHTML = `👨‍🍳 ${result.attributes.nama || "Unknown Chef"}`;
                        cardDiv.appendChild(nameH4);
                        
                        // Chef details container
                        const detailsDiv = document.createElement('div');
                        detailsDiv.className = 'chef-details';
                        
                        // Nationality
                        if (result.attributes.kebangsaan) {
                            const nationalitySpan = document.createElement('span');
                            nationalitySpan.className = 'chef-nationality';
                            nationalitySpan.innerHTML = `🌍 ${result.attributes.kebangsaan}`;
                            detailsDiv.appendChild(nationalitySpan);
                        }
                        
                        // Age calculation and display
                        if (result.attributes.tahun_lahir) {
                            const currentYear = new Date().getFullYear();
                            const birthYear = typeof result.attributes.tahun_lahir === 'object' && result.attributes.tahun_lahir.toInt ? 
                                             result.attributes.tahun_lahir.toInt() : 
                                             parseInt(result.attributes.tahun_lahir);
                            const age = currentYear - birthYear;
                            
                            const ageSpan = document.createElement('span');
                            ageSpan.className = 'chef-age';
                            ageSpan.innerHTML = `� ${age} years old`;
                            detailsDiv.appendChild(ageSpan);
                            
                            // Experience calculation (assuming started cooking at 18)
                            const experience = Math.max(0, age - 18);
                            if (experience > 0) {
                                const expSpan = document.createElement('span');
                                expSpan.className = 'chef-experience';
                                expSpan.innerHTML = `⭐ ${experience}+ years exp`;
                                detailsDiv.appendChild(expSpan);
                            }
                        }
                        
                        // Add specialty placeholder (could be enhanced with actual data)
                        const specialtySpan = document.createElement('span');
                        specialtySpan.className = 'chef-specialty';
                        specialtySpan.innerHTML = `🍽️ Professional Chef`;
                        detailsDiv.appendChild(specialtySpan);
                        
                        cardDiv.appendChild(detailsDiv);
                        
                        // Add click interaction
                        cardDiv.addEventListener('click', function() {
                            console.log('Chef selected:', result.attributes.nama);
                            // Could add more interaction here
                        });
                        
                        this.appendChild(cardDiv);
                    });
                }
            },
            
            "Country": {
                "returnAttributes": ["nama"],
                "constraintAttribute": "nama",
                "parent": "Recipe", // Taxonomy parent relationship
                "displayResults": function(pResultElmt) {
                    pResultElmt.each(function(result) {
                        const cardDiv = document.createElement('div');
                        cardDiv.className = 'country-card';
                        
                        const nameH4 = document.createElement('h4');
                        nameH4.className = 'country-name';
                        nameH4.innerHTML = `🌍 ${result.attributes.nama || "Unknown Country"}`;
                        cardDiv.appendChild(nameH4);
                        
                        this.appendChild(cardDiv);
                    });
                }
            },
            
            "Category": {
                "returnAttributes": ["nama"],
                "constraintAttribute": "nama",
                "parent": "Recipe", // Taxonomy parent relationship
                "displayResults": function(pResultElmt) {
                    pResultElmt.each(function(result) {
                        const cardDiv = document.createElement('div');
                        cardDiv.className = 'category-card';
                        
                        const nameH4 = document.createElement('h4');
                        nameH4.className = 'category-name';
                        nameH4.innerHTML = `🏷️ ${result.attributes.nama || "Unknown Category"}`;
                        cardDiv.appendChild(nameH4);
                        
                        this.appendChild(cardDiv);
                    });
                }
            }
        };
    }

    // Configure UI settings with performance optimization
    function configureUI() {
        // Set results page size for better performance
        popoto.result.RESULTS_PAGE_SIZE = CONFIG.ui.resultsPageSize;
        
        // Add result count listener with throttling
        let countUpdateTimeout;
        popoto.result.onTotalResultCount(function(count) {
            clearTimeout(countUpdateTimeout);
            countUpdateTimeout = setTimeout(() => {
                const resultCountElement = d3.select("#result-count");
                resultCountElement.text(`(${count})`);
                
                // Show empty state if no results
                if (count === 0) {
                    showEmptyResults();
                } else {
                    updateResultsLayout();
                }
            }, 100); // Throttle updates
        });
        
        // Optimize graph appearance for performance
        if (popoto.graph && popoto.graph.node) {
            popoto.graph.node.RADIUS = 30; // Smaller radius for better performance
            popoto.graph.node.STROKE_WIDTH = 2;
            popoto.graph.node.FORCE_CHARGE = -800; // Optimize force simulation
        }
        
        // Optimize graph layout for side panel
        if (popoto.graph && popoto.graph.link) {
            popoto.graph.link.DISTANCE = 100; // Reduced distance for better performance
        }
        
        // Disable animations on mobile for better performance
        if (window.innerWidth <= 768) {
            if (popoto.graph) {
                popoto.graph.TRANSITION_DURATION = 0;
            }
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        // Fullscreen button
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', toggleFullscreen);
        }
        
        // Reset button
        const resetBtn = document.getElementById('reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', resetVisualization);
        }
        
        // Retry button
        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', retryConnection);
        }
        
        // Taxonomy toggle for mobile (will be added later)
        setupTaxonomyToggle();
    }
    
    // Setup taxonomy toggle functionality
    function setupTaxonomyToggle() {
        // Create taxonomy toggle button for mobile
        const taxonomyNav = document.getElementById('popoto-taxonomy');
        if (taxonomyNav) {
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'taxonomy-toggle';
            toggleBtn.className = 'taxonomy-toggle';
            toggleBtn.innerHTML = '📋 Show Categories';
            toggleBtn.style.display = 'none'; // Hidden by default, shown in mobile CSS
            
            // Insert before taxonomy nav
            taxonomyNav.parentNode.insertBefore(toggleBtn, taxonomyNav);
            
            // Toggle functionality
            toggleBtn.addEventListener('click', function() {
                const isVisible = taxonomyNav.style.display !== 'none';
                taxonomyNav.style.display = isVisible ? 'none' : 'block';
                toggleBtn.innerHTML = isVisible ? '📋 Show Categories' : '❌ Hide Categories';
            });
        }
    }

    // Start the visualization with timeout and retry logic
    function startVisualizationWithTimeout() {
        const connectionPromise = driver.verifyConnectivity();
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Connection timeout after 30 seconds")), 30000);
        });

        Promise.race([connectionPromise, timeoutPromise])
            .then(function() {
                console.timeEnd("Database Connection");
                hideLoadingModal();
                console.log("✅ Connected to Neo4j database");
                
                // Start Popoto with optimized settings
                configurePopotoPerformance();
                
                // Configure and start taxonomy
                configureTaxonomy();
                popoto.start("Recipe");
                
                // Add success notification
                showNotification("Successfully connected to Neo4j database! 🎉", "success");
            })
            .catch(function(error) {
                console.timeEnd("Database Connection");
                hideLoadingModal();
                console.error("❌ Neo4j connection error:", error);
                
                // Show retry option for timeout errors
                if (error.message.includes("timeout")) {
                    showRetryModal("Connection timed out. Would you like to retry?");
                } else {
                    showErrorModal(error.message || "Unable to connect to Neo4j database");
                }
            });
    }

    // Configure Popoto for better performance
    function configurePopotoPerformance() {
        // Optimize query execution
        if (popoto.query) {
            popoto.query.COLLECT_RELATIONS_THRESHOLD = 100;
            popoto.query.MAX_RESULTS_COUNT = CONFIG.ui.resultsPageSize * 2;
        }
        
        // Optimize graph rendering
        if (popoto.graph) {
            popoto.graph.DISABLE_RELATION_ON_LOAD = true;
            popoto.graph.ENABLE_GRAPH_OPTIMIZATION = true;
        }
    }

    // Configure taxonomy for the Recipe database
    function configureTaxonomy() {
        // Check if popoto.taxonomy exists and configure
        if (typeof popoto.taxonomy !== 'undefined') {
            // Enable taxonomy navigation
            popoto.taxonomy.ENABLE = true;
            
            // Set taxonomy container
            popoto.taxonomy.CONTAINER_ID = "#popoto-taxonomy";
            
            // Configure taxonomy display properties
            popoto.taxonomy.TAXONOMY_DISPLAY_LABEL = function(node) {
                const icons = {
                    'Recipe': '🍳',
                    'Chef': '👨‍🍳',
                    'Country': '🌍',
                    'Category': '🏷️'
                };
                
                const icon = icons[node.label] || '📝';
                return `${icon} ${node.label}`;
            };
            
            // Configure taxonomy behavior
            popoto.taxonomy.NODE_DISPLAY_COUNT = true;
            popoto.taxonomy.ENABLE_NAVIGATION = true;
            
            // Custom taxonomy styling
            popoto.taxonomy.CSS_CLASS = "recipe-taxonomy";
        }
        
        // Alternative approach: Configure taxonomy through graph settings
        if (typeof popoto.graph !== 'undefined') {
            popoto.graph.node.TAXONOMY_CONTAINER_ID = "#popoto-taxonomy";
            popoto.graph.node.ENABLE_TAXONOMY = true;
        }
        
        console.log("✅ Taxonomy configured for Recipe database");
    }

    // Enhanced UI Helper Functions with performance tracking
    function showLoadingModal() {
        const modal = document.getElementById('loading-modal');
        if (modal) {
            modal.style.display = 'block';
            
            // Add connection status updates
            updateLoadingStatus("Connecting to database...");
            
            // Start connection timeout indicator
            let loadingDots = 0;
            const loadingInterval = setInterval(() => {
                loadingDots = (loadingDots + 1) % 4;
                const dots = '.'.repeat(loadingDots);
                updateLoadingStatus(`Connecting to database${dots}`);
                
                // Stop after successful connection or error
                if (modal.style.display === 'none') {
                    clearInterval(loadingInterval);
                }
            }, 500);
            
            // Store interval ID for cleanup
            modal.dataset.loadingInterval = loadingInterval;
        }
    }

    function hideLoadingModal() {
        const modal = document.getElementById('loading-modal');
        if (modal) {
            modal.style.display = 'none';
            
            // Clear loading interval
            const intervalId = modal.dataset.loadingInterval;
            if (intervalId) {
                clearInterval(parseInt(intervalId));
                delete modal.dataset.loadingInterval;
            }
        }
    }

    function updateLoadingStatus(message) {
        const modal = document.getElementById('loading-modal');
        if (modal) {
            const statusElement = modal.querySelector('p');
            if (statusElement) {
                statusElement.textContent = message;
            }
        }
    }

    function showErrorModal(message) {
        const modal = document.getElementById('error-modal');
        const messageElement = document.getElementById('error-message');
        
        if (modal && messageElement) {
            messageElement.textContent = message;
            modal.style.display = 'block';
        }
    }

    function hideErrorModal() {
        const modal = document.getElementById('error-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    // Enhanced UI functions for side layout
    function showResultsLoading() {
        const resultsContainer = document.getElementById('popoto-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = '<div class="results-loading">Loading results...</div>';
        }
    }

    function showEmptyResults() {
        const resultsContainer = document.getElementById('popoto-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = '<div class="results-empty">No results found. Try expanding your search.</div>';
        }
    }

    function updateResultsLayout() {
        const resultsContainer = document.getElementById('popoto-results');
        if (resultsContainer) {
            // Add scroll behavior for better UX
            resultsContainer.scrollTop = 0;
        }
    }

    // Enhanced fullscreen function for side layout
    function toggleFullscreen() {
        const graphElement = document.getElementById('popoto-graph');
        
        if (!document.fullscreenElement) {
            // In fullscreen, hide the right panel temporarily
            const rightPanel = document.querySelector('.right-panel');
            if (rightPanel) {
                rightPanel.style.display = 'none';
            }
            
            graphElement.requestFullscreen().then(() => {
                // Adjust graph size for fullscreen
                if (popoto && popoto.graph) {
                    popoto.graph.notifyResize();
                }
            }).catch(err => {
                console.error('Error attempting to enable fullscreen:', err);
                // Restore right panel if fullscreen fails
                if (rightPanel) {
                    rightPanel.style.display = 'block';
                }
            });
        } else {
            document.exitFullscreen().then(() => {
                // Restore right panel when exiting fullscreen
                const rightPanel = document.querySelector('.right-panel');
                if (rightPanel) {
                    rightPanel.style.display = 'block';
                }
                
                // Notify graph to resize back to normal
                setTimeout(() => {
                    if (popoto && popoto.graph) {
                        popoto.graph.notifyResize();
                    }
                }, 100);
            });
        }
    }

    // Listen for fullscreen changes to handle panel visibility
    document.addEventListener('fullscreenchange', function() {
        const rightPanel = document.querySelector('.right-panel');
        if (!document.fullscreenElement && rightPanel) {
            rightPanel.style.display = 'block';
            // Trigger graph resize after a short delay
            setTimeout(() => {
                if (popoto && popoto.graph) {
                    popoto.graph.notifyResize();
                }
            }, 100);
        }
    });

    // Optimized window resize handler for responsive layout
    function handleWindowResize() {
        // Use more aggressive debouncing for better performance
        window.addEventListener('resize', function() {
            clearTimeout(window.resizeTimeout);
            window.resizeTimeout = setTimeout(() => {
                // Only resize if graph is actually visible
                const graphElement = document.getElementById('popoto-graph');
                if (graphElement && graphElement.offsetParent !== null) {
                    // Notify Popoto graph to resize
                    if (popoto && popoto.graph && popoto.graph.notifyResize) {
                        popoto.graph.notifyResize();
                    }
                }
                
                // Adjust layout for mobile with performance check
                const currentWidth = window.innerWidth;
                const isMobile = currentWidth <= 768;
                const graphResultsLayout = document.querySelector('.graph-results-layout');
                
                if (graphResultsLayout) {
                    // Only update class if it actually changed
                    const hasMobileClass = graphResultsLayout.classList.contains('mobile-layout');
                    if (isMobile && !hasMobileClass) {
                        graphResultsLayout.classList.add('mobile-layout');
                        console.log('📱 Switched to mobile layout');
                    } else if (!isMobile && hasMobileClass) {
                        graphResultsLayout.classList.remove('mobile-layout');
                        console.log('�️ Switched to desktop layout');
                    }
                }
            }, 500); // Increased debounce time for better performance
        });
    }

    // Initialize responsive behavior
    function initializeResponsive() {
        // Set initial mobile class if needed
        const isMobile = window.innerWidth <= 768;
        const graphResultsLayout = document.querySelector('.graph-results-layout');
        
        if (graphResultsLayout && isMobile) {
            graphResultsLayout.classList.add('mobile-layout');
        }
        
        // Setup resize handler
        handleWindowResize();
        
        console.log('📱 Responsive behavior initialized');
    }

    // Initialize when page loads (single initialization)
    document.addEventListener('DOMContentLoaded', function() {
        console.log("🚀 Initializing Neo4j Recipe Visualization...");
        
        // Performance optimization: defer heavy operations
        requestAnimationFrame(() => {
            initializeApp();
        });
    });

    // Handle page unload with proper cleanup
    window.addEventListener('beforeunload', function() {
        console.log("🧹 Cleaning up resources...");
        if (driver) {
            driver.close();
        }
        
        // Clear any pending timeouts
        if (window.resizeTimeout) {
            clearTimeout(window.resizeTimeout);
        }
    });

    function showRetryModal(message) {
        const modal = document.getElementById('error-modal');
        const messageElement = document.getElementById('error-message');
        
        if (modal && messageElement) {
            messageElement.textContent = message;
            modal.style.display = 'block';
            
            // Add retry button functionality
            const retryBtn = document.getElementById('retry-btn');
            if (retryBtn) {
                retryBtn.onclick = function() {
                    hideErrorModal();
                    console.log("🔄 Retrying database connection...");
                    showLoadingModal();
                    setTimeout(() => {
                        startVisualizationWithTimeout();
                    }, 1000); // Small delay before retry
                };
            }
        }
    }

    function resetVisualization() {
        if (confirm('Are you sure you want to reset the visualization?')) {
            // Clear current graph with performance tracking
            console.time("Reset Visualization");
            
            if (popoto && popoto.graph) {
                popoto.graph.hasGraphChanged = true;
            }
            
            // Clear results
            const resultsContainer = document.getElementById('popoto-results');
            if (resultsContainer) {
                resultsContainer.innerHTML = '';
            }
            
            // Restart with Recipe as root
            popoto.start("Recipe");
            
            console.timeEnd("Reset Visualization");
            showNotification("Visualization reset! 🔄", "info");
        }
    }

    function retryConnection() {
        hideErrorModal();
        console.log("🔄 Retrying database connection...");
        
        // Close existing driver if any
        if (driver) {
            driver.close();
        }
        
        // Reinitialize
        setTimeout(() => {
            initializeApp();
        }, 500);
    }

})();