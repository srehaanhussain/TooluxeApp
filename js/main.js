/**
 * Main JavaScript file for App Cluster
 * Contains common functionality used across all tool pages
 */

// DOM Ready function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initNavigation();
    
    // Initialize footer year
    updateFooterYear();
    
    // Initialize theme toggle if present
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        initThemeToggle(themeToggle);
    }
    
    // Initialize tool-specific functionality if on a tool page
    initToolFunctionality();
});

/**
 * Initialize responsive navigation
 */
function initNavigation() {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    const toggleIcon = navbarToggle.querySelector('i');
    
    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
            // Toggle between hamburger and cross icons
            if (navbarMenu.classList.contains('active')) {
                toggleIcon.classList.remove('fa-bars');
                toggleIcon.classList.add('fa-times');
            } else {
                toggleIcon.classList.remove('fa-times');
                toggleIcon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInside = navbarToggle.contains(event.target) || navbarMenu.contains(event.target);
            
            if (!isClickInside && navbarMenu.classList.contains('active')) {
                navbarMenu.classList.remove('active');
                // Reset to hamburger icon when closing from outside
                toggleIcon.classList.remove('fa-times');
                toggleIcon.classList.add('fa-bars');
            }
        });
        
        // Set active nav item based on current page
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.navbar-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href').split('/').pop();
            if (href === currentPage) {
                link.classList.add('active');
            }
        });
    }
}

/**
 * Update footer year to current year
 */
function updateFooterYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Initialize theme toggle functionality
 * @param {HTMLElement} themeToggle - The theme toggle button element
 */
function initThemeToggle(themeToggle) {
    // Check for saved theme preference or use default
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(`theme-${currentTheme}`);
    
    // Update button text/icon
    updateThemeToggle(themeToggle, currentTheme);
    
    // Add click event
    themeToggle.addEventListener('click', function() {
        const newTheme = document.body.classList.contains('theme-light') ? 'dark' : 'light';
        
        // Update body class
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(`theme-${newTheme}`);
        
        // Save preference
        localStorage.setItem('theme', newTheme);
        
        // Update button text/icon
        updateThemeToggle(themeToggle, newTheme);
    });
}

/**
 * Update theme toggle button text/icon based on current theme
 * @param {HTMLElement} themeToggle - The theme toggle button element
 * @param {string} theme - The current theme ('light' or 'dark')
 */
function updateThemeToggle(themeToggle, theme) {
    if (theme === 'light') {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.setAttribute('title', 'Switch to Dark Mode');
    } else {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggle.setAttribute('title', 'Switch to Light Mode');
    }
}

/**
 * Initialize tool-specific functionality based on current page
 */
function initToolFunctionality() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'qr-scanner.html':
            // QR scanner initialization will be handled in its own JS file
            break;
        case 'password-generator.html':
            // Password generator initialization will be handled in its own JS file
            break;
        case 'text-to-speech.html':
            // Text to speech initialization will be handled in its own JS file
            break;
        case 'text-analyzer.html':
            // Text analyzer initialization will be handled in its own JS file
            break;
        case 'unit-converter.html':
            // Unit converter initialization will be handled in its own JS file
            break;
        default:
            // Home page or other pages
            initHomePage();
            break;
    }
}

/**
 * Initialize home page specific functionality
 */
function initHomePage() {
    // Add any home page specific initialization here
    const toolCards = document.querySelectorAll('.tool-card');
    
    if (toolCards.length > 0) {
        toolCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.classList.add('card-hover');
            });
            
            card.addEventListener('mouseleave', function() {
                this.classList.remove('card-hover');
            });
        });
    }
}

/**
 * Show notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of notification ('success', 'error', 'warning', 'info')
 * @param {number} duration - Duration in milliseconds to show the notification
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set notification content and type
    notification.textContent = message;
    notification.className = `notification notification-${type}`;
    
    // Show notification
    notification.classList.add('show');
    
    // Hide after duration
    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

/**
 * Copy text to clipboard
 * @param {string} text - The text to copy
 * @returns {Promise<boolean>} - Whether the copy was successful
 */
function copyToClipboard(text) {
    return new Promise((resolve, reject) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    showNotification('Copied to clipboard!', 'success');
                    resolve(true);
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    showNotification('Failed to copy to clipboard', 'error');
                    resolve(false);
                });
        } else {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';  // Prevent scrolling to bottom
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    showNotification('Copied to clipboard!', 'success');
                    resolve(true);
                } else {
                    showNotification('Failed to copy to clipboard', 'error');
                    resolve(false);
                }
            } catch (err) {
                console.error('Failed to copy: ', err);
                showNotification('Failed to copy to clipboard', 'error');
                resolve(false);
            }
            
            document.body.removeChild(textarea);
        }
    });
}

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce wait time in milliseconds
 * @returns {Function} - The debounced function
 */
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

/**
 * Format a number with commas as thousands separators
 * @param {number} number - The number to format
 * @returns {string} - The formatted number
 */
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Validate email address format
 * @param {string} email - The email address to validate
 * @returns {boolean} - Whether the email is valid
 */
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Get a random integer between min and max (inclusive)
 * @param {number} min - The minimum value
 * @param {number} max - The maximum value
 * @returns {number} - A random integer
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
