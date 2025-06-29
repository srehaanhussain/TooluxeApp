/**
 * Text to Speech JavaScript
 * Handles text-to-speech conversion with customizable voice options
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const textInput = document.getElementById('text-input');
    const voiceSelect = document.getElementById('voice-select');
    const languageSelect = document.getElementById('language-select');
    const rateSlider = document.getElementById('rate-slider');
    const rateValue = document.getElementById('rate-value');
    const pitchSlider = document.getElementById('pitch-slider');
    const pitchValue = document.getElementById('pitch-value');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeValue = document.getElementById('volume-value');
    const speakBtn = document.getElementById('speak-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resumeBtn = document.getElementById('resume-btn');
    const stopBtn = document.getElementById('stop-btn');
    const downloadBtn = document.getElementById('download-btn');
    const fileFormat = document.getElementById('file-format');
    const presetBtns = document.querySelectorAll('.preset-btn');
    
    // Speech synthesis
    const synth = window.speechSynthesis;
    let voices = [];
    let currentUtterance = null;
    
    // Initialize
    function init() {
        // Check if browser supports speech synthesis
        if (!synth) {
            showNotification('Your browser does not support text-to-speech functionality', 'error');
            disableInterface();
            return;
        }
        
        // Load voices
        loadVoices();
        
        // Voice changed event
        if (synth.onvoiceschanged !== undefined) {
            synth.onvoiceschanged = loadVoices;
        }
        
        // Update value displays when sliders change
        rateSlider.addEventListener('input', function() {
            rateValue.textContent = this.value;
        });
        
        pitchSlider.addEventListener('input', function() {
            pitchValue.textContent = this.value;
        });
        
        volumeSlider.addEventListener('input', function() {
            volumeValue.textContent = this.value;
        });
        
        // Language select change event
        languageSelect.addEventListener('change', function() {
            filterVoicesByLanguage(this.value);
        });
        
        // Speak button click event
        speakBtn.addEventListener('click', speak);
        
        // Pause button click event
        pauseBtn.addEventListener('click', function() {
            if (synth.speaking) {
                synth.pause();
                pauseBtn.disabled = true;
                resumeBtn.disabled = false;
            }
        });
        
        // Resume button click event
        resumeBtn.addEventListener('click', function() {
            if (synth.paused) {
                synth.resume();
                pauseBtn.disabled = false;
                resumeBtn.disabled = true;
            }
        });
        
        // Stop button click event
        stopBtn.addEventListener('click', function() {
            if (synth.speaking) {
                synth.cancel();
                resetButtons();
            }
        });
        
        // Download button click event
        downloadBtn.addEventListener('click', downloadAudio);
        
        // Preset buttons click events
        presetBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                textInput.value = this.getAttribute('data-text');
            });
        });
    }
    
    // Load available voices
    function loadVoices() {
        voices = synth.getVoices();
        
        if (voices.length === 0) {
            setTimeout(loadVoices, 100);
            return;
        }
        
        // Clear voice select
        voiceSelect.innerHTML = '';
        
        // Get unique languages
        const languages = [...new Set(voices.map(voice => voice.lang))];
        
        // Populate language select
        languageSelect.innerHTML = '';
        const allOption = document.createElement('option');
        allOption.value = '';
        allOption.textContent = 'All Languages';
        languageSelect.appendChild(allOption);
        
        languages.sort().forEach(lang => {
            const option = document.createElement('option');
            option.value = lang;
            option.textContent = getLanguageName(lang);
            languageSelect.appendChild(option);
        });
        
        // Populate voice select with all voices
        populateVoiceSelect(voices);
    }
    
    // Populate voice select with given voices
    function populateVoiceSelect(voiceList) {
        voiceSelect.innerHTML = '';
        
        voiceList.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.name;
            option.textContent = `${voice.name} (${getLanguageName(voice.lang)})`;
            
            if (voice.default) {
                option.selected = true;
            }
            
            voiceSelect.appendChild(option);
        });
        
        if (voiceSelect.options.length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No voices available';
            voiceSelect.appendChild(option);
            speakBtn.disabled = true;
        } else {
            speakBtn.disabled = false;
        }
    }
    
    // Filter voices by language
    function filterVoicesByLanguage(language) {
        if (!language) {
            populateVoiceSelect(voices);
            return;
        }
        
        const filteredVoices = voices.filter(voice => voice.lang === language);
        populateVoiceSelect(filteredVoices);
    }
    
    // Get language name from language code
    function getLanguageName(langCode) {
        const languages = {
            'ar-SA': 'Arabic (Saudi Arabia)',
            'cs-CZ': 'Czech',
            'da-DK': 'Danish',
            'de-DE': 'German',
            'el-GR': 'Greek',
            'en-AU': 'English (Australia)',
            'en-GB': 'English (UK)',
            'en-IE': 'English (Ireland)',
            'en-IN': 'English (India)',
            'en-US': 'English (US)',
            'en-ZA': 'English (South Africa)',
            'es-ES': 'Spanish',
            'es-MX': 'Spanish (Mexico)',
            'fi-FI': 'Finnish',
            'fr-CA': 'French (Canada)',
            'fr-FR': 'French',
            'he-IL': 'Hebrew',
            'hi-IN': 'Hindi',
            'hu-HU': 'Hungarian',
            'id-ID': 'Indonesian',
            'it-IT': 'Italian',
            'ja-JP': 'Japanese',
            'ko-KR': 'Korean',
            'nl-BE': 'Dutch (Belgium)',
            'nl-NL': 'Dutch',
            'no-NO': 'Norwegian',
            'pl-PL': 'Polish',
            'pt-BR': 'Portuguese (Brazil)',
            'pt-PT': 'Portuguese',
            'ro-RO': 'Romanian',
            'ru-RU': 'Russian',
            'sk-SK': 'Slovak',
            'sv-SE': 'Swedish',
            'th-TH': 'Thai',
            'tr-TR': 'Turkish',
            'zh-CN': 'Chinese (China)',
            'zh-HK': 'Chinese (Hong Kong)',
            'zh-TW': 'Chinese (Taiwan)'
        };
        
        return languages[langCode] || langCode;
    }
    
    // Speak text
    function speak() {
        // Check if already speaking
        if (synth.speaking) {
            synth.cancel();
        }
        
        const text = textInput.value.trim();
        
        if (!text) {
            showNotification('Please enter some text to speak', 'warning');
            return;
        }
        
        // Create utterance
        currentUtterance = new SpeechSynthesisUtterance(text);
        
        // Set voice
        const selectedVoice = voiceSelect.value;
        if (selectedVoice) {
            const voice = voices.find(v => v.name === selectedVoice);
            if (voice) {
                currentUtterance.voice = voice;
            }
        }
        
        // Set properties
        currentUtterance.rate = parseFloat(rateSlider.value);
        currentUtterance.pitch = parseFloat(pitchSlider.value);
        currentUtterance.volume = parseFloat(volumeSlider.value);
        
        // Events
        currentUtterance.onstart = function() {
            updateButtons(true);
        };
        
        currentUtterance.onend = function() {
            resetButtons();
        };
        
        currentUtterance.onerror = function(event) {
            console.error('SpeechSynthesis error:', event);
            showNotification('Error occurred during speech synthesis', 'error');
            resetButtons();
        };
        
        // Speak
        synth.speak(currentUtterance);
    }
    
    // Update button states when speaking
    function updateButtons(isSpeaking) {
        speakBtn.disabled = isSpeaking;
        pauseBtn.disabled = !isSpeaking;
        resumeBtn.disabled = true;
        stopBtn.disabled = !isSpeaking;
    }
    
    // Reset button states
    function resetButtons() {
        speakBtn.disabled = false;
        pauseBtn.disabled = true;
        resumeBtn.disabled = true;
        stopBtn.disabled = true;
    }
    
    // Disable interface if speech synthesis is not supported
    function disableInterface() {
        textInput.disabled = true;
        voiceSelect.disabled = true;
        languageSelect.disabled = true;
        rateSlider.disabled = true;
        pitchSlider.disabled = true;
        volumeSlider.disabled = true;
        speakBtn.disabled = true;
        pauseBtn.disabled = true;
        resumeBtn.disabled = true;
        stopBtn.disabled = true;
        downloadBtn.disabled = true;
        fileFormat.disabled = true;
        
        presetBtns.forEach(btn => {
            btn.disabled = true;
        });
    }
    
    // Download audio function using VoiceRSS API
    async function downloadAudio() {
        const text = textInput.value.trim();
        
        if (!text) {
            showNotification('Please enter some text to convert', 'warning');
            return;
        }
        
        showNotification('Preparing audio for download...', 'info');
        
        try {
            // Get selected voice and language
            const selectedVoice = voiceSelect.value;
            const selectedLanguage = languageSelect.value;
            
            // Map language code to VoiceRSS language code
            const languageMap = {
                'en-US': 'en-us',
                'en-GB': 'en-gb',
                'es-ES': 'es-es',
                'fr-FR': 'fr-fr',
                'de-DE': 'de-de',
                'it-IT': 'it-it',
                'pt-BR': 'pt-br',
                'ru-RU': 'ru-ru',
                'ja-JP': 'ja-jp',
                'ko-KR': 'ko-kr',
                'zh-CN': 'zh-cn',
                'hi-IN': 'hi-in',
                'ar-SA': 'ar-sa'
            };
            
            // Get VoiceRSS language code or default to en-us
            const voiceRssLanguage = languageMap[selectedLanguage] || 'en-us';
            
            // Construct VoiceRSS API URL
            const apiKey = '4f15230c3695486b987da7327c275410';
            const apiUrl = `https://api.voicerss.org/?key=${apiKey}&hl=${voiceRssLanguage}&src=${encodeURIComponent(text)}&r=${rateSlider.value}&c=MP3&f=44khz_16bit_stereo`;
            
            // Create audio element
            const audio = new Audio(apiUrl);
            
            // Add event listeners
            audio.oncanplaythrough = function() {
                showNotification('Audio ready to play', 'success');
            };
            
            audio.onerror = function() {
                showNotification('Error loading audio', 'error');
            };
            
            // Play the audio
            audio.play();
            
            // Create download link
            const downloadLink = document.createElement('a');
            downloadLink.href = apiUrl;
            downloadLink.download = 'text-to-speech.mp3';
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
        } catch (error) {
            console.error('Error creating audio:', error);
            showNotification('Error creating audio: ' + error.message, 'error');
        }
    }
    
    // Initialize the text-to-speech tool
    init();
});
