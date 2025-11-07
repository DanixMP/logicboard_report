// State Management
const state = {
    currentDay: null,
    inputs: {
        1: { S0: 0, S1: 0, S2: 0, E: 1 },
        2: { Y7: 0, Y6: 0, Y5: 0, Y4: 0, Y3: 0, Y2: 0, Y1: 0, Y0: 0, G2: 0, G1: 0, G0: 0 },
        3: { A: 0, B: 0, C: 0, D: 0, I0: 0, I1: 0, I2: 0, I3: 0, I4: 0, I5: 0, I6: 0, I7: 0, S0: 0, S1: 0, S2: 0, EN: 1 }
    }
};

// Logic Gate Functions (to be customized per day)
const logicFunctions = {
    1: (inputs) => (inputs.A && inputs.B) || inputs.C, // Example: (A AND B) OR C
    2: (inputs) => inputs.A || inputs.B || inputs.C,   // Placeholder
    3: (inputs) => inputs.A && inputs.B && inputs.C    // Placeholder
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeGreetingButtons();
    initializeScrollEffects();
    initializeLogicSimulators();
    initializeImageLightbox();
    initializeTestNavigation();
    initializeHomeButton();
    initializeAlbumButton();
});

// Also try to draw canvases when window fully loads
window.addEventListener('load', () => {
    setTimeout(() => {
        drawGrayToBinaryCircuit();
        drawMultiplexer();
    }, 100);
});

// Navigation System
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const underline = document.querySelector('.nav-underline');
    
    navButtons.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const day = btn.getAttribute('data-day');
            navigateToDay(day);
            updateNavUnderline(btn, underline);
        });
    });
}

function updateNavUnderline(activeBtn, underline) {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
    
    const btnRect = activeBtn.getBoundingClientRect();
    const containerRect = activeBtn.parentElement.getBoundingClientRect();
    const offsetLeft = btnRect.left - containerRect.left;
    
    // Adjust width to be slightly narrower and centered
    const adjustedWidth = btnRect.width * 0.8;
    const centerOffset = (btnRect.width - adjustedWidth) / 2;
    const rightShift = btnRect.width * 0.4; // Move 50% to the right
    
    underline.style.width = `${adjustedWidth}px`;
    underline.style.left = `${offsetLeft + centerOffset + rightShift}px`;
}

// Home Button
function initializeHomeButton() {
    const homeBtn = document.getElementById('home-btn');
    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            // Hide header
            const header = document.getElementById('main-header');
            header.classList.add('hidden');
            
            // Hide all day pages
            const dayPages = document.querySelectorAll('.day-page');
            dayPages.forEach(page => page.classList.remove('active'));
            
            // Show greeting page
            const greetingPage = document.getElementById('greeting-page');
            greetingPage.classList.add('active');
            
            // Reset greeting page elements
            const greetingImageContainer = document.getElementById('greeting-image-container');
            const dayButtons = document.querySelector('.day-buttons');
            const mainTitle = document.querySelector('.main-title');
            const secondTitle = document.querySelector('.secound-title');
            
            greetingImageContainer.classList.add('hidden');
            dayButtons.classList.remove('hidden');
            mainTitle.classList.remove('hidden');
            secondTitle.classList.remove('hidden');
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Reset current day
            state.currentDay = null;
        });
    }
}

// Album Button
function initializeAlbumButton() {
    const albumBtn = document.getElementById('album-btn');
    if (albumBtn) {
        albumBtn.addEventListener('click', () => {
            navigateToAlbum();
        });
    }
    
    // Initialize album image clicks and loading
    const albumImages = document.querySelectorAll('.album-image');
    albumImages.forEach(img => {
        // Add loaded class when image loads
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
        
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            openLightbox(img.src);
        });
    });
    
    // Initialize filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            filterAlbum(filter);
            
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

function filterAlbum(category) {
    const albumItems = document.querySelectorAll('.album-item');
    
    albumItems.forEach((item, index) => {
        const itemCategory = item.getAttribute('data-category');
        
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
            // Re-trigger animation
            item.style.animation = 'none';
            setTimeout(() => {
                item.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.1}s`;
            }, 10);
        } else {
            item.style.display = 'none';
        }
    });
}

function navigateToAlbum() {
    // Show header
    const header = document.getElementById('main-header');
    header.classList.remove('hidden');
    
    // Hide greeting page
    const greetingPage = document.getElementById('greeting-page');
    greetingPage.classList.remove('active');
    
    // Hide all day pages
    const dayPages = document.querySelectorAll('.day-page');
    dayPages.forEach(page => page.classList.remove('active'));
    
    // Show album page
    const albumPage = document.getElementById('album-page');
    albumPage.classList.add('active');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update state
    state.currentDay = 'album';
}

// Greeting Page Buttons
function initializeGreetingButtons() {
    const greetingButtons = document.querySelectorAll('#greeting-page .glass-btn');
    
    greetingButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const day = btn.getAttribute('data-day');
            navigateToDay(day);
        });
    });
}

// Page Navigation
function navigateToDay(day) {
    state.currentDay = day;
    
    // Update greeting page to show day image
    const greetingImageContainer = document.getElementById('greeting-image-container');
    const greetingDayImage = document.getElementById('greeting-day-image');
    const dayButtons = document.querySelector('.day-buttons');
    const mainTitle = document.querySelector('.main-title');
    const secondTitle = document.querySelector('.secound-title');
    
    // Map day numbers to image filenames
    const imageMap = {
        '1': 'images/hero-day-one.jpg',
        '2': 'images/hero-day-two.jpg',
        '3': 'images/hero-day-three.jpg'
    };
    
    // Show image in greeting container and hide buttons/titles
    greetingDayImage.src = imageMap[day];
    greetingImageContainer.classList.remove('hidden');
    dayButtons.classList.add('hidden');
    mainTitle.classList.add('hidden');
    secondTitle.classList.add('hidden');
    
    // Show header
    const header = document.getElementById('main-header');
    header.classList.remove('hidden');
    
    // Hide all day pages
    const dayPages = document.querySelectorAll('.day-page');
    dayPages.forEach(page => page.classList.remove('active'));
    
    // Show selected day page
    const selectedPage = document.getElementById(`day-${day}-page`);
    selectedPage.classList.add('active');
    
    // Update nav underline
    const activeNavBtn = document.querySelector(`.nav-btn[data-day="${day}"]`);
    const underline = document.querySelector('.nav-underline');
    if (activeNavBtn && underline) {
        updateNavUnderline(activeNavBtn, underline);
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Initialize canvas for this day
    setTimeout(() => {
        initializeCanvas(day);
        // Also initialize Gray to Binary canvas if on day 2
        if (day === '2') {
            drawGrayToBinaryCircuit();
        }
        // Initialize multiplexer canvas if on day 3
        if (day === '3') {
            drawMultiplexer();
        }
    }, 100);
}

// Scroll Effects
function initializeScrollEffects() {
    window.addEventListener('scroll', () => {
        const heroTitleContainers = document.querySelectorAll('.hero-title-container');
        heroTitleContainers.forEach(container => {
            if (window.scrollY > 100) {
                container.classList.add('scrolled');
            } else {
                container.classList.remove('scrolled');
            }
        });
    });
}

// Logic Simulator
function initializeLogicSimulators() {
    const powerButtons = document.querySelectorAll('.power-btn');
    
    powerButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.getAttribute('data-input');
            const day = btn.getAttribute('data-day');
            const currentValue = parseInt(btn.textContent);
            const newValue = currentValue === 0 ? 1 : 0;
            
            // Special handling for encoder inputs (only one can be active)
            if (day === '2' && btn.classList.contains('encoder-input')) {
                // Turn off all encoder inputs first
                const encoderInputs = document.querySelectorAll('.encoder-input[data-day="2"]');
                encoderInputs.forEach(encBtn => {
                    encBtn.textContent = '0';
                    encBtn.classList.remove('active');
                    const encInput = encBtn.getAttribute('data-input');
                    state.inputs['2'][encInput] = 0;
                });
                
                // Turn on only the clicked input
                if (newValue === 1) {
                    btn.textContent = '1';
                    btn.classList.add('active');
                    state.inputs[day][input] = 1;
                }
                
                updateEncoderOutputs();
            } else if (btn.classList.contains('gray-input')) {
                // Gray to Binary inputs
                btn.textContent = newValue;
                btn.classList.toggle('active');
                state.inputs['2'][input] = newValue;
                updateGrayToBinary();
            } else if (btn.classList.contains('bcd-input')) {
                // BCD to 7-Segment inputs
                btn.textContent = newValue;
                btn.classList.toggle('active');
                state.inputs['3'][input] = newValue;
                updateBCDTo7Segment();
            } else if (btn.classList.contains('mux-data-input') || btn.classList.contains('mux-select') || btn.classList.contains('mux-enable-btn')) {
                // Multiplexer inputs
                btn.textContent = newValue;
                btn.classList.toggle('active');
                state.inputs['3'][input] = newValue;
                updateMultiplexer();
            } else {
                // Normal behavior for other inputs
                btn.textContent = newValue;
                btn.classList.toggle('active');
                
                // Update state
                if (day) {
                    state.inputs[day][input] = newValue;
                    if (day === '1') {
                        updateDecoderOutputs();
                    } else {
                        updateLogicOutput(day);
                        drawLogicGates(day);
                    }
                } else if (state.currentDay) {
                    state.inputs[state.currentDay][input] = newValue;
                    updateLogicOutput(state.currentDay);
                    drawLogicGates(state.currentDay);
                }
            }
        });
    });
    
    // Initialize decoder, encoder, gray-binary, BCD, and MUX outputs
    updateDecoderOutputs();
    updateEncoderOutputs();
    updateGrayToBinary();
    updateBCDTo7Segment();
    updateMultiplexer();
    
    // Initialize canvases after DOM is fully ready
    // Use multiple attempts to ensure canvas is visible
    setTimeout(() => {
        drawGrayToBinaryCircuit();
        drawMultiplexer();
    }, 100);
    
    setTimeout(() => {
        drawGrayToBinaryCircuit();
        drawMultiplexer();
    }, 500);
    
    setTimeout(() => {
        drawGrayToBinaryCircuit();
        drawMultiplexer();
    }, 1000);
}

// Gray to Binary Conversion Logic
function updateGrayToBinary() {
    const inputs = state.inputs[2];
    const g2 = inputs.G2;
    const g1 = inputs.G1;
    const g0 = inputs.G0;
    
    // Gray to Binary conversion
    // B2 = G2
    // B1 = B2 XOR G1
    // B0 = B1 XOR G0
    const b2 = g2;
    const b1 = b2 ^ g1;
    const b0 = b1 ^ g0;
    
    // Update output displays
    const outputB2 = document.getElementById('binary-output-b2');
    const outputB1 = document.getElementById('binary-output-b1');
    const outputB0 = document.getElementById('binary-output-b0');
    
    if (outputB2) {
        outputB2.textContent = b2;
        outputB2.classList.toggle('active', b2 === 1);
    }
    if (outputB1) {
        outputB1.textContent = b1;
        outputB1.classList.toggle('active', b1 === 1);
    }
    if (outputB0) {
        outputB0.textContent = b0;
        outputB0.classList.toggle('active', b0 === 1);
    }
    
    // Draw the circuit
    drawGrayToBinaryCircuit();
}

function drawGrayToBinaryCircuit() {
    const canvas = document.getElementById('gray-binary-canvas');
    if (!canvas) {
        console.log('Gray binary canvas not found');
        return;
    }
    
    const rect = canvas.getBoundingClientRect();
    // If canvas has no width, it's probably hidden - skip drawing
    if (rect.width === 0) {
        console.log('Gray binary canvas has zero width, skipping draw');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.log('Could not get 2d context for gray binary canvas');
        return;
    }
    
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas size
    canvas.width = rect.width * dpr;
    canvas.height = 400 * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = '400px';
    
    // Scale for high DPI
    ctx.scale(dpr, dpr);
    
    console.log('Drawing Gray to Binary circuit, canvas size:', rect.width, 'x', 400);
    
    const inputs = state.inputs[2];
    const g2 = inputs.G2 || 0;
    const g1 = inputs.G1 || 0;
    const g0 = inputs.G0 || 0;
    
    const b2 = g2;
    const b1 = b2 ^ g1;
    const b0 = b1 ^ g0;
    
    const colorOn = '#10b981';
    const colorOff = '#6b7280';
    
    // Clear canvas
    ctx.clearRect(0, 0, rect.width, 400);
    
    const w = rect.width;
    const h = 400;
    
    // Draw G2 -> B2 (direct connection)
    ctx.strokeStyle = g2 ? colorOn : colorOff;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w * 0.1, h * 0.2);
    ctx.lineTo(w * 0.9, h * 0.2);
    ctx.stroke();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Vazir, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('G2', w * 0.05, h * 0.2 + 5);
    ctx.fillText('B2', w * 0.92, h * 0.2 + 5);
    
    // Draw XOR gate for B1 = B2 XOR G1
    drawXORGate(ctx, w * 0.4, h * 0.45, 80, 60);
    ctx.strokeStyle = b2 ? colorOn : colorOff;
    ctx.beginPath();
    ctx.moveTo(w * 0.1, h * 0.2);
    ctx.lineTo(w * 0.2, h * 0.2);
    ctx.lineTo(w * 0.2, h * 0.45);
    ctx.lineTo(w * 0.4, h * 0.45);
    ctx.stroke();
    
    ctx.strokeStyle = g1 ? colorOn : colorOff;
    ctx.beginPath();
    ctx.moveTo(w * 0.1, h * 0.5);
    ctx.lineTo(w * 0.4, h * 0.5);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.fillText('G1', w * 0.05, h * 0.5 + 5);
    
    ctx.strokeStyle = b1 ? colorOn : colorOff;
    ctx.beginPath();
    ctx.moveTo(w * 0.48, h * 0.475);
    ctx.lineTo(w * 0.9, h * 0.475);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.fillText('B1', w * 0.92, h * 0.475 + 5);
    
    // Draw XOR gate for B0 = B1 XOR G0
    drawXORGate(ctx, w * 0.4, h * 0.75, 80, 60);
    ctx.strokeStyle = b1 ? colorOn : colorOff;
    ctx.beginPath();
    ctx.moveTo(w * 0.48, h * 0.475);
    ctx.lineTo(w * 0.55, h * 0.475);
    ctx.lineTo(w * 0.55, h * 0.75);
    ctx.lineTo(w * 0.4, h * 0.75);
    ctx.stroke();
    
    ctx.strokeStyle = g0 ? colorOn : colorOff;
    ctx.beginPath();
    ctx.moveTo(w * 0.1, h * 0.8);
    ctx.lineTo(w * 0.4, h * 0.8);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.fillText('G0', w * 0.05, h * 0.8 + 5);
    
    ctx.strokeStyle = b0 ? colorOn : colorOff;
    ctx.beginPath();
    ctx.moveTo(w * 0.48, h * 0.775);
    ctx.lineTo(w * 0.9, h * 0.775);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.fillText('B0', w * 0.92, h * 0.775 + 5);
}

function drawXORGate(ctx, x, y, width, height) {
    ctx.save();
    ctx.strokeStyle = '#8b5cf6';
    ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
    ctx.lineWidth = 2;
    
    // XOR gate shape
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + width * 0.7, y, x + width, y + height / 2);
    ctx.quadraticCurveTo(x + width * 0.7, y + height, x, y + height);
    ctx.quadraticCurveTo(x + width * 0.2, y + height / 2, x, y);
    ctx.fill();
    ctx.stroke();
    
    // Extra arc for XOR
    ctx.beginPath();
    ctx.moveTo(x - 5, y);
    ctx.quadraticCurveTo(x + width * 0.15, y + height / 2, x - 5, y + height);
    ctx.stroke();
    
    // Label
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Vazir, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('XOR', x + width / 2, y + height / 2 + 5);
    
    ctx.restore();
}

// Multiplexer Logic
function updateMultiplexer() {
    const inputs = state.inputs[3];
    if (!inputs) return;
    
    const selectValue = (inputs.S0 || 0) + ((inputs.S1 || 0) * 2) + ((inputs.S2 || 0) * 4);
    const enable = inputs.EN || 0;
    
    // Get the selected input value
    const selectedInput = `I${selectValue}`;
    const selectedValue = inputs[selectedInput] || 0;
    
    // When enable is 1, Y gets the selected input, Y' gets NOT of selected input
    // When enable is 0, both outputs are 0
    const outputY = enable ? selectedValue : 0;
    const outputNot = enable ? (1 - selectedValue) : 0;
    
    // Update Y output
    const outputYLed = document.getElementById('mux-output-y');
    if (outputYLed) {
        outputYLed.classList.toggle('active', outputY === 1);
    }
    
    // Update Y' (NOT) output
    const outputNotLed = document.getElementById('mux-output-not');
    if (outputNotLed) {
        outputNotLed.classList.toggle('active', outputNot === 1);
    }
    
    // Update selected input label
    const selectedLabel = document.getElementById('selected-input');
    if (selectedLabel) {
        selectedLabel.textContent = `Selected: ${selectedInput}`;
    }
    
    // Redraw the multiplexer diagram
    drawMultiplexer();
}

function drawMultiplexer() {
    const canvas = document.getElementById('mux-canvas');
    if (!canvas) {
        console.log('MUX canvas not found');
        return;
    }
    
    const rect = canvas.getBoundingClientRect();
    // If canvas has no width, it's probably hidden - skip drawing
    if (rect.width === 0) {
        console.log('MUX canvas has zero width, skipping draw');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.log('Could not get 2d context for MUX canvas');
        return;
    }
    
    const dpr = window.devicePixelRatio || 1;
    
    // Determine canvas height based on screen size
    const canvasHeight = rect.width < 400 ? 400 : 500;
    
    // Set canvas size
    canvas.width = rect.width * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = canvasHeight + 'px';
    
    // Scale for high DPI
    ctx.scale(dpr, dpr);
    
    console.log('Drawing Multiplexer, canvas size:', rect.width, 'x', canvasHeight);
    
    const inputs = state.inputs[3];
    const selectValue = (inputs.S0 || 0) + ((inputs.S1 || 0) * 2) + ((inputs.S2 || 0) * 4);
    const selectedInput = `I${selectValue}`;
    const outputValue = inputs[selectedInput] || 0;
    
    const colorOn = '#10b981';
    const colorOff = '#6b7280';
    const colorSelected = '#f59e0b';
    
    // Clear canvas
    ctx.clearRect(0, 0, rect.width, canvasHeight);
    
    const w = rect.width;
    const h = canvasHeight;
    
    // Draw MUX box
    ctx.strokeStyle = '#8b5cf6';
    ctx.fillStyle = 'rgba(139, 92, 246, 0.1)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w * 0.3, h * 0.1);
    ctx.lineTo(w * 0.7, h * 0.2);
    ctx.lineTo(w * 0.7, h * 0.8);
    ctx.lineTo(w * 0.3, h * 0.9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Draw MUX label
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Vazir, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MUX', w * 0.5, h * 0.5);
    ctx.font = '14px Vazir, Arial, sans-serif';
    ctx.fillText('8:1', w * 0.5, h * 0.55);
    
    // Draw data inputs
    for (let i = 0; i < 8; i++) {
        const y = h * (0.15 + i * 0.08);
        const inputKey = `I${i}`;
        const isSelected = i === selectValue;
        const inputValue = inputs[inputKey];
        
        ctx.strokeStyle = isSelected ? colorSelected : (inputValue ? colorOn : colorOff);
        ctx.lineWidth = isSelected ? 4 : 2;
        ctx.beginPath();
        ctx.moveTo(w * 0.05, y);
        ctx.lineTo(w * 0.3, y);
        ctx.stroke();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Vazir, Arial, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(inputKey, w * 0.03, y + 5);
    }
    
    // Draw selection inputs at bottom
    const selInputs = ['S0', 'S1', 'S2'];
    selInputs.forEach((sel, idx) => {
        const x = w * (0.35 + idx * 0.15);
        const selValue = inputs[sel];
        
        ctx.strokeStyle = selValue ? colorOn : colorOff;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, h * 0.95);
        ctx.lineTo(x, h * 0.9);
        ctx.stroke();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Vazir, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(sel, x, h * 0.98);
    });
    
    // Calculate outputs
    const enable = inputs.EN;
    const outputY = enable ? outputValue : 0;
    const outputNot = enable ? (1 - outputValue) : 0;
    
    // Draw Y output
    ctx.strokeStyle = outputY ? colorOn : colorOff;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w * 0.7, h * 0.45);
    ctx.lineTo(w * 0.95, h * 0.45);
    ctx.stroke();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Vazir, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Y', w * 0.96, h * 0.45 + 5);
    
    // Draw Y' (NOT) output
    ctx.strokeStyle = outputNot ? colorOn : colorOff;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w * 0.7, h * 0.55);
    ctx.lineTo(w * 0.95, h * 0.55);
    ctx.stroke();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Vazir, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText("Y'", w * 0.96, h * 0.55 + 5);
    
    // Draw enable indicator
    ctx.fillStyle = enable ? colorOn : colorOff;
    ctx.font = '14px Vazir, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`EN: ${enable}`, w * 0.5, h * 0.08);
}

// BCD to 7-Segment Decoder Logic
function updateBCDTo7Segment() {
    const inputs = state.inputs[3];
    const bcdValue = inputs.A + (inputs.B * 2) + (inputs.C * 4) + (inputs.D * 8);
    
    // 7-segment patterns for digits 0-9 (a,b,c,d,e,f,g)
    const segmentPatterns = {
        0: [1,1,1,1,1,1,0],
        1: [0,1,1,0,0,0,0],
        2: [1,1,0,1,1,0,1],
        3: [1,1,1,1,0,0,1],
        4: [0,1,1,0,0,1,1],
        5: [1,0,1,1,0,1,1],
        6: [1,0,1,1,1,1,1],
        7: [1,1,1,0,0,0,0],
        8: [1,1,1,1,1,1,1],
        9: [1,1,1,1,0,1,1]
    };
    
    // Update decimal display
    const decimalDisplay = document.getElementById('decimal-value');
    if (decimalDisplay) {
        if (bcdValue <= 9) {
            decimalDisplay.textContent = bcdValue;
        } else {
            decimalDisplay.textContent = '-';
        }
    }
    
    // Update 7-segment display
    const segments = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    const pattern = segmentPatterns[bcdValue] || [0,0,0,0,0,0,0];
    
    segments.forEach((seg, index) => {
        const element = document.getElementById(`seg-${seg}`);
        if (element) {
            if (pattern[index] === 1) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        }
    });
}

// Encoder Logic for Day 2
function updateEncoderOutputs() {
    const inputs = state.inputs[2];
    
    // Find which input is active (priority encoder - highest input has priority)
    let activeInput = -1;
    for (let i = 7; i >= 0; i--) {
        const inputKey = `Y${i}`;
        if (inputs[inputKey] === 1) {
            activeInput = i;
            break;
        }
    }
    
    // Calculate binary output
    let a2 = 0, a1 = 0, a0 = 0;
    if (activeInput >= 0) {
        a2 = (activeInput & 0b100) >> 2;
        a1 = (activeInput & 0b010) >> 1;
        a0 = (activeInput & 0b001);
    }
    
    // Update output displays
    const outputA2 = document.getElementById('encoder-output-a2');
    const outputA1 = document.getElementById('encoder-output-a1');
    const outputA0 = document.getElementById('encoder-output-a0');
    
    if (outputA2) {
        outputA2.textContent = a2;
        outputA2.classList.toggle('active', a2 === 1);
    }
    if (outputA1) {
        outputA1.textContent = a1;
        outputA1.classList.toggle('active', a1 === 1);
    }
    if (outputA0) {
        outputA0.textContent = a0;
        outputA0.classList.toggle('active', a0 === 1);
    }
}

// Decoder Logic for Day 1
function updateDecoderOutputs() {
    const inputs = state.inputs[1];
    const enable = inputs.E;
    
    // If enable is 0 (disabled), all outputs are off
    if (enable === 0) {
        for (let i = 0; i < 8; i++) {
            const led = document.getElementById(`output-d${i}`);
            if (led) led.classList.remove('active');
        }
        return;
    }
    
    // Calculate which output should be active based on S0, S1, S2
    const activeOutput = inputs.S0 + (inputs.S1 * 2) + (inputs.S2 * 4);
    
    // Update all output LEDs
    for (let i = 0; i < 8; i++) {
        const led = document.getElementById(`output-d${i}`);
        if (led) {
            if (i === activeOutput) {
                led.classList.add('active');
            } else {
                led.classList.remove('active');
            }
        }
    }
}

// Update Logic Output
function updateLogicOutput(day) {
    const inputs = state.inputs[day];
    const logicFunc = logicFunctions[day];
    const output = logicFunc(inputs) ? 1 : 0;
    
    const outputElement = document.getElementById(`output-${day}`);
    if (outputElement) {
        outputElement.textContent = output;
        if (output === 1) {
            outputElement.classList.add('active');
        } else {
            outputElement.classList.remove('active');
        }
    }
}

// Canvas Drawing
function initializeCanvas(day) {
    const canvas = document.getElementById(`logic-canvas-${day}`);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    // Use device pixel ratio for sharper rendering on mobile
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    
    drawLogicGates(day);
}

function drawLogicGates(day) {
    const canvas = document.getElementById(`logic-canvas-${day}`);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const inputs = state.inputs[day];
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Canvas dimensions
    const w = canvas.width;
    const h = canvas.height;
    
    // Colors
    const colorOff = '#ef4444';
    const colorOn = '#10b981';
    const wireColor = '#3b82f6';
    
    // Draw based on day (this is a template - will be customized per problem)
    drawExampleCircuit(ctx, w, h, inputs, colorOff, colorOn, wireColor);
}

// Example Circuit Drawing (to be customized)
function drawExampleCircuit(ctx, w, h, inputs, colorOff, colorOn, wireColor) {
    const centerX = w / 2;
    const centerY = h / 2;
    
    // Input positions
    const inputY = [h * 0.25, h * 0.5, h * 0.75];
    const inputX = w * 0.2;
    
    // Draw input nodes
    ['A', 'B', 'C'].forEach((input, i) => {
        const value = inputs[input];
        const color = value === 1 ? colorOn : colorOff;
        
        // Input circle
        ctx.beginPath();
        ctx.arc(inputX, inputY[i], 15, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Input label
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Vazir';
        ctx.textAlign = 'right';
        ctx.fillText(input, inputX - 25, inputY[i] + 5);
        
        // Wire from input
        ctx.beginPath();
        ctx.moveTo(inputX + 15, inputY[i]);
        ctx.lineTo(centerX - 60, inputY[i]);
        ctx.strokeStyle = value === 1 ? colorOn : wireColor;
        ctx.lineWidth = 3;
        ctx.stroke();
    });
    
    // Draw logic gate (example AND gate)
    drawANDGate(ctx, centerX - 50, centerY - 40, 100, 80);
    
    // Output wire
    const outputValue = logicFunctions[1](inputs) ? 1 : 0;
    ctx.beginPath();
    ctx.moveTo(centerX + 50, centerY);
    ctx.lineTo(w * 0.8, centerY);
    ctx.strokeStyle = outputValue === 1 ? colorOn : wireColor;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Output circle
    ctx.beginPath();
    ctx.arc(w * 0.8, centerY, 15, 0, Math.PI * 2);
    ctx.fillStyle = outputValue === 1 ? colorOn : colorOff;
    ctx.fill();
    ctx.strokeStyle = outputValue === 1 ? colorOn : colorOff;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Output label
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Vazir';
    ctx.textAlign = 'left';
    ctx.fillText('OUT', w * 0.8 + 25, centerY + 5);
}

// Logic Gate Shapes
function drawANDGate(ctx, x, y, width, height) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width * 0.6, y);
    ctx.arc(x + width * 0.6, y + height / 2, height / 2, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(x, y + height);
    ctx.closePath();
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.fill();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Label
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Vazir';
    ctx.textAlign = 'center';
    ctx.fillText('AND', x + width / 2, y + height / 2 + 5);
}

function drawORGate(ctx, x, y, width, height) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + width * 0.7, y, x + width, y + height / 2);
    ctx.quadraticCurveTo(x + width * 0.7, y + height, x, y + height);
    ctx.quadraticCurveTo(x + width * 0.2, y + height / 2, x, y);
    ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
    ctx.fill();
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Label
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Vazir';
    ctx.textAlign = 'center';
    ctx.fillText('OR', x + width / 2, y + height / 2 + 5);
}

function drawNOTGate(ctx, x, y, width, height) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y + height / 2);
    ctx.lineTo(x, y + height);
    ctx.closePath();
    ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
    ctx.fill();
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Bubble
    ctx.beginPath();
    ctx.arc(x + width + 5, y + height / 2, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
    ctx.fill();
    ctx.strokeStyle = '#06b6d4';
    ctx.stroke();
    
    // Label
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Vazir';
    ctx.textAlign = 'center';
    ctx.fillText('NOT', x + width / 2, y + height / 2 + 5);
}

// Test Navigation for Day 2
function initializeTestNavigation() {
    const testButtons = document.querySelectorAll('.test-nav-btn');
    const underline = document.querySelector('.test-nav-underline');
    
    testButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const test = btn.getAttribute('data-test');
            const day = btn.getAttribute('data-day');
            switchTest(day, test);
            updateTestUnderline(btn, underline);
        });
    });
    
    // Initialize underline position
    const activeBtn = document.querySelector('.test-nav-btn.active');
    if (activeBtn && underline) {
        updateTestUnderline(activeBtn, underline);
    }
}

function switchTest(day, test) {
    // Hide all test contents for this day
    const testContents = document.querySelectorAll(`#day-${day}-page .test-content`);
    testContents.forEach(content => content.classList.remove('active'));
    
    // Show selected test content
    const selectedTest = document.getElementById(`day-${day}-test-${test}`);
    if (selectedTest) {
        selectedTest.classList.add('active');
    }
    
    // Update button states
    const testButtons = document.querySelectorAll(`.test-nav-btn[data-day="${day}"]`);
    testButtons.forEach(btn => btn.classList.remove('active'));
    
    const activeBtn = document.querySelector(`.test-nav-btn[data-day="${day}"][data-test="${test}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Initialize Gray to Binary canvas for day 2, test 2
    if (day === '2' && test === '2') {
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
            setTimeout(() => {
                drawGrayToBinaryCircuit();
            }, 50);
        });
    }
    
    // Initialize Multiplexer canvas for day 3, test 2
    if (day === '3' && test === '2') {
        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
            setTimeout(() => {
                drawMultiplexer();
            }, 50);
        });
    }
    
    // Scroll to top of content
    window.scrollTo({ top: 200, behavior: 'smooth' });
}

function updateTestUnderline(activeBtn, underline) {
    if (!underline) return;
    
    const btnRect = activeBtn.getBoundingClientRect();
    const containerRect = activeBtn.parentElement.getBoundingClientRect();
    const offsetLeft = btnRect.left - containerRect.left;
    
    const adjustedWidth = btnRect.width * 0.8;
    const centerOffset = (btnRect.width - adjustedWidth) / 2;
    const rightShift = btnRect.width * 0.2; // Move 50% to the right
    
    underline.style.width = `${adjustedWidth}px`;
    underline.style.left = `${offsetLeft + centerOffset + rightShift}px`;
}

// Image Lightbox
function initializeImageLightbox() {
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxOverlay = document.querySelector('.lightbox-overlay');
    
    // Make openLightbox globally accessible
    window.openLightbox = function(imageSrc) {
        lightboxImage.src = imageSrc;
        lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };
    
    // Function to close lightbox
    function closeLightbox() {
        lightbox.classList.add('hidden');
        document.body.style.overflow = '';
    }
    
    // Add click listeners to all images
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG' && 
            (e.target.classList.contains('circuit-image') || 
            e.target.classList.contains('greeting-day-image') ||
            e.target.classList.contains('album-image'))) {
            window.openLightbox(e.target.src);
        }
    });
    
    // Close lightbox on close button click
    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close lightbox on overlay click
    lightboxOverlay.addEventListener('click', closeLightbox);
    
    // Close lightbox on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
            closeLightbox();
        }
    });
}

// Responsive canvas resize with debounce for better mobile performance
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (state.currentDay) {
            initializeCanvas(state.currentDay);
        }
        // Redraw other canvases
        drawGrayToBinaryCircuit();
        drawMultiplexer();
    }, 250);
});