const fs = require("fs");
const _= require("lodash");

const input = fs.readFileSync("./input.txt").toString("utf-8").split('\n\n');
let iea = input[0].split('').map(c => c === "." ? 0 : 1);
let image = parseImage(input[1]);

let enhanced2 = enhanceImage(image, iea, 2);
console.log("(Part 1) Lit pixel count: " + getLitCount(enhanced2));

let enhanced50 = enhanceImage(image, iea, 50);
console.log("(Part 2) Lit pixel count: " + getLitCount(enhanced50));

function getLitCount(image){
   return _.flatten(image).reduce((sum, curr) => sum += curr, 0);
}

function enhanceImage(baseImage, iea, enhanceCount, displayImage = false){
    let image = _.cloneDeep(baseImage);
    image = padArray(image, "0", 2*enhanceCount);

    for (let i = 0; i < enhanceCount; i++){
        image = enhanceImageOnce(image, iea);
        if (displayImage){
            logImage(image);
        }
    }

    return image;
}

function enhanceImageOnce(image, iea){
    let enhancedImage = _.cloneDeep(image);
    for (let i = 1; i < image.length - 1; i++){
        for (let j = 1; j < image[0].length - 1; j++){
            let newPixel = iea[getInputPixelIndex(image, i, j)];
            enhancedImage[i][j] = newPixel;
        }
    }
    enhancedImage = unpadArray(enhancedImage);
    return enhancedImage;
}

function getInputPixelIndex(image, x, y){
    let inputPixels = [];
    for (let i = 0; i < 3; i++){
        inputPixels.push(image[x - 1 + i].slice(y - 1, y + 2));
    }

    return parseInt(_.flatten(inputPixels).join(''), 2);
}

function parseImage(rawImage){
    let image = [];
    rawImage.split('\n').forEach(line => {
        image.push(line.split('').map(c => c === "." ? 0 : 1));
    });

    return image;

}

function logImage(image){
    image.forEach(line => {
        console.log(line.map(c => c === 0 ? "." : "#").join(''));
    })
    console.log("\n------------------------------\n");
}

function padArray(array, fill, thickness) {
    const sidePad = fill.repeat(thickness);
    const topPad = fill.repeat(array[0].length).split('');
    
    for (let i = 0; i < thickness; i++){
        array.unshift(topPad);
        array.push(topPad);
    }

    array = array.map(a => sidePad + a.join("") + sidePad);
    array = array.map(a => a.split("").map(n => +n));

    return array;
  }

  function unpadArray(array){
    array.shift();
    array.pop();
    array = array.map(a => a.slice(1, -1));
    return array;
  }