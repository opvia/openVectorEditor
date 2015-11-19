var splitRangeIntoTwoPartsIfItIsCircular = require('ve-range-utils/splitRangeIntoTwoPartsIfItIsCircular');
var intervals = require('interval-query');
module.exports = function computeIntervals(ranges) {
    var tree = new intervals.SegmentTree;
    debugger;
    ranges.forEach(function(range, maxLength){
    var splitRangeParts = splitRangeIntoTwoPartsIfItIsCircular(range, Math.floor(maxLength/2));
        splitRangeParts.forEach(function(splitRangePart){
        	tree.pushInterval(splitRangePart.start, splitRangePart.end);
        });
    });
    return tree.buildTree();
}