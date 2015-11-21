var splitRangeIntoTwoPartsIfItIsCircular = require('ve-range-utils/splitRangeIntoTwoPartsIfItIsCircular');
var IntervalTree = require('interval-tree2');
module.exports = function computeIntervals(ranges, maxLength) {
    var itree = new IntervalTree(Math.floor(maxLength/2));
    ranges.forEach(function(range){
        var splitRangeParts = splitRangeIntoTwoPartsIfItIsCircular(range, maxLength);
        splitRangeParts.forEach(function(splitRangePart, index){
            itree.add(splitRangePart.start, splitRangePart.end + 1, range.id + index, range);
        });
    });
    itree.add(1, 1, 10212);
    itree.add(5, 5, 102121);
    itree.add(95, 95, 1021211);
    return itree;
}