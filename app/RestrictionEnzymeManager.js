import React, {PropTypes} from 'react';
import enzymeList from '../app/ve-sequence-utils/enzymeList.json'
import {Decorator as Cerebral} from 'cerebral-react';
import { propTypes } from './react-props-decorators.js'; //tnrtodo: update this once the actual npm module updates its dependencies

@Cerebral({
    userEnzymeList: ['userEnzymeList']

})

@propTypes({
    userEnzymeList: propTypes.object
})

class RestrictionEnzymeManager extends React.Component {
    render() {
        var data = JSON.stringify(enzymeList)
        return (
            <p> 
                {'' + data}
            </p>
        );
    }
}

module.exports = RestrictionEnzymeManager