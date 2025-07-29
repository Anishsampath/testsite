const cubes = document.querySelectorAll('.cube');

let activeCube = null; // Stores the cube currently being dragged
let startX = 0, startY = 0; // Initial mouse/touch position

// Initialize rotation state for each cube and attach individual mousedown/touchstart listeners
cubes.forEach(cube => {
    // Set initial rotation state as data attributes
    cube.dataset.currentX = -30; // Initial X rotation
    cube.dataset.currentY = 45;  // Initial Y rotation

    // Apply initial transform from dataset values
    cube.style.transform = `rotateX(${cube.dataset.currentX}deg) rotateY(${cube.dataset.currentY}deg)`;

    // Mouse events
    cube.addEventListener('mousedown', (e) => {
        activeCube = cube; // This cube is now the active one
        startX = e.clientX;
        startY = e.clientY;
        activeCube.style.transition = 'none'; // Disable transition during drag
    });

    // Touch events
    cube.addEventListener('touchstart', (e) => {
        activeCube = cube; // This cube is now the active one
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        activeCube.style.transition = 'none';
        e.preventDefault(); // Prevent scrolling on touch
    });
});

// Global mouse move and up listeners to handle dragging any active cube
document.addEventListener('mousemove', (e) => {
    if (!activeCube) return; // No cube is being dragged

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    // Calculate new rotation based on current values from dataset
    let newCurrentY = parseFloat(activeCube.dataset.currentY) + dx * 0.5;
    let newCurrentX = parseFloat(activeCube.dataset.currentX) - dy * 0.5;

    // Apply new transform
    activeCube.style.transform = `rotateX(${newCurrentX}deg) rotateY(${newCurrentY}deg)`;

    // Update dataset for next drag movement
    activeCube.dataset.currentX = newCurrentX;
    activeCube.dataset.currentY = newCurrentY;
    startX = e.clientX; // Update start for continuous drag
    startY = e.clientY;
});

document.addEventListener('mouseup', () => {
    if (activeCube) {
        activeCube.style.transition = 'transform 0.1s linear'; // Re-enable transition
        activeCube = null; // Release the active cube
    }
});

// Global touch move and up listeners
document.addEventListener('touchmove', (e) => {
    if (!activeCube) return;
    e.preventDefault(); // Prevent scrolling while dragging

    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;

    let newCurrentY = parseFloat(activeCube.dataset.currentY) + dx * 0.5;
    let newCurrentX = parseFloat(activeCube.dataset.currentX) - dy * 0.5;

    activeCube.style.transform = `rotateX(${newCurrentX}deg) rotateY(${newCurrentY}deg)`;

    activeCube.dataset.currentX = newCurrentX;
    activeCube.dataset.currentY = newCurrentY;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.addEventListener('touchend', () => {
    if (activeCube) {
        activeCube.style.transition = 'transform 0.1s linear';
        activeCube = null;
    }
});const cube = document.querySelector('.cube');
let isDragging = false;
let startX, startY;
let currentX = -30, currentY = 45; // Initial rotation from CSS

document.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    cube.style.transition = 'none'; // Disable transition during drag
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    // Adjust sensitivity as needed
    currentY += dx * 0.5;
    currentX -= dy * 0.5;

    // Apply rotation
    cube.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;

    startX = e.clientX;
    startY = e.clientY;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    cube.style.transition = 'transform 0.1s linear'; // Re-enable transition after drag
});

// Handle touch events for mobile
document.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    cube.style.transition = 'none';
});

document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevent scrolling while dragging

    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;

    currentY += dx * 0.5;
    currentX -= dy * 0.5;

    cube.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.addEventListener('touchend', () => {
    isDragging = false;
    cube.style.transition = 'transform 0.1s linear';
});

