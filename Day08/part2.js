var fs = require("fs");

//Explanation for digit groups: https://docs.google.com/spreadsheets/d/1U_tBsShi6tGHjMuMFc9h0KeTiqPcDLVV3C6U3p_RpSE/
const DIGIT_GROUPS = ["312", "200", "212", "311", "220", "221", "222", "300", "322", "321"];

const input = fs.readFileSync("./input.txt").toString('utf-8').split("\n")

const result = input.reduce((prev, curr) => prev += solveEntry(curr), 0);
console.log("Part 2 solution: " + result);

function solveEntry(entry){
    var line = entry.split("|").map(_ => _.trim());
    var groups = generateGroups(line[0].split(" "));
    return decodeOutput(line[1], groups);
}

function generateGroups(patterns){
    var groups = [];
    groups.push(patterns.find(p => p.length == 3));
    groups.push(patterns.find(p => p.length == 4).split('').filter(c => !groups[0].includes(c)).join(''));
    groups.push("abcdefg".split('').filter(c => !groups.join('').includes(c)).join(''));
    return groups;
}

function decodeOutput(output, groups){
    const decodeDigit = (encodedDigit) => {
        var groupCode = new Array(3).fill(0);
        [...encodedDigit].forEach(char => {
            groupCode[getCharGroup(char, groups)]++;
        });
        return DIGIT_GROUPS.findIndex(_ => _ === groupCode.join(""));       
    }

    return parseInt(output.split(" ").map(encodedDigit => decodeDigit(encodedDigit)).join(''));
}

function getCharGroup(char, groups){
   return groups.findIndex(group => group.includes(char));
}