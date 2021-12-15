var fs = require("fs");
var _ = require("lodash");

class CaveSystem {
    constructor(input) {
        this.caves = new Map();
        this.init(input);
    }

    init(input) {
        input.split("\n").forEach(line => {
            let connectedCaves = line.split('-');
            let cave0 = this.createCave(connectedCaves[0]);
            let cave1 = this.createCave(connectedCaves[1]);

            cave0.addConnection(cave1);
            cave1.addConnection(cave0);
        });
    }

    createCave(caveName) {
        if (this.caves.has(caveName)) {
            return this.caves.get(caveName);
        }
        let newCave = new Cave(caveName);
        this.caves.set(caveName, newCave);
        return newCave;
    }

    getPathCount(startCave, endCave, allowedMultipleVisits){
        return this.dfs(this.caves.get(startCave), this.caves.get(startCave), this.caves.get(endCave), allowedMultipleVisits, []);
    }

    dfs(currentCave, startCave, targetCave, allowedMultipleVisits, path){
        if (currentCave === targetCave) {
            return 1;
        }
        if (currentCave === startCave && path.length > 0){
            return 0;
        }
        if (!currentCave.isBig && path.includes(currentCave)){
            if (allowedMultipleVisits <= 0){
                return 0;
            }

            allowedMultipleVisits--;
        }

        path.push(currentCave);

        return currentCave.connections.reduce((sum, cave) => sum += this.dfs(cave, startCave, targetCave, allowedMultipleVisits, [...path]), 0);
    }
}

class Cave {
    constructor(name) {
        this.name = name;
        this.isBig = name === _.upperCase(name);
        this.connections = [];
    }

    addConnection(connectedCave) {
        this.connections.push(connectedCave);
    }
}

const input = fs.readFileSync("./input.txt").toString('utf-8');

let caveSystem = new CaveSystem(input);

console.log("Part 1: " + caveSystem.getPathCount("start", "end", 0));
console.log("Part 2: " + caveSystem.getPathCount("start", "end", 1));