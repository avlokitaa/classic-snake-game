const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverMessage = document.getElementById('game-over-message');
const restartButton = document.getElementById('restart-button');

const GRID_SIZE = 20;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

let snake = [];
let food;
let dx = GRID_SIZE;
let dy = 0;
let score = 0;
let gameOver = false;
let gameIntervalId;
let gameSpeed = 150;

function drawCanvas() {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.strokeStyle = '#555';
    ctx.beginPath();
    for (let x = 0; x < CANVAS_WIDTH; x += GRID_SIZE) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
    }
    for (let y = 0; y < CANVAS_HEIGHT; y += GRID_SIZE) {
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
    }
    ctx.stroke();
}

function drawSnake() {
    ctx.fillStyle = '#00ff00';
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, GRID_SIZE, GRID_SIZE);
    });
}

function drawFood() {
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(food.x, food.y, GRID_SIZE, GRID_SIZE);
}


function createFood() {
    food = {
        x: Math.floor(Math.random() * (CANVAS_WIDTH / GRID_SIZE)) * GRID_SIZE,
        y: Math.floor(Math.random() * (CANVAS_HEIGHT / GRID_SIZE)) * GRID_SIZE
    };
    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        createFood();
    }
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        updateScore();
        createFood();

        if (gameSpeed > 50) {
            gameSpeed -= 5;
            clearInterval(gameIntervalId);
            gameIntervalId = setInterval(gameLoop, gameSpeed);
        }
    } else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.x >= CANVAS_WIDTH || head.y < 0 || head.y >= CANVAS_HEIGHT) {
        return true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

function gameLoop() {
    if (gameOver) {
        return;
    }

    moveSnake();
    if (checkCollision()) {
        gameOver = true;
        endGame();
        return;
    }

    drawCanvas();
    drawFood();
    drawSnake();
}

function changeDirection(event) {
    const keyPressed = event.key;
    const goingUp = dy === -GRID_SIZE;
    const goingDown = dy === GRID_SIZE;
    const goingLeft = dx === -GRID_SIZE;
    const goingRight = dx === GRID_SIZE;

    switch (keyPressed) {
        case 'ArrowUp':
        case 'w':
            if (!goingDown) {
                dx = 0;
                dy = -GRID_SIZE;
            }
            break;
        case 'ArrowDown':
        case 's':
            if (!goingUp) {
                dx = 0;
                dy = GRID_SIZE;
            }
            break;
        case 'ArrowLeft':
        case 'a':
            if (!goingRight) {
                dx = -GRID_SIZE;
                dy = 0;
            }
            break;
        case 'ArrowRight':
        case 'd':
            if (!goingLeft) {
                dx = GRID_SIZE;
                dy = 0;
            }
            break;
    }
}

function startGame() {
    snake = [{ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 }];
    score = 0;
    gameOver = false;
    dx = GRID_SIZE;
    dy = 0;
    gameSpeed = 150;
    updateScore();
    gameOverMessage.style.display = 'none';

    clearInterval(gameIntervalId);
    gameIntervalId = setInterval(gameLoop, gameSpeed);

    document.addEventListener('keydown', changeDirection);
    createFood();
}

function endGame() {
    clearInterval(gameIntervalId);
    gameOverMessage.style.display = 'block';
    document.removeEventListener('keydown', changeDirection);
}

startGame();

restartButton.addEventListener('click', startGame);