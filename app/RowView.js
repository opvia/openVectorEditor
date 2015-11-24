var annotationIntervalTrees = require('./cerebral/computed/annotationIntervalTrees');
import React, {PropTypes} from 'react';
import { propTypes } from './react-props-decorators.js'; //tnrtodo: update this once the actual npm module updates its dependencies
var Draggable = require('react-draggable');
var RowItem = require('./RowItem.js');
var InfiniteScroller = require('react-variable-height-infinite-scroller');
import {Decorator as Cerebral} from 'cerebral-react';

@Cerebral({
    rowViewDimensions: ['rowViewDimensions'],
    rowData: ['rowData'],
    charWidth: ['charWidth'],
    selectionLayer: ['selectionLayer'],
    cutsiteLabelSelectionLayer: ['cutsiteLabelSelectionLayer'],
    annotationHeight: ['annotationHeight'],
    tickSpacing: ['tickSpacing'],
    spaceBetweenAnnotations: ['spaceBetweenAnnotations'],
    showFeatures: ['showFeatures'],
    showTranslations: ['showTranslations'],
    showParts: ['showParts'],
    showOrfs: ['showOrfs'],
    showAxis: ['showAxis'],
    showCutsites: ['showCutsites'],
    showReverseSequence: ['showReverseSequence'],
    caretPosition: ['caretPosition'],
    sequenceLength: ['sequenceLength'],
    bpsPerRow: ['bpsPerRow'],
    sequenceData: ['sequenceData'],
    //computed data:
    // featureIntervalTree: annotationIntervalTrees('features'),
    // cutsiteIntervalTree: annotationIntervalTrees('cutsites'),
    // translationIntervalTree: annotationIntervalTrees('translations'),
    // partIntervalTree: annotationIntervalTrees('parts'),
})
@propTypes({
    rowViewDimensions: PropTypes.object.isRequired,
    rowData: PropTypes.array.isRequired,
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
})
class RowView extends React.Component {
    getNearestCursorPositionToMouseEvent(event, callback) {
        var rowNotFound = true;
        var visibleRowsContainer = this.refs.InfiniteScroller.getVisibleRowsContainerDomNode();
        //loop through all the rendered rows to see if the click event lands in one of them
        var nearestBP = 0;
        for (var relativeRowNumber = 0; relativeRowNumber < visibleRowsContainer.childNodes.length; relativeRowNumber++) {
            var rowDomNode = visibleRowsContainer.childNodes[relativeRowNumber];
            var boundingRowRect = rowDomNode.getBoundingClientRect();
            // console.log('boundingRowRect.top', JSON.stringify(boundingRowRect.top,null,4));
            // console.log('boundingRowRect.height', JSON.stringify(boundingRowRect.height,null,4));
            if (event.clientY > boundingRowRect.top && event.clientY < boundingRowRect.top + boundingRowRect.height) {
                //then the click is falls within this row
                // console.log('HGGGG');
                rowNotFound = false;
                var rowNumber = this.refs.InfiniteScroller.state.visibleRows[relativeRowNumber];
                var row = this.props.rowData[rowNumber];
                if (event.clientX - boundingRowRect.left < 0) {
                    nearestBP = row.start;
                } else {
                    var clickXPositionRelativeToRowContainer = event.clientX - boundingRowRect.left;
                    var numberOfBPsInFromRowStart = Math.floor((clickXPositionRelativeToRowContainer + this.props.charWidth / 2) / this.props.charWidth);
                    nearestBP = numberOfBPsInFromRowStart + row.start;
                    if (nearestBP > row.end + 1) {
                        nearestBP = row.end + 1;
                    }
                }
                break; //break the for loop early because we found the row the click event landed in
            }
        }
        if (rowNotFound) {
            console.warn('was not able to find the correct row');
            //return the last bp index in the rendered rows
            var lastOfRenderedRowsNumber = this.refs.InfiniteScroller.state.visibleRows[this.refs.InfiniteScroller.state.visibleRows.length - 1];
            var lastOfRenderedRows = this.props.rowData[lastOfRenderedRowsNumber];
            nearestBP = lastOfRenderedRows.end
        }
        callback({
            shiftHeld: event.shiftKey,
            nearestBP,
            caretGrabbed: event.target.className === "cursor"
        });
    }

    render() {
        var self = this;
        function renderRows(rowNumber) {
            if (self.props.rowData[rowNumber]) {
                self.props.sequenceData.features
                return (<RowItem
                    charWidth={self.props.charWidth}
                    selectionLayer={self.props.selectionLayer}
                    cutsiteLabelSelectionLayer={self.props.cutsiteLabelSelectionLayer}
                    annotationHeight={self.props.annotationHeight}
                    tickSpacing={self.props.tickSpacing}
                    spaceBetweenAnnotations={self.props.spaceBetweenAnnotations}
                    showFeatures={self.props.showFeatures}
                    showTranslations={self.props.showTranslations}
                    showParts={self.props.showParts}
                    showOrfs={self.props.showOrfs}
                    showAxis={self.props.showAxis}
                    showCutsites={self.props.showCutsites}
                    showReverseSequence={self.props.showReverseSequence}
                    caretPosition={self.props.caretPosition}
                    sequenceLength={self.props.sequenceLength}
                    bpsPerRow={self.props.bpsPerRow}
                    sequenceData={self.props.sequenceData}
                    signals={self.props.signals}
                    // featureIntervalTree={self.props.featureIntervalTree}
                    // partIntervalTree={self.props.partIntervalTree}
                    key={rowNumber}
                    row={self.props.rowData[rowNumber]} 
                    />);
            } else {
                return null
            }
        }

        var rowViewStyle = {
            height: self.props.rowViewDimensions.height,
            width: self.props.rowViewDimensions.width,
            //   overflowY: "scroll",
            // float: "left",
            // paddingRight: "20px"
            //   padding: 10
        };
        // console.log('rowData: ' + JSON.stringify(rowData,null,4));
        return (
            <Draggable
            bounds={{top: 0, left: 0, right: 0, bottom: 0}}
            onDrag={(event) => {
                this.getNearestCursorPositionToMouseEvent(event, self.props.signals.editorDragged)}   
            }
            onStart={(event) => {
                this.getNearestCursorPositionToMouseEvent(event, self.props.signals.editorDragStarted)}   
            }
            onStop={self.props.signals.editorDragStopped}
            >
              <div
                ref="rowView"
                className="rowView"
                style={rowViewStyle}
                onClick={(event) => {
                    this.getNearestCursorPositionToMouseEvent(event, self.props.signals.editorClicked)}   
                }
                >
                <InfiniteScroller
                    ref={'InfiniteScroller'}
                    averageElementHeight={100}
                    containerHeight={self.props.rowViewDimensions.height}
                    renderRow={renderRows}
                    totalNumberOfRows={self.props.rowData.length}
                    rowToJumpTo={self.props.rowToJumpTo}
                    /> 
              </div>
            </Draggable>
        );
    }
}

module.exports = RowView;