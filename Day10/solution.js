var fs = require("fs");
const input = fs.readFileSync("./input.txt").toString('utf-8').split("\n");

const CHUNKS = [
    new Chunk("(", ")", 3, 1),
    new Chunk("[", "]", 57, 2),
    new Chunk("{", "}", 1197, 3),
    new Chunk("<", ">", 25137, 4),
];

var errorScore = 0;
var incompleteScores = [];

input.forEach((line, i) => {
    analyzeLine(line, i);
});

console.log("---------------------------------------------------");
console.log("Total syntax error score: " + errorScore + " (Part 1 solution)");
console.log("Middle incomplete score: " + getMedian(incompleteScores) + " (Part 2 solution)");

function analyzeLine(line, i){
    let chunkStack = [];
    for (let c of line.split('')){
        if (isOpeningChar(c)){
            chunkStack.push(c);
        } else {
            let expectedChar = getClosingChar(chunkStack.pop());
            if (c != expectedChar){
                handleIllegalCharacter(c);
                console.log("Error on line " + i + ": Expected " + expectedChar + ", but found " + c + " instead.");
                return;
            }
        }
    }

    handleIncompleteLine(chunkStack);
}

function handleIllegalCharacter(c){
    errorScore += CHUNKS.find(chunk => chunk.closingChar == c).errorScore;
}

function handleIncompleteLine(chunkStack){
    let incompleteScore = 0;
    while (chunkStack.length > 0){
        let c = chunkStack.pop();
        incompleteScore = 5 * incompleteScore + CHUNKS.find(chunk => chunk.openingChar == c).incompleteScore;
    }

    incompleteScores.push(incompleteScore);
}

function isOpeningChar(c){
    return CHUNKS.some(chunk => chunk.openingChar == c);
}

function getClosingChar(c){
    return CHUNKS.find(chunk => chunk.openingChar == c).closingChar;
}

function Chunk(openingChar, closingChar, errorScore, incompleteScore){ 
    this.openingChar = openingChar;
    this.closingChar = closingChar;
    this.errorScore = errorScore;
    this.incompleteScore = incompleteScore;
}

function getMedian(values){
    values.sort((a,b) => a - b);
    return values[Math.floor(values.length/2)];
}