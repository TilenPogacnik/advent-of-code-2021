var fs = require("fs");
var _ = require("lodash");

const input = fs.readFileSync("./input.txt").toString('utf-8').split("\n\n");

const dots = input[0].split("\n").map(line => line.split(",").map(x => parseInt(x)));
const folds = input[1].split("\n").map(line => [line[11] == 'y', parseInt(line.slice(line.indexOf('=')+1))] );

let foldedDots = foldDots(_.cloneDeep(dots), folds);
console.log("--------------");
generateImage(foldedDots);

function foldDots(dots, folds){
    folds.forEach((fold, i) => {
        foldOnce(dots, fold);
        console.log("Dot count after fold " + (i + 1) + ": " + _.uniqWith(dots, _.isEqual).length);
    });

    return dots;
}

function foldOnce(dots, fold){
    dots.map(dot => {
        if (fold[0]){ //y fold 
            if (dot[1] > fold[1]){
                dot[1] = 2 * fold[1] - dot[1];
            }
        } else { //x fold
            if (dot[0] > fold[1]){
                dot[0] = 2 * fold[1] - dot[0];
            }
        }
    });
}

function generateImage(dots){
    let maxWidth = _.max(dots.map(dot => dot[0])) + 1;
    let maxHeight = _.max(dots.map(dot => dot[1])) + 1;

    let image = new Array(maxHeight).fill(0).map(() => new Array(maxWidth).fill(0));
    dots.forEach(dot => image[dot[1]][dot[0]]++);
   
    image.forEach(l => console.log(l.map(x => x > 0 ? "#":".").join("")));
}