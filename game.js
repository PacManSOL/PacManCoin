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

const maze = [
    // 0: empty space, 1: wall, 2: coin
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 0, 1, 0, 0, 0, 1, 2, 1, 0, 0, 0, 1, 2, 0, 0, 2, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 1, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 1, 2, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 1, 2, 1, 0, 1, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 1, 0, 1, 2, 0, 0, 0, 1],
    [1, 2, 1, 1, 1, 0, 1, 0, 1, 2, 1, 1, 1, 0, 1, 1, 1, 1, 2, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

let score = 0;
let lives = 3;

function drawMaze() {
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            if (maze[row][col] === 1) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(col * 30, row * 30, 30, 30);
            } else if (maze[row][col] === 2) {
                ctx.drawImage(images.coin, col * 30 + 10, row * 30 + 10, 10, 10);
            }
        }
    }
}

function drawPacman() {
    ctx.drawImage(images.pacman, pacman.x - pacman.size, pacman.y - pacman.size, pacman.size * 2, pacman.size * 2);
}

function drawGhosts() {
    ghosts.forEach(ghost => {
        ctx.drawImage(images.ghost, ghost.x - ghost.size, ghost.y - ghost.size, ghost.size * 2, ghost.size * 2);
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

    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            if (maze[row][col] === 1) {
                const wall = { x: col * 30, y: row * 30, width: 30, height: 30 };
                if (checkCollision(pacman, wall)) {
                    pacman.x -= pacman.dx;
                    pacman.y -= pacman.dy;
                }
            } else if (maze[row][col] === 2) {
                const coin = { x: col * 30 + 10, y: row * 30 + 10, width: 10, height: 10 };
                if (checkCollision(pacman, coin)) {
                    maze[row][col] = 0;
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

        for (let row = 0; row < maze.length; row++) {
            for (let col = 0; col < maze[row].length; col++) {
                if (maze[row][col] === 1) {
                    const wall = { x: col * 30, y: row * 30, width: 30, height: 30 };
                    if (checkCollision(ghost, wall)) {
                        ghost.x -= ghost.dx;
                        ghost.y -= ghost.dy;
                    }
                }
            }
        }
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    movePacman();
    moveGhosts();
    drawPacman();
    drawGhosts();

    ghosts.forEach(ghost => {
        if (checkCollision(pacman, ghost)) {
            lives -= 1;
            document.getElementById('lives').removeChild(document.getElementById('lives').lastChild);
            if (lives === 0) {
                ctx.drawImage(images.gameOver, 150, 150, 300, 300);
                return;
            }
            pacman.x = 50;
            pacman.y = 50;
        }
    });

    if (score === 160) { // adjust this value to the total number of coins
        ctx.drawImage(images.win, 150, 150, 300, 300);
        return;
    }

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
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 's', 'a', 'd'].includes(e.key)) {
        pacman.dx = 0;
        pacman.dy = 0;
    }
});

images.pacman.onload = () => {
    update();
};
