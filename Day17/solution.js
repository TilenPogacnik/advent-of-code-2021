/*
Not proud of this code, but it works for this specific input ¯\_(ツ)_/¯
*/

var fs = require("fs");

const targetArea = { //Because who has time to parse input files?
    x: [235, 259],
    y: [-118, -62]
}

let maxValidYPos = 0;
let validLaunches = [];

for (let x = 1; x <= targetArea.x[1]; x++){
   for (let y = targetArea.y[0]; y < -targetArea.y[0]; y++){
            if (isValidLaunch(x, y)){
            validLaunches.push([x, y]);
        }
   }
}

console.log("Part 1: " + maxValidYPos);
console.log("Part 2: " + validLaunches.length);

function isValidLaunch(xVel, yVel){
    let pos = {x: 0, y: 0};
    let vel = {x: xVel, y: yVel};

    let maxY = pos.y;

    while (pos.y >= targetArea.y[0]){
        pos.x += vel.x;
        pos.y += vel.y;

        if (pos.y > maxY) maxY = pos.y;

        if (vel.x > 0) vel.x--;
        vel.y--;

        if (pos.x >= targetArea.x[0] && pos.x <= targetArea.x[1]
         && pos.y >= targetArea.y[0] && pos.y <= targetArea.y[1]){
            if (maxY > maxValidYPos) maxValidYPos = maxY;
            return true;
        }
    }

    return false;
}