var fs = require("fs");
var input = fs.readFileSync("./input.txt").toString('utf-8').split("\n");

const GRID_SIZE = 5;

var drawnNumbers = input[0].split(",")
var numOrder = [];
drawnNumbers.forEach((num, i) => {
    numOrder[num] = i;
});


var minBoard = [];
var maxBoard = [];
var minDrawTime = Number.MAX_SAFE_INTEGER;
var maxDrawTime = Number.MIN_SAFE_INTEGER;

for (var i = 2; i < input.length; i+= GRID_SIZE + 1){
    var currentBoard = readBoard(i);
    var drawTime = calculateBoardDrawTime(currentBoard);
    
    if (drawTime < minDrawTime){
        minDrawTime = drawTime;
        minBoard = currentBoard;
    }

    if (drawTime > maxDrawTime){
        maxDrawTime = drawTime;
        maxBoard = currentBoard;
    }
}

var minResult = calculateResult(minBoard, minDrawTime);
var maxResult = calculateResult(maxBoard, maxDrawTime);

console.log("PART 1");
console.log ("Last drawn number: " + drawnNumbers[minDrawTime]);
console.log("First completed board: " + minBoard);
console.log("Result: " + minResult);
console.log("------------");
console.log("PART 2");
console.log ("Last drawn number: " + drawnNumbers[maxDrawTime]);
console.log("Last completed board: " + maxBoard);
console.log("Result: " + maxResult);

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

    var boardDrawTime = Number.MAX_SAFE_INTEGER;

    const checkMax = arr => {
        var max = Math.max(...arr);
        if (max < boardDrawTime){
            boardDrawTime = max;
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
    
    return boardDrawTime;
}

function calculateResult(board, drawTime){   
    var unmarkedSum = [].concat(...board).reduce((prev, curr) => numOrder[curr] > drawTime ? prev + curr : prev, 0);
    var lastDrawnNum = parseInt(drawnNumbers[drawTime]);

    return unmarkedSum * lastDrawnNum;
}