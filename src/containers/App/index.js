import 'inert-polyfill';
import React from 'react'
import { connect } from 'react-redux'
import './style' //local styles
import '../../styles/core'; //global styles
import '../../styles/fonts'; //fonts need to be loaded separately as css
import DesignPage from '../DesignPage';
// import ResultsPage from '../ResultsPage';

export class App extends React.Component {
  render () {
    var {currentPage} = this.props;
    return (
      <div className='container text-center'>
        {currentPage === 'DesignPage' && <DesignPage/>}
        {/*currentPage === 'ResultsPage' && <ResultsPage/>*/}
      </div>
    )
  }
}

export default connect(
(state) => {
  return {
    currentPage: state.currentPage
  }
}, 
)(App)
