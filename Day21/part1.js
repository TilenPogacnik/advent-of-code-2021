const fs = require("fs");
const _= require("lodash");

class Die {
    constructor(){
        this.rollCount = 0;
    }

    roll(){
        this.rollCount++;
        return 1 + (this.rollCount - 1) % 100;
    }
}

class Player {
    constructor(playerNum, startPosition){
        this.playerNum = playerNum;
        this.position = startPosition;
        this.score = 0;
    }

    makeTurn(die){
        let moveCount = 0;
        for (let i = 0; i < 3; i++){
            moveCount += die.roll();
        }

        this.position = 1 + (this.position + moveCount - 1) % 10;
        this.score += this.position;

        console.log("Player " + (this.playerNum + 1) + " moves to space " + this.position + " for a total score of " + this.score);
    }
}

const WIN_SCORE = 1000;

const input = fs.readFileSync("./input.txt").toString("utf-8").split('\n');
const die = new Die();
const players = createPlayers(input);

let currentPlayer = 0;
while (!isGameEnded(players)){
    players[currentPlayer].makeTurn(die);
    currentPlayer = (currentPlayer + 1) % 2;
}

let part1Result = players.filter(p => p.score < WIN_SCORE)[0].score * die.rollCount;

console.log("-------------------------------------------------------------------");
console.log("Part 1 result: " + part1Result);

function isGameEnded(players){
    return players.some(p => p.score >= WIN_SCORE);
}

function createPlayers(input){
    let players = [];
    input.forEach((line, i) => {
        players.push(new Player(i, parseInt(line[line.length - 1])));
    });

    return players;
}