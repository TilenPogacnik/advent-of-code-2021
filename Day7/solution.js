var fs = require("fs");

const crabPositions = fs.readFileSync("./input.txt").toString('utf-8').split(",");

console.log("Part 1 solution: " + getFuelCost(getMedian(crabPositions)));

function getFuelCost(targetPosition){
    return crabPositions.reduce((prev, curr) => prev + Math.abs(curr-targetPosition), 0);
}

function getMedian(values){
    values.sort((a,b) => a - b);
    return values[Math.floor(values.length)/2];
}
