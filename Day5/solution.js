var fs = require("fs");
var input = fs.readFileSync("./input.txt").toString('utf-8').split("\n");

console.log("Part 1 solution: " + getOverlapCount(false, input));
console.log("Part 2 solution: " + getOverlapCount(true, input))

function getOverlapCount(allowDiagonals, lineInput){
    var pointMap = [];

    lineInput.forEach(rawLine => {
        var line = parseLine(rawLine);
        if (!allowDiagonals && isDiagonal(line)){
            return;
        }
    
        generateLinePoints(line).forEach(point => {
            if (pointMap[point]){
                pointMap[point]++;
            } else {
                pointMap[point] = 1;
            }
        });
    });
    
    //Count overlaps
    var overlapCount = 0;
    for (var pointCount in pointMap){
        if (pointMap[pointCount] > 1){
            overlapCount++;
        }
    }

    return overlapCount;
}


function parseLine(rawLine){
   return rawLine.split(" -> ").map(el => el.split(",").map(num => parseInt(num)));
}

function isDiagonal(line) {
    //check if start and end coordinates are the same on x or y axis
    return !(line [0][0] == line [1][0] || line [0][1] == line [1][1]);
}

function generateLinePoints(line){
    var points = [];

    var linePath = [norm(line[1][0] - line[0][0]),
                    norm(line[1][1] - line[0][1])];
    
    var currPoint = [...line[0]];
    points.push([...currPoint]);
    while (!compareArrays(currPoint, line[1])) {
        currPoint[0] += linePath[0];
        currPoint[1] += linePath[1];
        points.push([...currPoint]);
    }

    return points;
}

function norm(num){
    if (num > 0){
        return 1;
    } else if (num < 0){
        return -1;
    }
    return 0;
}

function compareArrays(array1, array2){
    return array1.length === array2.length && array1.every((value, index) => value === array2[index]);
}