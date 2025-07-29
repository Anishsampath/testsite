const cubes = document.querySelectorAll('.cube');
const shuffleButton = document.getElementById('shuffleButton');

// A map to store active state and start coordinates for each cube
const cubeStates = new Map();

// --- Utility Functions for Dice Roll ---
function getRandomRotation() {
    // Generate random rotations that make the dice appear to roll
    // Multiples of 90 degrees for faces, plus some extra for "tumble"
    const x = Math.floor(Math.random() * 4) * 90 + (Math.random() * 360);
    const y = Math.floor(Math.random() * 4) * 90 + (Math.random() * 360);
    const z = Math.floor(Math.random() * 4) * 90 + (Math.random() * 360); // Add Z rotation for more realism
    return { x, y, z };
}

// --- Initialize Cubes and Event Listeners ---
cubes.forEach(cube => {
    // Set initial rotation state as data attributes
    cube.dataset.currentX = -30; // Initial X rotation
    cube.dataset.currentY = 45;  // Initial Y rotation
    cube.dataset.currentZ = 0;   // Initial Z rotation

    // Apply initial transform from dataset values
    cube.style.transform = `rotateX(${cube.dataset.currentX}deg) rotateY(${cube.dataset.currentY}deg) rotateZ(${cube.dataset.currentZ}deg)`;

    // Mouse events (for individual drag)
    cube.addEventListener('mousedown', (e) => {
        // Prevent default drag behavior
        e.preventDefault();
        // Only allow dragging if not currently shuffling
        if (!cube.classList.contains('shuffling')) {
            cubeStates.set(cube, {
                isDragging: true,
                startX: e.clientX,
                startY: e.clientY
            });
            cube.style.transition = 'none'; // Disable transition during drag
        }
    });

    // Touch events (for individual drag)
    cube.addEventListener('touchstart', (e) => {
        // Prevent scrolling on touch
        e.preventDefault();
        // Only allow dragging if not currently shuffling
        if (!cube.classList.contains('shuffling')) {
            cubeStates.set(cube, {
                isDragging: true,
                startX: e.touches[0].clientX,
                startY: e.touches[0].clientY
            });
            cube.style.transition = 'none';
        }
    });
});

// --- Global Mouse/Touch Move and Up Listeners for Dragging ---
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
            cube.style.transition = 'transform 1s ease-out'; // Re-enable transition for future shuffles
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
            cube.style.transition = 'transform 1s ease-out';
        }
    });
});

// --- Shuffle Button Logic ---
shuffleButton.addEventListener('click', () => {
    shuffleButton.disabled = true; // Disable button during shuffle

    cubes.forEach((cube, index) => {
        cube.classList.add('shuffling'); // Add class to indicate shuffling
        cube.style.transition = 'transform 1s ease-out'; // Ensure transition is active

        // Get random rotation values
        const { x, y, z } = getRandomRotation();

        // Apply the random rotation
        cube.style.transform = `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;

        // Update dataset with new rotation values for future drags/shuffles
        cube.dataset.currentX = x;
        cube.dataset.currentY = y;
        cube.dataset.currentZ = z;

        // Re-enable button and remove shuffling class after animation
        cube.addEventListener('transitionend', function handler() {
            cube.classList.remove('shuffling');
            shuffleButton.disabled = false;
            cube.removeEventListener('transitionend', handler); // Remove listener to prevent multiple calls
        }, { once: true }); // Ensure listener runs only once
    });
});
