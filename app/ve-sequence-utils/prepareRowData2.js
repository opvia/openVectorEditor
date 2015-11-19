// ac.throw([ac.posInt, ac.posInt, ac.bool], arguments);
var computeIntervals = require('./computeIntervals');
var cloneDeep = require('lodash/lang/cloneDeep');
var ac = require('ve-api-check');
var getYOffsetsForPotentiallyCircularRanges = require('ve-range-utils/getYOffsetsForPotentiallyCircularRanges');
var annotationTypes = require('ve-sequence-utils/annotationTypes');
//basically just adds yOffsets to the annotations
module.exports = function prepareRowData2(sequenceData, sequenceLength) {
    var clonedSeqData = cloneDeep(sequenceData)
    annotationTypes.forEach(function(annotationType){
        if (annotationType !== 'cutsites') {
            var intervalTree = computeIntervals(clonedSeqData[annotationType], sequenceLength);
            // clonedSeqData[annotationType].maxYOffset = maxYOffset;
        }
    });
    return clonedSeqData;
}
