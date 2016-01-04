var splitRangeIntoTwoPartsIfItIsCircular = require('ve-range-utils/splitRangeIntoTwoPartsIfItIsCircular');
var IntervalTree = require('interval-tree2');
var a = 0;
module.exports = function computeIntervals(ranges, maxLength) {
    var itree = new IntervalTree(Math.floor(maxLength/2));
    ranges.forEach(function(range){
        var splitRangeParts = splitRangeIntoTwoPartsIfItIsCircular(range, maxLength);
        splitRangeParts.forEach(function(splitRangePart, index){
            itree.add(splitRangePart.start, splitRangePart.end, range.id + index, range);
        });
    });
    return itree;
}