
var tap = require('tap');
tap.mochaGlobals();
var getAminoAcidDataForEachBaseOfDna = require('../app/getAminoAcidDataForEachBaseOfDna.js');
var getAA = require('../app/getAminoAcidFromSequenceTriplet');
// var collapseOverlapsGeneratedFromRangeComparisonIfPossible = require('../app/collapseOverlapsGeneratedFromRangeComparisonIfPossible.js');
var assert = require('assert');
var aaData;
describe('getAminoAcidDataForEachBaseOfDna tranlates a', function() {
	//: It gets correct amino acid mapping and position in codon for each basepair in sequence
	it('1 amino acid long sequence', function() {
		aaData = getAminoAcidDataForEachBaseOfDna('atg', true);
		assert.deepEqual(aaData, [{
			aminoAcid: getAA('atg'),
			positionInCodon: 0,
			aminoAcidIndex: 0,
		}, {
			aminoAcid: getAA('atg'),
			positionInCodon: 1,
			aminoAcidIndex: 0,
		}, {
			aminoAcid: getAA('atg'),
			positionInCodon: 2,
			aminoAcidIndex: 0,
		}]);
	});
	it('1 amino acid long sequence in reverse direction', function() {
		aaData = getAminoAcidDataForEachBaseOfDna('atg', false);
		assert.deepEqual(aaData, [{
			aminoAcid: getAA('cat'),
			positionInCodon: 2,
			aminoAcidIndex: 0,
		}, {
			aminoAcid: getAA('cat'),
			positionInCodon: 1,
			aminoAcidIndex: 0,
		}, {
			aminoAcid: getAA('cat'),
			positionInCodon: 0,
			aminoAcidIndex: 0,
		}]);
	});
	it('> 1 amino acid long sequence', function() {
		debugger;
		aaData = getAminoAcidDataForEachBaseOfDna('atgtaat', true);
		assert.deepEqual(aaData, [{
			aminoAcid: getAA('atg'),
			positionInCodon: 0,
			aminoAcidIndex: 0,
		}, {
			aminoAcid: getAA('atg'),
			positionInCodon: 1,
			aminoAcidIndex: 0,
		}, {
			aminoAcid: getAA('atg'),
			positionInCodon: 2,
			aminoAcidIndex: 0,
		}, {
			aminoAcid: getAA('taa'),
			positionInCodon: 0,
			aminoAcidIndex: 1,
		}, {
			aminoAcid: getAA('taa'),
			positionInCodon: 1,
			aminoAcidIndex: 1,
		}, {
			aminoAcid: getAA('taa'),
			positionInCodon: 2,
			aminoAcidIndex: 1,
		}, {
			aminoAcid: getAA('xxx'),
			positionInCodon: 0,
			aminoAcidIndex: 2,
		}]);
	});
	it('> 1 amino acid long sequence in reverse direction', function() {
		aaData = getAminoAcidDataForEachBaseOfDna('atgtaat', false);
		
		assert.deepEqual(aaData, [{
			aminoAcid: getAA('xxx'),
			positionInCodon: 0,
			aminoAcidIndex: 2,
		}, {
			aminoAcid: getAA('aca'),
			positionInCodon: 2,
			aminoAcidIndex: 1,
		}, {
			aminoAcid: getAA('aca'),
			positionInCodon: 1,
			aminoAcidIndex: 1,
		}, {
			aminoAcid: getAA('aca'),
			positionInCodon: 0,
			aminoAcidIndex: 1,
		}, {
			aminoAcid: getAA('att'),
			positionInCodon: 2,
			aminoAcidIndex: 0,
		}, {
			aminoAcid: getAA('att'),
			positionInCodon: 1,
			aminoAcidIndex: 0,
		}, {
			aminoAcid: getAA('att'),
			positionInCodon: 0,
			aminoAcidIndex: 0,
		}]);
	});
	it('< 1 amino acid long sequence', function() {
		aaData = getAminoAcidDataForEachBaseOfDna('at', true);
		assert.deepEqual(aaData, [{
			aminoAcid: getAA('xxx'),
			positionInCodon: 0,
			aminoAcidIndex: 0,
		}, {
			aminoAcid: getAA('xxx'),
			positionInCodon: 1,
			aminoAcidIndex: 0,
		}]);
	});
	it('< 1 amino acid long sequence in reverse direction', function() {
		aaData = getAminoAcidDataForEachBaseOfDna('at', false);
		assert.deepEqual(aaData, [{
			aminoAcid: getAA('xxx'),
			positionInCodon: 1,
			aminoAcidIndex: 0,
		}, {
			aminoAcid: getAA('xxx'),
			positionInCodon: 0,
			aminoAcidIndex: 0,
		}]);
	});
});