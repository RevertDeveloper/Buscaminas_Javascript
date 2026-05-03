const gameForm = document.getElementById('game-form');
const boardSizeInput = document.getElementById('board-size');
const mineCountInput = document.getElementById('mine-count');
const boardElement = document.getElementById('board');
const gameTimeElement = document.getElementById('game-time');
const gameMessageElement = document.getElementById('game-message');

const gameState = {
    size: 0,
    mines: 0,
    board: [],
    revealedSafeCells: 0,
    isGameOver: false,
    secondsElapsed: 0,
    timerId: null,
    hasStarted: false
};

function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
        .map((value) => String(value).padStart(2, '0'))
        .join(':');
}

function updateTime() {
    gameTimeElement.textContent = `Tiempo: ${formatTime(gameState.secondsElapsed)}`;
}

function stopTimer() {
    clearInterval(gameState.timerId);
    gameState.timerId = null;
}

function startTimer() {
    if (gameState.hasStarted || gameState.isGameOver) {
        return;
    }

    gameState.hasStarted = true;
    gameState.timerId = setInterval(() => {
        gameState.secondsElapsed += 1;
        updateTime();
    }, 1000);
}

function createCell(row, column) {
    return {
        row,
        column,
        isMine: false,
        adjacentMines: 0,
        isRevealed: false,
        isFlagged: false,
        element: null
    };
}

function getNeighborPositions(row, column) {
    const positions = [];

    for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
        for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
            if (rowOffset === 0 && columnOffset === 0) {
                continue;
            }

            const nextRow = row + rowOffset;
            const nextColumn = column + columnOffset;

            if (
                nextRow >= 0
                && nextRow < gameState.size
                && nextColumn >= 0
                && nextColumn < gameState.size
            ) {
                positions.push({ row: nextRow, column: nextColumn });
            }
        }
    }

    return positions;
}

function placeMines() {
    let minesPlaced = 0;

    while (minesPlaced < gameState.mines) {
        const row = Math.floor(Math.random() * gameState.size);
        const column = Math.floor(Math.random() * gameState.size);
        const cell = gameState.board[row][column];

        if (cell.isMine) {
            continue;
        }

        cell.isMine = true;
        minesPlaced += 1;
    }
}

function calculateAdjacentMines() {
    gameState.board.forEach((row) => {
        row.forEach((cell) => {
            if (cell.isMine) {
                return;
            }

            const adjacentMineCount = getNeighborPositions(cell.row, cell.column).filter((position) => {
                return gameState.board[position.row][position.column].isMine;
            }).length;

            cell.adjacentMines = adjacentMineCount;
        });
    });
}

function updateCellAppearance(cell) {
    const { element } = cell;

    element.className = 'cell';
    element.textContent = '';

    if (cell.isRevealed) {
        element.classList.add('revealed');

        if (cell.isMine) {
            element.classList.add('mine');
            element.textContent = '💣';
            return;
        }

        if (cell.adjacentMines > 0) {
            element.textContent = String(cell.adjacentMines);
        }

        return;
    }

    if (cell.isFlagged) {
        element.classList.add('flagged');
        element.textContent = '🚩';
    }
}

function revealCell(row, column) {
    const cell = gameState.board[row][column];

    if (cell.isRevealed || cell.isFlagged) {
        return;
    }

    cell.isRevealed = true;
    updateCellAppearance(cell);

    if (cell.isMine) {
        return;
    }

    gameState.revealedSafeCells += 1;

    if (cell.adjacentMines !== 0) {
        return;
    }

    getNeighborPositions(row, column).forEach((position) => {
        revealCell(position.row, position.column);
    });
}

function revealAllMines() {
    gameState.board.forEach((row) => {
        row.forEach((cell) => {
            if (cell.isMine) {
                cell.isRevealed = true;
                updateCellAppearance(cell);
            }
        });
    });
}

function finishGame(message) {
    gameState.isGameOver = true;
    stopTimer();
    gameMessageElement.textContent = message;
}

function checkVictory() {
    const safeCells = (gameState.size * gameState.size) - gameState.mines;

    if (gameState.revealedSafeCells === safeCells) {
        finishGame(`Felicidades, has ganado. Tiempo total: ${formatTime(gameState.secondsElapsed)}`);
    }
}

function handleCellClick(row, column) {
    if (gameState.isGameOver) {
        return;
    }

    const cell = gameState.board[row][column];

    if (cell.isFlagged || cell.isRevealed) {
        return;
    }

    startTimer();

    if (cell.isMine) {
        cell.isRevealed = true;
        updateCellAppearance(cell);
        revealAllMines();
        finishGame('Game Over');
        return;
    }

    revealCell(row, column);
    checkVictory();
}

function handleCellRightClick(event, row, column) {
    event.preventDefault();

    if (gameState.isGameOver) {
        return;
    }

    const cell = gameState.board[row][column];

    if (cell.isRevealed) {
        return;
    }

    cell.isFlagged = !cell.isFlagged;
    updateCellAppearance(cell);
}

function renderBoard() {
    boardElement.innerHTML = '';
    boardElement.style.gridTemplateColumns = `repeat(${gameState.size}, 36px)`;

    if (window.innerWidth <= 600) {
        boardElement.style.gridTemplateColumns = `repeat(${gameState.size}, 30px)`;
    }

    gameState.board.forEach((row) => {
        row.forEach((cell) => {
            const button = document.createElement('button');

            button.type = 'button';
            button.className = 'cell';
            button.addEventListener('click', () => {
                handleCellClick(cell.row, cell.column);
            });
            button.addEventListener('contextmenu', (event) => {
                handleCellRightClick(event, cell.row, cell.column);
            });

            cell.element = button;
            boardElement.appendChild(button);
            updateCellAppearance(cell);
        });
    });
}

function createBoard(size, mines) {
    gameState.size = size;
    gameState.mines = mines;
    gameState.board = [];
    gameState.revealedSafeCells = 0;
    gameState.isGameOver = false;
    gameState.secondsElapsed = 0;
    gameState.hasStarted = false;
    stopTimer();
    updateTime();
    gameMessageElement.textContent = 'Partida en curso.';

    for (let row = 0; row < size; row += 1) {
        const currentRow = [];

        for (let column = 0; column < size; column += 1) {
            currentRow.push(createCell(row, column));
        }

        gameState.board.push(currentRow);
    }

    placeMines();
    calculateAdjacentMines();
    renderBoard();
}

gameForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const size = Number(boardSizeInput.value);
    const mines = Number(mineCountInput.value);
    const totalCells = size * size;

    if (!size || !mines) {
        gameMessageElement.textContent = 'Debes indicar un tamano y una cantidad de minas.';
        return;
    }

    if (mines >= totalCells) {
        gameMessageElement.textContent = 'La cantidad de minas debe ser menor que el numero total de celdas.';
        return;
    }

    createBoard(size, mines);
});

updateTime();