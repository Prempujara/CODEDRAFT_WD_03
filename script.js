
        const board = document.getElementById('board');
        const statusDisplay = document.getElementById('status');
        const resetButton = document.getElementById('reset');
        const gameModeButtons = document.getElementById('game-mode');
        let currentPlayer = 'X';
        let gameState = Array(9).fill(null);
        let isGameActive = true;
        let isAgainstAI = false;

        const winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        function checkWinner() {
            for (const condition of winningConditions) {
                const [a, b, c] = condition;
                if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                    statusDisplay.textContent = `Player ${gameState[a]} Wins!`;
                    isGameActive = false;
                    return true;
                }
            }
            if (!gameState.includes(null)) {
                statusDisplay.textContent = "It's a Draw!";
                isGameActive = false;
                return true;
            }
            return false;
        }

        function minimax(newGameState, isMaximizing) {
            const winner = evaluate(newGameState);
            if (winner !== null) {
                return winner === 'X' ? -10 : winner === 'O' ? 10 : 0;
            }

            if (isMaximizing) {
                let bestScore = -Infinity;
                for (let i = 0; i < newGameState.length; i++) {
                    if (!newGameState[i]) {
                        newGameState[i] = 'O';
                        let score = minimax(newGameState, false);
                        newGameState[i] = null;
                        bestScore = Math.max(score, bestScore);
                    }
                }
                return bestScore;
            } else {
                let bestScore = Infinity;
                for (let i = 0; i < newGameState.length; i++) {
                    if (!newGameState[i]) {
                        newGameState[i] = 'X';
                        let score = minimax(newGameState, true);
                        newGameState[i] = null;
                        bestScore = Math.min(score, bestScore);
                    }
                }
                return bestScore;
            }
        }

        function bestMove() {
            let bestScore = -Infinity;
            let move;
            for (let i = 0; i < gameState.length; i++) {
                if (!gameState[i]) {
                    gameState[i] = 'O';
                    let score = minimax(gameState, false);
                    gameState[i] = null;
                    if (score > bestScore) {
                        bestScore = score;
                        move = i;
                    }
                }
            }
            return move;
        }

        function aiMove() {
            if (isGameActive) {
                const index = bestMove();
                gameState[index] = 'O';
                const cell = document.querySelector(`.cell[data-index="${index}"]`);
                cell.textContent = 'O';
                cell.classList.add('taken');
                if (!checkWinner()) {
                    currentPlayer = 'X';
                    statusDisplay.textContent = `Player X's Turn`;
                }
            }
        }

        function evaluate(state) {
            for (const condition of winningConditions) {
                const [a, b, c] = condition;
                if (state[a] && state[a] === state[b] && state[a] === state[c]) {
                    return state[a];
                }
            }
            return state.includes(null) ? null : 'Draw';
        }

        function handleCellClick(event) {
            const cell = event.target;
            const index = cell.getAttribute('data-index');

            if (!gameState[index] && isGameActive) {
                gameState[index] = currentPlayer;
                cell.textContent = currentPlayer;
                cell.classList.add('taken');

                if (!checkWinner()) {
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                    statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;

                    if (isAgainstAI && currentPlayer === 'O') {
                        setTimeout(aiMove, 500);
                    }
                }
            }
        }

        function resetGame() {
            gameState.fill(null);
            currentPlayer = 'X';
            isGameActive = true;
            statusDisplay.textContent = isAgainstAI ? "Player X's Turn" : "Player X's Turn";
            Array.from(board.children).forEach(cell => {
                cell.textContent = '';
                cell.classList.remove('taken');
            });
        }

        function startGame(withAI) {
            isAgainstAI = withAI;
            gameModeButtons.style.display = 'none';
            board.style.display = 'grid';
            resetButton.style.display = 'block';
            resetGame();
        }

        document.getElementById('two-player').addEventListener('click', () => startGame(false));
        document.getElementById('play-ai').addEventListener('click', () => startGame(true));
        board.addEventListener('click', handleCellClick);
        resetButton.addEventListener('click', resetGame);
    