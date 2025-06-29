/**
 * Password Generator JavaScript
 * Handles password generation with customizable options
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const passwordDisplay = document.getElementById('password-display');
    const copyPasswordBtn = document.getElementById('copy-password');
    const generateBtn = document.getElementById('generate-btn');
    const passwordLengthSlider = document.getElementById('password-length');
    const passwordLengthValue = document.getElementById('length-value');
    const includeUppercase = document.getElementById('include-uppercase');
    const includeLowercase = document.getElementById('include-lowercase');
    const includeNumbers = document.getElementById('include-numbers');
    const includeSymbols = document.getElementById('include-symbols');
    const excludeSimilar = document.getElementById('exclude-similar');
    const excludeAmbiguous = document.getElementById('exclude-ambiguous');
    const strengthMeterFill = document.getElementById('strength-meter-fill');
    const strengthText = document.getElementById('strength-text');
    
    // Character sets
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const similarChars = 'iIlL1oO0';
    const ambiguousChars = '{}[]()/\\\'"`~,;:.<>';
    
    // Initialize
    function init() {
        // Update length value display when slider changes
        passwordLengthSlider.addEventListener('input', function() {
            passwordLengthValue.textContent = this.value;
        });
        
        // Generate button click event
        generateBtn.addEventListener('click', generatePassword);
        
        // Copy button click event
        copyPasswordBtn.addEventListener('click', function() {
            if (passwordDisplay.textContent !== 'Click generate to create a password') {
                copyToClipboard(passwordDisplay.textContent);
            }
        });
        
        // Generate initial password
        generatePassword();
    }
    
    // Generate password based on selected options
    function generatePassword() {
        // Check if at least one character type is selected
        if (!includeUppercase.checked && !includeLowercase.checked && 
            !includeNumbers.checked && !includeSymbols.checked) {
            showNotification('Please select at least one character type', 'warning');
            return;
        }
        
        const length = parseInt(passwordLengthSlider.value);
        let charset = '';
        let excludeChars = '';
        
        // Build character set based on selected options
        if (includeUppercase.checked) charset += uppercaseChars;
        if (includeLowercase.checked) charset += lowercaseChars;
        if (includeNumbers.checked) charset += numberChars;
        if (includeSymbols.checked) charset += symbolChars;
        
        // Build exclude character set
        if (excludeSimilar.checked) excludeChars += similarChars;
        if (excludeAmbiguous.checked) excludeChars += ambiguousChars;
        
        // Remove excluded characters from charset
        if (excludeChars.length > 0) {
            for (let i = 0; i < excludeChars.length; i++) {
                charset = charset.replace(excludeChars[i], '');
            }
        }
        
        // Check if we have any characters left
        if (charset.length === 0) {
            showNotification('No characters available with current settings', 'error');
            return;
        }
        
        // Generate password
        let password = '';
        let hasRequiredChars = false;
        
        // Keep generating until we have a password with at least one of each required character type
        while (!hasRequiredChars) {
            password = '';
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * charset.length);
                password += charset[randomIndex];
            }
            
            // Check if password has at least one of each required character type
            hasRequiredChars = true;
            
            if (includeUppercase.checked && !/[A-Z]/.test(password)) {
                hasRequiredChars = false;
            }
            
            if (includeLowercase.checked && !/[a-z]/.test(password)) {
                hasRequiredChars = false;
            }
            
            if (includeNumbers.checked && !/[0-9]/.test(password)) {
                hasRequiredChars = false;
            }
            
            if (includeSymbols.checked && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
                hasRequiredChars = false;
            }
        }
        
        // Display password
        passwordDisplay.textContent = password;
        
        // Calculate and display password strength
        calculatePasswordStrength(password);
    }
    
    // Calculate password strength
    function calculatePasswordStrength(password) {
        let strength = 0;
        const length = password.length;
        
        // Length contribution (up to 40 points)
        strength += Math.min(40, length * 2);
        
        // Character variety contribution (up to 60 points)
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSymbols = /[^A-Za-z0-9]/.test(password);
        
        const varietyCount = [hasUppercase, hasLowercase, hasNumbers, hasSymbols].filter(Boolean).length;
        strength += varietyCount * 15;
        
        // Adjust for repeated characters and patterns
        const repeatedChars = (password.length - new Set(password.split('')).size);
        strength -= repeatedChars * 2;
        
        // Ensure strength is between 0 and 100
        strength = Math.max(0, Math.min(100, strength));
        
        // Update strength meter
        strengthMeterFill.style.width = `${strength}%`;
        
        // Set color based on strength
        if (strength < 40) {
            strengthMeterFill.style.backgroundColor = '#dc3545'; // Red
            strengthText.textContent = 'Weak';
        } else if (strength < 70) {
            strengthMeterFill.style.backgroundColor = '#ffc107'; // Yellow
            strengthText.textContent = 'Moderate';
        } else {
            strengthMeterFill.style.backgroundColor = '#28a745'; // Green
            strengthText.textContent = 'Strong';
        }
    }
    
    // Initialize the password generator
    init();
});
