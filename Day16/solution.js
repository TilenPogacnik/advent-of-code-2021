var fs = require("fs");
const input = fs.readFileSync("./input.txt").toString('utf-8');

//*********
//CLASSES
//*********

const PacketType = {
    Literal: 4,
}

const BitLengths = {
    Version: 3,
    TypeID: 3,
    LiteralGroupHeader: 1,
    LiteralGroupLength: 4,
    LengthTypeID: 1,
    TotalSubpacketBitLength: 15, //in operator packets with lengthTypeID == 0
    SubpacketCount: 11, //in operator packets with lengthTypeID == 1
}

class Packet{
    constructor(input, startIndex = 0){
        this.input = input;
        this.currentIndex = startIndex;

        this.version = this.readNumber(BitLengths.Version);
        this.typeID = this.readNumber(BitLengths.TypeID);

        this.literalValue = 0;
        this.childPackets = [];

        switch (this.typeID) {
            case PacketType.Literal:
                this.parseLiteralValue();
                break;
            default: 
                this.parseOperator();
                break;
        }

        this.initialized = true;
    }

    parseLiteralValue(){
        let binVal = "";
        let isLastGroup = false;
        do {
            isLastGroup = this.readNumber(BitLengths.LiteralGroupHeader) < 1;
            binVal += this.readBits(BitLengths.LiteralGroupLength);
        } while (!isLastGroup);
        
        this.literalValue = bin2dec(binVal);
    }

    parseOperator(){
        let lengthTypeID = this.readNumber(BitLengths.LengthTypeID);
        if (lengthTypeID == 0){
            let subpacketsBitLength = this.readNumber(BitLengths.TotalSubpacketBitLength);
            let endIndex = this.currentIndex + subpacketsBitLength;
            while (this.currentIndex < endIndex){
                this.readChild();
            }

        } else {
            let subpacketCount = this.readNumber(BitLengths.SubpacketCount);
            for (let i = 0; i < subpacketCount; i++){
                this.readChild();
            }
        }
    }

    readChild(){
        let child = new Packet(this.input, this.currentIndex);
        this.childPackets.push(child);
        this.currentIndex = child.getEndIndex(); 
    }

    readNumber(length){
        return bin2dec(this.readBits(length));
    }

    readBits(length){
        let result = this.input.slice(this.currentIndex, this.currentIndex + length);
        this.currentIndex += length;
        return result;
    }

    isPacketType(type){
        return this.typeID == type;
    }

    getEndIndex(){
        return this.initialized ? this.currentIndex : -1;
    }

    getVersionSum(){
        return this.version + this.childPackets.reduce((sum, child) => sum += child.getVersionSum(), 0);
    }
}

//*********
//CODE
//*********

let binaryInput = createBinaryInput(input);

let packet = new Packet(binaryInput);

console.log("Part 1 solution: Version sum: " + packet.getVersionSum());

//*********
//FUNCTIONS
//*********

function createBinaryInput(hexInput){
    return hexInput.split('').map(char => hex2bin(char)).join('');
}

function hex2bin(hex){
    return parseInt(hex, 16).toString(2).padStart(4, '0');
}

function bin2dec(bin){
    return parseInt(bin, 2);
}