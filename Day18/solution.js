var fs = require("fs");
const _= require("lodash");

let input = fs.readFileSync("./input.txt").toString('utf-8').split('\n');

part1([...input]);
part2([...input]);

function part1(input){
    let sumLine = reduce(parse(input.shift()));
    input.forEach(stringLine => {
        let newLine = reduce(parse(stringLine));
        sumLine = reduce(add(sumLine, newLine));
    });
    
    let magnitude = calculateMagnitude(sumLine);
    
    console.log("(Part 1) Magnitude: " + magnitude); 
}

function part2(input){
    let lines = [];
    input.forEach(line => lines.push(reduce(parse(line))));

    let maxMagnitude = 0;

    for (let i = 0; i < lines.length; i++){
        for (let j = 0; j < lines.length; j++){
            if (i == j) continue;
            let line0 = _.cloneDeep(lines[i]);
            let line1 = _.cloneDeep(lines[j]);
            let pairMagnitude = calculateMagnitude(reduce(add(line0, line1)));

            if (pairMagnitude > maxMagnitude){
                maxMagnitude = pairMagnitude;
            }
        }
    }

    console.log("(Part 2) Max magnitude: " + maxMagnitude);
}

function calculateMagnitude(line){
    let magnitudeLine = _.cloneDeep(line);

    while (magnitudeLine.length > 1){
        for (let i = 0; i < magnitudeLine.length - 1; i++){
            if (magnitudeLine[i].depth == magnitudeLine[i + 1].depth){
                magnitudeLine[i + 1].value = 3 * magnitudeLine[i].value + 2 * magnitudeLine[i + 1].value;
                magnitudeLine[i + 1].depth--;
                magnitudeLine.splice(i, 1);
                break;
            }
        }
    }

    return magnitudeLine[0].value;
}

//reduce -> loop through line, explode and split while possible, return line when nothing else can be done
function reduce(line){
    const explode = (i) => {
        if (i > 0) line[i - 1].value += line[i].value;
        if (i < line.length - 2) line[i + 2].value += line[i + 1].value; //Possible off by one error here!
        line[i].value = 0;
        line[i].depth--;

        line.splice(i + 1, 1);
    };

    const split = (i) => {
       let splitNum = line[i];
       let newNum = new SnailfishNumber(Math.floor(splitNum.value/2), splitNum.depth + 1);
       let newNum2 = new SnailfishNumber(Math.ceil(splitNum.value/2), splitNum.depth + 1);
       line.splice(i, 1, newNum, newNum2);
    };

    let isReduced;
    do{
        isReduced = true;
        for (let i = 0; i < line.length - 1; i++){
            if (line[i].depth > 4 && line[i].depth == line[i+1].depth){
                explode(i);
                isReduced = false;
                break;
            }
        }
        if (!isReduced) continue;
        //We split only of nothing can be exploded
        for (let i = 0; i < line.length; i++){
            if (line[i].value > 9){
                split(i);
                isReduced = false;
                break;
            }
        }
        
    } while (!isReduced);

    return line;
}

//add -> concatenate both lists, increase all depths by one
function add(line0, line1){
    return line0.concat(line1).map(num => {num.depth++; return num});
}

//string to pair list<[number, depth]> => depth = count("["") - count("]")
// we assume all numbers are between 0 and 9 -> one character long
function parse(stringLine){
    let numberList = [];
    let currentDepth = 0;
    for (let i = 0; i < stringLine.length; i++){
        let currentChar = stringLine.charAt(i);
        switch (currentChar){
            case '[':
                currentDepth++;
                break;
            case ']':
                currentDepth--;
                break;
            case ',':
                break;
            default:
                numberList.push(new SnailfishNumber(parseInt(currentChar), currentDepth));
                break;
        }
    }

    return numberList;
}

function SnailfishNumber(value, depth){
    this.value = value;
    this.depth = depth;
}