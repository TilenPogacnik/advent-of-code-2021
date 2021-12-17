var fs = require("fs");

//One liner just for fun. 
var solution = [].concat(...fs.readFileSync("./input.txt").toString('utf-8').split("\n").map(line => line.split("|")[1].trim().split(" "))).filter(val => [2, 3, 4, 7].includes(val.length)).length;

console.log("Part 1 solution: "  + solution);