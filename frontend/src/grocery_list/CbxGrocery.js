import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';


const GreenCheckbox = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);

export default GreenCheckbox;
