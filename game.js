const canvas = document.getElementById('gameCanvas');
canvas.width = 600;  // 1.5 razy większe (400 * 1.5)
canvas.height = 600; // 1.5 razy większe (400 * 1.5)
const ctx = canvas.getContext('2d');

const images = {
    pacman: 'images/cheese.png',
    ghost1: 'images/ghost1.png',
    ghost2: 'images/ghost2.png',
    ghost3: 'images/ghost3.png',
    ghost4: 'images/ghost4.png',
    coin: 'images/coin.png'
};

const pacman = {
    x: 60,  // 1.5 razy większe (40 * 1.5)
    y: 60,  // 1.5 razy większe (40 * 1.5)
    size: 30,  // 1.5 razy większe (20 * 1.5)
    speed: 3,  // 1.5 razy większe (2 * 1.5)
    dx: 3,  // 1.5 razy większe (2 * 1.5)
    dy: 0
};

const ghosts = [
    { x: 120, y: 120, size: 30, speed: 3, dx: 3, dy: 0, image: images.ghost1 },
    { x: 480, y: 120, size: 30, speed: 3, dx: -3, dy: 0, image: images.ghost2 },
    { x: 120, y: 480, size: 30, speed: 3, dx: 3, dy: 0, image: images.ghost3 },
    { x: 480, y: 480, size: 30, speed: 3, dx: -3, dy: 0, image: images.ghost4 }
];

const walls = [
    { x: 90, y: 90, width: 420, height: 30 }, // Zmienione na 1.5 razy większe
    { x: 90, y: 90, width: 30, height: 420 },
    { x: 90, y: 480, width: 420, height: 30 },
    { x: 480, y: 90, width: 30, height: 420 }
];

const coins = [
    { x: 150, y: 150, size: 15, image: images.coin }, // Zmienione na 1.5 razy większe
    { x: 300, y: 150, size: 15, image: images.coin },
    { x: 450, y: 150, size: 15, image: images.coin },
    { x: 150, y: 300, size: 15, image: images.coin },
    { x: 300, y: 300, size: 15, image: images.coin },
    { x: 450, y: 300, size: 15, image: images.coin }
];

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const goingUp = pacman.dy === -pacman.speed;
    const goingDown = pacman.dy === pacman.speed;
    const goingRight = pacman.dx === pacman.speed;
    const goingLeft = pacman.dx === -pacman.speed;

    if (keyPressed === 37 && !goingRight) { // left
        pacman.dx = -pacman.speed;
        pacman.dy = 0;
    }
    if (keyPressed === 38 && !goingDown) { // up
        pacman.dx = 0;
        pacman.dy = -pacman.speed;
    }
    if (keyPressed === 39 && !goingLeft) { // right
        pacman.dx = pacman.speed;
        pacman.dy = 0;
    }
    if (keyPressed === 40 && !goingUp) { // down
        pacman.dx = 0;
        pacman.dy = pacman.speed;
    }
}

function drawWalls() {
    ctx.fillStyle = 'blue';
    walls.forEach(wall => {
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    });
}

function drawCoins() {
    coins.forEach(coin => {
        const img = new Image();
        img.src = coin.image;
        ctx.drawImage(img, coin.x, coin.y, coin.size, coin.size);
    });
}

function drawPacman() {
    const img = new Image();
    img.src = images.pacman;
    ctx.drawImage(img, pacman.x, pacman.y, pacman.size, pacman.size);
}

function drawGhosts() {
    ghosts.forEach(ghost => {
        const img = new Image();
        img.src = ghost.image;
        ctx.drawImage(img, ghost.x, ghost.y, ghost.size, ghost.size);
    });
}

function movePacman() {
    pacman.x += pacman.dx;
    pacman.y += pacman.dy;

    if (pacman.x < 0 || pacman.x + pacman.size > canvas.width ||
        pacman.y < 0 || pacman.y + pacman.size > canvas.height) {
        pacman.x -= pacman.dx;
        pacman.y -= pacman.dy;
    }
}

function moveGhosts() {
    ghosts.forEach(ghost => {
        ghost.x += ghost.dx;
        ghost.y += ghost.dy;

        if (ghost.x < 0 || ghost.x + ghost.size > canvas.width) {
            ghost.dx *= -1;
        }

        if (ghost.y < 0 || ghost.y + ghost.size > canvas.height) {
            ghost.dy *= -1;
        }
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWalls();
    drawCoins();
    drawPacman();
    drawGhosts();
    movePacman();
    moveGhosts();
    requestAnimationFrame(update);
}

update();
