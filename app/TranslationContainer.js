import React, { PropTypes } from 'react';


const AnnotationContainerHolder = require('./AnnotationContainerHolder');
const AnnotationPositioner = require('./AnnotationPositioner');
const Translation = require('./Translation');
const getXStartAndWidthOfRowAnnotation = require('./getXStartAndWidthOfRowAnnotation');


var checkIfNonCircularRangesOverlap = require('ve-range-utils/checkIfNonCircularRangesOverlap');
var getOverlapOfNonCircularRanges = require('ve-range-utils/getOverlapOfNonCircularRanges');

var annotationIntervalTrees = require('./cerebral/computed/annotationIntervalTrees');
import {Decorator as Cerebral} from 'cerebral-react';
var getIntervalTree = annotationIntervalTrees(['translationsWithAminoAcids']);
@Cerebral({
    rowViewDimensions: ['rowViewDimensions'],
    charWidth: ['charWidth'],
    annotationHeight: ['annotationHeight'],
    spaceBetweenAnnotations: ['spaceBetweenAnnotations'],
    showFeatures: ['showFeatures'],
    showTranslations: ['showTranslations'],
    sequenceLength: ['sequenceLength'],
    bpsPerRow: ['bpsPerRow'],
    //computed data:
    annotationIntervalTree: getIntervalTree,
})
class TranslationContainer extends React.Component {
    // propTypes: {
    //     annotationRanges: PropTypes.arrayOf(PropTypes.shape({
    //         start: PropTypes.number.isRequired,
    //         end: PropTypes.number.isRequired,
    //         yOffset: PropTypes.number.isRequired,
    //         annotation: PropTypes.shape({
    //             start: PropTypes.number.isRequired,
    //             end: PropTypes.number.isRequired,
    //             forward: PropTypes.bool.isRequired,
    //             id: PropTypes.string.isRequired
    //         })
    //     })),
    //     charWidth: PropTypes.number.isRequired,
    //     bpsPerRow: PropTypes.number.isRequired,
    //     annotationHeight: PropTypes.number.isRequired,
    //     spaceBetweenAnnotations: PropTypes.number.isRequired,
    //     sequenceLength: PropTypes.number.isRequired,
    //     signals: PropTypes.object.isRequired
    // },
    render() {
        var {signals, row, annotationIntervalTree, bpsPerRow, charWidth, annotationHeight, spaceBetweenAnnotations, sequenceLength} = this.props;
        var yOffsets = [[]];
        var annotationRanges = annotationIntervalTree.search(row.start, row.end).map(function (interval) {
            var annotationRange = getOverlapOfNonCircularRanges(row, interval);
            var openYOffsetFound = yOffsets.some(function (rangesAlreadyAddedToYOffset, index) {
                var yOffsetBlocked = rangesAlreadyAddedToYOffset.some(function (alreadyAddedRange) {
                    return (checkIfNonCircularRangesOverlap(alreadyAddedRange, annotationRange));
                })
                if (!yOffsetBlocked) {
                    annotationRange.yOffset = index
                    rangesAlreadyAddedToYOffset.push(annotationRange)
                    return true
                }
            })
            if (!openYOffsetFound) {
                annotationRange.yOffset = yOffsets.length;
            }
            annotationRange.annotation = interval.object;
            return annotationRange;
        })

        if (annotationRanges.length === 0) {
            return null;
        }
        let maxAnnotationYOffset = 0;
        let annotationsSVG = [];
        annotationRanges.forEach(function(annotationRange) {
            if (annotationRange.yOffset > maxAnnotationYOffset) { //tnrtodo: consider abstracting out the code to calculate the necessary height for the annotation container
                maxAnnotationYOffset = annotationRange.yOffset;
            }
            const annotation = annotationRange.annotation;
            const result = getXStartAndWidthOfRowAnnotation(annotationRange, bpsPerRow, charWidth);
            annotationsSVG.push(
                <AnnotationPositioner 
                  height={annotationHeight} 
                  width={result.width}
                  key={'feature' + annotation.id + 'start:' + annotationRange.start}
                  top= {annotationRange.yOffset * (annotationHeight + spaceBetweenAnnotations)}
                  left={result.xStart}
                  >
                    <Translation
                        annotationRange={annotationRange}
                        sequenceLength={sequenceLength}
                        signals={signals}
                        widthInBps={annotationRange.end - annotationRange.start + 1}
                        charWidth={charWidth}
                        forward={annotation.forward}
                        height={annotationHeight}
                        color={annotation.color}
                        name={annotation.name}
                        >
                    </Translation>
                </AnnotationPositioner>
            );
            // transform={"scale(" + transformX + ",.2) "}
            // console.log('translationSVG: ' + translationSVG);
            // annotationsSVG = annotationsSVG.concat(translationSVG);
        });
        const containerHeight = (maxAnnotationYOffset + 1) * (annotationHeight + spaceBetweenAnnotations);
          // height={containerHeight}
        return (
              <AnnotationContainerHolder 
                containerHeight={containerHeight}>
                {annotationsSVG}
              </AnnotationContainerHolder>
          );
    }
}
module.exports = TranslationContainer;