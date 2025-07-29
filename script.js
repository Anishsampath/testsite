const cubes = document.querySelectorAll('.cube');
const shuffleButton = document.getElementById('shuffleButton');
const guessButtons = document.querySelectorAll('.guess-btn');
const diceTotalDisplay = document.getElementById('dice-total-display');
const messageArea = document.getElementById('message-area');
const playAgainButton = document.getElementById('playAgainButton');
const gameArea = document.querySelector('.game-area'); // To apply win animation

// Game State
let userGuess = null;
let rollResults = [0, 0]; // To store the result of each die (1-6)
let transitionsCompleted = 0; // To track when both dice have finished animating

// A map to store active state and start coordinates for each cube
const cubeStates = new Map();

// --- Dice Face Rotation Mapping ---
// These are target rotations for the *cube* that make a specific face point directly UP.
// They are based on a standard dice layout assuming:
// Front: 1, Back: 6, Right: 3, Left: 4, Top: 5, Bottom: 2
// The base transform is rotateX(0deg) rotateY(0deg) for the 'front' face.
// To make a face visible 'up', we apply a specific rotation.
const faceUpRotations = {
    // x: rotation around horizontal axis (forwards/backwards tilt)
    // y: rotation around vertical axis (spin left/right)
    1: {x: 0, y: 0},       // Front face 1 (if cube is initially aligned with 1 front and 5 top)
    2: {x: 90, y: 0},     // Bottom face 2
    3: {x: 0, y: -90},    // Right face 3
    4: {x: 0, y: 90},     // Left face 4
    5: {x: -90, y: 0},    // Top face 5
    6: {x: 180, y: 0}     // Back face 6
};

// --- Game Initialization ---
function initGame() {
    // Reset state
    userGuess = null;
    rollResults = [0, 0];
    transitionsCompleted = 0;

    // Reset UI
    diceTotalDisplay.textContent = 'Total: --';
    messageArea.textContent = '';
    messageArea.classList.remove('win', 'lose'); // Clear previous styling
    playAgainButton.classList.add('hidden');
    shuffleButton.disabled = true; // Shuffle button is disabled until a guess is made
    gameArea.classList.remove('win-celebration'); // Remove fireworks

    // Enable and reset guess buttons
    guessButtons.forEach(button => {
        button.disabled = false;
        button.classList.remove('selected');
    });

    // Reset cube initial rotation
    cubes.forEach(cube => {
        cube.dataset.currentX = -30;
        cube.dataset.currentY = 45;
        cube.dataset.currentZ = 0;
        cube.style.transition = 'none'; // No transition on reset
        cube.style.transform = `rotateX(${cube.dataset.currentX}deg) rotateY(${cube.dataset.currentY}deg) rotateZ(${cube.dataset.currentZ}deg)`;
        setTimeout(() => { // Re-enable transition after a very short delay to avoid flicker
            cube.style.transition = 'transform 1.2s ease-out';
        }, 50);
    });
}

// --- Event Listeners for Guess Buttons ---
guessButtons.forEach(button => {
    button.addEventListener('click', () => {
        userGuess = button.dataset.guess;
        guessButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        shuffleButton.disabled = false; // Enable shuffle button after a guess
        messageArea.textContent = ''; // Clear any previous messages
    });
});

// --- Cube Rotation Logic ---
cubes.forEach(cube => {
    // Apply initial transform from dataset values
    cube.style.transform = `rotateX(${cube.dataset.currentX}deg) rotateY(${cube.dataset.currentY}deg) rotateZ(${cube.dataset.currentZ}deg)`;

    // Mouse events (for individual drag)
    cube.addEventListener('mousedown', (e) => {
        e.preventDefault();
        // Allow dragging ONLY if the cube is not currently shuffling (animating a roll)
        if (!cube.classList.contains('shuffling')) {
            cubeStates.set(cube, {
                isDragging: true,
                startX: e.clientX,
                startY: e.clientY
            });
            cube.style.transition = 'none';
        }
    });

    // Touch events (for individual drag)
    cube.addEventListener('touchstart', (e) => {
        e.preventDefault();
        // Allow dragging ONLY if the cube is not currently shuffling (animating a roll)
        if (!cube.classList.contains('shuffling')) {
            cubeStates.set(cube, {
                isDragging: true,
                startX: e.touches[0].clientX,
                startY: e.touches[0].clientY
            });
            cube.style.transition = 'none';
        }
    });

    // Listen for end of shuffle animation
    cube.addEventListener('transitionend', function handler(e) {
        // Ensure it's the transform property that ended, not opacity or other.
        if (e.propertyName === 'transform' && cube.classList.contains('shuffling')) {
            transitionsCompleted++;
            cube.classList.remove('shuffling'); // Remove class after animation
            if (transitionsCompleted === cubes.length) {
                // Both dice have finished animating
                checkGuess();
            }
        }
    });
});

// Global Mouse/Touch Move and Up Listeners for Dragging
document.addEventListener('mousemove', (e) => {
    cubes.forEach(cube => {
        const state = cubeStates.get(cube);
        if (state && state.isDragging) {
            const dx = e.clientX - state.startX;
            const dy = e.clientY - state.startY;

            let newCurrentY = parseFloat(cube.dataset.currentY) + dx * 0.5;
            let newCurrentX = parseFloat(cube.dataset.currentX) - dy * 0.5;

            cube.style.transform = `rotateX(${newCurrentX}deg) rotateY(${newCurrentY}deg) rotateZ(${cube.dataset.currentZ}deg)`;

            cube.dataset.currentX = newCurrentX;
            cube.dataset.currentY = newCurrentY;

            state.startX = e.clientX;
            state.startY = e.clientY;
        }
    });
});

document.addEventListener('mouseup', () => {
    cubes.forEach(cube => {
        const state = cubeStates.get(cube);
        if (state && state.isDragging) {
            state.isDragging = false;
            cube.style.transition = 'transform 1.2s ease-out'; // Re-enable transition for future shuffles
        }
    });
});

document.addEventListener('touchmove', (e) => {
    cubes.forEach(cube => {
        const state = cubeStates.get(cube);
        if (state && state.isDragging) {
            e.preventDefault();

            const dx = e.touches[0].clientX - state.startX;
            const dy = e.touches[0].clientY - state.startY;

            let newCurrentY = parseFloat(cube.dataset.currentY) + dx * 0.5;
            let newCurrentX = parseFloat(cube.dataset.currentX) - dy * 0.5;

            cube.style.transform = `rotateX(${newCurrentX}deg) rotateY(${newCurrentY}deg) rotateZ(${cube.dataset.currentZ}deg)`;

            cube.dataset.currentX = newCurrentX;
            cube.dataset.currentY = newCurrentY;
            state.startX = e.touches[0].clientX;
            state.startY = e.touches[0].clientY;
        }
    });
});

document.addEventListener('touchend', () => {
    cubes.forEach(cube => {
        const state = cubeStates.get(cube);
        if (state && state.isDragging) {
            state.isDragging = false;
            cube.style.transition = 'transform 1.2s ease-out';
        }
    });
});

// --- Shuffle Button Logic ---
shuffleButton.addEventListener('click', () => {
    if (!userGuess) {
        messageArea.textContent = "Please make a guess first!";
        return;
    }

    shuffleButton.disabled = true;
    guessButtons.forEach(button => button.disabled = true); // Disable guess buttons after choice
    messageArea.textContent = ''; // Clear previous message
    diceTotalDisplay.textContent = 'Total: --';
    transitionsCompleted = 0; // Reset counter for new roll

    cubes.forEach((cube, index) => {
        cube.classList.add('shuffling');
        cube.style.transition = 'transform 1.2s ease-out'; // Ensure transition is active

        // Simulate dice roll (1-6)
        const roll = Math.floor(Math.random() * 6) + 1;
        rollResults[index] = roll; // Store the result

        // Get the exact target rotation for this specific roll to make the face point UP
        const targetFaceRotation = faceUpRotations[roll];

        // Get the current rotations from the dataset
        let currentX = parseFloat(cube.dataset.currentX);
        let currentY = parseFloat(cube.dataset.currentY);
        let currentZ = parseFloat(cube.dataset.currentZ);

        // Normalize current rotations to be within 0-360 for consistent tumble calculation
        currentX = currentX % 360;
        currentY = currentY % 360;

        // Add random full revolutions to create the "tumble" effect during the animation.
        const revolutionsX = (Math.floor(Math.random() * 5) + 5) * 360; // 5 to 9 full rotations
        const revolutionsY = (Math.floor(Math.random() * 5) + 5) * 360;

        // Calculate the final rotation values.
        const finalX = targetFaceRotation.x + revolutionsX;
        const finalY = targetFaceRotation.y + revolutionsY;
        
        // Add a random Z-axis spin for extra visual flair during the shuffle.
        const revolutionsZ = (Math.floor(Math.random() * 2) + 1) * 360; // 1 to 2 full rotations
        const finalZ = (Math.random() * 180 - 90) + revolutionsZ; // Random spin between -90 and 90, plus revolutions

        // Apply the calculated final rotation.
        cube.style.transform = `rotateX(${finalX}deg) rotateY(${finalY}deg) rotateZ(${finalZ}deg)`;

        // Update dataset with these new final rotation values.
        cube.dataset.currentX = finalX;
        cube.dataset.currentY = finalY;
        cube.dataset.currentZ = finalZ;
    });
});

// --- Check Guess Logic ---
function checkGuess() {
    const total = rollResults[0] + rollResults[1];
    diceTotalDisplay.textContent = `Total: ${total}`;

    let correct = false;
    if (userGuess === '<7' && total < 7) {
        correct = true;
    } else if (userGuess === '7' && total === 7) {
        correct = true;
    } else if (userGuess === '>7' && total > 7) {
        correct = true;
    }

    if (correct) {
        messageArea.textContent = "YOU WIN! 🎉";
        messageArea.style.color = "#32CD32"; // Lime green for win
        gameArea.classList.add('win-celebration'); // Trigger fireworks effect
    } else {
        messageArea.textContent = "Try again! 😞";
        messageArea.style.color = "#FF4500"; // Orange red for lose
    }

    playAgainButton.classList.remove('hidden'); // Show play again button
}

// --- Play Again Button Logic ---
playAgainButton.addEventListener('click', initGame);

// Initial game setup when page loads
initGame();
