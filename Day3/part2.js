var fs = require("fs");
var input = fs.readFileSync("./input.txt").toString('utf-8');

function filterReport(report, useMostCommonBit, index){
    var oneCount = report.reduce((prev, curr) => prev + parseInt(curr[index]), 0);
    var zeroCount = report.length - oneCount;

    var filterBit = useMostCommonBit === (oneCount >= zeroCount);
    
    var filteredReport = report.filter(line => line[index] == filterBit);

    if (filteredReport.length > 1){
        return filterReport(filteredReport, useMostCommonBit, index+1);
    } else {
        return filteredReport[0];
    }
}

const report = input.split("\n");
var oxygenGeneratorRating = filterReport(report, true, 0);
var CO2ScrubberRating = filterReport(report, false, 0);
var lifeSupportRating = parseInt(oxygenGeneratorRating, 2) * parseInt(CO2ScrubberRating, 2);


console.log("Oxygen generator rating: " + oxygenGeneratorRating);
console.log("CO2 Scrubber Rating: " + CO2ScrubberRating);
console.log("(Part 2 solution) Life support rating: " + lifeSupportRating);

