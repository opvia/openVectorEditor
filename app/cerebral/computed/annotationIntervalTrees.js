var computeIntervals = require('ve-sequence-utils/computeIntervals');
module.exports = function annotationIntervalTrees (pathToAnnotation) {
    return function(get) {
        var annotations = get(pathToAnnotation);
        var sequenceLength = get(['sequenceLength']);
        return computeIntervals(annotations, sequenceLength)
    }
}