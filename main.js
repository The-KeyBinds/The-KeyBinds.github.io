const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray = [];
let adjustX = 0;
let adjustY = 0;

// Handle mouse
const mouse = {
    x: null,
    y: null,
    radius: 150
}

window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = 3;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
        this.color = color;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 10;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 10;
            }
        }
    }
}

function init() {
    particleArray = [];

    // Dynamic font size - significantly larger
    let fontSize = Math.min(window.innerWidth / 5, 250);
    ctx.font = '800 ' + fontSize + 'px Nunito';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Create Gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0.3, '#ff00cc'); // Purple-ish pink
    gradient.addColorStop(0.7, '#333399'); // Deep purple

    // Draw text to get data
    ctx.fillStyle = gradient;
    ctx.fillText('The Keybinds', canvas.width / 2, canvas.height / 2);

    // Scan the canvas
    const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Clear the canvas after scanning
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Increase step to make particles sparse (10 instead of 4)
    const step = 10;

    for (let y = 0, y2 = textCoordinates.height; y < y2; y += step) {
        for (let x = 0, x2 = textCoordinates.width; x < x2; x += step) {
            // Check alpha value
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
                let positionX = x;
                let positionY = y;

                // Extract color from pixel data
                const r = textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4)];
                const g = textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 1];
                const b = textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 2];
                const color = `rgb(${r},${g},${b})`;

                particleArray.push(new Particle(positionX, positionY, color));
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update();
    }
    requestAnimationFrame(animate);
}

document.fonts.ready.then(function () {
    init();
    animate();
});

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});
