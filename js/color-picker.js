// Color Picker Tool for Tooluxe
document.addEventListener('DOMContentLoaded', function() {
    const colorPicker = document.getElementById('color-picker');
    const colorValue = document.getElementById('color-value');
    const colorPreview = document.getElementById('color-preview');
    const rgbValue = document.getElementById('rgb-value');
    const hslValue = document.getElementById('hsl-value');
    const copyHexBtn = document.getElementById('copy-hex');
    const copyRgbBtn = document.getElementById('copy-rgb');
    const copyHslBtn = document.getElementById('copy-hsl');
    const savedColors = document.getElementById('saved-colors');
    const saveColorBtn = document.getElementById('save-color');
    
    // Initialize with a default color
    let currentColor = '#4a6fa5';
    colorPicker.value = currentColor;
    updateColorDisplay(currentColor);
    
    // Event listener for color picker
    colorPicker.addEventListener('input', function() {
        currentColor = this.value;
        updateColorDisplay(currentColor);
    });
    
    // Update all color displays
    function updateColorDisplay(color) {
        // Update hex display
        colorValue.textContent = color.toUpperCase();
        
        // Update color preview
        colorPreview.style.backgroundColor = color;
        
        // Convert to RGB
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        rgbValue.textContent = `rgb(${r}, ${g}, ${b})`;
        
        // Convert to HSL
        const hsl = rgbToHsl(r, g, b);
        hslValue.textContent = `hsl(${Math.round(hsl.h)}°, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
    }
    
    // RGB to HSL conversion
    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            
            h /= 6;
        }
        
        return {
            h: h * 360,
            s: s * 100,
            l: l * 100
        };
    }
    
    // Copy buttons functionality
    copyHexBtn.addEventListener('click', function() {
        copyToClipboard(colorValue.textContent);
        showCopiedMessage(this);
    });
    
    copyRgbBtn.addEventListener('click', function() {
        copyToClipboard(rgbValue.textContent);
        showCopiedMessage(this);
    });
    
    copyHslBtn.addEventListener('click', function() {
        copyToClipboard(hslValue.textContent);
        showCopiedMessage(this);
    });
    
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    }
    
    function showCopiedMessage(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 1500);
    }
    
    // Save color functionality
    saveColorBtn.addEventListener('click', function() {
        saveColor(currentColor);
    });
    
    function saveColor(color) {
        // Create color swatch element
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = color;
        swatch.setAttribute('data-color', color);
        swatch.title = color.toUpperCase();
        
        // Add click event to select this color
        swatch.addEventListener('click', function() {
            const selectedColor = this.getAttribute('data-color');
            colorPicker.value = selectedColor;
            updateColorDisplay(selectedColor);
        });
        
        // Add right-click event to remove this color
        swatch.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            this.remove();
        });
        
        // Add to saved colors
        savedColors.appendChild(swatch);
    }
    
    // Add some predefined colors
    const predefinedColors = ['#ff7e5f', '#4a6fa5', '#28a745', '#ffc107', '#dc3545', '#17a2b8'];
    predefinedColors.forEach(color => saveColor(color));
});
