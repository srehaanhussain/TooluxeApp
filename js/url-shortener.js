// URL Shortener Tool for Tooluxe
document.addEventListener('DOMContentLoaded', function() {
    const urlForm = document.getElementById('url-shortener-form');
    const longUrlInput = document.getElementById('long-url-input');
    const shortenButton = document.getElementById('shorten-button');
    const resultContainer = document.getElementById('shortener-result');
    const shortUrlDisplay = document.getElementById('short-url');
    const copyButton = document.getElementById('copy-short-url');
    const errorMessage = document.getElementById('shortener-error');
    const loadingIndicator = document.getElementById('shortener-loading');
    
    // Using TinyURL API for URL shortening
    urlForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const longUrl = longUrlInput.value.trim();
        
        if (longUrl === '') {
            showError('Please enter a URL to shorten');
            return;
        }
        
        if (!isValidUrl(longUrl)) {
            showError('Please enter a valid URL (include http:// or https://)');
            return;
        }
        
        shortenUrl(longUrl);
    });
    
    function shortenUrl(longUrl) {
        // Show loading indicator
        loadingIndicator.style.display = 'block';
        resultContainer.style.display = 'none';
        errorMessage.style.display = 'none';
        
        // Using TinyURL API
        fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to shorten URL');
                }
                return response.text();
            })
            .then(shortUrl => {
                displayShortUrl(shortUrl);
                loadingIndicator.style.display = 'none';
            })
            .catch(error => {
                loadingIndicator.style.display = 'none';
                showError(error.message);
            });
    }
    
    function displayShortUrl(shortUrl) {
        shortUrlDisplay.textContent = shortUrl;
        shortUrlDisplay.href = shortUrl;
        resultContainer.style.display = 'block';
    }
    
    copyButton.addEventListener('click', function() {
        const shortUrl = shortUrlDisplay.textContent;
        navigator.clipboard.writeText(shortUrl)
            .then(() => {
                copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
                }, 2000);
            })
            .catch(err => {
                showError('Failed to copy URL');
            });
    });
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
    
    function isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }
});
