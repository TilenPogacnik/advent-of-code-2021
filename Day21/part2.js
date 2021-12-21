const fs = require("fs");
const _= require("lodash");

class GameState {
    constructor(p0Pos, p0Score, p1Pos, p1Score, p0Turn) {
        this.p0Pos = p0Pos;
        this.p0Score = p0Score;
        this.p1Pos = p1Pos;
        this.p1Score = p1Score;
        this.p0Turn = p0Turn;
    }

    getArray(){
        return [this.p0Pos, this.p0Score, this.p1Pos, this.p1Score, this.p0Turn];
    }
}

const WIN_SCORE = 21;
const playerPositions = [];
const cache = [];

const input = fs.readFileSync("./input.txt").toString("utf-8").split('\n');
input.forEach(line => {
    playerPositions.push(parseInt(line[line.length-1]));
});

const winStats = countWins(new GameState(playerPositions[0], 0, playerPositions[1], 0, true));
console.log("Part 2 solution: " + Math.max(...winStats));

function countWins(gameState){
    if (cache[gameState.getArray()]){
        return cache[gameState.getArray()];
    }

    let winCount = [0, 0];
    do {
        if (gameState.p0Score >= WIN_SCORE){
            winCount = [1,0];
            break;
        }
        if (gameState.p1Score >= WIN_SCORE){
            winCount = [0,1];
            break;
        }

        for (let i = 1; i < 4; i++){
            for (let j = 1; j < 4; j++){
                for (let k = 1; k < 4; k++){
                    let moveCount = i + j + k;
                    let newStateWinCount = [0, 0];
                    let newGameState;
                    if (gameState.p0Turn){
                        let newPosition = getNewPosition(gameState.p0Pos, moveCount);
                        newGameState = new GameState(newPosition, gameState.p0Score + newPosition, gameState.p1Pos, gameState.p1Score, !gameState.p0Turn);
                    } else {
                        let newPosition = getNewPosition(gameState.p1Pos, moveCount);
                        newGameState = new GameState(gameState.p0Pos, gameState.p0Score, newPosition, gameState.p1Score + newPosition, !gameState.p0Turn);
                    }
                    newStateWinCount = countWins(newGameState);
                    winCount[0] += newStateWinCount[0];
                    winCount[1] += newStateWinCount[1];
                }
            }
        }
    } while (false);

    cache[gameState.getArray()] = winCount;
    return winCount;
}

function getNewPosition(oldPosition, moveCount){
    return 1 + (oldPosition + moveCount - 1) % 10;
}
