var fs = require("fs");
var input = fs.readFileSync("./input.txt").toString('utf-8').split("\n");

var prev = -1;
var count = 0;
input.forEach(measurement => {
    if (measurement > prev){
        count ++;
    }
    prev = measurement;
});

console.log("Result: " + count);