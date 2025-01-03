const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.7;

// Sprite Class
class Sprite {
    constructor({ position, velocity, color = 'red', offset }) {
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey = null;
        this.attackBox = {
            position: { x: this.position.x, y: this.position.y },
            offset,
            width: 100,
            height: 50,
        };
        this.color = color;
        this.isAttacking = false;
    }

    draw() {
        // Draw character
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);

        // Draw attack box if attacking
        if (this.isAttacking) {
            c.fillStyle = 'green';
            c.fillRect(
                this.attackBox.position.x + this.attackBox.offset.x,
                this.attackBox.position.y + this.attackBox.offset.y,
                this.attackBox.width,
                this.attackBox.height
            );
        }
    }

    update() {
        this.draw();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y 

        // Update attack box position
        this.attackBox.position.x = this.position.x;
        this.attackBox.position.y = this.position.y;

        // Apply velocity and gravity
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0; // Prevent going below the canvas
        } else {
            this.velocity.y += gravity;
        }
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => (this.isAttacking = false), 100);
    }
}

// Create Sprites
const player = new Sprite({
    position: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
    offset: {x:0, y:0 },
});

const enemy = new Sprite({
    position: { x: 400, y: 100 },
    velocity: { x: 0, y: 10 },
    color: 'blue',
    offset: {x:-50, y:0 },
});

// Keys state
const keys = {
    a: { pressed: false },
    d: { pressed: false },
    ArrowLeft: { pressed: false },
    ArrowRight: { pressed: false },
};

// Collision Detection
function detectCollision({ attacker, target }) {
    return (
        attacker.attackBox.position.x + attacker.attackBox.width >= target.position.x &&
        attacker.attackBox.position.x <= target.position.x + target.width &&
        attacker.attackBox.position.y + attacker.attackBox.height >= target.position.y &&
        attacker.attackBox.position.y <= target.position.y + target.height &&
        attacker.isAttacking
    );
}

// Animation Loop
function animate() {
    window.requestAnimationFrame(animate);

    // Clear canvas
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);

    // Update sprites
    player.update();
    enemy.update();

    // Player movement
    player.velocity.x = 0;
    if (keys.a.pressed && player.lastKey === 'a') player.velocity.x = -5;
    if (keys.d.pressed && player.lastKey === 'd') player.velocity.x = 5;

    // Enemy movement
    enemy.velocity.x = 0;
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') enemy.velocity.x = -5;
    if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') enemy.velocity.x = 5;

    // Collision handling
    if (detectCollision({ attacker: player, target: enemy })) {
        player.isAttacking = false;
        console.log('Player hit enemy!');
    }
    if (detectCollision({ attacker: enemy, target: player })) {
        enemy.isAttacking = false;
        console.log('Enemy hit player!');
    }
}

animate();

// Event Listeners
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;
        case 'w':
            player.velocity.y = -20;
            break;
        case ' ':
            player.attack();
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;
        case 'ArrowUp':
            enemy.velocity.y = -20;
            break;
        case 'Enter': // Optional enemy attack key
            enemy.attack();
            break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
    }
});
