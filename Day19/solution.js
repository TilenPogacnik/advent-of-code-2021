const fs = require("fs");
const _ = require("lodash");
const Scanner = require("./Scanner");

let input = fs.readFileSync("./input.txt").toString('utf-8');
let scanners = parseScanners(input);

console.time("Search time: ");
locateScanners();
console.timeEnd("Search time: ");

console.log("(Part 1) Beacon count: " + getBeaconCount());
console.log("(Part 2) Largest Manhattan distance: " + getMaxScannerDistance());

function locateScanners(){
    scanners[0].isLocated = true;
    let untestedLocatedScanners = [scanners[0]];
    while (scanners.some(s => !s.isLocated)){
        let newLocatedScanners = [];
        for (uls of untestedLocatedScanners){
            for (unlocatedScanner of scanners.filter(s => !s.isLocated)){
                console.count("comparison");
                let isMatch = unlocatedScanner.compareTo(uls);
                if (isMatch){
                    newLocatedScanners.push(unlocatedScanner);
                }
            }
        }
        untestedLocatedScanners = [...newLocatedScanners]; 
    }
}

function getBeaconCount(){
    let allBeacons = [];
    scanners.forEach(scanner => allBeacons.push(...scanner.beacons));
    return _.uniqWith(allBeacons, _.isEqual).length;
}

function getMaxScannerDistance(){
    let maxDistance = 0;
    for (let i = 0; i < scanners.length; i++){
        for (let j = 0; j < scanners.length; j++){
            let distance = scanners[i].relativePos.map((rp, k) => Math.abs(rp - scanners[j].relativePos[k])).reduce((sum, curr) => (sum + curr), 0);
            if (distance > maxDistance) maxDistance = distance;
        }
    }
    return maxDistance;
}

function parseScanners(rawScanners){
    let scanners = [];
    rawScanners.split("\n\n").forEach(rawScanner => {
        let beacons = [];
        rawScanner.split('\n').forEach(line => {
            if (line.startsWith("---")) return;
               
            beacons.push(line.split(',').map(num => parseInt(num)));
        });
        scanners.push(new Scanner(beacons));
    });

    return scanners;    
}