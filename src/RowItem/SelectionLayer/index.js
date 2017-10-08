import draggableClassnames from "../../constants/draggableClassnames";
import PropTypes from "prop-types";
import React from "react";
import Caret from "../Caret";

import "./style.css";

import getXStartAndWidthOfRangeWrtRow from "../getXStartAndWidthOfRangeWrtRow";
import getOverlapsOfPotentiallyCircularRanges
  from "ve-range-utils/getOverlapsOfPotentiallyCircularRanges";

function SelectionLayer(props) {
  let {
    charWidth,
    bpsPerRow,
    row,
    sequenceLength,
    regions,
    hideCarets = false,
    selectionLayerRightClicked,
    className: globalClassname = ""
  } = props;
  return (
    <div>
      {regions.map(function(selectionLayer, index) {
        let { className = "", style = {}, start, end, color } = selectionLayer;
        let classNameToPass =
          "veRowViewSelectionLayer " +
          className +
          " " +
          className +
          " " +
          globalClassname;
        if (start > -1) {
          let overlaps = getOverlapsOfPotentiallyCircularRanges(
            selectionLayer,
            row,
            sequenceLength
          );
          //DRAW SELECTION LAYER

          return overlaps.map(function(overlap, index) {
            let isTrueStart = false;
            let isTrueEnd = false;
            if (overlap.start === selectionLayer.start) {
              isTrueStart = true;
            }
            if (overlap.end === selectionLayer.end) {
              isTrueEnd = true;
            }
            let { xStart, width } = getXStartAndWidthOfRangeWrtRow(
              overlap,
              row,
              bpsPerRow,
              charWidth,
              sequenceLength
            );
            let caretSvgs = [];
            if (!hideCarets) {
              //DRAW CARETS
              caretSvgs = [
                overlap.start === start &&
                  <Caret
                    {...{
                      charWidth,
                      row,
                      sequenceLength,
                      className: classNameToPass +
                        " " +
                        draggableClassnames.selectionStart,
                      caretPosition: overlap.start
                    }}
                  />,
                overlap.end === end &&
                  <Caret
                    {...{
                      charWidth,
                      row,
                      sequenceLength,
                      className: classNameToPass +
                        " " +
                        draggableClassnames.selectionEnd,
                      caretPosition: overlap.end + 1
                    }}
                  />
              ];
            }
            return [
              <div
                onContextMenu={function(event) {
                  selectionLayerRightClicked({
                    event,
                    annotation: selectionLayer
                  });
                }}
                key={index}
                className={
                  classNameToPass +
                    (isTrueStart ? " isTrueStart " : "") +
                    (isTrueEnd ? " isTrueEnd " : "")
                }
                style={{
                  width,
                  left: xStart,
                  ...style,
                  background: color
                }}
              />,
              ...caretSvgs
            ];
          });
        }
      })}
    </div>
  );
}

export default SelectionLayer;