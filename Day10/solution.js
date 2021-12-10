var fs = require("fs");
const input = fs.readFileSync("./input.txt").toString('utf-8').split("\n");

const CHAR_ERROR_SCORES = {
    ")" : 3,
    "]" : 57,
    "}" : 1197,
    ">" : 25137,
}

let errorScore = 0;

input.forEach((line, i) => {
    analyzeLine(line, i);
});
console.log("Total syntax error score: " + errorScore + " (Part 1 solution)");


function analyzeLine(line, i){
    var chunkStack = [];
    for (let c of line.split('')){
        if (isOpeningChar(c))
            chunkStack.push(c);
        else {
            var expectedChar = getClosingChar(chunkStack.pop());
            if (c != expectedChar){
                handleIllegalCharacter(c);
                console.log("Error on line " + i + ": Expected " + expectedChar + ", but found " + c + " instead.");
                break;
            }
        }
    }
}

function handleIllegalCharacter(c){
    errorScore += CHAR_SCORES[c];
}

function isOpeningChar(c){
    return "([{<".includes(c);
}

function getClosingChar(c){
    switch(c){
        case "(":
            return ")";
        case "[":
            return "]";
        case "{":
            return "}";
        case "<": 
            return ">";
    }
}