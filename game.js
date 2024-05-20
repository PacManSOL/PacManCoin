const canvas = document.getElementById('gameCanvas');
canvas.width = 600; 
canvas.height = 600;
const ctx = canvas.getContext('2d');

const images = {
    pacman: 'images/cheese.png',
    ghost1: 'images/ghost1.png',
    ghost2: 'images/ghost2.png',
    ghost3: 'images/ghost3.png',
    ghost4: 'images/ghost4.png',
    coin: 'images/coin.png',
    heart: 'images/heart.png',
    win: 'images/wygrana.png',
    gameOver: 'images/game_over.png'
};

let score = 0;
let lives = 3;

const pacman = {
    x: 60,
    y: 60,
    size: 30,
    speed: 3,
    dx: 3,
    dy: 0
};

const ghosts = [
    { x: 120, y: 120, size: 30, speed: 3, dx: 3, dy: 0, image: images.ghost1 },
    { x: 480, y: 120, size: 30, speed: 3, dx: -3, dy: 0, image: images.ghost2 },
    { x: 120, y: 480, size: 30, speed: 3, dx: 3, dy: 0, image: images.ghost3 },
    { x: 480, y: 480, size: 30, speed: 3, dx: -3, dy: 0, image: images.ghost4 }
];

const walls = [
    { x: 90, y: 90, width: 420, height: 30 },
    { x: 90, y: 90, width: 30, height: 420 },
    { x: 90, y: 480, width: 420, height: 30 },
    { x: 480, y: 90, width: 30, height: 420 }
];

const coins = [
    { x: 150, y: 150, size: 15, image: images.coin, collected: false },
    { x: 300, y: 150, size: 15, image: images.coin, collected: false },
    { x: 450, y: 150, size: 15, image: images.coin, collected: false },
    { x: 150, y: 300, size: 15, image: images.coin, collected: false },
    { x: 300, y: 300, size: 15, image: images.coin, collected: false },
    { x: 450, y: 300, size: 15, image: images.coin, collected: false }
];

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const goingUp = pacman.dy === -pacman.speed;
    const goingDown = pacman.dy === pacman.speed;
    const goingRight = pacman.dx === pacman.speed;
    const goingLeft = pacman.dx === -pacman.speed;

    if ((keyPressed === 37 || keyPressed === 65) && !goingRight) { // left or A
        pacman.dx = -pacman.speed;
        pacman.dy = 0;
    }
    if ((keyPressed === 38 || keyPressed === 87) && !goingDown) { // up or W
        pacman.dx = 0;
        pacman.dy = -pacman.speed;
    }
    if ((keyPressed === 39 || keyPressed === 68) && !goingLeft) { // right or D
        pacman.dx = pacman.speed;
        pacman.dy = 0;
    }
    if ((keyPressed === 40 || keyPressed === 83) && !goingUp) { // down or S
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
        if (!coin.collected) {
            const img = new Image();
            img.src = coin.image;
            ctx.drawImage(img, coin.x, coin.y, coin.size, coin.size);
        }
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

function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.size &&
           obj1.x + obj1.size > obj2.x &&
           obj1.y < obj2.y + obj2.size &&
           obj1.y + obj1.size > obj2.y;
}

function movePacman() {
    pacman.x += pacman.dx;
    pacman.y += pacman.dy;

    if (pacman.x < 0 || pacman.x + pacman.size > canvas.width ||
        pacman.y < 0 || pacman.y + pacman.size > canvas.height) {
        pacman.x -= pacman.dx;
        pacman.y -= pacman.dy;
    }

    walls.forEach(wall => {
        if (checkCollision(pacman, wall)) {
            pacman.x -= pacman.dx;
            pacman.y -= pacman.dy;
        }
    });

    coins.forEach((coin, index) => {
        if (!coin.collected && checkCollision(pacman, coin)) {
            coin.collected = true;
            score++;
            document.getElementById('score').textContent = "SCORE: " + score;
        }
    });

    if (coins.every(coin => coin.collected)) {
        const winImg = new Image();
        winImg.src = images.win;
        winImg.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(winImg, 0, 0, canvas.width, canvas.height);
        };
        return;
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

        if (checkCollision(pacman, ghost)) {
            lives--;
            document.getElementById('lives').removeChild(document.querySelector('.life'));
            if (lives === 0) {
                const gameOverImg = new Image();
                gameOverImg.src = images.gameOver;
                gameOverImg.onload = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(gameOverImg, 0, 0, canvas.width, canvas.height);
                };
                return;
            }
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
    if (lives > 0 && !coins.every(coin => coin.collected)) {
        requestAnimationFrame(update);
    }
}

update();
