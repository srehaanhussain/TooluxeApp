// Organization Schema
const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Tooluxe",
    "url": "https://tooluxe.netlify.app",
    "logo": "https://tooluxe.netlify.app/assets/logo.jpg",
    "sameAs": [
        "https://www.instagram.com/tooluxeapp/"
    ],
    "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "",
        "contactType": "customer service",
        "email": "toouxeapp@gmail.com"
    }
};

// WebApplication Schema
const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Tooluxe",
    "url": "https://tooluxe.netlify.app",
    "description": "Free online tools for everyday tasks including QR scanner, password generator, text-to-speech, text analyzer, and unit converter.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web Browser",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
    },
    "author": {
        "@type": "Person",
        "name": "Rehaan Hussain. S"
    }
};

// Individual Tool Schemas
const toolSchemas = {
    "qr-scanner": {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "QR Code Scanner",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web Browser",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": "Scan QR codes using your device's camera. Quickly access websites, contact information, and more."
    },
    "password-generator": {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Password Generator",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web Browser",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": "Create strong, secure passwords with customizable options for length and character types."
    },
    "text-to-speech": {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Text to Speech",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web Browser",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": "Convert text to spoken words with adjustable voice options, speed, and pitch controls."
    },
    "text-analyzer": {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Text Analyzer",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web Browser",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": "Analyze text for word count, character count, reading time, and other useful metrics."
    },
    "unit-converter": {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Unit Converter",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web Browser",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": "Convert between different units of measurement including length, weight, temperature, and more."
    },
    "weather-forecast": {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Weather Forecast",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web Browser",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": "Get real-time weather information for any location with temperature, humidity, and wind details."
    },
    "url-shortener": {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "URL Shortener",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web Browser",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": "Create short, shareable links from long URLs. Perfect for social media, emails, and messaging."
    },
    "color-picker": {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Color Picker",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Web Browser",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": "Select, preview, and convert colors between HEX, RGB, and HSL formats. Save your favorite colors."
    }
};

// Function to inject schema markup
function injectSchema(schema) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
}

// Function to inject all schemas for a specific page
function injectPageSchemas(pageName) {
    // Always inject organization and web application schemas
    injectSchema(organizationSchema);
    injectSchema(webApplicationSchema);
    
    // If it's a tool page, inject the specific tool schema
    if (toolSchemas[pageName]) {
        injectSchema(toolSchemas[pageName]);
    }
}

// Export the function for use in other files
window.injectPageSchemas = injectPageSchemas; 