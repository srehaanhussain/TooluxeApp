/**
 * Text Analyzer JavaScript
 * Handles text analysis functionality with various metrics
 */

// Make initTextAnalyzer globally available
window.initTextAnalyzer = function() {
    // Elements
    const analyzeBtn = document.getElementById('analyze-btn');
    const clearBtn = document.getElementById('clear-btn');
    const sampleBtn = document.getElementById('sample-btn');
    const resultsContainer = document.getElementById('results-container');
    
    // Result elements
    const charCountWithSpaces = document.getElementById('char-count-with-spaces');
    const charCountNoSpaces = document.getElementById('char-count-no-spaces');
    const wordCount = document.getElementById('word-count');
    const sentenceCount = document.getElementById('sentence-count');
    const paragraphCount = document.getElementById('paragraph-count');
    const readingTime = document.getElementById('reading-time');
    const speakingTime = document.getElementById('speaking-time');
    const readabilityScore = document.getElementById('readability-score');
    const readingLevel = document.getElementById('reading-level');
    const uniqueWords = document.getElementById('unique-words');
    const lexicalDensity = document.getElementById('lexical-density');
    const avgWordLength = document.getElementById('avg-word-length');
    const longestWord = document.getElementById('longest-word');
    const avgSentenceLength = document.getElementById('avg-sentence-length');
    const longestSentenceLength = document.getElementById('longest-sentence-length');
    const shortestSentenceLength = document.getElementById('shortest-sentence-length');
    const frequentWords = document.getElementById('frequent-words');
    
    // Sample text
    const sampleText = `The quick brown fox jumps over the lazy dog. This pangram contains all the letters of the English alphabet. It is often used to test typewriters and computer keyboards, as well as to display examples of fonts.

The phrase "The quick brown fox jumps over the lazy dog" has been used since at least the late 19th century. A pangram is a sentence that contains every letter of the alphabet at least once. The name comes from the Greek words "pan" (meaning "all") and "gramma" (meaning "letter").

Pangrams are useful for testing fonts, keyboards, and other text-related tools because they use every letter of the alphabet. This particular pangram is well-known because it is relatively short and makes sense as a sentence, unlike many other pangrams that use obscure words or awkward phrasing to include all 26 letters.`;
    
    // Initialize
    function init() {
        // Analyze button click event
        analyzeBtn.addEventListener('click', analyzeText);
        
        // Clear button click event
        clearBtn.addEventListener('click', function() {
            tinymce.get('text-input').setContent('');
            resultsContainer.style.display = 'none';
        });
        
        // Sample button click event
        sampleBtn.addEventListener('click', function() {
            tinymce.get('text-input').setContent(sampleText);
            analyzeText();
        });
        
        // Handle paste events
        const editor = tinymce.get('text-input');
        editor.on('paste', function(e) {
            // Wait for paste to complete
            setTimeout(analyzeText, 100);
        });
        
        // Handle any content changes
        editor.on('change', function() {
            analyzeText();
        });
        
        // Handle keyup for immediate feedback
        editor.on('keyup', function() {
            analyzeText();
        });
    }
    
    // Analyze text
    function analyzeText() {
        const editor = tinymce.get('text-input');
        if (!editor) {
            console.error('TinyMCE editor not found');
            return;
        }
        
        const text = editor.getContent({ format: 'text' }).trim();
        
        if (!text) {
            showNotification('Please enter some text to analyze', 'warning');
            return;
        }
        
        // Show results container
        resultsContainer.style.display = 'block';
        
        try {
            // Perform analysis with error handling
            const analysis = performTextAnalysis(text);
            
            // Update UI with results
            updateResults(analysis);
        } catch (error) {
            console.error('Error analyzing text:', error);
            showNotification('Error analyzing text. Please try again.', 'error');
        }
    }
    
    // Perform text analysis
    function performTextAnalysis(text) {
        // Basic counts with improved handling
        const charWithSpaces = text.length;
        const charNoSpaces = text.replace(/\s/g, '').length;
        
        // Improved word counting to handle various languages and special characters
        const words = text.match(/\p{L}+/gu) || [];
        const wordCount = words.length;
        
        // Enhanced sentence detection
        const sentenceRegex = /[.!?]+(?=\s+|$)(?!(\s*[A-Z][a-z]*\.))/g;
        const sentences = text.split(sentenceRegex)
            .filter(s => s.trim().length > 0)
            .map(s => s.trim());
        const sentenceCount = sentences.length;
        
        // Improved paragraph detection
        const paragraphs = text.split(/\n\s*\n/)
            .filter(p => p.trim().length > 0)
            .map(p => p.trim());
        const paragraphCount = paragraphs.length;
        
        // Reading and speaking time with improved calculations
        const avgReadingSpeed = 225; // words per minute
        const avgSpeakingSpeed = 150; // words per minute
        const readingTimeMinutes = Math.max(0.1, wordCount / avgReadingSpeed);
        const speakingTimeMinutes = Math.max(0.1, wordCount / avgSpeakingSpeed);
        
        // Enhanced word analysis
        const uniqueWordsSet = new Set(words.map(w => w.toLowerCase()));
        const uniqueWordsCount = uniqueWordsSet.size;
        const lexicalDensityValue = wordCount > 0 ? (uniqueWordsCount / wordCount) * 100 : 0;
        
        // Improved word length calculations
        const wordLengths = words.map(w => w.length);
        const totalWordLength = wordLengths.reduce((sum, length) => sum + length, 0);
        const avgWordLengthValue = wordCount > 0 ? totalWordLength / wordCount : 0;
        const longestWordValue = words.reduce((longest, word) => 
            word.length > longest.length ? word : longest, '');
        
        // Enhanced sentence analysis
        const sentenceWordCounts = sentences.map(s => {
            const sentenceWords = s.match(/\p{L}+/gu) || [];
            return sentenceWords.length;
        });
        
        const totalSentenceWords = sentenceWordCounts.reduce((sum, count) => sum + count, 0);
        const avgSentenceLengthValue = sentenceCount > 0 ? totalSentenceWords / sentenceCount : 0;
        const longestSentenceLengthValue = sentenceWordCounts.length > 0 ? Math.max(...sentenceWordCounts) : 0;
        const shortestSentenceLengthValue = sentenceWordCounts.length > 0 ? Math.min(...sentenceWordCounts) : 0;
        
        // Improved readability calculation
        const syllables = countSyllables(text);
        const fleschScore = wordCount > 0 && sentenceCount > 0 ? 
            206.835 - (1.015 * (wordCount / sentenceCount)) - (84.6 * (syllables / wordCount)) : 0;
        const readingLevelValue = getReadingLevel(fleschScore);
        
        // Enhanced frequent words analysis
        const frequentWordsMap = getFrequentWords(words);
        
        return {
            charWithSpaces,
            charNoSpaces,
            wordCount,
            sentenceCount,
            paragraphCount,
            readingTimeMinutes,
            speakingTimeMinutes,
            fleschScore,
            readingLevelValue,
            uniqueWordsCount,
            lexicalDensityValue,
            avgWordLengthValue,
            longestWordValue,
            avgSentenceLengthValue,
            longestSentenceLengthValue,
            shortestSentenceLengthValue,
            frequentWordsMap
        };
    }
    
    // Enhanced syllable counting
    function countSyllables(text) {
        const words = text.match(/\p{L}+/gu) || [];
        let syllableCount = 0;
        
        for (const word of words) {
            syllableCount += countWordSyllables(word);
        }
        
        return syllableCount;
    }
    
    // Improved word syllable counting
    function countWordSyllables(word) {
        word = word.toLowerCase();
        
        // Handle special cases
        if (word.length <= 3) return 1;
        
        // Remove common suffixes
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        word = word.replace(/^y/, '');
        
        // Count vowel groups with improved regex
        const syllables = word.match(/[aeiouy]{1,2}/g);
        return syllables ? Math.max(1, syllables.length) : 1;
    }
    
    // Get reading level based on Flesch score
    function getReadingLevel(score) {
        if (score >= 90) return 'Very Easy (5th grade)';
        if (score >= 80) return 'Easy (6th grade)';
        if (score >= 70) return 'Fairly Easy (7th grade)';
        if (score >= 60) return 'Standard (8th-9th grade)';
        if (score >= 50) return 'Fairly Difficult (10th-12th grade)';
        if (score >= 30) return 'Difficult (College)';
        return 'Very Difficult (College Graduate)';
    }
    
    // Get frequent words (excluding common stop words)
    function getFrequentWords(words) {
        const stopWords = new Set([
            'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'by', 'in',
            'of', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
            'do', 'does', 'did', 'will', 'would', 'shall', 'should', 'can', 'could', 'may',
            'might', 'must', 'it', 'its', 'it\'s', 'they', 'them', 'their', 'this', 'that',
            'these', 'those', 'i', 'me', 'my', 'mine', 'you', 'your', 'yours', 'he', 'him',
            'his', 'she', 'her', 'hers', 'we', 'us', 'our', 'ours'
        ]);
        
        const wordFrequency = {};
        
        // Count word frequencies (excluding stop words)
        for (const word of words) {
            const lowerWord = word.toLowerCase();
            if (!stopWords.has(lowerWord) && lowerWord.length > 1) {
                wordFrequency[lowerWord] = (wordFrequency[lowerWord] || 0) + 1;
            }
        }
        
        // Sort by frequency
        const sortedWords = Object.entries(wordFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10); // Top 10 words
        
        return sortedWords;
    }
    
    // Update results in UI
    function updateResults(analysis) {
        // Basic statistics
        charCountWithSpaces.textContent = formatNumber(analysis.charWithSpaces);
        charCountNoSpaces.textContent = formatNumber(analysis.charNoSpaces);
        wordCount.textContent = formatNumber(analysis.wordCount);
        sentenceCount.textContent = formatNumber(analysis.sentenceCount);
        paragraphCount.textContent = formatNumber(analysis.paragraphCount);
        
        // Reading metrics
        readingTime.textContent = formatTime(analysis.readingTimeMinutes);
        speakingTime.textContent = formatTime(analysis.speakingTimeMinutes);
        readabilityScore.textContent = analysis.fleschScore.toFixed(1);
        readingLevel.textContent = analysis.readingLevelValue;
        
        // Word analysis
        uniqueWords.textContent = formatNumber(analysis.uniqueWordsCount);
        lexicalDensity.textContent = analysis.lexicalDensityValue.toFixed(1) + '%';
        avgWordLength.textContent = analysis.avgWordLengthValue.toFixed(1) + ' characters';
        longestWord.textContent = analysis.longestWordValue;
        
        // Sentence analysis
        avgSentenceLength.textContent = analysis.avgSentenceLengthValue.toFixed(1) + ' words';
        longestSentenceLength.textContent = analysis.longestSentenceLengthValue + ' words';
        shortestSentenceLength.textContent = analysis.shortestSentenceLengthValue + ' words';
        
        // Frequent words
        displayFrequentWords(analysis.frequentWordsMap);
    }
    
    // Format number with commas
    function formatNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    // Format time in minutes and seconds
    function formatTime(minutes) {
        if (minutes < 1) {
            return Math.round(minutes * 60) + ' sec';
        } else if (minutes < 60) {
            const mins = Math.floor(minutes);
            const secs = Math.round((minutes - mins) * 60);
            return mins + ' min' + (secs > 0 ? ' ' + secs + ' sec' : '');
        } else {
            const hours = Math.floor(minutes / 60);
            const mins = Math.round(minutes % 60);
            return hours + ' hr' + (mins > 0 ? ' ' + mins + ' min' : '');
        }
    }
    
    // Display frequent words
    function displayFrequentWords(wordMap) {
        frequentWords.innerHTML = '';
        
        if (wordMap.length === 0) {
            frequentWords.textContent = 'No significant words found.';
            return;
        }
        
        // Create word cloud-like display
        const wordCloudContainer = document.createElement('div');
        wordCloudContainer.className = 'd-flex flex-wrap';
        
        wordMap.forEach(([word, count]) => {
            const wordElement = document.createElement('div');
            wordElement.className = 'p-2 m-1';
            wordElement.style.backgroundColor = 'var(--primary-light)';
            wordElement.style.color = 'white';
            wordElement.style.borderRadius = 'var(--border-radius-pill)';
            wordElement.style.fontSize = `${Math.max(0.8, Math.min(1.5, 0.8 + (count / wordMap[0][1]) * 0.7))}rem`;
            wordElement.textContent = `${word} (${count})`;
            
            wordCloudContainer.appendChild(wordElement);
        });
        
        frequentWords.appendChild(wordCloudContainer);
    }
    
    // Initialize the analyzer
    init();
};
