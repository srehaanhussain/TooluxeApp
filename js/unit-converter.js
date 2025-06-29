/**
 * Unit Converter JavaScript
 * Handles unit conversion functionality for various measurement types
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const conversionType = document.getElementById('conversion-type');
    const fromUnit = document.getElementById('from-unit');
    const toUnit = document.getElementById('to-unit');
    const fromValue = document.getElementById('from-value');
    const toValue = document.getElementById('to-value');
    const convertBtn = document.getElementById('convert-btn');
    const swapBtn = document.getElementById('swap-btn');
    const clearBtn = document.getElementById('clear-btn');
    const copyResultBtn = document.getElementById('copy-result');
    const conversionFormula = document.getElementById('conversion-formula');
    const formulaText = document.getElementById('formula-text');
    const conversionHistory = document.getElementById('conversion-history');
    const commonConversionBtns = document.querySelectorAll('.common-conversion');
    
    // Conversion units by type
    const unitTypes = {
        length: {
            name: 'Length',
            units: {
                nanometers: { name: 'Nanometers (nm)', factor: 1e-9 },
                micrometers: { name: 'Micrometers (μm)', factor: 1e-6 },
                millimeters: { name: 'Millimeters (mm)', factor: 0.001 },
                centimeters: { name: 'Centimeters (cm)', factor: 0.01 },
                inches: { name: 'Inches (in)', factor: 0.0254 },
                feet: { name: 'Feet (ft)', factor: 0.3048 },
                yards: { name: 'Yards (yd)', factor: 0.9144 },
                meters: { name: 'Meters (m)', factor: 1 },
                kilometers: { name: 'Kilometers (km)', factor: 1000 },
                miles: { name: 'Miles (mi)', factor: 1609.344 },
                nautical_miles: { name: 'Nautical Miles', factor: 1852 }
            }
        },
        area: {
            name: 'Area',
            units: {
                square_millimeters: { name: 'Square Millimeters (mm²)', factor: 1e-6 },
                square_centimeters: { name: 'Square Centimeters (cm²)', factor: 0.0001 },
                square_inches: { name: 'Square Inches (in²)', factor: 0.00064516 },
                square_feet: { name: 'Square Feet (ft²)', factor: 0.09290304 },
                square_yards: { name: 'Square Yards (yd²)', factor: 0.83612736 },
                square_meters: { name: 'Square Meters (m²)', factor: 1 },
                acres: { name: 'Acres', factor: 4046.8564224 },
                hectares: { name: 'Hectares (ha)', factor: 10000 },
                square_kilometers: { name: 'Square Kilometers (km²)', factor: 1000000 },
                square_miles: { name: 'Square Miles (mi²)', factor: 2589988.110336 }
            }
        },
        volume: {
            name: 'Volume',
            units: {
                milliliters: { name: 'Milliliters (ml)', factor: 0.001 },
                cubic_centimeters: { name: 'Cubic Centimeters (cm³)', factor: 0.001 },
                cubic_inches: { name: 'Cubic Inches (in³)', factor: 0.000016387064 },
                fluid_ounces_us: { name: 'Fluid Ounces (US)', factor: 0.0000295735296 },
                fluid_ounces_uk: { name: 'Fluid Ounces (UK)', factor: 0.0000284130625 },
                cups: { name: 'Cups', factor: 0.000236588236 },
                pints_us: { name: 'Pints (US)', factor: 0.000473176473 },
                pints_uk: { name: 'Pints (UK)', factor: 0.00056826125 },
                quarts_us: { name: 'Quarts (US)', factor: 0.000946352946 },
                liters: { name: 'Liters (L)', factor: 0.001 },
                gallons_us: { name: 'Gallons (US)', factor: 0.003785411784 },
                gallons_uk: { name: 'Gallons (UK)', factor: 0.00454609 },
                cubic_feet: { name: 'Cubic Feet (ft³)', factor: 0.028316846592 },
                cubic_meters: { name: 'Cubic Meters (m³)', factor: 1 }
            }
        },
        weight: {
            name: 'Weight/Mass',
            units: {
                milligrams: { name: 'Milligrams (mg)', factor: 0.000001 },
                grams: { name: 'Grams (g)', factor: 0.001 },
                ounces: { name: 'Ounces (oz)', factor: 0.028349523125 },
                pounds: { name: 'Pounds (lb)', factor: 0.45359237 },
                kilograms: { name: 'Kilograms (kg)', factor: 1 },
                stone: { name: 'Stone', factor: 6.35029318 },
                metric_tons: { name: 'Metric Tons (t)', factor: 1000 },
                tons_us: { name: 'Tons (US)', factor: 907.18474 },
                tons_uk: { name: 'Tons (UK)', factor: 1016.0469088 }
            }
        },
        temperature: {
            name: 'Temperature',
            units: {
                celsius: { name: 'Celsius (°C)', factor: 1 },
                fahrenheit: { name: 'Fahrenheit (°F)', factor: 1 },
                kelvin: { name: 'Kelvin (K)', factor: 1 }
            },
            // Special conversion functions for temperature
            formulas: {
                celsius_to_fahrenheit: 'F = C × 9/5 + 32',
                fahrenheit_to_celsius: 'C = (F - 32) × 5/9',
                celsius_to_kelvin: 'K = C + 273.15',
                kelvin_to_celsius: 'C = K - 273.15',
                fahrenheit_to_kelvin: 'K = (F - 32) × 5/9 + 273.15',
                kelvin_to_fahrenheit: 'F = (K - 273.15) × 9/5 + 32'
            }
        },
        time: {
            name: 'Time',
            units: {
                nanoseconds: { name: 'Nanoseconds (ns)', factor: 1e-9 },
                microseconds: { name: 'Microseconds (μs)', factor: 1e-6 },
                milliseconds: { name: 'Milliseconds (ms)', factor: 0.001 },
                seconds: { name: 'Seconds (s)', factor: 1 },
                minutes: { name: 'Minutes (min)', factor: 60 },
                hours: { name: 'Hours (h)', factor: 3600 },
                days: { name: 'Days', factor: 86400 },
                weeks: { name: 'Weeks', factor: 604800 },
                months: { name: 'Months (avg)', factor: 2629746 },
                years: { name: 'Years (365 days)', factor: 31536000 }
            }
        },
        speed: {
            name: 'Speed',
            units: {
                meters_per_second: { name: 'Meters per Second (m/s)', factor: 1 },
                kilometers_per_hour: { name: 'Kilometers per Hour (km/h)', factor: 0.277777778 },
                feet_per_second: { name: 'Feet per Second (ft/s)', factor: 0.3048 },
                miles_per_hour: { name: 'Miles per Hour (mph)', factor: 0.44704 },
                knots: { name: 'Knots (nautical miles/h)', factor: 0.514444444 }
            }
        },
        pressure: {
            name: 'Pressure',
            units: {
                pascals: { name: 'Pascals (Pa)', factor: 1 },
                kilopascals: { name: 'Kilopascals (kPa)', factor: 1000 },
                bars: { name: 'Bars', factor: 100000 },
                psi: { name: 'Pounds per Square Inch (psi)', factor: 6894.75729 },
                atmospheres: { name: 'Atmospheres (atm)', factor: 101325 },
                millimeters_mercury: { name: 'Millimeters of Mercury (mmHg)', factor: 133.322387415 },
                inches_mercury: { name: 'Inches of Mercury (inHg)', factor: 3386.389 }
            }
        },
        energy: {
            name: 'Energy',
            units: {
                joules: { name: 'Joules (J)', factor: 1 },
                kilojoules: { name: 'Kilojoules (kJ)', factor: 1000 },
                calories: { name: 'Calories (cal)', factor: 4.184 },
                kilocalories: { name: 'Kilocalories (kcal)', factor: 4184 },
                watt_hours: { name: 'Watt-hours (Wh)', factor: 3600 },
                kilowatt_hours: { name: 'Kilowatt-hours (kWh)', factor: 3600000 },
                electron_volts: { name: 'Electron Volts (eV)', factor: 1.602176634e-19 },
                british_thermal_units: { name: 'British Thermal Units (BTU)', factor: 1055.05585262 }
            }
        },
        data: {
            name: 'Digital Storage',
            units: {
                bits: { name: 'Bits (b)', factor: 1/8 },
                bytes: { name: 'Bytes (B)', factor: 1 },
                kilobytes: { name: 'Kilobytes (KB)', factor: 1024 },
                megabytes: { name: 'Megabytes (MB)', factor: 1048576 },
                gigabytes: { name: 'Gigabytes (GB)', factor: 1073741824 },
                terabytes: { name: 'Terabytes (TB)', factor: 1099511627776 },
                petabytes: { name: 'Petabytes (PB)', factor: 1125899906842624 }
            }
        }
    };
    
    // Conversion history
    let history = [];
    
    // Initialize
    function init() {
        // Populate unit type dropdown
        populateConversionTypes();
        
        // Initial population of unit dropdowns
        populateUnitDropdowns(conversionType.value);
        
        // Conversion type change event
        conversionType.addEventListener('change', function() {
            populateUnitDropdowns(this.value);
            updateFormula();
        });
        
        // From unit change event
        fromUnit.addEventListener('change', function() {
            updateFormula();
        });
        
        // To unit change event
        toUnit.addEventListener('change', function() {
            updateFormula();
        });
        
        // Convert button click event
        convertBtn.addEventListener('click', convert);
        
        // From value input event
        fromValue.addEventListener('input', function() {
            if (this.value) {
                convert();
            }
        });
        
        // Swap button click event
        swapBtn.addEventListener('click', swapUnits);
        
        // Clear button click event
        clearBtn.addEventListener('click', function() {
            fromValue.value = '1';
            toValue.textContent = '0';
            updateFormula();
        });
        
        // Copy result button click event
        copyResultBtn.addEventListener('click', function() {
            copyToClipboard(toValue.textContent);
        });
        
        // Common conversion buttons click events
        commonConversionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                const from = this.getAttribute('data-from');
                const to = this.getAttribute('data-to');
                const value = this.getAttribute('data-value');
                
                conversionType.value = type;
                populateUnitDropdowns(type);
                fromUnit.value = from;
                toUnit.value = to;
                fromValue.value = value;
                
                convert();
            });
        });
        
        // Initial conversion
        convert();
    }
    
    // Populate conversion types dropdown
    function populateConversionTypes() {
        conversionType.innerHTML = '';
        
        for (const type in unitTypes) {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = unitTypes[type].name;
            conversionType.appendChild(option);
        }
    }
    
    // Populate unit dropdowns based on selected conversion type
    function populateUnitDropdowns(type) {
        fromUnit.innerHTML = '';
        toUnit.innerHTML = '';
        
        const units = unitTypes[type].units;
        
        for (const unit in units) {
            const fromOption = document.createElement('option');
            fromOption.value = unit;
            fromOption.textContent = units[unit].name;
            fromUnit.appendChild(fromOption);
            
            const toOption = document.createElement('option');
            toOption.value = unit;
            toOption.textContent = units[unit].name;
            toUnit.appendChild(toOption);
        }
        
        // Set default selections (different units)
        if (fromUnit.options.length > 1) {
            fromUnit.selectedIndex = 0;
            toUnit.selectedIndex = 1;
        }
        
        updateFormula();
    }
    
    // Convert units
    function convert() {
        const type = conversionType.value;
        const from = fromUnit.value;
        const to = toUnit.value;
        const value = parseFloat(fromValue.value);
        
        if (isNaN(value)) {
            toValue.textContent = '0';
            return;
        }
        
        let result;
        
        // Special case for temperature
        if (type === 'temperature') {
            result = convertTemperature(from, to, value);
        } else {
            // Standard conversion using factors
            const fromFactor = unitTypes[type].units[from].factor;
            const toFactor = unitTypes[type].units[to].factor;
            result = (value * fromFactor) / toFactor;
        }
        
        // Format result based on magnitude
        toValue.textContent = formatResult(result);
        
        // Update formula
        updateFormula();
        
        // Add to history
        addToHistory(type, from, to, value, result);
    }
    
    // Convert temperature (special case)
    function convertTemperature(from, to, value) {
        let result;
        
        // Convert to Celsius as intermediate step
        let celsius;
        if (from === 'celsius') {
            celsius = value;
        } else if (from === 'fahrenheit') {
            celsius = (value - 32) * 5/9;
        } else if (from === 'kelvin') {
            celsius = value - 273.15;
        }
        
        // Convert from Celsius to target unit
        if (to === 'celsius') {
            result = celsius;
        } else if (to === 'fahrenheit') {
            result = celsius * 9/5 + 32;
        } else if (to === 'kelvin') {
            result = celsius + 273.15;
        }
        
        return result;
    }
    
    // Format result based on magnitude
    function formatResult(result) {
        if (Math.abs(result) < 0.000001 && result !== 0) {
            return result.toExponential(6);
        } else if (Math.abs(result) >= 1000000) {
            return result.toExponential(6);
        } else {
            return result.toPrecision(10).replace(/\.?0+$/, '');
        }
    }
    
    // Update conversion formula display
    function updateFormula() {
        const type = conversionType.value;
        const from = fromUnit.value;
        const to = toUnit.value;
        
        // Special case for temperature
        if (type === 'temperature' && from !== to) {
            const formulaKey = `${from}_to_${to}`;
            const formula = unitTypes.temperature.formulas[formulaKey];
            
            if (formula) {
                formulaText.textContent = formula;
                conversionFormula.style.display = 'block';
            } else {
                conversionFormula.style.display = 'none';
            }
        } 
        // Standard conversion
        else if (from !== to) {
            const fromUnit = unitTypes[type].units[from].name.split(' ')[0];
            const toUnit = unitTypes[type].units[to].name.split(' ')[0];
            const fromFactor = unitTypes[type].units[from].factor;
            const toFactor = unitTypes[type].units[to].factor;
            
            formulaText.textContent = `${toUnit} = ${fromUnit} × ${(fromFactor / toFactor).toPrecision(6)}`;
            conversionFormula.style.display = 'block';
        } else {
            conversionFormula.style.display = 'none';
        }
    }
    
    // Swap from and to units
    function swapUnits() {
        const tempUnit = fromUnit.value;
        fromUnit.value = toUnit.value;
        toUnit.value = tempUnit;
        
        convert();
    }
    
    // Add conversion to history
    function addToHistory(type, from, to, fromVal, toVal) {
        const fromUnitName = unitTypes[type].units[from].name.split(' ')[0];
        const toUnitName = unitTypes[type].units[to].name.split(' ')[0];
        
        const historyItem = {
            type: unitTypes[type].name,
            from: from,
            to: to,
            fromValue: fromVal,
            toValue: toVal,
            fromUnitName: fromUnitName,
            toUnitName: toUnitName,
            timestamp: new Date()
        };
        
        // Add to beginning of array
        history.unshift(historyItem);
        
        // Limit history to 5 items
        if (history.length > 5) {
            history.pop();
        }
        
        // Update history display
        updateHistoryDisplay();
    }
    
    // Update history display
    function updateHistoryDisplay() {
        conversionHistory.innerHTML = '';
        
        if (history.length === 0) {
            conversionHistory.innerHTML = '<p>No conversions yet.</p>';
            return;
        }
        
        const historyList = document.createElement('ul');
        historyList.style.listStyle = 'none';
        historyList.style.padding = '0';
        
        history.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'mb-2 p-2';
            listItem.style.borderBottom = '1px solid var(--border-color)';
            
            const fromValueFormatted = formatResult(item.fromValue);
            const toValueFormatted = formatResult(item.toValue);
            
            listItem.innerHTML = `
                <div class="d-flex justify-content-between">
                    <span>${fromValueFormatted} ${item.fromUnitName} = ${toValueFormatted} ${item.toUnitName}</span>
                    <button class="btn-icon repeat-conversion" data-index="${index}" title="Repeat this conversion">
                        <i class="fas fa-redo-alt"></i>
                    </button>
                </div>
                <small class="text-light">${item.type} • ${formatTimeAgo(item.timestamp)}</small>
            `;
            
            historyList.appendChild(listItem);
        });
        
        conversionHistory.appendChild(historyList);
        
        // Add event listeners to repeat buttons
        document.querySelectorAll('.repeat-conversion').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const item = history[index];
                
                conversionType.value = getTypeKeyByName(item.type);
                populateUnitDropdowns(conversionType.value);
                fromUnit.value = item.from;
                toUnit.value = item.to;
                fromValue.value = item.fromValue;
                
                convert();
            });
        });
    }
    
    // Get type key by name
    function getTypeKeyByName(name) {
        for (const key in unitTypes) {
            if (unitTypes[key].name === name) {
                return key;
            }
        }
        return 'length'; // Default
    }
    
    // Format time ago
    function formatTimeAgo(date) {
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) {
            return 'just now';
        } else if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (seconds < 86400) {
            const hours = Math.floor(seconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            const days = Math.floor(seconds / 86400);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        }
    }
    
    // Initialize the unit converter
    init();
});
