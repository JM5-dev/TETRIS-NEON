/**
 * TETRIS NEON - Un gioco di Tetris con tema neon-retro
 * 
 * Questo script gestisce tutta la logica del gioco Tetris:
 * - Disegno della griglia e dei pezzi
 * - Movimento e rotazione dei tetramini
 * - Controllo delle collisioni
 * - Gestione del punteggio e livello
 * - Controlli da tastiera (frecce e WASD)
 * - Effetti visivi e audio
 */

// Recupero riferimenti agli elementi del DOM
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
const arcadeBackground = document.querySelector('.arcade-background');

// Audio del gioco
let backgroundMusic = null;
let clearLineSound = null;
let moveSound = null;
let rotateSound = null;
let dropSound = null;
let gameOverSound = null;

// Dimensioni della griglia di gioco
const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
const NEXT_BLOCK_SIZE = 30;

// Colori neon per i tetramini
const COLORS = [
    null,
    '#00ffff', // I - Ciano
    '#ffff00', // O - Giallo
    '#ff00ff', // T - Magenta
    '#39ff14', // S - Verde
    '#ff073a', // Z - Rosso
    '#00f3ff', // J - Blu chiaro
    '#ff9e00'  // L - Arancione
];

// Shadow colors per l'effetto neon
const SHADOW_COLORS = [
    null,
    'rgba(0, 255, 255, 0.7)', // I - Ciano
    'rgba(255, 255, 0, 0.7)', // O - Giallo
    'rgba(255, 0, 255, 0.7)', // T - Magenta
    'rgba(57, 255, 20, 0.7)', // S - Verde
    'rgba(255, 7, 58, 0.7)',  // Z - Rosso
    'rgba(0, 243, 255, 0.7)', // J - Blu chiaro
    'rgba(255, 158, 0, 0.7)'  // L - Arancione
];

// Definizione dei tetramini
const SHAPES = [
    null,
    // I
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

// Variabili di gioco
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
let gameSpeed = 1000; // Velocità iniziale in millisecondi
let arcadeMachines = []; // Array per le macchine arcade sullo sfondo
let isMusicMuted = false;

// Creazione della griglia di gioco
function createBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

// Inizializzazione del gioco
function init() {
    highScoreElement.textContent = highScore;
    
    // Inizializza gli audio
    initializeAudio();
    
    // Evento per il pulsante di inizio
    startButton.addEventListener('click', startGame);
    
    // Evento per il pulsante di pausa
    pauseButton.addEventListener('click', togglePause);
    
    // Evento per il pulsante di riavvio
    restartButton.addEventListener('click', restartGame);
    
    // Gestione degli eventi da tastiera
    document.addEventListener('keydown', handleKeyPress);
    
    // Disegna la griglia vuota
    drawBoard();
    
    // Inizializza le macchine arcade sullo sfondo
    initArcadeBackground();
}

// Inizializza gli elementi audio
function initializeAudio() {
    // Background music
    backgroundMusic = new Audio('assests/audio/tetris-theme.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.5;
    
    // Sound effects
    clearLineSound = new Audio('assests/audio/line-clear.mp3');
    moveSound = new Audio('assests/audio/move.mp3');
    rotateSound = new Audio('assests/audio/rotate.mp3');
    dropSound = new Audio('assests/audio/drop.mp3');
    gameOverSound = new Audio('assests/audio/game-over.mp3');
    
    // Imposta volumi
    clearLineSound.volume = 0.6;
    moveSound.volume = 0.3;
    rotateSound.volume = 0.4;
    dropSound.volume = 0.5;
    gameOverSound.volume = 0.7;
}

// Funzione per riprodurre suoni
function playSound(sound) {
    if (sound && !isMusicMuted) {
        // Clona il suono per permettere sovrapposizioni
        const soundClone = sound.cloneNode();
        soundClone.play().catch(error => {
            console.log("Errore nella riproduzione dell'audio:", error);
        });
    }
}

// Toggle audio
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

// Inizializza le macchine arcade animate sullo sfondo
function initArcadeBackground() {
    // Crea circa 15 macchine arcade sparse per lo sfondo
    for (let i = 0; i < 15; i++) {
        createArcadeMachine();
    }
}

// Crea una singola macchina arcade sullo sfondo
function createArcadeMachine() {
    const arcade = document.createElement('div');
    arcade.className = 'arcade-machine';
    
    // Posizione casuale
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    
    // Dimensione variabile
    const scale = 0.5 + Math.random() * 1.5;
    
    // Colore casuale per le luci
    const colors = ['#00ffff', '#ffff00', '#ff00ff', '#39ff14', '#ff073a', '#00f3ff', '#ff9e00'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Applica stili
    arcade.style.left = `${x}px`;
    arcade.style.top = `${y}px`;
    arcade.style.transform = `scale(${scale})`;
    arcade.style.boxShadow = `0 0 15px ${color}`;
    
    // Aggiungi illuminazione dello schermo
    arcade.style.setProperty('--screen-color', color);
    
    // Movimento
    const duration = 5 + Math.random() * 10;
    arcade.style.animation = `floatUpDown ${duration}s infinite ease-in-out`;
    arcade.style.animationDelay = `${Math.random() * 5}s`;
    
    // Aggiungi al contenitore
    arcadeBackground.appendChild(arcade);
    arcadeMachines.push(arcade);
    
    return arcade;
}

// Funzione per generare un nuovo pezzo
function generatePiece() {
    // Genera un indice casuale tra 1 e 7 (inclusi)
    const randomIndex = Math.floor(Math.random() * 7) + 1;
    // Clona il pezzo corrispondente all'indice
    const piece = {
        shape: SHAPES[randomIndex].map(row => [...row]),
        color: randomIndex,
        x: Math.floor(COLS / 2) - Math.floor(SHAPES[randomIndex][0].length / 2),
        y: 0
    };
    return piece;
}

// Inizia una nuova partita
function startGame() {
    // Resetta il gioco se necessario
    resetGame();
    
    // Genera il primo pezzo e il prossimo
    currentPiece = generatePiece();
    nextPiece = generatePiece();
    
    // Nascondi il pulsante di inizio e mostra quello di pausa
    startButton.classList.add('hidden');
    pauseButton.classList.remove('hidden');
    
    // Avvia la musica di sottofondo
    if (!isMusicMuted) {
        backgroundMusic.play().catch(error => {
            console.log("Errore nella riproduzione della musica:", error);
        });
    }
    
    // Avvia il loop di gioco
    gameInterval = setInterval(gameLoop, gameSpeed);
    
    // Disegna lo stato iniziale
    draw();
}

// Loop principale di gioco
function gameLoop() {
    if (!isPaused) {
        moveDown();
        draw();
    }
}

// Funzione per mettere in pausa/riprendere il gioco
function togglePause() {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'RIPRENDI' : 'PAUSA';
    
    // Gestisci la musica in base allo stato di pausa
    if (isPaused) {
        backgroundMusic.pause();
    } else if (!isMusicMuted) {
        backgroundMusic.play().catch(error => {
            console.log("Errore nella riproduzione della musica:", error);
        });
    }
}

// Disegna lo stato attuale del gioco
function draw() {
    // Pulisci il canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Disegna la griglia
    drawBoard();
    
    // Disegna il pezzo corrente
    if (currentPiece) {
        drawPiece(ctx, currentPiece);
    }
    
    // Disegna il prossimo pezzo
    drawNextPiece();
    
    // Aggiorna le informazioni di gioco
    scoreElement.textContent = score;
    levelElement.textContent = level;
    linesElement.textContent = lines;
}

// Disegna la griglia di gioco
function drawBoard() {
    // Disegna i blocchi fissi
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x] !== 0) {
                drawBlock(ctx, x, y, board[y][x]);
            }
        }
    }
    
    // Disegna le linee della griglia (opzionale)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 0.5;
    
    // Linee verticali
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

// Disegna un blocco nella griglia con effetti 3D migliorati
function drawBlock(context, x, y, colorIndex) {
    const blockX = x * BLOCK_SIZE;
    const blockY = y * BLOCK_SIZE;
    const blockSize = BLOCK_SIZE - 1; // Ridotto per evitare sovrapposizioni
    
    // Colore principale
    const color = COLORS[colorIndex];
    const shadowColor = SHADOW_COLORS[colorIndex];
    
    // Sfondo del blocco
    context.fillStyle = color;
    context.fillRect(blockX, blockY, blockSize, blockSize);
    
    // Effetto 3D - Faccia superiore (più chiara)
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

    // Effetto Neon - Glow
    context.shadowBlur = 15;
    context.shadowColor = shadowColor;
    context.strokeStyle = lightenColor(color, 50);
    context.lineWidth = 2;
    context.strokeRect(blockX + 2, blockY + 2, blockSize - 4, blockSize - 4);
    
    // Reset shadow
    context.shadowBlur = 0;
}

// Funzione per schiarire un colore
function lightenColor(hexColor, percent) {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    const newR = Math.min(255, r + Math.floor(r * percent / 100));
    const newG = Math.min(255, g + Math.floor(g * percent / 100));
    const newB = Math.min(255, b + Math.floor(b * percent / 100));
    
    return `rgb(${newR}, ${newG}, ${newB})`;
}

// Funzione per scurire un colore
function darkenColor(hexColor, percent) {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    const newR = Math.max(0, r - Math.floor(r * percent / 100));
    const newG = Math.max(0, g - Math.floor(g * percent / 100));
    const newB = Math.max(0, b - Math.floor(b * percent / 100));
    
    return `rgb(${newR}, ${newG}, ${newB})`;
}

// Disegna il pezzo corrente
function drawPiece(context, piece) {
    const shape = piece.shape;
    const color = piece.color;
    
    // Disegna la proiezione (ghost piece)
    let ghostY = piece.y;
    while (isValidMove(0, 1, piece.shape, piece.x, ghostY)) {
        ghostY++;
    }
    
    // Disegna il ghost piece con trasparenza
    context.globalAlpha = 0.3;
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                drawBlock(context, piece.x + x, ghostY + y, color);
            }
        }
    }
    context.globalAlpha = 1.0;
    
    // Disegna il pezzo attuale
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                drawBlock(context, piece.x + x, piece.y + y, color);
            }
        }
    }
}

// Disegna il prossimo pezzo nella box laterale
function drawNextPiece() {
    // Pulisci il canvas
    nextPieceCtx.clearRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);
    
    // Disegna lo sfondo (opzionale)
    nextPieceCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    nextPieceCtx.fillRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);
    
    if (!nextPiece) return;
    
    const shape = nextPiece.shape;
    const color = nextPiece.color;
    
    // Trova i limiti effettivi del pezzo (ignora righe/colonne vuote)
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
    
    // Calcola le dimensioni effettive del pezzo
    const pieceWidth = maxX - minX + 1;
    const pieceHeight = maxY - minY + 1;
    
    // Calcola la posizione per centrare perfettamente il pezzo
    const canvasWidthInBlocks = nextPieceCanvas.width / NEXT_BLOCK_SIZE;
    const canvasHeightInBlocks = nextPieceCanvas.height / NEXT_BLOCK_SIZE;
    
    const startX = Math.floor((canvasWidthInBlocks - pieceWidth) / 2) - minX;
    const startY = Math.floor((canvasHeightInBlocks - pieceHeight) / 2) - minY;
    
    // Disegna il pezzo
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                drawBlock(nextPieceCtx, startX + x, startY + y, color);
            }
        }
    }
}

// Verifica se una mossa è valida
function isValidMove(xOffset, yOffset, shape, x, y) {
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col] !== 0) {
                const newX = x + col + xOffset;
                const newY = y + row + yOffset;
                
                // Fuori dai limiti della griglia
                if (newX < 0 || newX >= COLS || newY >= ROWS) {
                    return false;
                }
                
                // Sotto il limite superiore e collisione con blocchi esistenti
                if (newY >= 0 && board[newY][newX] !== 0) {
                    return false;
                }
            }
        }
    }
    return true;
}

// Movimento verso il basso
function moveDown() {
    if (isValidMove(0, 1, currentPiece.shape, currentPiece.x, currentPiece.y)) {
        currentPiece.y++;
    } else {
        // Il pezzo non può scendere ulteriormente
        // Fissalo sulla griglia e genera un nuovo pezzo
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

// Movimento a sinistra
function moveLeft() {
    if (isValidMove(-1, 0, currentPiece.shape, currentPiece.x, currentPiece.y)) {
        currentPiece.x--;
        playSound(moveSound);
        draw();
    }
}

// Movimento a destra
function moveRight() {
    if (isValidMove(1, 0, currentPiece.shape, currentPiece.x, currentPiece.y)) {
        currentPiece.x++;
        playSound(moveSound);
        draw();
    }
}

// Rotazione del pezzo
function rotate() {
    // Crea una copia della forma attuale
    const shape = currentPiece.shape;
    const n = shape.length;
    
    // Crea una nuova matrice ruotata
    const rotated = Array.from({ length: n }, () => Array(n).fill(0));
    
    // Applica la rotazione (senso orario)
    for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
            rotated[x][n - 1 - y] = shape[y][x];
        }
    }
    
    // Controlla se la rotazione è valida
    if (isValidMove(0, 0, rotated, currentPiece.x, currentPiece.y)) {
        currentPiece.shape = rotated;
        playSound(rotateSound);
        draw();
    } else {
        // Tenta wall kick (spostamento laterale se la rotazione collide con il bordo)
        const kicks = [1, -1, 2, -2]; // Distanze da provare
        for (const kick of kicks) {
            if (isValidMove(kick, 0, rotated, currentPiece.x, currentPiece.y)) {
                currentPiece.x += kick;
                currentPiece.shape = rotated;
                playSound(rotateSound);
                draw();
                break;
            }
        }
    }
}

// Fissa il pezzo sulla griglia
function placePiece() {
    const shape = currentPiece.shape;
    const color = currentPiece.color;
    
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x] !== 0) {
                const boardY = currentPiece.y + y;
                const boardX = currentPiece.x + x;
                
                // Assicurati che il pezzo sia all'interno della griglia
                if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
                    board[boardY][boardX] = color;
                }
            }
        }
    }
    
    // Suono quando un pezzo viene piazzato
    playSound(dropSound);
}

// Controllo e rimozione delle linee complete - SOSTITUITA CON VERSIONE MIGLIORATA PIÙ AVANTI



// Aggiorna il punteggio e il livello
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

// Aggiorna la velocità di gioco in base al livello
function updateSpeed() {
    // La velocità aumenta con il livello
    gameSpeed = Math.max(100, 1000 - (level - 1) * 50);
    
    // Aggiorna l'intervallo di gioco
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
}

// Hard drop (caduta immediata)
function hardDrop() {
    let distance = 0;
    while (isValidMove(0, 1, currentPiece.shape, currentPiece.x, currentPiece.y)) {
        currentPiece.y++;
        distance++;
    }
    
    // Punti extra per hard drop
    score += distance;
    
    // Piazza il pezzo e genera il successivo
    placePiece();
    clearLines();
    
    currentPiece = nextPiece;
    nextPiece = generatePiece();
    
    // Controlla se il gioco è finito
    if (!isValidMove(0, 0, currentPiece.shape, currentPiece.x, currentPiece.y)) {
        gameOver();
    } else {
        playSound(dropSound);
    }
    
    draw();
}

// Gestione degli input da tastiera
function handleKeyPress(event) {
    // Ignora gli input se il gioco è in pausa o finito
    if (isPaused || isGameOver || !currentPiece) return;
    
    switch (event.keyCode) {
        // Controlli originali (frecce)
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

// Game over
function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval);
    
    // Mostra schermata di game over
    finalScoreElement.textContent = score;
    gameOverScreen.classList.remove('hidden');
    
    // Ferma la musica e riproduci il suono di game over
    backgroundMusic.pause();
    playSound(gameOverSound);
    
    // Effetto animato per il game over
    animateGameOver();
}
// Funzione per animazione game over
function animateGameOver() {
    // "Dissolvi" tutti i blocchi nel tabellone
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x] !== 0) {
                // Crea un effetto particellare per ogni blocco
                createDissolveEffect(x, y, board[y][x]);
            }
        }
    }
    
    // Aggiungi l'effetto "Game Over" lampeggiante
    const gameOverText = document.querySelector('.game-over-text');
    gameOverText.classList.add('blinking');
}

// Crea effetto particellare per blocchi che si dissolvono
function createDissolveEffect(x, y, colorIndex) {
    const gameArea = document.querySelector('.game-area');
    const gameAreaRect = gameArea.getBoundingClientRect();
    
    const blockX = x * BLOCK_SIZE;
    const blockY = y * BLOCK_SIZE;
    const color = COLORS[colorIndex];
    
    // Crea diverse particelle per ogni blocco
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'dissolve-particle';
        
        // Posizione iniziale al centro del blocco, relativa alla finestra
        const startX = gameAreaRect.left + blockX + BLOCK_SIZE/2;
        const startY = gameAreaRect.top + blockY + BLOCK_SIZE/2;
        
        particle.style.position = 'fixed';
        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;
        particle.style.zIndex = '15';
        particle.style.pointerEvents = 'none';
        
        // Colore basato sul blocco
        particle.style.backgroundColor = color;
        particle.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
        particle.style.borderRadius = '50%';
        
        // Direzione casuale
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        const size = 3 + Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Aggiungi al DOM
        document.body.appendChild(particle);
        
        // Animazione
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

// Resetta lo stato di gioco per una nuova partita
function resetGame() {
    // Reimposta le variabili di gioco
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
    
    // Resetta gli elementi animati
    const gameOverText = document.querySelector('.game-over-text');
    if (gameOverText) {
        gameOverText.classList.remove('blinking');
    }
    
    // Ferma tutte le animazioni esistenti
    document.querySelectorAll('.dissolve-particle').forEach(particle => {
        particle.remove();
    });
    
    // Reimposta la musica
    backgroundMusic.currentTime = 0;
}

// Riavvia il gioco dopo un game over
function restartGame() {
    resetGame();
    startGame();
}

// Funzione per creare un'esplosione di particelle quando si completa una linea


// Miglioramento della funzione clearLines per includere animazioni
function clearLines() {
    let linesCleared = 0;
    let linesToAnimate = [];
    
    // Controlla ogni riga dal basso verso l'alto
    for (let y = ROWS - 1; y >= 0; y--) {
        let isLineComplete = true;
        
        // Verifica se la riga è completa
        for (let x = 0; x < COLS; x++) {
            if (board[y][x] === 0) {
                isLineComplete = false;
                break;
            }
        }
        
        if (isLineComplete) {
            // Aggiungi alla lista di righe da animare
            linesToAnimate.push(y);
            linesCleared++;
        }
    }
    
    // Se ci sono linee da rimuovere, aggiorna immediatamente
    if (linesCleared > 0) {
        // Riproduci suono
        playSound(clearLineSound);
        
        // Crea una nuova griglia senza le righe complete
        const newBoard = [];
        
        // Copia solo le righe non complete dall'alto verso il basso
        for (let y = 0; y < ROWS; y++) {
            if (!linesToAnimate.includes(y)) {
                newBoard.push([...board[y]]);
            }
        }
        
        // Aggiungi righe vuote in cima per compensare quelle rimosse
        while (newBoard.length < ROWS) {
            newBoard.unshift(Array(COLS).fill(0));
        }
        
        // Sostituisci la griglia con quella aggiornata
        board = newBoard;
        
        // Aggiorna punteggio e interfaccia
        updateScore(linesCleared);
        draw();
    }
}

// Sistema di ricompense visuali basato sul punteggio
function visualReward(points) {
    const reward = document.createElement('div');
    reward.className = 'score-reward';
    reward.textContent = `+${points}`;
    
    // Posiziona vicino al punteggio
    const scoreRect = scoreElement.getBoundingClientRect();
    reward.style.left = `${scoreRect.right + 10}px`;
    reward.style.top = `${scoreRect.top}px`;
    
    // Colore in base ai punti
    if (points >= 800) {
        reward.style.color = '#ff00ff'; // Magenta per Tetris
        reward.style.fontSize = '2em';
        reward.textContent += ' TETRIS!';
    } else if (points >= 500) {
        reward.style.color = '#ffff00'; // Giallo per Triple
    } else if (points >= 300) {
        reward.style.color = '#00ffff'; // Ciano per Double
    }
    
    document.body.appendChild(reward);
    
    // Animazione e rimozione
    setTimeout(() => {
        reward.remove();
    }, 1000);
}

// Miglioramento dell'aggiornamento del punteggio con ricompense visuali
function updateScore(linesCleared) {
    // Sistema di punteggio con bonus per linee multiple
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
    
    // Aggiorna il record
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('tetrisHighScore', highScore);
        highScoreElement.textContent = highScore;
        
        // Animazione per nuovo record
        const highScoreTag = document.createElement('div');
        highScoreTag.className = 'high-score-tag';
        highScoreTag.textContent = 'NEW HIGH SCORE!';
        document.body.appendChild(highScoreTag);
        
        setTimeout(() => {
            highScoreTag.remove();
        }, 2000);
    }
}

// Animazione per avanzamento di livello
function levelUpAnimation() {
    // Crea un elemento overlay per l'animazione
    const levelUp = document.createElement('div');
    levelUp.className = 'level-up-animation';
    levelUp.innerHTML = `<span>LEVEL ${level}!</span>`;
    document.body.appendChild(levelUp);
    
    // Riproduci un suono speciale per il livello
    const levelUpSound = new Audio('assests/audio/level-up.mp3');
    playSound(levelUpSound);
    
    // Rimuovi dopo l'animazione
    setTimeout(() => {
        levelUp.remove();
    }, 2000);
}

// Aggiungi effetti particellari sullo sfondo
function addBackgroundEffects() {
    // Crea particelle "stelle" per l'atmosfera arcade
    for (let i = 0; i < 50; i++) {
        createStarParticle();
    }
    
    // Aggiungi un effetto di scanline per l'aspetto retro
    const scanlines = document.createElement('div');
    scanlines.className = 'scanlines';
    document.body.appendChild(scanlines);
}

// Crea una singola particella "stella" per lo sfondo
function createStarParticle() {
    const star = document.createElement('div');
    star.className = 'star-particle';
    
    // Posizione casuale
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    
    // Dimensione e colore casuali
    const size = 1 + Math.random() * 3;
    const colors = ['#00ffff', '#ffff00', '#ff00ff', '#39ff14', '#ff073a', '#00f3ff', '#ff9e00'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.backgroundColor = color;
    star.style.boxShadow = `0 0 ${size * 2}px ${color}`;
    
    // Animazione lampeggiante con durata casuale
    const duration = 1 + Math.random() * 5;
    star.style.animation = `starTwinkle ${duration}s infinite ease-in-out`;
    star.style.animationDelay = `${Math.random() * duration}s`;
    
    document.body.appendChild(star);
}

// CSS aggiuntivo per le animazioni (da aggiungere in un file .css)
/* 
@keyframes starTwinkle {
    0%, 100% { opacity: 0.1; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.2); }
}

@keyframes particleExplode {
    0% { transform: translate(0, 0) scale(1); opacity: 1; }
    100% { transform: translate(var(--tx, 0), var(--ty, 0)) scale(0); opacity: 0; }
}

@keyframes rotate-block {
    0% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(1.5); }
    100% { transform: rotate(360deg) scale(0); }
}

.level-up-animation {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 48px;
    font-family: 'Press Start 2P', cursive;
    color: #39ff14;
    text-shadow: 0 0 10px #39ff14, 0 0 20px #39ff14, 0 0 30px #000;
    animation: pulse 2s infinite;
    z-index: 1000;
}

@keyframes pulse {
    0% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
    50% { transform: translate(-50%, -50%) scale(1.5); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
}

.scanlines {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0) 50%,
        rgba(0, 0, 0, 0.1) 50%
    );
    background-size: 100% 4px;
    pointer-events: none;
    z-index: 999;
    opacity: 0.3;
}

.score-reward {
    position: absolute;
    font-family: 'Press Start 2P', cursive;
    font-size: 1.5em;
    animation: float-up 1s forwards;
    text-shadow: 0 0 5px currentColor, 0 0 10px currentColor;
}

@keyframes float-up {
    from { transform: translateY(0); opacity: 1; }
    to { transform: translateY(-50px); opacity: 0; }
}

.high-score-tag {
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'Press Start 2P', cursive;
    font-size: 2em;
    color: gold;
    text-shadow: 0 0 10px gold, 0 0 20px gold;
    animation: bounce 0.5s infinite alternate;
}

@keyframes bounce {
    from { transform: translateX(-50%) scale(1); }
    to { transform: translateX(-50%) scale(1.1); }
}

.blinking {
    animation: blink 0.8s infinite;
}

@keyframes blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
}
*/

// Inizializza il gioco al caricamento
window.onload = function() {
    // Carica gli elementi audio
    initializeAudio();
    
    // Inizializza il gioco
    init();
    
    // Aggiungi effetti di sfondo
    addBackgroundEffects();
    
    // Crea pixel colorati dinamici
    createDynamicPixels();
    
    // Aggiungi listener per il ridimensionamento della finestra
    window.addEventListener('resize', function() {
        // Ridisegna il gioco
        draw();
        
        // Riposiziona le macchine arcade
        arcadeMachines.forEach(machine => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            machine.style.left = `${x}px`;
            machine.style.top = `${y}px`;
        });
    });
    
    // Aggiungi un gestore di eventi per il gamepad se supportato
    if (navigator.getGamepads) {
        initGamepadSupport();
    }
};

// Supporto per gamepad (opzionale)
function initGamepadSupport() {
    let gamepadInterval;
    
    window.addEventListener("gamepadconnected", function(e) {
        console.log("Gamepad connesso:", e.gamepad.id);
        // Avvia il polling del gamepad
        if (!gamepadInterval) {
            gamepadInterval = setInterval(pollGamepad, 100);
        }
    });
    
    window.addEventListener("gamepaddisconnected", function(e) {
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
    
    // D-Pad o analogico sinistro
    if (gamepad.buttons[14].pressed || gamepad.axes[0] < -0.5) { // Sinistra
        moveLeft();
    }
    if (gamepad.buttons[15].pressed || gamepad.axes[0] > 0.5) { // Destra
        moveRight();
    }
    if (gamepad.buttons[13].pressed || gamepad.axes[1] > 0.5) { // Giù
        moveDown();
        draw();
    }
    
    // Pulsanti azione
    if (gamepad.buttons[0].pressed || gamepad.buttons[1].pressed) { // A o B
        rotate();
    }
    if (gamepad.buttons[3].pressed) { // Y
        hardDrop();
    }
    if (gamepad.buttons[9].pressed) { // Start
        togglePause();
    }
}

// Funzione per creare pixel colorati dinamici sullo sfondo
function createDynamicPixels() {
    const pixelContainer = document.createElement('div');
    pixelContainer.id = 'dynamic-pixels';
    pixelContainer.style.position = 'fixed';
    pixelContainer.style.top = '0';
    pixelContainer.style.left = '0';
    pixelContainer.style.width = '100%';
    pixelContainer.style.height = '100%';
    pixelContainer.style.pointerEvents = 'none';
    pixelContainer.style.zIndex = '-2';
    
    document.body.appendChild(pixelContainer);
    
    // Crea 50 pixel sparsi che cambiano colore
    for (let i = 0; i < 50; i++) {
        createColorfulPixel(pixelContainer);
    }
    
    // Aggiungi nuovi pixel ogni 2 secondi (solo se il gioco non è in game over)
    setInterval(() => {
        if (pixelContainer.children.length < 80 && !isGameOver) {
            createColorfulPixel(pixelContainer);
        }
    }, 2000);
}

// Crea un singolo pixel colorato che cambia colore
function createColorfulPixel(container) {
    const pixel = document.createElement('div');
    pixel.className = 'dynamic-pixel';
    
    // Posizione casuale
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    
    // Dimensione casuale tra 2 e 8 pixel
    const size = 2 + Math.random() * 6;
    
    // Colori neon disponibili
    const colors = [
        '#00ffff', '#ffff00', '#ff00ff', '#39ff14', 
        '#ff073a', '#00f3ff', '#ff9e00'
    ];
    
    pixel.style.position = 'absolute';
    pixel.style.left = `${x}px`;
    pixel.style.top = `${y}px`;
    pixel.style.width = `${size}px`;
    pixel.style.height = `${size}px`;
    pixel.style.borderRadius = '50%';
    pixel.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    pixel.style.boxShadow = `0 0 ${size * 2}px currentColor`;
    
    // Animazione di cambio colore continuo
    let colorIndex = 0;
    const changeColor = () => {
        colorIndex = (colorIndex + 1) % colors.length;
        pixel.style.backgroundColor = colors[colorIndex];
        pixel.style.boxShadow = `0 0 ${size * 2}px ${colors[colorIndex]}`;
    };
    
    // Cambia colore ogni 500-2000ms
    const interval = setInterval(changeColor, 500 + Math.random() * 1500);
    
    // Movimento lento e casuale
    let pixelX = x;
    let pixelY = y;
    const speed = 0.2 + Math.random() * 0.5;
    const direction = Math.random() * Math.PI * 2;
    
    const movePixel = () => {
        pixelX += Math.cos(direction) * speed;
        pixelY += Math.sin(direction) * speed;
        
        // Riposiziona se esce dallo schermo
        if (pixelX < 0) pixelX = window.innerWidth;
        if (pixelX > window.innerWidth) pixelX = 0;
        if (pixelY < 0) pixelY = window.innerHeight;
        if (pixelY > window.innerHeight) pixelY = 0;
        
        pixel.style.left = `${pixelX}px`;
        pixel.style.top = `${pixelY}px`;
    };
    
    const moveInterval = setInterval(movePixel, 50);
    
    container.appendChild(pixel);
    
    // Rimuovi il pixel dopo 20-40 secondi
    setTimeout(() => {
        clearInterval(interval);
        clearInterval(moveInterval);
        if (pixel.parentNode) {
            pixel.parentNode.removeChild(pixel);
        }
    }, 20000 + Math.random() * 20000);
}