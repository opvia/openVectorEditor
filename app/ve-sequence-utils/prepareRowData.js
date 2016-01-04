var mapAnnotationsToRows = require('./mapAnnotationsToRows');
module.exports = function prepareRowData(sequence, bpsPerRow) {
    var sequenceLength = sequence.length;
    var totalRows = Math.ceil(sequenceLength / bpsPerRow) || 1; //this check makes sure there is always at least 1 row!
    var rows = [];
    for (var rowNumber = 0; rowNumber < totalRows; rowNumber++) {
        var row = {};
        row.rowNumber = rowNumber;
        row.start = rowNumber * bpsPerRow;
        row.end = (rowNumber + 1) * (bpsPerRow) - 1 < sequenceLength ? (rowNumber + 1) * (bpsPerRow) - 1 : sequenceLength - 1;
        if (row.end < 0) {
            row.end = 0
        }
        row.sequence = sequence.slice(row.start, (row.end + 1));
        rows[rowNumber] = row;
    }
    return rows;
}