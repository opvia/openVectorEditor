// var cloneDeep = require('lodash/lang/cloneDeep');
var assign = require('lodash/object/assign');
var ac = require('ve-api-check');
var getYOffsetsForPotentiallyCircularRanges = require('ve-range-utils/getYOffsetsForPotentiallyCircularRanges');
var annotationTypes = require('ve-sequence-utils/annotationTypes');
//basically just adds yOffsets to the annotations
module.exports = function prepareCircularViewData(sequenceData) {
    // var clonedSeqData = assign({},sequenceData)
    // annotationTypes.forEach(function(annotationType){
    //     if (annotationType !== 'cutsites') {
    //         var {maxYOffset} = getYOffsetsForPotentiallyCircularRanges(clonedSeqData[annotationType]);
    //         clonedSeqData[annotationType].maxYOffset = maxYOffset;
    //     }
    // });
    // return clonedSeqData;
}