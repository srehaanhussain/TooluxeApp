/**
 * Image Enhancer JavaScript
 * Handles image enhancement functionality using HTML5 Canvas
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const imageInput = document.getElementById('image-input');
    const uploadButton = document.getElementById('upload-button');
    const resetButton = document.getElementById('reset-button');
    const previewImage = document.getElementById('preview-image');
    const previewContainer = document.getElementById('preview-container');
    const enhancementControls = document.getElementById('enhancement-controls');
    const downloadButton = document.getElementById('download-button');

    // Image enhancement controls
    const brightnessSlider = document.getElementById('brightness');
    const contrastSlider = document.getElementById('contrast');
    const saturationSlider = document.getElementById('saturation');
    const blurSlider = document.getElementById('blur');
    const sharpnessSlider = document.getElementById('sharpness');
    const hdSlider = document.getElementById('hd-quality');

    // Manual input controls
    const brightnessInput = document.getElementById('brightness-input');
    const contrastInput = document.getElementById('contrast-input');
    const saturationInput = document.getElementById('saturation-input');
    const blurInput = document.getElementById('blur-input');
    const sharpnessInput = document.getElementById('sharpness-input');
    const hdInput = document.getElementById('hd-input');

    // Value displays
    const brightnessValue = document.getElementById('brightness-value');
    const contrastValue = document.getElementById('contrast-value');
    const saturationValue = document.getElementById('saturation-value');
    const blurValue = document.getElementById('blur-value');
    const sharpnessValue = document.getElementById('sharpness-value');
    const hdValue = document.getElementById('hd-value');

    // Canvas elements
    let originalCanvas = document.createElement('canvas');
    let originalCtx = originalCanvas.getContext('2d');
    let workingCanvas = document.createElement('canvas');
    let workingCtx = workingCanvas.getContext('2d');

    // Original image data
    let originalImageData = null;

    // HD Enhancement settings
    let HD_QUALITY = 2; // Default 2x upscaling
    const HD_SMOOTHING = true;
    const HD_SHARPENING = true;

    // Add max dimension constant at the top
    const maxDimension = 2000; // Maximum dimension for image processing

    // Initialize the tool
    function initImageEnhancer() {
        // Upload button click event
        uploadButton.addEventListener('click', () => {
            imageInput.click();
        });

        // Image input change event
        imageInput.addEventListener('change', handleImageUpload);

        // Reset button click event
        resetButton.addEventListener('click', resetImage);

        // Download button click event
        downloadButton.addEventListener('click', downloadImage);

        // Slider change events
        brightnessSlider.addEventListener('input', () => {
            brightnessInput.value = brightnessSlider.value;
            updateImage();
        });
        
        contrastSlider.addEventListener('input', () => {
            contrastInput.value = contrastSlider.value;
            updateImage();
        });
        
        saturationSlider.addEventListener('input', () => {
            saturationInput.value = saturationSlider.value;
            updateImage();
        });
        
        blurSlider.addEventListener('input', () => {
            blurInput.value = blurSlider.value;
            updateImage();
        });
        
        sharpnessSlider.addEventListener('input', () => {
            sharpnessInput.value = sharpnessSlider.value;
            updateImage();
        });
        
        hdSlider.addEventListener('input', debounce(() => {
            hdInput.value = hdSlider.value;
            updateHDQuality();
        }, 10));

        // Manual input events
        brightnessInput.addEventListener('change', () => {
            const value = Math.min(200, Math.max(0, parseInt(brightnessInput.value) || 0));
            brightnessInput.value = value;
            brightnessSlider.value = value;
            updateImage();
        });

        contrastInput.addEventListener('change', () => {
            const value = Math.min(200, Math.max(0, parseInt(contrastInput.value) || 0));
            contrastInput.value = value;
            contrastSlider.value = value;
            updateImage();
        });

        saturationInput.addEventListener('change', () => {
            const value = Math.min(200, Math.max(0, parseInt(saturationInput.value) || 0));
            saturationInput.value = value;
            saturationSlider.value = value;
            updateImage();
        });

        blurInput.addEventListener('change', () => {
            const value = Math.min(10, Math.max(0, parseFloat(blurInput.value) || 0));
            blurInput.value = value;
            blurSlider.value = value;
            updateImage();
        });

        sharpnessInput.addEventListener('change', () => {
            const value = Math.min(200, Math.max(0, parseInt(sharpnessInput.value) || 0));
            sharpnessInput.value = value;
            sharpnessSlider.value = value;
            updateImage();
        });

        hdInput.addEventListener('change', () => {
            const value = Math.min(4, Math.max(1, parseFloat(hdInput.value) || 1));
            hdInput.value = value;
            hdSlider.value = value;
            updateHDQuality();
        });

        // Update value displays
        brightnessSlider.addEventListener('input', () => {
            brightnessValue.textContent = `${brightnessSlider.value}%`;
        });
        contrastSlider.addEventListener('input', () => {
            contrastValue.textContent = `${contrastSlider.value}%`;
        });
        saturationSlider.addEventListener('input', () => {
            saturationValue.textContent = `${saturationSlider.value}%`;
        });
        blurSlider.addEventListener('input', () => {
            blurValue.textContent = `${blurSlider.value}px`;
        });
        sharpnessSlider.addEventListener('input', () => {
            sharpnessValue.textContent = `${sharpnessSlider.value}%`;
        });
    }

    // Optimize the debounce function
    function debounce(func, wait) {
        let timeout;
        let lastArgs;
        let lastThis;
        
        return function executedFunction(...args) {
            lastArgs = args;
            lastThis = this;
            
            const later = () => {
                clearTimeout(timeout);
                func.apply(lastThis, lastArgs);
            };
            
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Update HD quality
    function updateHDQuality() {
        if (!originalImageData) return;
        
        HD_QUALITY = parseFloat(hdSlider.value);
        applyHDEnhancement();
        updateImage();
    }

    // Optimize image upload handling
    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Check if file is an image
        if (!file.type.match('image.*')) {
            showNotification('Please select an image file', 'error');
            return;
        }

        // Check file size (max 20MB for original quality)
        if (file.size > 20 * 1024 * 1024) {
            showNotification('Image size should be less than 20MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                // Use original dimensions
                const width = img.width;
                const height = img.height;

                // Set canvas dimensions to match original image
                originalCanvas.width = width;
                originalCanvas.height = height;
                workingCanvas.width = width;
                workingCanvas.height = height;

                // Enable image smoothing for better quality
                originalCtx.imageSmoothingEnabled = true;
                originalCtx.imageSmoothingQuality = 'high';
                workingCtx.imageSmoothingEnabled = true;
                workingCtx.imageSmoothingQuality = 'high';

                // Draw image on original canvas at original size
                originalCtx.drawImage(img, 0, 0, width, height);
                originalImageData = originalCtx.getImageData(0, 0, width, height);

                // Apply HD enhancement
                applyHDEnhancement();

                // Display preview with original quality
                previewImage.src = workingCanvas.toDataURL('image/jpeg', 1.0);
                previewImage.style.display = 'block';

                // Show controls and reset button
                enhancementControls.style.display = 'block';
                resetButton.style.display = 'inline-block';

                // Reset sliders
                resetSliders();

                showNotification('Image uploaded successfully', 'success');
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Optimize HD enhancement
    function applyHDEnhancement() {
        if (!originalImageData) return;

        // Create HD canvas with original dimensions
        const hdCanvas = document.createElement('canvas');
        const hdCtx = hdCanvas.getContext('2d');
        
        // Use original dimensions
        const width = originalCanvas.width;
        const height = originalCanvas.height;
        
        hdCanvas.width = width;
        hdCanvas.height = height;

        // Enable HD smoothing with performance optimization
        hdCtx.imageSmoothingEnabled = HD_SMOOTHING;
        hdCtx.imageSmoothingQuality = 'high';

        // Draw original image at original size
        hdCtx.drawImage(originalCanvas, 0, 0, width, height);

        // Apply HD sharpening if enabled (optimized algorithm)
        if (HD_SHARPENING) {
            const imageData = hdCtx.getImageData(0, 0, width, height);
            const data = imageData.data;
            
            // Optimized sharpening algorithm
            for (let i = 0; i < data.length; i += 4) {
                if (i > 0 && i < data.length - 4) {
                    const prevPixel = data[i - 4];
                    const nextPixel = data[i + 4];
                    const diff = Math.abs(prevPixel - nextPixel);
                    
                    if (diff > 30) {
                        const factor = 1.1;
                        data[i] = Math.min(255, Math.max(0, data[i] * factor));
                        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * factor));
                        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * factor));
                    }
                }
            }
            
            hdCtx.putImageData(imageData, 0, 0);
        }

        // Update working canvas with original dimensions
        workingCanvas.width = width;
        workingCanvas.height = height;
        workingCtx.drawImage(hdCanvas, 0, 0);
        originalImageData = workingCtx.getImageData(0, 0, width, height);
    }

    // Reset image to original state
    function resetImage() {
        if (originalImageData) {
            workingCtx.putImageData(originalImageData, 0, 0);
            previewImage.src = workingCanvas.toDataURL('image/jpeg', 1.0); // Maximum quality
            resetSliders();
            showNotification('Image reset to original state', 'info');
        }
    }

    // Reset all sliders and inputs to default values
    function resetSliders() {
        // Reset sliders
        brightnessSlider.value = 100;
        contrastSlider.value = 100;
        saturationSlider.value = 100;
        blurSlider.value = 0;
        sharpnessSlider.value = 100;
        hdSlider.value = 2;

        // Reset inputs
        brightnessInput.value = 100;
        contrastInput.value = 100;
        saturationInput.value = 100;
        blurInput.value = 0;
        sharpnessInput.value = 100;
        hdInput.value = 2;
    }

    // Optimize image update function
    function updateImage() {
        if (!originalImageData) return;

        // Copy original image data to working canvas
        workingCtx.putImageData(originalImageData, 0, 0);
        let imageData = workingCtx.getImageData(0, 0, workingCanvas.width, workingCanvas.height);
        let data = imageData.data;

        // Optimize brightness adjustment
        const brightness = (brightnessSlider.value - 100) / 100;
        const brightnessFactor = 255 * brightness;

        // Optimize contrast adjustment
        const contrast = (contrastSlider.value - 100) / 100;
        const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));

        // Process all pixels in a single loop for better performance
        for (let i = 0; i < data.length; i += 4) {
            // Apply brightness
            data[i] = Math.min(255, Math.max(0, data[i] + brightnessFactor));
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + brightnessFactor));
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + brightnessFactor));

            // Apply contrast
            data[i] = Math.min(255, Math.max(0, contrastFactor * (data[i] - 128) + 128));
            data[i + 1] = Math.min(255, Math.max(0, contrastFactor * (data[i + 1] - 128) + 128));
            data[i + 2] = Math.min(255, Math.max(0, contrastFactor * (data[i + 2] - 128) + 128));

            // Apply saturation
            const gray = 0.2989 * data[i] + 0.5870 * data[i + 1] + 0.1140 * data[i + 2];
            const saturation = saturationSlider.value / 100;
            data[i] = Math.min(255, Math.max(0, gray + saturation * (data[i] - gray)));
            data[i + 1] = Math.min(255, Math.max(0, gray + saturation * (data[i + 1] - gray)));
            data[i + 2] = Math.min(255, Math.max(0, gray + saturation * (data[i + 2] - gray)));
        }

        // Apply blur with optimized quality
        if (blurSlider.value > 0) {
            const blurAmount = blurSlider.value;
            workingCtx.filter = `blur(${blurAmount}px)`;
            workingCtx.drawImage(workingCanvas, 0, 0);
            workingCtx.filter = 'none';
        }

        // Apply sharpness with optimized algorithm
        if (sharpnessSlider.value !== 100) {
            const sharpness = (sharpnessSlider.value - 100) / 100;
            const kernel = [
                -sharpness, -sharpness, -sharpness,
                -sharpness, 1 + 8 * sharpness, -sharpness,
                -sharpness, -sharpness, -sharpness
            ];
            workingCtx.filter = `brightness(100%) contrast(100%) saturate(100%)`;
            workingCtx.drawImage(workingCanvas, 0, 0);
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = workingCanvas.width;
            tempCanvas.height = workingCanvas.height;
            tempCtx.drawImage(workingCanvas, 0, 0);
            applyConvolution(tempCtx, workingCtx, kernel);
        }

        // Update preview with original quality
        previewImage.src = workingCanvas.toDataURL('image/jpeg', 1.0);
    }

    // Optimize convolution filter
    function applyConvolution(sourceCtx, targetCtx, kernel) {
        const imageData = sourceCtx.getImageData(0, 0, sourceCtx.canvas.width, sourceCtx.canvas.height);
        const data = imageData.data;
        const width = sourceCtx.canvas.width;
        const height = sourceCtx.canvas.height;
        const tempData = new Uint8ClampedArray(data);

        // Optimize convolution algorithm
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const idx = (y * width + x) * 4;
                for (let c = 0; c < 3; c++) {
                    let sum = 0;
                    for (let ky = -1; ky <= 1; ky++) {
                        for (let kx = -1; kx <= 1; kx++) {
                            const pixelIdx = ((y + ky) * width + (x + kx)) * 4 + c;
                            sum += data[pixelIdx] * kernel[(ky + 1) * 3 + (kx + 1)];
                        }
                    }
                    tempData[idx + c] = Math.min(255, Math.max(0, sum));
                }
            }
        }

        const newImageData = new ImageData(tempData, width, height);
        targetCtx.putImageData(newImageData, 0, 0);
    }

    // Download enhanced image with maximum quality
    function downloadImage() {
        if (!previewImage.src) {
            showNotification('No image to download', 'error');
            return;
        }

        const link = document.createElement('a');
        link.download = 'enhanced-image.jpg'; // Changed to .jpg for better quality
        link.href = workingCanvas.toDataURL('image/jpeg', 1.0); // Maximum quality
        link.click();
        showNotification('Image downloaded successfully', 'success');
    }

    // Initialize the tool
    initImageEnhancer();
}); 