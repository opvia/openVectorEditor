var computeIntervals = require('ve-sequence-utils/computeIntervals');
module.exports = function(annotationType) {
    return function(get) {
        var annotations = get(['sequenceData', annotationType]);
        var sequenceLength = get(['sequenceLength']);
        return computeIntervals(annotations, sequenceLength)
    }
}