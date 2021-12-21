const _ = require("lodash");
const ROTATIONS = getAllRotations();
const OVERLAP_THRESHOLD = 12;

class Scanner {
    constructor(beacons){
        this.beacons = beacons;
        this.isLocated = false;
        this.relativePos = [0,0,0];
    }

    compareTo(otherScanner){
        for (let otherBeacon of otherScanner.beacons){
            for (let rotation of ROTATIONS){
                let rotatedBeacons = this.getRotatedBeacons(rotation);
                for (let beacon of rotatedBeacons){
                    let relativePos = otherBeacon.map((val, i) => val - beacon[i]);
                    let transposedBeacons = rotatedBeacons.map(b => b.map((val,i) => val + relativePos[i]));//this.getTransposedBeacons(rotatedBeacons, relativePos);

                    let overlapCount = _.intersectionWith(otherScanner.beacons, transposedBeacons, _.isEqual).length;
                    if (overlapCount >= OVERLAP_THRESHOLD){
                        console.log("Match found! " + relativePos);
                        this.relativePos = relativePos;
                        this.beacons = transposedBeacons;
                        this.isLocated = true;
                        return true;
                    }
                }
            }
        }
        return false;
    }


    getRotatedBeacons(rot){
        let rotatedBeacons = [];
        this.beacons.forEach(b => {
            rotatedBeacons.push(rotatePosition(b, rot[0], rot[1], rot[2]));
        });
        return rotatedBeacons;
    }

    getTransposedBeacons(targetBeacons, relativePos){
        return targetBeacons.map(b => b.map((val,i) => val + relativePos[i]));
    }


}

function rotatePosition(pos, x, y, z){
    const sin = [0, 1, 0, -1];
    const cos = [1, 0, -1, 0];


    let R = [[cos[z]*cos[y], cos[z]*sin[y]*sin[x] - sin[z]*cos[x], cos[z]*sin[y]*cos[x] + sin[z]*sin[x]],
            [sin[z]*cos[y], sin[z]*sin[y]*sin[x] + cos[z]*cos[x], sin[z]*sin[y]*cos[x] - cos[z]*sin[x]],
            [-sin[y], cos[y]*sin[x], cos[y]*cos[x]]];

    let rotated = [pos[0] * R[0][0] + pos[1] * R[0][1] + pos[2] * R[0][2],
                   pos[0] * R[1][0] + pos[1] * R[1][1] + pos[2] * R[1][2],
                   pos[0] * R[2][0] + pos[1] * R[2][1] + pos[2] * R[2][2]];

    return rotated;
}

function getAllRotations(){
    let rotations = [];

    for (let x = 0; x < 4; x++){
        for (let y = 0; y < 4; y++){
            for (let z = 0; z < 4; z++){
               rotations.push([x, y, z]);
            }
        }
    }
    return rotations;
}

module.exports = Scanner;