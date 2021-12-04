var fs = require("fs");
var input = fs.readFileSync("./input.txt").toString('utf-8').split("\n");

const GRID_SIZE = 5;

var drawnNumbers = input[0].split(",")
var numOrder = [];
drawnNumbers.forEach((num, i) => {
    numOrder[num] = i;
});


var minBoard = [];
var minDrawTime = Number.MAX_SAFE_INTEGER;

for (var i = 2; i < input.length; i+= GRID_SIZE + 1){
    var currentBoard = readBoard(i);
    var drawTime = calculateBoardDrawTime(currentBoard);
    
    if (drawTime < minDrawTime){
        minDrawTime = drawTime;
        minBoard = currentBoard;
    }
}

console.log ("Last drawn number: " + drawnNumbers[minDrawTime]);
console.log("Winning board: " + minBoard);

var result = calculateResult(minBoard, minDrawTime);
console.log("Result: " + result);

/****
 * FUNCTIONS
 */

function readBoard(startIndex){
    var currentBoard = [];
    for (var i = 0; i < GRID_SIZE; i++){
        currentBoard[i] = input[startIndex + i].trim().split(/\s+/).map(el => parseInt(el));
    }

    return currentBoard;
}

function calculateBoardDrawTime(board){
    var boardDrawTimes = board.map( row => row.map( column => column = numOrder[column]));

    var minBoardDrawTime = Number.MAX_SAFE_INTEGER;

    const checkMax = arr => {
        var max = Math.max(...arr);
        if (max < minBoardDrawTime){
            minBoardDrawTime = max;
        }
    };

    //check rows
    boardDrawTimes.forEach(row => {
        checkMax(row);
    });

    //check columns
    for (var i = 0; i < GRID_SIZE; i++){
        checkMax(boardDrawTimes.map(row => row[i]));
    }
    
    return minBoardDrawTime;
}

function calculateResult(board, drawTime){   
    var unmarkedSum = [].concat(...board).reduce((prev, curr) => numOrder[curr] > drawTime ? prev + curr : prev, 0);
    var lastDrawnNum = parseInt(drawnNumbers[minDrawTime]);

    return unmarkedSum * lastDrawnNum;
}