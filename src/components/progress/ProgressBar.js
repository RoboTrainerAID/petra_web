import React from 'react';

//Styling
import {makeStyles, withStyles} from '@material-ui/core/styles';

//Components
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';


const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 15,
        borderRadius: 5,
    },
    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
        borderRadius: 5,
        backgroundColor: '#1a90ff',
    },
}))(ProgressBarWithLabel);

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});


function ProgressBarWithLabel(props) {
    return (
        <Box display="flex" alignItems="center" marginTop="7px">
            <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
        </Box>
    );
}

export default function ProgressBar({duration, remaining}) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <BorderLinearProgress variant="determinate" value={(1 - remaining / duration) * 100}/>
        </div>
    );
}
