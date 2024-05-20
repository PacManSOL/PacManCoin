const canvas = document.getElementById('gameCanvas');
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
    x: 40,
    y: 40,
    size: 20,
    speed: 2,
    dx: 2,
    dy: 0
};

const ghosts = [
    { x: 80, y: 80, size: 20, speed: 2, dx: 2, dy: 0, image: images.ghost1 },
    { x: 320, y: 80, size: 20, speed: 2, dx: -2, dy: 0, image: images.ghost2 },
    { x: 80, y: 320, size: 20, speed: 2, dx: 2, dy: 0, image: images.ghost3 },
    { x: 320, y: 320, size: 20, speed: 2, dx: -2, dy: 0, image: images.ghost4 }
];

const walls = [
    { x: 60, y: 60, width: 280, height: 20 },
    { x: 60, y: 60, width: 20, height: 280 },
    { x: 60, y: 320, width: 280, height: 20 },
    { x: 320, y: 60, width: 20, height: 280 }
];

const coins = [
    { x: 100, y: 100, size: 10, image: images.coin },
    { x: 200, y: 100, size: 10, image: images.coin },
    { x: 300, y: 100, size: 10, image: images.coin },
    { x: 100, y: 200, size: 10, image: images.coin },
    { x: 200, y: 200, size: 10, image: images.coin },
    { x: 300, y: 200, size: 10, image: images.coin }
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
