var fs = require("fs");
const startingAges = fs.readFileSync("./input.txt").toString('utf-8').split(",");

const INITIAL_REPRODUCE_TIME = 9;
const REPRODUCE_TIME = 7;

console.log("Part 1 solution: " + simulateDays(80));
console.log("Part 2 solution: " + simulateDays(256));

function simulateDays(days){
    var fishes = new Array(INITIAL_REPRODUCE_TIME).fill(0);
    startingAges.forEach(age => fishes[age]++);

    for (var i = 0; i < days; i++){
        let newSpawners = fishes.shift();
        fishes.push(newSpawners);
        fishes[REPRODUCE_TIME - 1] += newSpawners;
    }

    return fishes.reduce((acc, a) => acc+ a, 0);
}