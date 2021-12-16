var fs = require("fs");

const PacketType = {
    Literal: 4,
    Sum: 0,
    Product: 1,
    Minimum: 2,
    Maximum: 3,
    GreaterThan: 5,
    LessThan: 6,
    Equal: 7,
}

const BitLengths = {
    Version: 3,
    TypeID: 3,
    LiteralGroupHeader: 1,
    LiteralGroupLength: 4,
    LengthTypeID: 1,
    TotalSubpacketBitLength: 15,
    SubpacketCount: 11,
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
            let endIndex = this.readNumber(BitLengths.TotalSubpacketBitLength) + this.currentIndex;
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

    getEndIndex(){
        return this.initialized ? this.currentIndex : -1;
    }

    getVersionSum(){
        return this.version + this.childPackets.reduce((sum, child) => sum += child.getVersionSum(), 0);
    }

    evaluate() {
        switch(this.typeID){
            case PacketType.Literal:
                return this.literalValue;

            case PacketType.Sum:
                return this.childPackets.reduce((sum, child) => sum += child.evaluate(), 0);
                
            case PacketType.Product:
                return this.childPackets.reduce((sum, child) => sum *= child.evaluate(), 1);

            case PacketType.Minimum:
                return this.childPackets.reduce((min, child) => {
                    let childVal = child.evaluate();
                    return childVal < min ? childVal : min;
                }, Number.MAX_SAFE_INTEGER);

            case PacketType.Maximum:
                return this.childPackets.reduce((max, child) => {
                    let childVal = child.evaluate();
                    return childVal > max ? childVal : max;
                }, Number.MIN_SAFE_INTEGER);

            case PacketType.GreaterThan:
                return this.childPackets[0].evaluate() > this.childPackets[1].evaluate() ? 1 : 0;

            case PacketType.LessThan:
                return this.childPackets[0].evaluate() < this.childPackets[1].evaluate() ? 1 : 0;

            case PacketType.Equal:
                return this.childPackets[0].evaluate() == this.childPackets[1].evaluate() ? 1 : 0;
        }
    }
}

//*********
//CODE
//*********

const input = fs.readFileSync("./input.txt").toString('utf-8');
const packet = new Packet(createBinaryInput(input));

console.log("Part 1 solution: Version sum: " + packet.getVersionSum());
console.log("Part 2 solution: Packet value: " + packet.evaluate());

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