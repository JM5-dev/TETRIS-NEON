// === TETRIS NEON - Gioco Tetris con tema neon-retro ===

// Elementi DOM
const canvas = document.getElementById('tetris-canvas');
const ctx = canvas.getContext('2d');
const nextPieceCanvas = document.getElementById('next-piece-canvas');
const nextPieceCtx = nextPieceCanvas.getContext('2d');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const linesElement = document.getElementById('lines');
const highScoreElement = document.getElementById('high-score');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const gameOverScreen = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

// Audio
let backgroundMusic = null;
let gameOverSound = null;

// Configurazione griglia
const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
const NEXT_BLOCK_SIZE = 30;

// Colori tetramini
const COLORS = [
    null, '#00ffff', '#ffff00', '#ff00ff', '#39ff14', 
    '#ff073a', '#00f3ff', '#ff9e00'
];

const SHADOW_COLORS = [
    null, 'rgba(0, 255, 255, 0.7)', 'rgba(255, 255, 0, 0.7)', 
    'rgba(255, 0, 255, 0.7)', 'rgba(57, 255, 20, 0.7)', 
    'rgba(255, 7, 58, 0.7)', 'rgba(0, 243, 255, 0.7)', 
    'rgba(255, 158, 0, 0.7)'
];

// Forme tetramini (I, O, T, S, Z, J, L)
const SHAPES = [
    null,
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    // O
    [
        [2, 2],
        [2, 2]
    ],
    // T
    [
        [0, 3, 0],
        [3, 3, 3],
        [0, 0, 0]
    ],
    // S
    [
        [0, 4, 4],
        [4, 4, 0],
        [0, 0, 0]
    ],
    // Z
    [
        [5, 5, 0],
        [0, 5, 5],
        [0, 0, 0]
    ],
    // J
    [
        [6, 0, 0],
        [6, 6, 6],
        [0, 0, 0]
    ],
    // L
    [
        [0, 0, 7],
        [7, 7, 7],
        [0, 0, 0]
    ]
];

// Stato del gioco
let board = createBoard();
let currentPiece = null;
let nextPiece = null;
let score = 0;
let level = 1;
let lines = 0;
let highScore = localStorage.getItem('tetrisHighScore') || 0;
let gameInterval = null;
let isGameOver = false;
let isPaused = false;
let gameSpeed = 1000;
let isMusicMuted = false;

// === FUNZIONI PRINCIPALI ===

function createBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function init() {
    highScoreElement.textContent = highScore;
    initializeAudio();
    startButton.addEventListener('click', startGame);
    pauseButton.addEventListener('click', togglePause);
    restartButton.addEventListener('click', restartGame);
    document.addEventListener('keydown', handleKeyPress);
    drawBoard();
}

function initializeAudio() {
    backgroundMusic = new Audio('assets/audio/tetris-theme.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.5;
    
    gameOverSound = new Audio('assets/audio/game-over.mp3');
    gameOverSound.volume = 0.7;
}

function playSound(sound) {
    if (sound && !isMusicMuted) {
        const soundClone = sound.cloneNode();
        soundClone.play().catch(error => {
            console.log("Errore nella riproduzione dell'audio:", error);
        });
    }
}

function toggleAudio() {
    isMusicMuted = !isMusicMuted;
    if (isMusicMuted) {
        backgroundMusic.pause();
    } else if (!isPaused && !isGameOver) {
        backgroundMusic.play().catch(error => {
            console.log("Errore nella riproduzione della musica:", error);
        });
    }
}

// === GESTIONE PEZZI ===

function generatePiece() {
    const randomIndex = Math.floor(Math.random() * 7) + 1;
    const piece = {
        shape: SHAPES[randomIndex].map(row => [...row]),
        color: randomIndex,
        x: Math.floor(COLS / 2) - Math.floor(SHAPES[randomIndex][0].length / 2),
        y: 0
    };
    return piece;
}

function startGame() {
    resetGame();
    currentPiece = generatePiece();
    nextPiece = generatePiece();
    startButton.classList.add('hidden');
    pauseButton.classList.remove('hidden');
    if (!isMusicMuted) {
        backgroundMusic.play().catch(error => {
            console.log("Errore nella riproduzione della musica:", error);
        });
    }
    gameInterval = setInterval(gameLoop, gameSpeed);
    draw();
}

function gameLoop() {
    if (!isPaused) {
        moveDown();
        draw();
    }
}

function togglePause() {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'RIPRENDI' : 'PAUSA';
    if (isPaused) {
        backgroundMusic.pause();
    } else if (!isMusicMuted) {
        backgroundMusic.play().catch(error => {
            console.log("Errore nella riproduzione della musica:", error);
        });
    }
}

// === RENDERING ===

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    if (currentPiece) drawPiece(ctx, currentPiece);
    drawNextPiece();
    scoreElement.textContent = score;
    levelElement.textContent = level;
    linesElement.textContent = lines;
}

function drawBoard() {
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x] !== 0) {
                drawBlock(ctx, x, y, board[y][x]);
            }
        }
    }
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
        ctx.beginPath();
        ctx.moveTo(x * BLOCK_SIZE, 0);
        ctx.lineTo(x * BLOCK_SIZE, ROWS * BLOCK_SIZE);
        ctx.stroke();
    }
    
    // Linee orizzontali
    for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * BLOCK_SIZE);
        ctx.lineTo(COLS * BLOCK_SIZE, y * BLOCK_SIZE);
        ctx.stroke();
    }
}

function drawBlock(context, x, y, colorIndex) {
    const blockX = x * BLOCK_SIZE;
    const blockY = y * BLOCK_SIZE;
    const blockSize = BLOCK_SIZE - 1;
    const color = COLORS[colorIndex];
    const shadowColor = SHADOW_COLORS[colorIndex];
    context.fillStyle = color;
    context.fillRect(blockX, blockY, blockSize, blockSize);
    context.fillStyle = lightenColor(color, 30);
    context.beginPath();
    context.moveTo(blockX, blockY);
    context.lineTo(blockX + blockSize, blockY);
    context.lineTo(blockX + blockSize - 5, blockY + 5);
    context.lineTo(blockX + 5, blockY + 5);
    context.closePath();
    context.fill();

    // Effetto 3D - Faccia destra (più scura)
    context.fillStyle = darkenColor(color, 30);
    context.beginPath();
    context.moveTo(blockX + blockSize, blockY);
    context.lineTo(blockX + blockSize, blockY + blockSize);
    context.lineTo(blockX + blockSize - 5, blockY + blockSize - 5);
    context.lineTo(blockX + blockSize - 5, blockY + 5);
    context.closePath();
    context.fill();
    context.shadowBlur = 15;
    context.shadowColor = shadowColor;
    context.strokeStyle = lightenColor(color, 50);
    context.lineWidth = 2;
    context.strokeRect(blockX + 2, blockY + 2, blockSize - 4, blockSize - 4);
    context.shadowBlur = 0;
}

function lightenColor(hexColor, percent) {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    const newR = Math.min(255, r + Math.floor(r * percent / 100));
    const newG = Math.min(255, g + Math.floor(g * percent / 100));
    const newB = Math.min(255, b + Math.floor(b * percent / 100));
    
    return `rgb(${newR}, ${newG}, ${newB})`;
}

function darkenColor(hexColor, percent) {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    const newR = Math.max(0, r - Math.floor(r * percent / 100));
    const newG = Math.max(0, g - Math.floor(g * percent / 100));
    const newB = Math.max(0, b - Math.floor(b * percent / 100));
    
    return `rgb(${newR}, ${newG}, ${newB})`;
}

function drawPiece(context, piece) {
    const shape = piece.shape;
    const color = piece.color;
    let ghostY = piece.y;
    while (isValidMove(0, 1, piece.shape, piece.x, ghostY)) {
        ghostY++;
    }
    context.globalAlpha = 0.3;
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                drawBlock(context, piece.x + x, ghostY + y, color);
            }
        }
    }
    context.globalAlpha = 1.0;
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                drawBlock(context, piece.x + x, piece.y + y, color);
            }
        }
    }
}

function drawNextPiece() {
    nextPieceCtx.clearRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);
    nextPieceCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    nextPieceCtx.fillRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);
    if (!nextPiece) return;
    const shape = nextPiece.shape;
    const color = nextPiece.color;
    let minX = shape[0].length, maxX = -1;
    let minY = shape.length, maxY = -1;
    
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
            }
        }
    }
    const pieceWidth = maxX - minX + 1;
    const pieceHeight = maxY - minY + 1;
    const canvasWidthInBlocks = nextPieceCanvas.width / NEXT_BLOCK_SIZE;
    const canvasHeightInBlocks = nextPieceCanvas.height / NEXT_BLOCK_SIZE;
    const startX = Math.floor((canvasWidthInBlocks - pieceWidth) / 2) - minX;
    const startY = Math.floor((canvasHeightInBlocks - pieceHeight) / 2) - minY;
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                drawBlock(nextPieceCtx, startX + x, startY + y, color);
            }
        }
    }
}

// === LOGICA DI MOVIMENTO ===

function isValidMove(xOffset, yOffset, shape, x, y) {
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col] !== 0) {
                const newX = x + col + xOffset;
                const newY = y + row + yOffset;
                if (newX < 0 || newX >= COLS || newY >= ROWS) return false;
                if (newY >= 0 && board[newY][newX] !== 0) return false;
            }
        }
    }
    return true;
}

function moveDown() {
    if (isValidMove(0, 1, currentPiece.shape, currentPiece.x, currentPiece.y)) {
        currentPiece.y++;
    } else {
        placePiece();
        clearLines();
        
        // Genera un nuovo pezzo
        currentPiece = nextPiece;
        nextPiece = generatePiece();
        
        // Controlla se il gioco è finito
        if (!isValidMove(0, 0, currentPiece.shape, currentPiece.x, currentPiece.y)) {
            gameOver();
        }
    }
}

function moveLeft() {
    if (isValidMove(-1, 0, currentPiece.shape, currentPiece.x, currentPiece.y)) {
        currentPiece.x--;
        draw();
    }
}

function moveRight() {
    if (isValidMove(1, 0, currentPiece.shape, currentPiece.x, currentPiece.y)) {
        currentPiece.x++;
        draw();
    }
}

function rotate() {
    const shape = currentPiece.shape;
    const n = shape.length;
    const rotated = Array.from({ length: n }, () => Array(n).fill(0));
    for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
            rotated[x][n - 1 - y] = shape[y][x];
        }
    }
    if (isValidMove(0, 0, rotated, currentPiece.x, currentPiece.y)) {
        currentPiece.shape = rotated;
        draw();
    } else {
        const kicks = [1, -1, 2, -2];
        for (const kick of kicks) {
            if (isValidMove(kick, 0, rotated, currentPiece.x, currentPiece.y)) {
                currentPiece.x += kick;
                currentPiece.shape = rotated;
                draw();
                break;
            }
        }
    }
}

function placePiece() {
    const shape = currentPiece.shape;
    const color = currentPiece.color;
    
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x] !== 0) {
                const boardY = currentPiece.y + y;
                const boardX = currentPiece.x + x;
                if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
                    board[boardY][boardX] = color;
                }
            }
        }
    }
}

// === PUNTEGGIO E LIVELLI ===
function updateScore(linesCleared) {
    // Sistema di punteggio con bonus per linee multiple
    const points = [0, 100, 300, 500, 800]; // 0, 1, 2, 3, 4 linee
    score += points[linesCleared] * level;
    
    // Incrementa il contatore di linee
    lines += linesCleared;
    
    // Aggiorna il livello ogni 10 linee
    const newLevel = Math.floor(lines / 10) + 1;
    if (newLevel > level) {
        level = newLevel;
        updateSpeed();
    }
    
    // Aggiorna il record
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('tetrisHighScore', highScore);
        highScoreElement.textContent = highScore;
    }
}

function updateSpeed() {
    gameSpeed = Math.max(100, 1000 - (level - 1) * 50);
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
}

function hardDrop() {
    let distance = 0;
    while (isValidMove(0, 1, currentPiece.shape, currentPiece.x, currentPiece.y)) {
        currentPiece.y++;
        distance++;
    }
    score += distance;
    placePiece();
    clearLines();
    
    currentPiece = nextPiece;
    nextPiece = generatePiece();
    
    // Controlla se il gioco è finito
    if (!isValidMove(0, 0, currentPiece.shape, currentPiece.x, currentPiece.y)) {
        gameOver();
    }
    
    draw();
}

// === CONTROLLI ===

function handleKeyPress(event) {
    if (isPaused || isGameOver || !currentPiece) return;
    switch (event.keyCode) {
        case 37: // Freccia sinistra
            moveLeft();
            break;
        case 39: // Freccia destra
            moveRight();
            break;
        case 40: // Freccia giù
            moveDown();
            draw();
            break;
        case 38: // Freccia su
            rotate();
            break;
        
        // Nuovi controlli (WASD)
        case 65: // A (sinistra)
            moveLeft();
            break;
        case 68: // D (destra)
            moveRight();
            break;
        case 83: // S (giù)
            moveDown();
            draw();
            break;
        case 87: // W (ruota)
            rotate();
            break;
            
        // Altri controlli
        case 13: // Invio
            hardDrop();
            break;
        case 80: // P
            togglePause();
            break;
        case 77: // M (toggle audio)
            toggleAudio();
            break;
    }
}

// === GAME OVER E RESET ===

function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval);
    finalScoreElement.textContent = score;
    gameOverScreen.classList.remove('hidden');
    backgroundMusic.pause();
    playSound(gameOverSound);
}

// === EFFETTI VISIVI ===
// === EFFETTI VISIVI ===

function createDissolveEffect(x, y, colorIndex) {
    const gameArea = document.querySelector('.game-area');
    const gameAreaRect = gameArea.getBoundingClientRect();
    const blockX = x * BLOCK_SIZE;
    const blockY = y * BLOCK_SIZE;
    const color = COLORS[colorIndex];
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'dissolve-particle';
        const startX = gameAreaRect.left + blockX + BLOCK_SIZE/2;
        const startY = gameAreaRect.top + blockY + BLOCK_SIZE/2;
        
        particle.style.position = 'fixed';
        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;
        particle.style.zIndex = '15';
        particle.style.pointerEvents = 'none';
        particle.style.backgroundColor = color;
        particle.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
        particle.style.borderRadius = '50%';
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        const size = 3 + Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        document.body.appendChild(particle);
        let posX = startX;
        let posY = startY;
        const moveX = Math.cos(angle) * speed;
        const moveY = Math.sin(angle) * speed;
        let opacity = 1;
        
        const animate = () => {
            posX += moveX;
            posY += moveY;
            opacity -= 0.02;
            
            particle.style.left = `${posX}px`;
            particle.style.top = `${posY}px`;
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }
}

function resetGame() {
    board = createBoard();
    score = 0;
    lines = 0;
    level = 1;
    isGameOver = false;
    isPaused = false;
    gameSpeed = 1000;
    
    // Nascondi la schermata di game over
    gameOverScreen.classList.add('hidden');
    
    // Aggiorna l'interfaccia
    scoreElement.textContent = '0';
    levelElement.textContent = '1';
    linesElement.textContent = '0';
    document.querySelectorAll('.dissolve-particle').forEach(particle => particle.remove());
    backgroundMusic.currentTime = 0;
}

function restartGame() {
    resetGame();
    startGame();
}

// === GESTIONE RIGHE ===

function clearLines() {
    let linesCleared = 0;
    let linesToAnimate = [];
    for (let y = ROWS - 1; y >= 0; y--) {
        let isLineComplete = true;
        for (let x = 0; x < COLS; x++) {
            if (board[y][x] === 0) {
                isLineComplete = false;
                break;
            }
        }
        if (isLineComplete) {
            linesToAnimate.push(y);
            linesCleared++;
        }
    }
    if (linesCleared > 0) {
        // Crea una nuova griglia senza le righe complete
        const newBoard = [];
        
        // Copia solo le righe non complete dall'alto verso il basso
        for (let y = 0; y < ROWS; y++) {
            if (!linesToAnimate.includes(y)) {
                newBoard.push([...board[y]]);
            }
        }
        while (newBoard.length < ROWS) {
            newBoard.unshift(Array(COLS).fill(0));
        }
        board = newBoard;
        updateScore(linesCleared);
        draw();
    }
}

function visualReward(points) {
    const reward = document.createElement('div');
    reward.className = 'score-reward';
    reward.textContent = `+${points}`;
    const scoreRect = scoreElement.getBoundingClientRect();
    reward.style.left = `${scoreRect.right + 10}px`;
    reward.style.top = `${scoreRect.top}px`;
    if (points >= 800) {
        reward.style.fontSize = '2em';
        reward.textContent += ' TETRIS!';
    } else if (points >= 500) {
        reward.style.color = '#ffff00'; // Giallo per Triple
    } else if (points >= 300) {
        reward.style.color = '#00ffff'; // Ciano per Double
    }
    document.body.appendChild(reward);
    setTimeout(() => reward.remove(), 1000);
}

function updateScore(linesCleared) {
    const points = [0, 100, 300, 500, 800]; // 0, 1, 2, 3, 4 linee
    const pointsEarned = points[linesCleared] * level;
    
    // Incrementa punteggio
    score += pointsEarned;
    
    // Mostra ricompensa visuale
    visualReward(pointsEarned);
    
    // Incrementa il contatore di linee
    lines += linesCleared;
    
    // Aggiorna il livello ogni 10 linee
    const newLevel = Math.floor(lines / 10) + 1;
    if (newLevel > level) {
        level = newLevel;
        updateSpeed();
        levelUpAnimation();
    }
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('tetrisHighScore', highScore);
        highScoreElement.textContent = highScore;
        const highScoreTag = document.createElement('div');
        highScoreTag.className = 'high-score-tag';
        highScoreTag.textContent = 'NEW HIGH SCORE!';
        document.body.appendChild(highScoreTag);
        
        setTimeout(() => {
            highScoreTag.remove();
        }, 2000);
    }
}

function levelUpAnimation() {
    const levelUp = document.createElement('div');
    levelUp.className = 'level-up-animation';
    levelUp.innerHTML = `<span>LEVEL ${level}!</span>`;
    document.body.appendChild(levelUp);
    setTimeout(() => levelUp.remove(), 2000);
}

function addBackgroundEffects() {
    // Aggiungi un effetto di scanline per l'aspetto retro
    const scanlines = document.createElement('div');
    scanlines.className = 'scanlines';
    document.body.appendChild(scanlines);
}

// === INIZIALIZZAZIONE ===
window.onload = function() {
    initializeAudio();
    init();
    addBackgroundEffects();
    window.addEventListener('resize', () => draw());
    if (navigator.getGamepads) {
        initGamepadSupport();
    }
};

// Supporto per gamepad (opzionale)
function initGamepadSupport() {
    let gamepadInterval;
    window.addEventListener("gamepadconnected", (e) => {
        console.log("Gamepad connesso:", e.gamepad.id);
        if (!gamepadInterval) gamepadInterval = setInterval(pollGamepad, 100);
    });
    window.addEventListener("gamepaddisconnected", (e) => {
        console.log("Gamepad disconnesso:", e.gamepad.id);
        clearInterval(gamepadInterval);
        gamepadInterval = null;
    });
}

function pollGamepad() {
    if (isPaused || isGameOver || !currentPiece) return;
    const gamepads = navigator.getGamepads();
    if (!gamepads || !gamepads[0]) return;
    const gamepad = gamepads[0];
    if (gamepad.buttons[14].pressed || gamepad.axes[0] < -0.5) moveLeft();
    if (gamepad.buttons[15].pressed || gamepad.axes[0] > 0.5) moveRight();
    if (gamepad.buttons[13].pressed || gamepad.axes[1] > 0.5) { moveDown(); draw(); }
    if (gamepad.buttons[0].pressed || gamepad.buttons[1].pressed) rotate();
    if (gamepad.buttons[3].pressed) hardDrop();
    if (gamepad.buttons[9].pressed) togglePause();
}
