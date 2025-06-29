/**
 * QR Code Tools JavaScript
 * Handles both QR code scanning and generation functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Tab Navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');

            // If switching to scanner tab, initialize camera
            if (tabId === 'scanner') {
                initCamera();
            }
        });
    });

    // Scanner Elements
    const startButton = document.getElementById('start-button');
    const stopButton = document.getElementById('stop-button');
    const cameraSelect = document.getElementById('camera-select');
    const resultContainer = document.getElementById('result-container');
    const resultText = document.getElementById('result-text');
    const resultLink = document.getElementById('result-link');
    const copyButton = document.getElementById('copy-result');
    const fileInput = document.getElementById('qr-input-file');
    
    // Generator Elements
    const qrContent = document.getElementById('qr-content');
    const qrSize = document.getElementById('qr-size');
    const qrColor = document.getElementById('qr-color');
    const qrBackground = document.getElementById('qr-background');
    const sizeValue = document.getElementById('size-value');
    const generateButton = document.getElementById('generate-button');
    const qrOutput = document.getElementById('qr-output');
    const qrCode = document.getElementById('qr-code');
    const downloadButton = document.getElementById('download-qr');
    
    // HTML5 QR Code Scanner instance
    let html5QrCode;
    let currentCamera = null;
    
    // Initialize camera list
    function initCameraList() {
        Html5Qrcode.getCameras().then(cameras => {
            if (cameras && cameras.length) {
                cameraSelect.innerHTML = '';
                cameras.forEach(camera => {
                    const option = document.createElement('option');
                    option.value = camera.id;
                    option.text = camera.label || `Camera ${cameras.indexOf(camera) + 1}`;
                    cameraSelect.appendChild(option);
                });
                
                // Enable the start button
                startButton.disabled = false;
                
                // Set the first camera as default
                currentCamera = cameras[0].id;
            } else {
                cameraSelect.innerHTML = '<option value="">No cameras found</option>';
                startButton.disabled = true;
                showNotification('No camera found on this device', 'warning');
            }
        }).catch(err => {
            console.error('Error getting cameras', err);
            cameraSelect.innerHTML = '<option value="">Error loading cameras</option>';
            startButton.disabled = true;
            showNotification('Error accessing camera. Please ensure camera permissions are granted.', 'error');
        });
    }
    
    // Initialize QR Code scanner
    function initQrScanner() {
        html5QrCode = new Html5Qrcode("reader");
        
        // Initialize camera list
        initCameraList();
        
        // Camera selection change event
        cameraSelect.addEventListener('change', function() {
            currentCamera = this.value;
            if (html5QrCode.isScanning) {
                html5QrCode.stop().then(() => {
                    startScanner();
                }).catch(err => {
                    console.error('Error stopping camera before switching', err);
                });
            }
        });
        
        // Start button click event
        startButton.addEventListener('click', startScanner);
        
        // Stop button click event
        stopButton.addEventListener('click', stopScanner);
        
        // Copy button click event
        copyButton.addEventListener('click', function() {
            copyToClipboard(resultText.textContent);
        });
        
        // File input change event
        fileInput.addEventListener('change', handleFileInput);
    }
    
    // Start QR scanner
    function startScanner() {
        if (!currentCamera) {
            showNotification('Please select a camera', 'warning');
            return;
        }
        
        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
        };
        
        html5QrCode.start(
            currentCamera, 
            config,
            onScanSuccess,
            onScanFailure
        ).then(() => {
            // Show stop button, hide start button
            startButton.style.display = 'none';
            stopButton.style.display = 'inline-block';
            showNotification('Camera started successfully', 'success');
        }).catch(err => {
            console.error('Error starting camera', err);
            showNotification('Error starting camera. Please check permissions.', 'error');
        });
    }
    
    // Stop QR scanner
    function stopScanner() {
        if (html5QrCode.isScanning) {
            html5QrCode.stop().then(() => {
                // Show start button, hide stop button
                startButton.style.display = 'inline-block';
                stopButton.style.display = 'none';
                showNotification('Camera stopped', 'info');
            }).catch(err => {
                console.error('Error stopping camera', err);
            });
        }
    }
    
    // Handle successful scan
    function onScanSuccess(decodedText, decodedResult) {
        // Display the result
        displayResult(decodedText);
        
        // Play success sound
        playBeepSound();
        
        // Optionally stop scanning after successful scan
        // stopScanner();
    }
    
    // Handle scan failure
    function onScanFailure(error) {
        // Handle scan failure, usually ignore as this is called frequently
        // console.warn(`QR code scanning failed: ${error}`);
    }
    
    // Handle file input for QR code scanning from image
    function handleFileInput(e) {
        if (e.target.files.length === 0) {
            return;
        }
        
        const file = e.target.files[0];
        
        // Check if file is an image
        if (!file.type.match('image.*')) {
            showNotification('Please select an image file', 'error');
            return;
        }
        
        // If scanner is running, stop it
        if (html5QrCode && html5QrCode.isScanning) {
            stopScanner();
        }
        
        // Create a new HTML5 QR code scanner if not already created
        if (!html5QrCode) {
            html5QrCode = new Html5Qrcode("reader");
        }
        
        html5QrCode.scanFile(file, true)
            .then(decodedText => {
                // Display the result
                displayResult(decodedText);
                showNotification('QR code scanned successfully', 'success');
                
                // Play success sound
                playBeepSound();
            })
            .catch(err => {
                console.error('Error scanning file', err);
                showNotification('No QR code found in the image or error scanning', 'error');
            });
    }
    
    // Display scan result
    function displayResult(decodedText) {
        resultText.textContent = decodedText;
        resultContainer.style.display = 'block';
        
        // Check if the result is a URL
        if (isValidURL(decodedText)) {
            resultLink.href = decodedText;
            resultLink.style.display = 'inline-block';
        } else {
            resultLink.style.display = 'none';
        }
    }
    
    // Play beep sound on successful scan
    function playBeepSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 1000;
        gainNode.gain.value = 0.1;
        
        oscillator.start();
        
        setTimeout(() => {
            oscillator.stop();
        }, 100);
    }
    
    // Check if a string is a valid URL
    function isValidURL(str) {
        try {
            new URL(str);
            return true;
        } catch (e) {
            return false;
        }
    }

    // QR Generator Functions
    function initQrGenerator() {
        // Size slider change event
        qrSize.addEventListener('input', () => {
            sizeValue.textContent = `${qrSize.value}px`;
        });

        // Generate button click event
        generateButton.addEventListener('click', generateQrCode);

        // Download button click event
        downloadButton.addEventListener('click', downloadQrCode);
    }

    // Generate QR code
    function generateQrCode() {
        const content = qrContent.value.trim();
        if (!content) {
            showNotification('Please enter content for the QR code', 'error');
            return;
        }

        // Clear previous QR code
        qrCode.innerHTML = '<canvas id="qr-canvas"></canvas>';
        const canvas = document.getElementById('qr-canvas');

        // Create new QR code using QRious
        new QRious({
            element: canvas,
            value: content,
            size: parseInt(qrSize.value),
            level: 'H', // High error correction
            foreground: qrColor.value,
            background: qrBackground.value
        });

        // Show output container
        qrOutput.style.display = 'block';
        showNotification('QR code generated successfully', 'success');
    }

    // Download QR code
    function downloadQrCode() {
        const canvas = document.getElementById('qr-canvas');
        if (!canvas) {
            showNotification('No QR code to download', 'error');
            return;
        }

        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    // Initialize both tools
    function init() {
        initQrScanner();
        initQrGenerator();
    }

    // Start initialization
    init();
});
