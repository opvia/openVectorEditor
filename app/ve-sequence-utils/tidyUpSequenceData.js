var bsonObjectid = require('bson-objectid');
var assign = require('lodash/object/assign');
var randomColor = require('random-color');
var FeatureTypes = require('./FeatureTypes.js');
var areNonNegativeIntegers = require('validate.io-nonnegative-integer-array');
module.exports = function tidyUpSequenceData(sequence) {
    var sequenceData = assign({}, sequence); //sequence is usually immutable, so we clone it and return it
    var response = {
        messages: []
    };
    if (!sequenceData) {
        sequenceData = {};
    }
    if (!sequenceData.sequence && sequenceData.sequence !== '') {
        sequenceData.sequence = "";
    }
    sequenceData.size = sequenceData.sequence.length;
    if (sequenceData.circular === 'false' || sequenceData.circular == -1 || !sequenceData.circular) {
        sequenceData.circular = false;
    } else {
        sequenceData.circular = true;
    }
    if (!Array.isArray(sequenceData.features)) {
        sequenceData.features = [];
    }
    if (!Array.isArray(sequenceData.parts)) {
        sequenceData.parts = [];
    }
    if (!Array.isArray(sequenceData.translations)) {
        sequenceData.translations = [];
    }
    if (!Array.isArray(sequenceData.cutsites)) {
        sequenceData.cutsites = [];
    }
    if (!Array.isArray(sequenceData.orfs)) {
        sequenceData.orfs = [];
    }

    sequenceData.features = cleanUpAnnotations(sequenceData.features)
    sequenceData.parts = cleanUpAnnotations(sequenceData.parts)
    sequenceData.translations = cleanUpAnnotations(sequenceData.translations)

    return sequenceData;

    function cleanUpAnnotations(annotations, options) {
        var annotationIds = {};
        return annotations.filter(function (annotation) {
            if (!annotation || typeof annotation !== 'object') {
                response.messages.push('Invalid annotation detected and removed');
                return false;
            }
            annotation.start = parseInt(annotation.start);
            annotation.end = parseInt(annotation.end);

            if (!annotation.name || typeof annotation.name !== 'string') {
                response.messages.push('Unable to detect valid name for annotation, setting name to "Untitled annotation"');
                annotation.name = 'Untitled annotation';
            }
            if (!areNonNegativeIntegers([annotation.start]) || annotation.start > sequenceData.size - 1) {
                response.messages.push('Invalid annotation start: ' + annotation.start + ' detected for ' + annotation.name + ' and set to 1'); //setting it to 0 internally, but users will see it as 1
                annotation.start = 0;
            }
            if (!areNonNegativeIntegers([annotation.end]) || annotation.end > sequenceData.size - 1) {
                response.messages.push('Invalid annotation end:  ' + annotation.end + ' detected for ' + annotation.name + ' and set to 1'); //setting it to 0 internally, but users will see it as 1
                annotation.end = 0;
            }
            if (annotation.start > annotation.end && sequenceData.circular === false) {
                response.messages.push('Invalid circular annotation detected for ' + annotation.name + '. end set to 1'); //setting it to 0 internally, but users will see it as 1
                annotation.end = 0;
            }
            if (!annotation.color) {
                annotation.color = randomColor();
            }
            if (typeof annotation.id !== 'string' || typeof annotation.id !== 'number' || (!annotation.id && annotation.id !== 0)){
                annotation.id = bsonObjectid();
                response.messages.push('Invalid circular annotation detected for ' + annotation.name + '. end set to 1');
                response.messages.push('Invalid id detected ' + annotation.name + '. A new random ID has been generated for it')
            }
            annotation.id = annotation.id.toString();
            if (annotationIds[annotation.id]) {
                annotation.id = bsonObjectid()
                response.messages.push('Duplicate id detected for' + annotation.name + '. A new random ID has been generated for it')
            }
            //we use this map to keep track of annotation ids 
            annotationIds[annotation.id] = true; 

            if (annotation.forward === true || annotation.forward === 'true' || annotation.strand === 1 || annotation.strand === '1' || annotation.strand === '+') {
                annotation.forward = true;
            } else {
                annotation.forward = false;
            }
            if (!annotation.type || typeof annotation.type !== 'string' || FeatureTypes.some(function(featureType) {
                if (featureType.toLowerCase === annotation.type.toLowerCase()) {
                    annotation.type = featureType; //this makes sure the annotation.type is being set to the exact value of the accepted featureType
                    return true;
                }
            })) {
                response.messages.push('Invalid annotation type detected:  ' + annotation.type + ' for ' + annotation.name + '. set type to misc_feature');
                annotation.type = 'misc_feature';
            }
            return true;
        })

    }
};