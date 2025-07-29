const cube = document.querySelector('.cube');
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
