var fs = require("fs");
var _ = require("lodash");
const { Graph, astar } = require("./astar");

const input = fs.readFileSync("./input.txt").toString('utf-8').split("\n").map(line => line.split('').map(x => parseInt(x)));

console.log("Part 1: " + getLowestRisk(input));
console.log("Part 2: " + getLowestRisk(increaseMap(input, 5)));

function getLowestRisk(inputArray){
    let graph = new Graph(inputArray);
    let start = graph.grid[0][0];
    let end = graph.grid[inputArray.length - 1][inputArray[0].length - 1];
    let shortestPath = astar.search(graph, start, end);

    return shortestPath.reduce((prev, curr) => prev + curr.weight, 0);                          
}

function increaseMap(initial, increaseFactor){
    let largeMap = [];
    const increaseTileRisk = (risk, increase) => {
        let newRisk = risk + increase;
        return newRisk > 9 ? newRisk - 9 : newRisk;
    };

    initial.forEach((line) => {
        let newLine = [];
        for (let i = 0; i < increaseFactor; i++){
            newLine.push(...line.map(x => increaseTileRisk(x, i)));
        }
        largeMap.push(newLine);
    
    });
    
    for (let i = 1; i < increaseFactor; i++){
        for (let j = 0; j < initial.length; j++){
            let newLine = largeMap[j].map(x => increaseTileRisk(x, i));
            largeMap.push(newLine);
        }
    }

    return largeMap;
}