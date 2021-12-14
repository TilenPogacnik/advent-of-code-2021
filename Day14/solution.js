var fs = require("fs");
var _ = require("lodash");

const input = fs.readFileSync("./input.txt").toString('utf-8').split("\n\n");
let template = input[0];
let rules = parseRules(input[1]);

console.log("Part 1 solution: " + simulateSteps(template, rules, 10));
console.log("Part 2 solution: " + simulateSteps(template, rules, 40));

function parseRules(input){
    let ruleMap = new Map();
    
    input.split("\n").forEach(line => {
       let split = line.split(" -> ");
       ruleMap.set(split[0], [split[0][0] + split[1], split[1] + split[0][1]]);
    });

    return ruleMap;
}

function simulateSteps(startPolymer, rules, steps){
    let pairCount = generatePairsFromTemplate(startPolymer);

    for (let i = 0; i < steps; i++){
        pairCount = calculateStep(pairCount);
    }

    let elementCount = countElements(pairCount, startPolymer);

    return _.max([...elementCount.values()]) - _.min([...elementCount.values()]);
}

function generatePairsFromTemplate(template){
    let pairCount = new Map();
    for (let i = 0; i < template.length - 1; i++){
        let pair = template.slice(i, i + 2);
        pairCount.set(pair, (pairCount.get(pair) || 0) + 1);
    }

    return pairCount;
}

function calculateStep(pairCount){
    let newPairCount = new Map();

    pairCount.forEach((value, key) => {
        rules.get(key).forEach(newPair => {
            newPairCount.set(newPair, value + (newPairCount.get(newPair) || 0));
        });
    });

    return newPairCount;
}

function countElements(pairCount, startPolymer){
    let elementCount = new Map();
    pairCount.forEach((value, key) => {
        elementCount.set(key[0], value + (elementCount.get(key[0]) || 0));
    });
    elementCount.set(_.last(startPolymer), elementCount.get(_.last(startPolymer)) + 1);

    return elementCount;
}