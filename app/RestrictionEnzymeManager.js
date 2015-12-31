import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-react';
import { propTypes } from './react-props-decorators.js'; //tnrtodo: update this once the actual npm module updates its dependencies
import Table from 'reactable' // the reactable stuff we need here

@Cerebral({
	userEnzymeList:
})

@propTypes({

})
React.renderComponent(
    <Table className="table" data={[
        { Name: 'Griffin Smith', Age: 18 },
        { Age: 23,  Name: 'Lee Salminen' },
        { Age: 28, Position: 'Developer' },
    ]} />,
    document.getElementById('table')
);