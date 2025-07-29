const cubes = document.querySelectorAll('.cube');

// A map to store active state and start coordinates for each cube
const cubeStates = new Map();

cubes.forEach(cube => {
    // Initialize rotation state for each cube using data attributes
    cube.dataset.currentX = -30; // Initial X rotation
    cube.dataset.currentY = 45;  // Initial Y rotation

    // Apply initial transform from dataset values
    cube.style.transform = `rotateX(${cube.dataset.currentX}deg) rotateY(${cube.dataset.currentY}deg)`;

    // Mouse events for each cube
    cube.addEventListener('mousedown', (e) => {
        // Prevent default drag behavior
        e.preventDefault();

        // Store the state for this specific cube
        cubeStates.set(cube, {
            isDragging: true,
            startX: e.clientX,
            startY: e.clientY
        });
        cube.style.transition = 'none'; // Disable transition during drag
    });

    // Touch events for each cube
    cube.addEventListener('touchstart', (e) => {
        // Prevent scrolling on touch
        e.preventDefault();

        // Store the state for this specific cube
        cubeStates.set(cube, {
            isDragging: true,
            startX: e.touches[0].clientX,
            startY: e.touches[0].clientY
        });
        cube.style.transition = 'none';
    });
});

// Global mouse/touch move and up listeners to handle dragging any active cube
document.addEventListener('mousemove', (e) => {
    // Iterate through all cubes to find the one being dragged
    cubes.forEach(cube => {
        const state = cubeStates.get(cube);
        if (state && state.isDragging) {
            const dx = e.clientX - state.startX;
            const dy = e.clientY - state.startY;

            let newCurrentY = parseFloat(cube.dataset.currentY) + dx * 0.5;
            let newCurrentX = parseFloat(cube.dataset.currentX) - dy * 0.5;

            cube.style.transform = `rotateX(${newCurrentX}deg) rotateY(${newCurrentY}deg)`;

            // Update dataset for next drag movement
            cube.dataset.currentX = newCurrentX;
            cube.dataset.currentY = newCurrentY;

            // Update start position for continuous drag
            state.startX = e.clientX;
            state.startY = e.clientY;
        }
    });
});

document.addEventListener('mouseup', () => {
    cubes.forEach(cube => {
        const state = cubeStates.get(cube);
        if (state && state.isDragging) {
            state.isDragging = false; // Stop dragging for this cube
            cube.style.transition = 'transform 0.1s linear'; // Re-enable transition
        }
    });
});

document.addEventListener('touchmove', (e) => {
    cubes.forEach(cube => {
        const state = cubeStates.get(cube);
        if (state && state.isDragging) {
            e.preventDefault(); // Prevent scrolling while dragging

            const dx = e.touches[0].clientX - state.startX;
            const dy = e.touches[0].clientY - state.startY;

            let newCurrentY = parseFloat(cube.dataset.currentY) + dx * 0.5;
            let newCurrentX = parseFloat(cube.dataset.currentX) - dy * 0.5;

            cube.style.transform = `rotateX(${newCurrentX}deg) rotateY(${newCurrentY}deg)`;

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
            cube.style.transition = 'transform 0.1s linear';
        }
    });
});
