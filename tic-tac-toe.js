//Gameboard Object w/ gameboard array stored inside (object module)
const gameBoard = (() => {
    const _newBoard = [["","",""],["","",""],["","",""]];
    const _newMoves = [];
    const gameSquaresAll = document.querySelectorAll(".game-square");
    const players = [];
    let board = [];
    let _playOn = true;
    let _playerCurrent = 0;
    let moves = [];

    const resetBoard = function() {
        board = _newBoard;
        //console.log(board);
    }

    const createBoardELs = function() {
        //creates event listeners to created div square elements
        gameSquaresAll.forEach(square => {
            square.addEventListener("click",gamePlay.oneTurn);
            console.log("ELs added.")
        })
    }

    const _updateBoardDisplay = () => {
        //updates board element text content & sets up event listeners in divs
        gameSquaresAll.forEach(square => {
            let tempIndex = square.id.split("-")[1];
            square.textContent = board[tempIndex[0]][tempIndex[1]];
        })
    }

    const addMarkerToBoard = (e) => {
        let selectedIndex = e.srcElement.id.split("-")[1];
        moves.push(selectedIndex);
        console.log(moves);
        if (board[selectedIndex[0]][selectedIndex[1]].length === 0) {
            //if square available places marker
            board[selectedIndex[0]][selectedIndex[1]] = players[_playerCurrent].mkr;
            _togglePlayer();
            _updateBoardDisplay();
            //check if last move ends game and calls function to end it if it does
            if (!checkWinner()) {
                gamePlay.endGame();
            }
        } else { 
            commDisplay.textContent = "That square is already taken, please select another.";
        }
    }

    const checkWinner = function() {
        //check rows and columns
        if (_playOn) {
            for (i=0;i<3;i++) {
                if (board[i][0] === board[i][1]  && board[i][1] === board[i][2] && board[i][2].length != 0) {
                    _playOn = false;
                    console.log(`row ${i} winner`);
                } else if (board[0][i] === board[1][i]  && board[1][i] === board[2][i] && board[2][i].length != 0) {
                    _playOn = false;
                    console.log(`row ${i} winner`);
                }
            }
        }
        //check diagonals
        if (_playOn) {
            for (i=0;i<3;i++) {
                if (board[0][0] === board[1][1]  && board[1][1] === board[2][2] && board[2][2].length != 0) {
                    _playOn = false;
                    console.log(`diagonal top to bottom winner`);
                } else if (board[2][0] === board[1][1]  && board[1][1] === board[0][2] && board[0][2].length != 0) {
                    _playOn = false;
                    console.log(`diagonal bottom to top winner`);
                }
            }
        }

        //check for all squares filled 
        if (moves.length === 9) {
            _playOn = false;
            console.log(`All squares taken, no winner`);
        }
        console.log(`Play on = ${_playOn}`);
        console.log(board);
        return(_playOn);
    }

    const _togglePlayer = () => {
        if (_playerCurrent === 0) {
            _playerCurrent = 1;
        } else {
            _playerCurrent = 0;
        }
        commDisplay.textContent = `${players[_playerCurrent].name} it is now your turn. Please select a square.`;
    }

    return {board, players, resetBoard, createBoardELs, addMarkerToBoard, checkWinner};
})();


//Player Objects (object factories)
const playerFactory = (var1) => {
    const name = var1;
    const moves = [];
    const assignMkr = () => {
        if (gameBoard.players.length === 0) {
            return "X";
        } else if (gameBoard.players.length === 1) {
            return "O";
        }
    }
    const mkr = assignMkr();
    const _method2 = () => {
        console.log(var1);
    }
    return {name, assignMkr, mkr, moves}
};



//Gameflow/Data Object (object module)
const gamePlay = (() => {
    const var1 = "hi";
    const _var2 = "Hello";
    const startGame = () => {
        //assign players
        let player1 = playerFactory(prompt("Player 1, please enter your name?"));
        gameBoard.players[0] = player1;
        let player2 = playerFactory(prompt("Player 2, please enter your name?"));
        gameBoard.players[1] = player2;
        //give instructions on next move
        commDisplay.textContent = "Good Luck to both players, Player 1 your are X and you have the first turn. Please selecrt a square to place your marker."
        // Sets gameboard and event listeners for squares
        gameBoard.resetBoard();
        gameBoard.createBoardELs();
    }
    const oneTurn = (e) => {
        console.log("Next turn started")
        //add marker to board 
        gameBoard.addMarkerToBoard(e);
    }
    const endGame = function() {
        commDisplay.textContent = "Game Over, Player XX wins!"
        console.log("Game Over");
    }
    return {var1, startGame, oneTurn, endGame};
})();

//Event Listeners 
const newGameBtn = document.querySelector(".new-game-btn");
const commDisplay = document.querySelector(".gameplay-communication");
const gameBoardDiv = document.querySelector(".gameboard");
newGameBtn.addEventListener("click",gamePlay.startGame);



