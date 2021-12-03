var fs = require("fs");
const file = fs.readFileSync("./input.txt").toString('utf-8');

const depthReadings = file.split("\n").map(x => parseInt(x));

var prev = -1;
var count = -1;

for (var i = 2; i < depthReadings.length; i++){
    var measurement = depthReadings[i] + depthReadings[i - 1] + depthReadings[i - 2];
    if (measurement > prev) {
        count++;
    }
    prev = measurement;
}

console.log("Result: " + count);