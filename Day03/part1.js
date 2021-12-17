var fs = require("fs");
var input = fs.readFileSync("./input.txt").toString('utf-8');

const report = input.split("\n");

var gammaRate = ""; //Find most common bit for each position
var epsilonRate = ""; //Find least common bit for each position (just invert the gamma rate)

var counter = new Array(report[0].length).fill(0); 

report.forEach(line => {
    line.split("").forEach((bit, i) => {
        counter[i] += parseInt(bit);
    });
});

counter.forEach(line => {
    gammaRate += (line > report.length/2) ? "1" : "0";
    epsilonRate += (line > report.length/2) ? "0" : "1";
});

var powerConsumption = parseInt(gammaRate, 2) * parseInt(epsilonRate, 2);
console.log("(Part 1 solution) Power consumption: " + powerConsumption);

