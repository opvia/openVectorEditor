require('../../test/testSetup.js');
var getAminoAcidDataForRangeOfSequence = require('./getAminoAcidDataForRangeOfSequence');
getAminoAcidDataForRangeOfSequence(dnaSequence, false);
describe('getAminoAcidDataForRangeOfSequence', function () {
	it('should return a string of AAs', function (done) {
		var dnaSequence = 'atgatg'
		var aminoAcidString = getAminoAcidDataForRangeOfSequence(dnaSequence, true);
		aminoAcidString.should.equal('MM')
	});
});