var fs = require("fs");
var input = fs.readFileSync("./input.txt").toString('utf-8');

const commands = input.split("\n").map (x => x.split(' '));


var vertical = 0;
var horizontal = 0;

commands.forEach(command => {
    var change = parseInt(command[1]);
    switch(command[0]){
        case "forward":
            horizontal += change;
            break;
        case "down":
            vertical += change;
            break;
        case "up":
            vertical -= change;
            break;
    }
});

console.log("Vert: " + vertical + " Hor: " + horizontal);
console.log("Result: " + vertical * horizontal);