import React, {PropTypes} from 'react';
var getComplementSequenceString = require('ve-sequence-utils/getComplementSequenceString');
var SequenceContainer = require('./SequenceContainer');
var AxisContainer = require('./AxisContainer');
var OrfContainer = require('./OrfContainer');
var TranslationContainer = require('./TranslationContainer');
var FeatureContainer = require('./FeatureContainer');
var CutsiteLabelContainer = require('./CutsiteLabelContainer');
var CutsiteSnipsContainer = require('./CutsiteSnipsContainer');
var HighlightLayer = require('./HighlightLayer');
var Caret = require('./Caret');

class RowItem extends React.Component {
    render() {
        var {
            charWidth,
            selectionLayer,
            cutsiteLabelSelectionLayer,
            annotationHeight,
            tickSpacing,
            spaceBetweenAnnotations,
            showFeatures,
            showTranslations,
            showParts,
            showOrfs,
            showAxis,
            showCutsites,
            showReverseSequence,
            caretPosition,
            sequenceLength,
            bpsPerRow,
            row,
            signals,
            featureIntervalTree,
        } = this.props;
        if (!row) {
            return null;
        }
        var fontSize = charWidth + "px";
        
        var rowContainerStyle = {
            overflow: "hidden",
            position: "relative",
            width: "100%",
        };
        return (
            <div className="rowContainer"
                style={rowContainerStyle}
                onMouseMove={this.onMouseMove}
                onMouseUp={this.onMouseUp}
                onMouseDown={this.onMouseDown}
                >
                {showFeatures &&
                  <FeatureContainer
                    row={row}
                    />
                }
            
                {showOrfs &&
                  <OrfContainer
                    row={row}
                    signals={signals}
                    annotationRanges={row.orfs}
                    charWidth={charWidth}
                    annotationHeight={annotationHeight}
                    bpsPerRow={bpsPerRow}
                    sequenceLength={sequenceLength}
                    spaceBetweenAnnotations={spaceBetweenAnnotations}/>
                }
                {showTranslations &&
                  <TranslationContainer
                    row={row}
                    />
                }

                {showCutsites &&
                  <CutsiteLabelContainer
                    signals={signals}
                    annotationRanges={row.cutsites}
                    charWidth={charWidth}
                    annotationHeight={annotationHeight}
                    bpsPerRow={bpsPerRow}
                    spaceBetweenAnnotations={spaceBetweenAnnotations}/>
                }
                <SequenceContainer 
                    sequence={row.sequence} 
                    charWidth={charWidth}>
                    {showCutsites && <CutsiteSnipsContainer
                        row={row}
                        signals={signals}
                        sequenceLength={sequenceLength}
                        annotationRanges={row.cutsites}
                        charWidth={charWidth}
                        bpsPerRow={bpsPerRow}
                        topStrand={true}
                        />}
                </SequenceContainer>

                {showReverseSequence &&
                    <SequenceContainer sequence={ getComplementSequenceString(row.sequence)} charWidth={charWidth}>
                        {showCutsites && <CutsiteSnipsContainer
                                                row={row}
                                                signals={signals}
                                                sequenceLength={sequenceLength}
                                                annotationRanges={row.cutsites}
                                                charWidth={charWidth}
                                                bpsPerRow={bpsPerRow}
                                                topStrand={false}
                                                />}
                    </SequenceContainer>
                }
                {showAxis &&
                    <AxisContainer
                    row={row}
                    signals={signals}
                    tickSpacing={tickSpacing}
                    charWidth={charWidth}
                    annotationHeight={annotationHeight}
                    bpsPerRow={bpsPerRow}/>
                }
                <HighlightLayer
                    charWidth={charWidth}
                    bpsPerRow={bpsPerRow}
                    row={row}
                    signals={signals}
                    sequenceLength={sequenceLength}
                    selectionLayer={selectionLayer}
                >
                </HighlightLayer>
                <HighlightLayer
                    charWidth={charWidth}
                    bpsPerRow={bpsPerRow}
                    row={row}
                    color={'green'}
                    signals={signals}
                    sequenceLength={sequenceLength}
                    selectionLayer={cutsiteLabelSelectionLayer}
                >
                </HighlightLayer>
                {!selectionLayer.selected && 
                    <Caret 
                        caretPosition={caretPosition} 
                        charWidth={charWidth}
                        row={row}
                        signals={signals}
                        sequenceLength={sequenceLength}
                        shouldBlink={true}
                        />
                }
            </div>
        );
    }
}

RowItem.propTypes = {
    charWidth: PropTypes.number.isRequired,
    selectionLayer: PropTypes.object.isRequired,
    cutsiteLabelSelectionLayer: PropTypes.object.isRequired,
    annotationHeight: PropTypes.number.isRequired,
    tickSpacing: PropTypes.number.isRequired,
    spaceBetweenAnnotations: PropTypes.number.isRequired,
    showFeatures: PropTypes.bool.isRequired,
    showTranslations: PropTypes.bool.isRequired,
    showParts: PropTypes.bool.isRequired,
    showOrfs: PropTypes.bool.isRequired,
    showAxis: PropTypes.bool.isRequired,
    showCutsites: PropTypes.bool.isRequired,
    showReverseSequence: PropTypes.bool.isRequired,
    caretPosition: PropTypes.number.isRequired,
    sequenceLength: PropTypes.number.isRequired,
    bpsPerRow: PropTypes.number.isRequired,
    row: PropTypes.object.isRequired
};

module.exports = RowItem;