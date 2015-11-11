var Nt = require('ntseq');
module.exports = function getAminoAcidDataForRangeOfSequence(sequenceString, forward) {
    var seq = (new Nt.Seq()).read(sequenceString);
    if (!forward) {
        seq = seq.complement()
    }
    // Translate at nucleotide offset 0
    return seq.translate();

    // // Translate at nucleotide offset 1
    // seq.translate(1); // === 'CPTA'
    // // Translate at nucleotide offset 0, 1 amino acid into the frame
    // seq.translateFrame(0, 1);

    // // var revComp = require('./getReverseComplementSequenceString');
    // // var getAA = require('./getAminoAcidFromSequenceTriplet');
    // // var ac = require('ve-api-check'); 
    // // ac.throw([ac.string,ac.bool],arguments);
    // // var aminoAcids = ''
    // // for (var i = 2; i < sequenceString.length; i+3) {
    // //     aminoAcids += getAA((sequenceString[i-2] + sequenceString[i-1] + sequenceString[i])).value
    // // }
    // // return 'asdgasdgasdgasgasg';
};
