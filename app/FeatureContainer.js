var StyleFeature = require('./StyleFeature');
import React, { PropTypes } from 'react';
let getXStartAndWidthOfRowAnnotation = require('./getXStartAndWidthOfRowAnnotation');
let getAnnotationRangeType = require('ve-range-utils/getAnnotationRangeType');
let LinearFeature = require('./LinearFeature');

let AnnotationContainerHolder = require('./AnnotationContainerHolder');
let AnnotationPositioner = require('./AnnotationPositioner');

var checkIfNonCircularRangesOverlap = require('ve-range-utils/checkIfNonCircularRangesOverlap');
var getOverlapOfNonCircularRanges = require('ve-range-utils/getOverlapOfNonCircularRanges');
var annotationIntervalTrees = require('./cerebral/computed/annotationIntervalTrees');
import {Decorator as Cerebral} from 'cerebral-react';
var getIntervalTree = annotationIntervalTrees(['sequenceData','features']);
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
class FeatureContainer extends React.Component {
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
        var {
            bpsPerRow,
            charWidth,
            annotationHeight,
            spaceBetweenAnnotations, 
            signals,
            annotationIntervalTree,
            row
        } = this.props;

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
        annotationRanges.forEach(function(annotationRange, index) {
            if (annotationRange.yOffset > maxAnnotationYOffset) {
                maxAnnotationYOffset = annotationRange.yOffset;
            }
            let annotation = annotationRange.annotation;
            let result = getXStartAndWidthOfRowAnnotation(annotationRange, bpsPerRow, charWidth);
            annotationsSVG.push(
                <AnnotationPositioner 
                    height={annotationHeight} 
                    width={result.width}
                    key={index}
                    top= {annotationRange.yOffset * (annotationHeight + spaceBetweenAnnotations)}
                    left={result.xStart}
                    >
                    <StyleFeature
                        signals={signals}
                        annotation={annotation}
                        color={annotation.color}>
                        <LinearFeature
                            widthInBps={annotationRange.end - annotationRange.start + 1}
                            charWidth={charWidth}
                            forward={annotation.forward}
                            rangeType={getAnnotationRangeType(annotationRange, annotation, annotation.forward)}
                            height={annotationHeight}
                            name={annotation.name}>
                        </LinearFeature>
                    </StyleFeature>
                    
                </AnnotationPositioner>
            );
        });
        let containerHeight = (maxAnnotationYOffset + 1) * (annotationHeight + spaceBetweenAnnotations);
        return (
            <AnnotationContainerHolder 
                className='featureContainer'
                containerHeight={containerHeight}>
                {annotationsSVG}
            </AnnotationContainerHolder>
        );

    }
}
module.exports = FeatureContainer;