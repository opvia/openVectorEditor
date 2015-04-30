var React = require('react');
var RowItem = require('./RowItem');
var appActions = require('./actions/appActions');
// var InfiniteScrollContainer = require('./InfiniteScrollContainer');
var prepareRowData = require('./prepareRowData');
var CHAR_WIDTH = require('./editorConstants').CHAR_WIDTH;
// var ReactList = require('react-list');

var RowView = React.createClass({
  propTypes: {
    preloadBasepairStart: React.PropTypes.number.isRequired,
    viewportDimensions: React.PropTypes.object.isRequired,
  },
  // getDefaultProps: function() {
  //   return {
  //     preloadBasepairStart: 150, //start the loading of the sequence with this basepair
  //     viewportDimensions: {
  //       height: 700,
  //       width: 400
  //     },
  //   };
  // }, 
  onScroll: function (event) {
    var infiniteContainer = event.currentTarget;
    // var scrollTop = infiniteContainer.scrollTop;
    // this.setState({
    //   oldScrollTop: scrollTop
    // })
    // if (scrollTop > this.state.oldScrollTop) {
    //   var scrollDirection = "up";
    //   console.log('up');
    // } else {
    //   var scrollDirection = "down";
    //   console.log('down'); 
    // } 

    var totalHeightOfInfiniteContainer = infiniteContainer.scollHeight; //equals the total height of container
    // console.log(totalHeightOfInfiniteContainer); 



    //determine if we're scrolling into new territory
    //below:

    //scrollHeight 
    var topSpacer = event.currentTarget.children[0];
    var totalChildCount = event.currentTarget.childElementCount;
    var bottomSpacer = event.currentTarget.children[(totalChildCount-1)];

    var newStartingRowBasedOnPercentageScrolled = Math.floor(this.state.totalRows * (1 - (infiniteContainer.scrollHeight - infiniteContainer.scrollTop)/infiniteContainer.scrollHeight))

    if (infiniteContainer.scrollTop - topSpacer.scrollHeight < 100) {
      if (this.state.preloadRowStart > 0) {
        console.log('hit');
        if (newStartingRowBasedOnPercentageScrolled < (this.state.preloadRowStart - 10)) {
          var newRowStart = newStartingRowBasedOnPercentageScrolled;
          console.log('newStartingRowBasedOnPercentageScrolled');
        } else {
          var newRowStart = (this.state.preloadRowStart - 10) > 0 ? (this.state.preloadRowStart - 10) : 0;
        }
        // var newRowStart = Math.floor(this.state.totalRows * (1 - (infiniteContainer.scrollHeight - infiniteContainer.scrollTop)/infiniteContainer.scrollHeight))
        console.log(newRowStart);

        this.prepareVisibleRows(newRowStart); 
      }
      //we're less than 100 pixels away from hitting the top spacer
      // console.log("top true");

      // appActions.loadRowsAbove()
    } 

    // console.log(infiniteContainer.scrollTop);
    // console.log(bottomSpacer.offsetTop); 

    if (bottomSpacer.offsetTop - infiniteContainer.clientHeight - infiniteContainer.scrollTop < 100) {
      if (this.state.totalRows - (this.state.preloadRowStart + this.state.rowsThatFitIntoViewport) > 0) {
        if (newStartingRowBasedOnPercentageScrolled > (this.state.preloadRowStart + 30)) {
          var newRowStart = newStartingRowBasedOnPercentageScrolled;
          console.log('newStartingRowBasedOnPercentageScrolled');
        } else {
          // var newRowStart = Math.floor(this.state.totalRows * (1 - (infiniteContainer.scrollHeight - infiniteContainer.scrollTop)/infiniteContainer.scrollHeight))
          var newRowStart = (this.state.preloadRowStart + 10) < this.state.totalRows ? (this.state.preloadRowStart + 10) : this.state.totalRows;
        }
        // console.log('hit');
        // console.log(newRowStart);
        this.prepareVisibleRows(newRowStart);
      }
    } 

    // console.log('bottomSpacer.offsetTop');
    // console.log(bottomSpacer.offsetTop);
     // console.log(bottomSpacer);
    // console.log(event.currentTarget.scrollBottom);

  },
  componentWillMount: function (argument) {
    var {preloadRowStart, preloadBasepairStart, viewportDimensions, sequenceData, ...other} = this.props;
    // this.setState({
    //   visibleRowStart: preloadRowStart,
    // });
    this.prepareVisibleRows(preloadRowStart);
  },

  componentDidMount: function (argument) {
    //tnr, instead of finding the dom nodes and performing calculations, we can add 
    //a variable to the state/props to determine if we need to scroll down
    var infiniteContainer = React.findDOMNode(this.refs.infiniteContainer);
    var heightOfTopSpacer = React.findDOMNode(this.refs.topSpacer).scrollHeight;
    if (heightOfTopSpacer > 0) {
      var thirdRowElement = infiniteContainer.children[3].scrollIntoView();
    }
  },

  prepareVisibleRows: function (preloadRowStart) {
    // var {preloadRowStart, preloadBasepairStart, viewportDimensions, sequenceData, ...other} = this.props; //start the loading of the sequence with this basepair
    var {viewportDimensions, sequenceData, ...other} = this.props; //start the loading of the sequence with this basepair

    var averageRowHeight = 100;

    //prepare the infinite container dimension
    var rowLength = Math.floor(viewportDimensions.width / CHAR_WIDTH);
    var totalRows = Math.ceil(sequenceData.sequence.length / rowLength);
    // var preloadRowStart = this.state.preloadRowStart;
    // var preloadRowStart = (Math.floor(preloadBasepairStart / rowLength) - 3) > 0 ? Math.floor(preloadBasepairStart / rowLength) - 3 : 0; //get three below the top row if possible //start the loading of the sequence with this basepair
    var rowsThatFitIntoViewport = Math.ceil(viewportDimensions.height / averageRowHeight);
    console.log('rowsThatFitIntoViewport');
    console.log(rowsThatFitIntoViewport);
    // var numberOfRowsToDisplay = (preloadRowStart + rowsThatFitIntoViewport + 3) < totalRows ? preloadRowStart + rowsThatFitIntoViewport + 3 : totalRows;
    var numberOfRowsToDisplay = rowsThatFitIntoViewport + 25;

    var preloadRowEnd = (preloadRowStart + numberOfRowsToDisplay) < totalRows ? (preloadRowStart + numberOfRowsToDisplay) : totalRows; 

    //calculate topSpacer height
    var topSpacerHeight = preloadRowStart*averageRowHeight;

    //calculate bottom spacer height
    var bottomSpacerHeight = (totalRows - preloadRowEnd)*averageRowHeight;

    //calculate the visible rows
    //tnr: pass any already prepared rows into this function so we don't have to recalculate them
    var visibleRows = prepareRowData(sequenceData, preloadRowStart, preloadRowEnd, rowLength, this.alreadyPreparedRows); //this function also pushes any newly calculated rows onto the this.alreadyPreparedRows object

    this.setState({
      preloadRowStart: preloadRowStart,
      visibleRows: visibleRows,
      totalRows: totalRows,
      rowLength: rowLength,
      rowsThatFitIntoViewport: rowsThatFitIntoViewport,
      topSpacerHeight: topSpacerHeight,
      bottomSpacerHeight: bottomSpacerHeight,
    });
  },

  render: function () {
    var {preloadRowStart, preloadBasepairStart, viewportDimensions, sequenceData, ...other} = this.props; //start the loading of the sequence with this basepair
    
    // console.log('rows');
    // console.log(rows); 
    var self = this;
    var rowItems = this.state.visibleRows.map(function(row) {
      if (row) {
        return(<RowItem key={row.rowNumber} {...other} row={row} rowLength={self.state.rowLength}  />);
      }
    });
    // var rowItemHeights = [];

    // rowItems.forEach(function(){
    //   rowItemHeights.push(100);
    // }); 

    var style = {
      height:viewportDimensions.height,
      width: viewportDimensions.width,
      overflowY: "scroll"
    };

    

    return (
      <div>
        <input> 
          hey
        </input>
        <button onClick={appActions.changeViewportSize.bind(null,{height: 300, width: 600})}> 
        yoo
        </button>
        SequenceEditor2
        <div ref="infiniteContainer" className="infiniteContainer" style={style} onScroll={this.onScroll}>
            <div ref="topSpacer" className="topSpacer" style={{height: this.state.topSpacerHeight}}/>
            {rowItems}
            <div className="bottomSpacer" style={{height: this.state.bottomSpacerHeight}}/> 
        </div>
      </div>
    );
  }
});

module.exports = RowView;
