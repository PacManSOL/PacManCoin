const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const images = {
    pacman: new Image(),
    ghost: new Image(),
    coin: new Image(),
    win: new Image(),
    gameOver: new Image()
};

images.pacman.src = 'images/pacman.png';
images.ghost.src = 'images/ghost.png';
images.coin.src = 'images/coin.png';
images.win.src = 'images/win.png';
images.gameOver.src = 'images/gameOver.png';

const pacman = {
    x: 50,
    y: 50,
    size: 20,
    speed: 2,
    dx: 0,
    dy: 0
};

const ghosts = [
    { x: 100, y: 100, size: 20, speed: 1.5, dx: 1.5, dy: 0 },
    { x: 200, y: 200, size: 20, speed: 1.5, dx: 1.5, dy: 0 }
];

const walls = [
    { x: 0, y: 0, width: 600, height: 10 },
    { x: 0, y: 0, width: 10, height: 600 },
    { x: 0, y: 590, width: 600, height: 10 },
    { x: 590, y: 0, width: 10, height: 600 },
    { x: 100, y: 100, width: 400, height: 10 },
    { x: 100, y: 100, width: 10, height: 400 },
    { x: 100, y: 490, width: 400, height: 10 },
    { x: 490, y: 100, width: 10, height: 400 }
];

const coins = [
    { x: 120, y: 120, size: 5, collected: false },
    { x: 150, y: 150, size: 5, collected: false },
    { x: 180, y: 180, size: 5, collected: false }
];

let score = 0;
let lives = 3;

function drawPacman() {
    ctx.drawImage(images.pacman, pacman.x - pacman.size, pacman.y - pacman.size, pacman.size * 2, pacman.size * 2);
}

function drawGhosts() {
    ghosts.forEach(ghost => {
        ctx.drawImage(images.ghost, ghost.x - ghost.size, ghost.y - ghost.size, ghost.size * 2, ghost.size * 2);
    });
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
            ctx.drawImage(images.coin, coin.x - coin.size, coin.y - coin.size, coin.size * 2, coin.size * 2);
        }
    });
}

function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.size > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.size > obj2.y;
}

function movePacman() {
    pacman.x += pacman.dx;
    pacman.y += pacman.dy;

    walls.forEach(wall => {
        if (checkCollision(pacman, wall)) {
            pacman.x -= pacman.dx;
            pacman.y -= pacman.dy;
        }
    });

    coins.forEach(coin => {
        if (checkCollision(pacman, coin) && !coin.collected) {
            coin.collected = true;
            score += 10;
            document.getElementById('score').textContent = `SCORE: ${score}`;

            if (coins.every(coin => coin.collected)) {
                const winImg = images.win;
                winImg.onload = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(winImg, 0, 0, canvas.width, canvas.height);
                };
                ctx.drawImage(winImg, 0, 0, canvas.width, canvas.height);
            }
        }
    });
}

function moveGhosts() {
    ghosts.forEach(ghost => {
        let dx = pacman.x - ghost.x;
        let dy = pacman.y - ghost.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        ghost.x += (dx / distance) * ghost.speed;
        ghost.y += (dy / distance) * ghost.speed;

        walls.forEach(wall => {
            if (checkCollision(ghost, wall)) {
                ghost.x -= (dx / distance) * ghost.speed;
                ghost.y -= (dy / distance) * ghost.speed;
            }
        });

        if (checkCollision(pacman, ghost)) {
            lives--;
            document.getElementById('lives').removeChild(document.querySelector('.life'));
            if (lives === 0) {
                const gameOverImg = images.gameOver;
                gameOverImg.onload = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(gameOverImg, 0, 0, canvas.width, canvas.height);
                };
                ctx.drawImage(gameOverImg, 0, 0, canvas.width, canvas.height);
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

document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            pacman.dx = 0;
            pacman.dy = -pacman.speed;
            break;
        case 'ArrowDown':
            pacman.dx = 0;
            pacman.dy = pacman.speed;
            break;
        case 'ArrowLeft':
            pacman.dx = -pacman.speed;
            pacman.dy = 0;
            break;
        case 'ArrowRight':
            pacman.dx = pacman.speed;
            pacman.dy = 0;
            break;
    }
});

document.addEventListener('keyup', e => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        pacman.dx = 0;
        pacman.dy = 0;
    }
});

images.pacman.onload = () => {
    update();
};
