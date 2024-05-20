const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const images = {
    pacman: new Image(),
    ghost: new Image(),
    coin: new Image(),
    heart: new Image(),
    win: new Image(),
    gameOver: new Image()
};

images.pacman.src = 'images/pacman.png';
images.ghost.src = 'images/ghost.png';
images.coin.src = 'images/coin.png';
images.heart.src = 'images/heart.png';
images.win.src = 'images/win.png';
images.gameOver.src = 'images/gameOver.png';

const tileSize = 40;
const numRows = 15;
const numCols = 15;

const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const pacman = {
    x: tileSize + 10,
    y: tileSize + 10,
    width: 20,
    height: 20,
    speed: 2,
    dx: 0,
    dy: 0
};

const ghosts = [
    { x: 2 * tileSize + 10, y: 2 * tileSize + 10, width: 20, height: 20, speed: 1.5, dx: 0, dy: 0 },
    { x: 10 * tileSize + 10, y: 2 * tileSize + 10, width: 20, height: 20, speed: 1.5, dx: 0, dy: 0 }
];

let score = 0;
let lives = 3;

function drawMaze() {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            if (maze[row][col] === 1) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
            } else if (maze[row][col] === 0) {
                ctx.drawImage(images.coin, col * tileSize + 15, row * tileSize + 15, 10, 10);
            }
        }
    }
}

function drawPacman() {
    ctx.drawImage(images.pacman, pacman.x, pacman.y, pacman.width, pacman.height);
}

function drawGhosts() {
    ghosts.forEach(ghost => {
        ctx.drawImage(images.ghost, ghost.x, ghost.y, ghost.width, ghost.height);
    });
}

function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

function movePacman() {
    pacman.x += pacman.dx;
    pacman.y += pacman.dy;

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            if (maze[row][col] === 1) {
                const wall = { x: col * tileSize, y: row * tileSize, width: tileSize, height: tileSize };
                if (checkCollision(pacman, wall)) {
                    pacman.x -= pacman.dx;
                    pacman.y -= pacman.dy;
                }
            } else if (maze[row][col] === 0) {
                const coin = { x: col * tileSize + 15, y: row * tileSize + 15, width: 10, height: 10 };
                if (checkCollision(pacman, coin)) {
                    maze[row][col] = 2;
                    score += 10;
                    document.getElementById('score').innerText = `SCORE: ${score}`;
                }
            }
        }
    }
}

function moveGhosts() {
    ghosts.forEach(ghost => {
        const distX = pacman.x - ghost.x;
        const distY = pacman.y - ghost.y;
        const angle = Math.atan2(distY, distX);

        ghost.dx = Math.cos(angle) * ghost.speed;
        ghost.dy = Math.sin(angle) * ghost.speed;

        ghost.x += ghost.dx;
        ghost.y += ghost.dy;

        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                if (maze[row][col] === 1) {
                    const wall = { x: col * tileSize, y: row * tileSize, width: tileSize, height: tileSize };
                    if (checkCollision(ghost, wall)) {
                        ghost.x -= ghost.dx;
                        ghost.y -= ghost.dy;
                    }
                }
            }
        }

        if (checkCollision(ghost, pacman)) {
            lives--;
            document.getElementById('lives').innerHTML = '';
            for (let i = 0; i < lives; i++) {
                const heart = document.createElement('img');
                heart.src = 'images/heart.png';
                heart.style.width = '20px';
                heart.style.height = '20px';
                document.getElementById('lives').appendChild(heart);
            }
            if (lives === 0) {
                ctx.drawImage(images.gameOver, 0, 0, canvas.width, canvas.height);
                return;
            }
            pacman.x = tileSize + 10;
            pacman.y = tileSize + 10;
        }
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    drawPacman();
    drawGhosts();
    movePacman();
    moveGhosts();
    requestAnimationFrame(update);
}

document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
            pacman.dx = 0;
            pacman.dy = -pacman.speed;
            break;
        case 'ArrowDown':
        case 's':
            pacman.dx = 0;
            pacman.dy = pacman.speed;
            break;
        case 'ArrowLeft':
        case 'a':
            pacman.dx = -pacman.speed;
            pacman.dy = 0;
            break;
        case 'ArrowRight':
        case 'd':
            pacman.dx = pacman.speed;
            pacman.dy = 0;
            break;
    }
});

document.addEventListener('keyup', e => {
    switch (e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'w':
        case 'a':
        case 's':
        case 'd':
            pacman.dx = 0;
            pacman.dy = 0;
            break;
    }
});

function init() {
    const livesContainer = document.getElementById('lives');
    livesContainer.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        const heart = document.createElement('img');
        heart.src = 'images/heart.png';
        heart.style.width = '20px';
        heart.style.height = '20px';
        livesContainer.appendChild(heart);
    }

    document.getElementById('score').innerText = 'SCORE: 0';
    update();
}

init();
