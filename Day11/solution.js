var fs = require("fs");
var _ = require("lodash");

const octopusInput = fs.readFileSync("./input.txt").toString('utf-8').split("\n").map(_ => _.split("").map(_ => parseInt(_)));
const MAX_ENERGY = 10;

console.log("Part 1 solution: " + simulateOctopuses(100, _.cloneDeep(octopusInput), false));
console.log("Part 2 solution: " + simulateOctopuses(0, _.cloneDeep(octopusInput), true));

function simulateOctopuses(steps, octopuses, isSimulSearch){
    const simulateStep = () => {
        let flashCount = 0;
        hasFlashed = [];

        for (let i = 0; i < octopuses.length; i++){
            for (let j = 0; j < octopuses.length; j++){
                flashCount += gainEnergy(i, j);
            }
        }
        return flashCount;
    };

    const gainEnergy = (i, j) => {
        if (i < 0 || i >= octopuses.length || j < 0 || j >= octopuses[i].length || hasFlashed.includes([i,j].join(''))){
            return 0;
        }
    
        octopuses[i][j]++;
        if (octopuses[i][j] >= MAX_ENERGY){
            return flash(i, j);
        }
    
        return 0;
    }

    const flash = (i, j) => {
        octopuses[i][j] = 0;
        hasFlashed.push([i,j].join(''));
     
        return 1 + gainEnergy(i + 1, j)  
             + gainEnergy(i - 1, j)
             + gainEnergy(i, j + 1)
             + gainEnergy(i, j - 1)
             + gainEnergy(i + 1, j + 1)
             + gainEnergy(i + 1, j - 1)
             + gainEnergy(i - 1, j + 1)
             + gainEnergy(i - 1, j - 1);
    }
    
    
    let octopusesCount = octopuses.reduce((count, row) => count + row.length, 0);
    let flashCount = 0;
    let hasFlashed = [];
    
    if (isSimulSearch){
        steps = Number.MAX_SAFE_INTEGER;
    }

    for (let i = 0; i < steps; i++){
        let newFlashes = simulateStep();

        if (isSimulSearch && newFlashes >= octopusesCount){
            return i + 1;
        }

        flashCount += newFlashes;
    }

    return flashCount;
}