// Variables del juego
const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const grid = 16;
let count = 0;
let gameRunning = false;
let gamePaused = false;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let animationId;

// Elementos de la interfaz
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const lengthElement = document.getElementById('length');
const gameOverlay = document.getElementById('game-overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayMessage = document.getElementById('overlay-message');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const soundBtn = document.getElementById('sound-btn');
const pauseIcon = document.getElementById('pause-icon');

// Sonido
let soundEnabled = true;
const eatSound = document.getElementById('eat-sound');
const crashSound = document.getElementById('crash-sound');

// Inicializar puntuación alta
highScoreElement.textContent = highScore;

// Objetos del juego
const snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 4,
    color: '#00ff88'
};

const apple = {
    x: 320,
    y: 320,
    color: '#ff3366',
    glowColor: '#ff6699'
};

// Generar posición aleatoria
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Dibujar con efecto de brillo
function drawWithGlow(x, y, width, height, color, glowColor) {
    // Sombra exterior
    context.shadowColor = glowColor;
    context.shadowBlur = 15;
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
    
    // Resetear sombra
    context.shadowBlur = 0;
}

// Dibujar la serpiente
function drawSnake() {
    snake.cells.forEach((cell, index) => {
        // Color degradado (cabeza más brillante)
        const colorIntensity = 1 - (index / snake.cells.length * 0.7);
        const r = Math.floor(0 * colorIntensity);
        const g = Math.floor(255 * colorIntensity);
        const b = Math.floor(136 * colorIntensity);
        const cellColor = `rgb(${r}, ${g}, ${b})`;
        
        drawWithGlow(cell.x, cell.y, grid-1, grid-1, cellColor, '#00ff88');
        
        // Dibujar ojos en la cabeza
        if (index === 0) {
            const eyeSize = grid / 5;
            const eyeOffset = grid / 3;
            
            // Ojos basados en la dirección
            let leftEyeX, leftEyeY, rightEyeX, rightEyeY;
            
            if (snake.dx > 0) { // Derecha
                leftEyeX = cell.x + grid - eyeOffset;
                leftEyeY = cell.y + eyeOffset;
                rightEyeX = cell.x + grid - eyeOffset;
                rightEyeY = cell.y + grid - eyeOffset;
            } else if (snake.dx < 0) { // Izquierda
                leftEyeX = cell.x + eyeOffset;
                leftEyeY = cell.y + eyeOffset;
                rightEyeX = cell.x + eyeOffset;
                rightEyeY = cell.y + grid - eyeOffset;
            } else if (snake.dy > 0) { // Abajo
                leftEyeX = cell.x + eyeOffset;
                leftEyeY = cell.y + grid - eyeOffset;
                rightEyeX = cell.x + grid - eyeOffset;
                rightEyeY = cell.y + grid - eyeOffset;
            } else { // Arriba
                leftEyeX = cell.x + eyeOffset;
                leftEyeY = cell.y + eyeOffset;
                rightEyeX = cell.x + grid - eyeOffset;
                rightEyeY = cell.y + eyeOffset;
            }
            
            context.fillStyle = 'white';
            context.fillRect(leftEyeX, leftEyeY, eyeSize, eyeSize);
            context.fillRect(rightEyeX, rightEyeY, eyeSize, eyeSize);
        }
    });
}

// Dibujar manzana
function drawApple() {
    // Efecto de pulso para la manzana
    const pulse = Math.sin(Date.now() / 200) * 2 + 2;
    const appleSize = grid - 1 + pulse;
    const offset = (grid - appleSize) / 2;
    
    drawWithGlow(
        apple.x + offset, 
        apple.y + offset, 
        appleSize, 
        appleSize, 
        apple.color, 
        apple.glowColor
    );
    
    // Tallo de la manzana
    context.fillStyle = '#8B4513';
    context.fillRect(apple.x + grid/2 - 1, apple.y - 3, 2, 4);
    
    // Hoja
    context.fillStyle = '#00ff88';
    context.beginPath();
    context.ellipse(apple.x + grid/2 + 3, apple.y - 1, 3, 2, Math.PI/4, 0, Math.PI * 2);
    context.fill();
}

// Actualizar interfaz
function updateUI() {
    scoreElement.textContent = score;
    lengthElement.textContent = snake.maxCells;
    
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
        localStorage.setItem('snakeHighScore', highScore);
    }
}

// Mostrar pantalla de inicio/pausa/game over
function showOverlay(title, message, showButton = true) {
    overlayTitle.textContent = title;
    overlayMessage.textContent = message;
    gameOverlay.style.display = 'flex';
    startBtn.style.display = showButton ? 'flex' : 'none';
}

// Ocultar overlay
function hideOverlay() {
    gameOverlay.style.display = 'none';
}

// Reiniciar juego
function resetGame() {
    snake.x = 160;
    snake.y = 160;
    snake.dx = grid;
    snake.dy = 0;
    snake.cells = [];
    snake.maxCells = 4;
    
    apple.x = getRandomInt(0, 25) * grid;
    apple.y = getRandomInt(0, 25) * grid;
    
    score = 0;
    updateUI();
    gameRunning = true;
    hideOverlay();
}

// Colisión con el cuerpo
function checkCollision() {
    for (let i = 1; i < snake.cells.length; i++) {
        if (snake.cells[0].x === snake.cells[i].x && 
            snake.cells[0].y === snake.cells[i].y) {
            
            if (soundEnabled) {
                crashSound.currentTime = 0;
                crashSound.play();
            }
            
            gameRunning = false;
            showOverlay('¡GAME OVER!', `Puntuación: ${score}`, true);
            return true;
        }
    }
    return false;
}

// Bucle principal del juego
function gameLoop() {
    if (!gameRunning || gamePaused) return;
    
    animationId = requestAnimationFrame(gameLoop);
    
    if (++count < 4) return;
    count = 0;
    
    // Limpiar canvas con efecto de desvanecimiento
    context.fillStyle = 'rgba(17, 17, 34, 0.3)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Mover serpiente
    snake.x += snake.dx;
    snake.y += snake.dy;
    
    // Teletransporte en bordes
    if (snake.x < 0) snake.x = canvas.width - grid;
    else if (snake.x >= canvas.width) snake.x = 0;
    
    if (snake.y < 0) snake.y = canvas.height - grid;
    else if (snake.y >= canvas.height) snake.y = 0;
    
    // Agregar nueva posición
    snake.cells.unshift({ x: snake.x, y: snake.y });
    
    // Mantener longitud
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }
    
    // Dibujar elementos
    drawApple();
    drawSnake();
    
    // Comer manzana
    if (snake.cells[0].x === apple.x && snake.cells[0].y === apple.y) {
        snake.maxCells++;
        score += 10;
        
        if (soundEnabled) {
            eatSound.currentTime = 0;
            eatSound.play();
        }
        
        // Nueva manzana (no en la serpiente)
        let newApplePosition;
        do {
            newApplePosition = {
                x: getRandomInt(0, 25) * grid,
                y: getRandomInt(0, 25) * grid
            };
        } while (snake.cells.some(cell => 
            cell.x === newApplePosition.x && cell.y === newApplePosition.y
        ));
        
        apple.x = newApplePosition.x;
        apple.y = newApplePosition.y;
        
        updateUI();
    }
    
    // Comprobar colisión
    checkCollision();
}

// Controles de teclado
document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case 'ArrowLeft':
            if (snake.dx === 0 && gameRunning) {
                snake.dx = -grid;
                snake.dy = 0;
            }
            break;
        case 'ArrowUp':
            if (snake.dy === 0 && gameRunning) {
                snake.dy = -grid;
                snake.dx = 0;
            }
            break;
        case 'ArrowRight':
            if (snake.dx === 0 && gameRunning) {
                snake.dx = grid;
                snake.dy = 0;
            }
            break;
        case 'ArrowDown':
            if (snake.dy === 0 && gameRunning) {
                snake.dy = grid;
                snake.dx = 0;
            }
            break;
        case ' ':
            if (!gameRunning) {
                resetGame();
                gameLoop();
            } else {
                togglePause();
            }
            e.preventDefault();
            break;
    }
});

// Controles táctiles
document.querySelectorAll('.btn-control').forEach(button => {
    button.addEventListener('click', function() {
        if (!gameRunning) return;
        
        const direction = this.getAttribute('data-direction');
        
        switch(direction) {
            case 'up':
                if (snake.dy === 0) {
                    snake.dy = -grid;
                    snake.dx = 0;
                }
                break;
            case 'down':
                if (snake.dy === 0) {
                    snake.dy = grid;
                    snake.dx = 0;
                }
                break;
            case 'left':
                if (snake.dx === 0) {
                    snake.dx = -grid;
                    snake.dy = 0;
                }
                break;
            case 'right':
                if (snake.dx === 0) {
                    snake.dx = grid;
                    snake.dy = 0;
                }
                break;
        }
        
        // Efecto táctil
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = '';
        }, 100);
    });
});

// Botón central (pausa)
document.querySelector('.btn-center').addEventListener('click', togglePause);

// Control por gestos táctiles (swipe)
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    e.preventDefault();
});

canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
});

canvas.addEventListener('touchend', function(e) {
    if (!gameRunning) {
        resetGame();
        gameLoop();
        return;
    }
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    
    // Determinar dirección del swipe
    if (Math.abs(dx) > Math.abs(dy)) {
        // Movimiento horizontal
        if (dx > 0 && snake.dx === 0) {
            snake.dx = grid;
            snake.dy = 0;
        } else if (dx < 0 && snake.dx === 0) {
            snake.dx = -grid;
            snake.dy = 0;
        }
    } else {
        // Movimiento vertical
        if (dy > 0 && snake.dy === 0) {
            snake.dy = grid;
            snake.dx = 0;
        } else if (dy < 0 && snake.dy === 0) {
            snake.dy = -grid;
            snake.dx = 0;
        }
    }
    
    e.preventDefault();
});

// Funciones de control
function togglePause() {
    if (!gameRunning) return;
    
    gamePaused = !gamePaused;
    
    if (gamePaused) {
        showOverlay('JUEGO EN PAUSA', 'Presiona ESPACIO para continuar', false);
        pauseIcon.className = 'fas fa-play';
        pauseBtn.innerHTML = '<i class="fas fa-play"></i> Reanudar';
    } else {
        hideOverlay();
        pauseIcon.className = 'fas fa-pause';
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pausa';
        gameLoop();
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    soundBtn.innerHTML = soundEnabled ? 
        '<i class="fas fa-volume-up"></i> Sonido' : 
        '<i class="fas fa-volume-mute"></i> Sonido';
}

// Event listeners para botones
startBtn.addEventListener('click', function() {
    resetGame();
    gameLoop();
});

pauseBtn.addEventListener('click', togglePause);

resetBtn.addEventListener('click', function() {
    resetGame();
    if (!gamePaused) {
        gameLoop();
    }
});

soundBtn.addEventListener('click', toggleSound);

// Inicialización
showOverlay('¡SNAKE EVOLUTION!', 'Presiona JUGAR para empezar', true);

// Asegurar que el canvas sea táctil
canvas.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Detectar si es dispositivo táctil
if ('ontouchstart' in window) {
    document.querySelector('.mobile-controls').style.display = 'flex';
}