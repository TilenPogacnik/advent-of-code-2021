const fs = require("fs");

class Cuboid{
    constructor(xRange, yRange, zRange, on = true){
        this.xMin = xRange[0];
        this.xMax = xRange[1];
        this.yMin = yRange[0];
        this.yMax = yRange[1];
        this.zMin = zRange[0];
        this.zMax = zRange[1];
        this.zRange = zRange;
        this.on = on;
    }

    volume(){
        return ((1 + this.xMax - this.xMin) * (1 + this.yMax - this.yMin) * (1 + this.zMax - this.zMin));
    }

    isOverlapping(otherCuboid){
        return otherCuboid.xMin <= this.xMax && this.xMin <=  otherCuboid.xMax
            && otherCuboid.yMin <= this.yMax && this.yMin <=  otherCuboid.yMax
            && otherCuboid.zMin <= this.zMax && this.zMin <=  otherCuboid.zMax;
    }

    split(cuttingCuboid){
        let splitCuboids = [];
        if (cuttingCuboid.xMin > this.xMin){
            splitCuboids.push(new Cuboid([this.xMin, cuttingCuboid.xMin - 1], [this.yMin, this.yMax], [this.zMin, this.zMax]))
        }
        if (cuttingCuboid.xMax < this.xMax){
            splitCuboids.push(new Cuboid([cuttingCuboid.xMax + 1, this.xMax], [this.yMin, this.yMax], [this.zMin, this.zMax]))
        }

        let middleXRange = [Math.max(this.xMin, cuttingCuboid.xMin), Math.min(this.xMax, cuttingCuboid.xMax)];
        if (cuttingCuboid.yMin > this.yMin){
            splitCuboids.push(new Cuboid(middleXRange, [this.yMin, cuttingCuboid.yMin - 1], [this.zMin, this.zMax]));
        }
        if (cuttingCuboid.yMax < this.yMax){
            splitCuboids.push(new Cuboid(middleXRange, [cuttingCuboid.yMax + 1, this.yMax], [this.zMin, this.zMax]));
        }

        let middleYRange = [Math.max(this.yMin, cuttingCuboid.yMin), Math.min(this.yMax, cuttingCuboid.yMax)];
        if (cuttingCuboid.zMin > this.zMin){
            splitCuboids.push(new Cuboid(middleXRange, middleYRange, [this.zMin, cuttingCuboid.zMin - 1]));
        }
        if (cuttingCuboid.zMax < this.zMax){
            splitCuboids.push(new Cuboid(middleXRange, middleYRange, [cuttingCuboid.zMax + 1, this.zMax]));
        }

        return splitCuboids;
    }
}

const input = fs.readFileSync("./input.txt").toString("utf-8").split('\n');
const steps = parseInput(input);

const litCuboidsSmall = executeSteps(steps.filter(step => {
    return ![step.xMax, step.xMin, step.yMax, step.yMin, step.zMax, step.zMin].some(el => Math.abs(el) > 50)
}));
console.log("(Part 1) Lit count: " + getVolume(litCuboidsSmall));

const litCuboids = executeSteps(steps);
console.log("(Part 2) Lit count: " + getVolume(litCuboids));

function executeSteps(steps){
    let lit = [];

    steps.forEach(step => {
        newLitCuboids = [];
        lit.forEach(cuboid => {
            if (cuboid.isOverlapping(step)){
                let cutCuboids = cuboid.split(step);
                newLitCuboids.push(...cutCuboids);
            } else {
                newLitCuboids.push(cuboid);
            }
        });
        if (step.on) {
            newLitCuboids.push(step);
        }
        lit = newLitCuboids;
    });

    return lit;
}

function getVolume(cuboids){
    return cuboids.reduce((sum, curr) => sum + curr.volume(), 0);
}

function parseInput(input){
    let cuboids = [];
    input.forEach(line => {
        let on = line.split(" ")[0] == "on";
        let axisRanges = [];
        line.split(" ")[1].split(",").forEach(axis => {
            let range = axis.split("=")[1].split("..").map(x => parseInt(x));
            axisRanges.push(range);
        });

        cuboids.push(new Cuboid(...axisRanges, on));
    });
    return cuboids;
}