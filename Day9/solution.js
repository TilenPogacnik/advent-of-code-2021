var fs = require("fs");
const MAX_HEIGHT = 9;
const input = fs.readFileSync("./input.txt").toString('utf-8');
const heightmap = input.split("\n").map(_ => _.split("").map(_ => parseInt(_)));
const lowPoints = findLowPoints(heightmap);

var riskLevelSum = lowPoints.reduce((prev, curr) => {return prev + 1 + heightmap[curr[0]][curr[1]]}, 0);
console.log("Part 1 solution: " + riskLevelSum);

var basinMap = heightmap.slice();
const basinSizes = lowPoints.map(lp => getBasinSize(lp));
var largestBasinsMultiplied = basinSizes.sort((a,b) => {return b - a}).slice(0, 3).reduce((prev, curr) => prev * curr, 1);
console.log("Part 2 solution: " + largestBasinsMultiplied);

function findLowPoints(heightmap){
    var lowPoints = [];

    heightmap.forEach((col, y) => {
        col.forEach((_, x) => {
            if (isLowPoint(x, y)) lowPoints.push([y,x]);
        });
    });

    return lowPoints;
}

function isLowPoint(x, y){
    var height = heightmap[y][x];

    return (y == 0 || heightmap[y - 1][x] > height)
    && (y == heightmap.length - 1 || heightmap[y + 1][x] > height)
    && (x == 0 || heightmap[y][x - 1] > height)
    && (x == heightmap[y].length - 1 || heightmap[y][x + 1] > height)
}

function getBasinSize(point){
    const isInsideBasin = point => {
        return point[0] >= 0 
            && point[0] < basinMap.length 
            && point[1] >= 0 
            && point[1] < basinMap[point[0]].length
            && basinMap[point[0]][point[1]] < MAX_HEIGHT 
            && basinMap[point[0]][point[1]] >= 0;
    };

    if (!isInsideBasin(point)){
        return 0;
    }

    basinMap[point[0]][point[1]] = -1;

    return 1 
        + getBasinSize([point[0] + 1, point[1]])
        + getBasinSize([point[0] - 1, point[1]])
        + getBasinSize([point[0], point[1] + 1])
        + getBasinSize([point[0], point[1] - 1]);
}