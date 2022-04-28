//Gameboard Object w/ gameboard array stored inside (object module)
const gameBoard = (() => {
    const gameSquaresAll = document.querySelectorAll(".game-square");
    const players = [];
    const board = [["","",""],["","",""],["","",""]];
    let _playOn = true;
    let _playerCurrent = 0;
    let _moves = [];

    const returnCurrentPlayer = function() {
        return _playerCurrent;
    }

    const resetBoard = function() {
        _clearBoardArr();
        _clearArr(_moves);
        _clearArr(players);
        _playOn = true;
        _playerCurrent = 0;
        _updateBoardDisplay();
    }

    const restartBoard = function() {
        _togglePlayer();// switches player starting
        _toggleMkr(players[0]);//switches marker so starting player has "X" marker
        _toggleMkr(players[1]);
        _clearBoardArr();
        _clearArr(_moves);
        _playOn = true;
        _updateBoardDisplay();
    }

    const _clearBoardArr = function() {
    //removes all content in board array
        for (i=0;i<3;i++) {
            for (j=0;j<3;j++) {
                board[i][j] = "";
            }
        }
    }

    const _clearArr = function(array) {
    //removes all content in array 
        while (array.length > 0) {
            array.pop();
        }
    }

    const updateBoardELs = function(action) {
    //creates or removes event listeners to created div square elements per action string input
        switch (action) {
            case "create": {
                gameSquaresAll.forEach(square => {
                    square.addEventListener("click",gamePlay.oneTurn);
                })
                //adds event listener for restart button once game over
                restartGameBtn.removeEventListener("click",gamePlay.restartGame); //might cause error if not already created
                break;
            }
            case "delete": {
                gameSquaresAll.forEach(square => {
                    square.removeEventListener("click",gamePlay.oneTurn);
                })
                //adds event listener for restart button once game over
                restartGameBtn.addEventListener("click",gamePlay.restartGame);
                break;
            }
        }
    }

    const _updateBoardDisplay = () => {
    //updates text content of all square div elements on the board
        gameSquaresAll.forEach(square => {
            let tempIndex = square.id.split("-")[1];
            square.textContent = board[tempIndex[0]][tempIndex[1]];
        })
    }

    const addMarkerToBoard = (e) => {
    //checks if square available, adds marker to board array, updates display elements, toggles to next player
        let selectedIndex = e.srcElement.id.split("-")[1];
        if (board[selectedIndex[0]][selectedIndex[1]].length === 0) {
        //if square is available adds marker to board
            board[selectedIndex[0]][selectedIndex[1]] = players[_playerCurrent].mkr;
            _moves.push(selectedIndex); //stores all moves in array, checked for draw situation
            _updateBoardDisplay(); //updates text content of all divs per board array
            //toggle player was here before removed
            return true; //if marker was added to board
        } else { 
            return false;
        }
    }

    const updateScore = (result) => {
    //updates score board in case players want to continue playing, no functionality to display score yet
        switch (result) {
            case "w":
                players[_playerCurrent].score[0] += 1;//adds win to current player
                if (_playerCurrent === 0) { //adds loss to other player
                    players[1].score[1] += 1;
                } else {
                    players[0].score[1] += 1;
                }
                break;
            case "d":
                //both players get draw
                players[0].score[2] += 1;
                players[1].score[2] += 1;
                break;
        }
    }

    const checkWinner = function() {
        //checks rows and columns
        if (_playOn) {
            for (i=0;i<3;i++) {
                if (board[i][0] === board[i][1]  && board[i][1] === board[i][2] && board[i][2].length != 0) {
                    _playOn = false;
                    return "w";
                } else if (board[0][i] === board[1][i]  && board[1][i] === board[2][i] && board[2][i].length != 0) {
                    _playOn = false;
                    return "w";
                }
            }
        }
        //checks diagonals
        if (_playOn) {
            for (i=0;i<3;i++) {
                if (board[0][0] === board[1][1]  && board[1][1] === board[2][2] && board[2][2].length != 0) {
                    _playOn = false;
                    return "w";
                } else if (board[2][0] === board[1][1]  && board[1][1] === board[0][2] && board[0][2].length != 0) {
                    _playOn = false;
                    return "w";
                }
            }
        }
        //checks for all squares filled 
        if (_playOn) {
            if (_moves.length === 9) {
                _playOn = false;
                return "d";
            }
        }

        if (_playOn) {// if no winners return conditon to continue playing "p"
            _togglePlayer();
            return "p";
        }
    }

    const _togglePlayer = () => {
        if (_playerCurrent === 0) {
            _playerCurrent = 1;
        } else {
            _playerCurrent = 0;
        }
    }
    const _toggleMkr = function(selectedPlayer) {
        if (selectedPlayer.mkr === "X") {
            selectedPlayer.mkr = "O";
        } else {
            selectedPlayer.mkr = "X";
        }
    }

    return {board, players, returnCurrentPlayer, resetBoard, restartBoard, updateBoardELs, addMarkerToBoard, checkWinner, updateScore};
})();


//Player Objects (object factories)
const playerFactory = (name) => {
    name = name;
    score = [0,0,0] //[W,L,D]
    _assignMkr = function() {
        //assigns marker per order players are entered into the array gameBoard.players
        if (gameBoard.players.length === 0) {
            return "X"; //player 1 if no players added yet 
        } else if (gameBoard.players.length === 1) {
            return "O"; //player 2 if player already added
        }
    }
    mkr = _assignMkr(); //might cause issue reassigning value b/c not using let to create??
    return {name, mkr, score}
};


//GAMEPLAY MODULE 
const gamePlay = (() => {
    const startGame = () => {
        //reset variables if carryover from last game 
        gameBoard.resetBoard();
        //assign players
        let player1 = playerFactory(prompt("Player 1, please enter your name.","Joe"));
        gameBoard.players[0] = player1;
        let player2 = playerFactory(prompt("Player 2, please enter your name.","Jim"));
        gameBoard.players[1] = player2;
        //give instructions on next move
        commDisplay.textContent = `Good Luck, ${player1.name} you are X. Please select a square.`
        // Sets gameboard and event listeners for squares
        gameBoard.updateBoardELs("create");
    }
    const oneTurn = (e) => {
        //add marker to board 
        if(gameBoard.addMarkerToBoard(e)) {
        //if square not taken, adds it to board check for winner
            switch (gameBoard.checkWinner()) {
                case "p":
                    commDisplay.textContent = `${gameBoard.players[gameBoard.returnCurrentPlayer()].name} it is your turn. Please select a square.`; 
                    break;
                case "w":
                    commDisplay.textContent = `${gameBoard.players[gameBoard.returnCurrentPlayer()].name} Wins!`;
                    gameBoard.updateScore("w");
                    gameBoard.updateBoardELs("delete");//turns off square ELs and creates restart button EL
                    break;
                case "d":
                    commDisplay.textContent = `Game ends in a draw.`
                    gameBoard.updateScore("d");
                    gameBoard.updateBoardELs("delete"); //turns off square ELs and creates restart button EL
                    break;
            }
        } else {
            commDisplay.textContent = "That square is already taken, please select another.";
        }
    }
    const restartGame = function() {
        //reset variables
        gameBoard.restartBoard(); 
        gameBoard.updateBoardELs("create");

        commDisplay.textContent = `Good Luck, ${gameBoard.players[gameBoard.returnCurrentPlayer()].name} you are X. Please select a square.`;
    }
    return {startGame, oneTurn, restartGame};
})();

//Event Listeners 
const newGameBtn = document.querySelector(".new-game-btn");
const restartGameBtn = document.querySelector(".restart-game-btn");
const commDisplay = document.querySelector(".gameplay-communication");
const gameBoardDiv = document.querySelector(".gameboard");
newGameBtn.addEventListener("click",gamePlay.startGame);


// updated logics of ending game
//added notes for readability of gameplay logic
//added stalemate function and scoring 
//added functionality to play game with same players


