var fs = require("fs");
const input = fs.readFileSync("./input.txt").toString('utf-8');

const heightmap = input.split("\n").map(_ => _.split("").map(_ => parseInt(_)));
const lowPoints = findLowPoints(heightmap);

var riskLevelSum = lowPoints.reduce((prev, curr) => {return prev + 1 + heightmap[curr[0]][curr[1]]}, 0);
console.log("Part 1 solution: " + riskLevelSum);

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