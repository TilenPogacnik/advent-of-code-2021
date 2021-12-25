const fs = require("fs");
const _ = require("lodash");
const Jimp = require("jimp");


const input = fs.readFileSync("./input.txt").toString("utf-8").split('\n');

const REGION_TYPE = {
    EMPTY: 0,
    EAST: 1,
    SOUTH: 2,
}

let grid = parseInput(input);
saveGridImage(0, _.cloneDeep(grid));

let stepCount = simulateSteps();
console.log("Sea cucumbers stop moving on step " + stepCount);

function simulateSteps() {
    let stepCount = 0;
    let madeAMove = false;

    do {
        stepCount++;
        madeAMove = step();
        saveGridImage(stepCount, _.cloneDeep(grid));
    } while (madeAMove);

    return stepCount;
}

function step(){
    const canMove = (row, column, type) => {
        if (grid[row][column] != type) return false;

        let target = type == REGION_TYPE.EAST ? nextColumn(column) : nextRow(row);
        if (type == REGION_TYPE.EAST && grid[row][target] == REGION_TYPE.EMPTY) return true;
        if (type == REGION_TYPE.SOUTH && grid[target][column] == REGION_TYPE.EMPTY) return true;
        return false;
    } 

    const moveCucumbers = (type, constPos) => { //constPos => row for east, column for south 
        let isEast = type == REGION_TYPE.EAST;
        let movingCucumbers = [];
        for (let i = 0; i < (isEast ? grid[0] : grid).length; i++){
            if (canMove(isEast ? constPos : i, isEast ? i : constPos, type)) movingCucumbers.push(i);
        }

        movingCucumbers.forEach(mc => {
            moveCucumber(isEast ? constPos : mc, isEast ? mc : constPos, type);
            madeAMove = true;
        });

        return movingCucumbers.length > 0;
    }

    let madeAMove = false;
    //Move east-facing herd
    for (let r = 0; r < grid.length; r++){ //row
        madeAMove = moveCucumbers(REGION_TYPE.EAST, r) || madeAMove;
    }

    //move south-facing herd
    for (let c = 0; c < grid[0].length; c++){ //column
        madeAMove = moveCucumbers(REGION_TYPE.SOUTH, c) || madeAMove;
    }

    return madeAMove;
}

function moveCucumber(row, column, moveType){
    let targetCol = moveType == REGION_TYPE.EAST ? nextColumn(column) : column;
    let targetRow = moveType == REGION_TYPE.SOUTH ? nextRow(row) : row;

    grid[row][column] = REGION_TYPE.EMPTY;
    grid[targetRow][targetCol] = moveType;
}

function nextColumn (column) { return (column + 1) % grid[0].length; }
function nextRow (row) { return (row + 1) % grid.length; }

function parseInput(input){
    let grid = [];
    input.forEach(line => {
        grid.push(line.split('').map(loc => {
            if (loc == ">") return 1;
            if (loc == "v") return 2;
            return 0;
        }));
    });

    return grid;
}

function printGrid(i){
    console.log("After step " + i);
    _.cloneDeep(grid).forEach(line => console.log(line.join('').replace(/0/g, ".").replace(/1/g, ">").replace(/2/g, "v")));
    console.log("--------------------------------------------------");
}

function saveGridImage(step, gridCopy){
    let eastColor = 0x989052FF;
    let southColor = 0x4a6f67FF;
    let emptyColor = 0x003f62FF;

    new Jimp(grid[0].length, grid.length, function (err, image) {
        if (err) throw err;
      
        gridCopy.forEach((row, y) => {
          row.forEach((cucumber, x) => {
            let color = cucumber == REGION_TYPE.EAST ? eastColor : cucumber == REGION_TYPE.SOUTH ? southColor : emptyColor;
            image.setPixelColor(color, x, y);
          });
        });
      
        image.write('./StepImages/' + step + '.png', (err) => {
          if (err) throw err;
        });
      });
}