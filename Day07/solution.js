var fs = require("fs");

const crabPositions = fs.readFileSync("./input.txt").toString('utf-8').split(",").map(el => parseInt(el));

var part1 = getFuelCost(getMedian(crabPositions), true);
console.log("Part 1 solution: " + part1);

var part2 = Math.min(getFuelCost(Math.ceil(getAverage(crabPositions)), false),
                    getFuelCost(Math.floor(getAverage(crabPositions)), false));
console.log("Part 2 solution: " + part2);

function getFuelCost(targetPosition, constantCost){
    return crabPositions.reduce((prev, curr) => prev + getMoveCost(Math.abs(curr-targetPosition), constantCost), 0);
}

function getMedian(values){
    values.sort((a,b) => a - b);
    return values[Math.floor(values.length)/2];
}

function getAverage(values){
    if (values.length == 0) return 0;
    var sum = values.reduce ((prev, curr) => prev + curr, 0);
    return sum / values.length;
}

function getMoveCost(distance, constantCost){
    if (constantCost){
        return distance;
    }

    return (distance*distance + distance) / 2;
}
