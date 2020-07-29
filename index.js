let body = document.querySelector('body')
let form = document.querySelector('#player-form')
let submit = document.querySelector('#submit');
let symbols = document.getElementsByName("symbol-radio");
let playerTypes = document.getElementsByName("playerType");
let textInputs1 = document.querySelector('#firstName');
let textInputs2 = document.querySelector('#secondName');




submit.addEventListener("mousedown", () => {
    let playerName;
    let playerTwoName;
    let playerSymbol;
    let playerTwoSymbol;
    let playerTwoType;
    playerName = textInputs1.value;
    playerTwoName = textInputs2.value;
    symbols.forEach((symbol) => {
        if(symbol.checked) {
            playerSymbol = symbol.id;
        } else {
            playerTwoSymbol = symbol.id
        }
    })
    playerTypes.forEach((playerType) => {
        if(playerType.checked) {
            playerTwoType = playerType.id;
            console.log(playerType.id)
            return 0;
        }
    })

    body.removeChild(form)



    startGame(playerName, playerTwoName, playerSymbol, playerTwoSymbol, playerTwoType)

})

//starts a game of tic-tac-toe
let startGame = function(playerName, playerTwoName, playerSymbol, playerTwoSymbol, playerTwoType) {
    let gameBoard = (function() {
        let board = new Array(3);
        for(let i = 0; i < board.length; i++) {
            board[i] = new Array(3);
        }
        return {board};
    })();

    let squareSelection = function() {
        console.log(playerTwoType.id)
        let none = true;
        let i = Math.floor(Math.random() * 3);
        let j = Math.floor(Math.random() * 3);
        let squareList = document.querySelectorAll(".gridDiv");
        squareList.forEach(square => {
            let temp = square.getAttribute('class');
            if(parseInt(temp.substring(0, 1)) == i) {
                console.log(i)
                if(parseInt(temp.substring(1, 2)) == j) {
                    console.log(j)
                    if(gameBoard.board[i][j] == null) {
                        square.click()
                        none = false;
                    }

                }
            }
        })
        if(none) {
            squareSelection()
        }
    }
    
    let displayController = (function() {
        let playerTurn = true;
        let switchTurn = () => {
            if(displayController.playerTurn) {
                displayController.playerTurn = false;
                moveTracker.textContent = `${playerTwoName}'s move`;
                if(playerTwoType == 'ai') {
                    setTimeout(squareSelection, 1000);
                }
                
            } else {
                displayController.playerTurn = true;
                moveTracker.textContent = `${playerName}'s move`
            }
        }
        return {playerTurn, switchTurn};
    })();
    
    function Player(name, symbol) {
        let points = 0;
        let increasePoints = () => {
            points++;
            return points;
        }
        return {name, symbol, points, increasePoints};
    }

    let player = Player(playerName, playerSymbol);
    let player2 = Player(playerTwoName, playerTwoSymbol);

    let grid = document.querySelector("#grid")
    grid.style.height = "90%"
    let results = document.createElement('h2'); 
    grid.appendChild(results)

    let newGame = document.createElement('button');
    newGame.textContent = "New Game";
    newGame.setAttribute('id', 'newGame')
    newGame.addEventListener('mousedown', () => {
        location.reload();
    })

    let moveTracker = document.querySelector('#moveThing')
    moveTracker.textContent = `${playerName}'s move`
    let divCont = document.querySelector("#container");

 
    
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            let temp = document.createElement('div');
            temp.classList.add("" + i + j);
            temp.classList.toggle('gridDiv')
            temp.addEventListener('click', () => {
                let classList = temp.getAttribute('class');
                let row = parseInt(classList.substring(0, 1));
                let col = parseInt(classList.substring(1, 2));
                console.log(classList)
                if(gameBoard.board[row][col] == null) {
                    if(displayController.playerTurn) {
                        gameBoard.board[row][col] = player.symbol;
                        render();
                        displayController.switchTurn();
                    } else {
                        gameBoard.board[row][col] = player2.symbol;
                        moveTracker.textContent = `${playerTwoName}'s move`
                        render();
                        displayController.switchTurn();
                    }
                    if(checkForWin(player.symbol)) {
                        results.textContent = `${playerName} wins!`
                        grid.appendChild(newGame);
                        moveTracker.textContent = '';
                    } else if(checkForWin(player2.symbol)) {
                        results.textContent = `${playerTwoName} wins!`
                        grid.appendChild(newGame);
                        moveTracker.textContent = '';
                    } else if(checkForTie()) {
                        results.textContent = `It's a Draw!`
                        grid.appendChild(newGame);
                        moveTracker.textContent = '';
                    }
                }
                
            })
            divCont.appendChild(temp)
        }

    }


    function checkForWin(symbol) {
        let dcount = 0;
        let dtrack = 0;
        let revDCount = 0;
        let revDTrack = 2;
        for(let i = 0; i < 3; i++) {
            let hcount = 0;
            let vcount = 0;
            if(gameBoard.board[i][dtrack] == symbol) {
                dcount++;
            }
            if(gameBoard.board[i][revDTrack] == symbol) {
                revDCount++;
            }
            for(let j = 0; j < 3; j++) {
                let x = gameBoard.board[i][j];
                let y = gameBoard.board[j][i];
                if(x == symbol) {
                    hcount++;
                }
                if(y == symbol) {
                    vcount++;
                } 
                if(hcount == 3 || vcount == 3) {
                    console.log(' h / v wins')
                    return true;
                }
            }
            if(dcount == 3 || revDCount == 3) {
                console.log(' d wins')
                return true;
            }
            dtrack++;
            revDTrack--;
        }

        return false;
    };

    function checkForTie() {
        for(let i = 0; i < gameBoard.board.length; i++) {
            for(let j = 0; j < gameBoard.board.length; j++) {
                if(gameBoard.board[i][j] == null) {
                    return false;
                }
            }
        }
        return true;
    }
    
    
    let render = function() {
        let allDivs = document.querySelectorAll('.gridDiv');
        let count = 0;
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                let temp = allDivs[count];
                if(gameBoard.board[i][j] == 'x' || gameBoard.board[i][j] == "o") {
                    temp.textContent = gameBoard.board[i][j];
                }
                count++;
            }
        }
        console.log(gameBoard.board)
    }
    
    render();
};



