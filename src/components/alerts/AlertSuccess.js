import React from 'react';
import {useLocation} from "react-router-dom";

//Styling
import {makeStyles} from '@material-ui/core/styles';

//Components
import Snackbar from '@material-ui/core/Snackbar';
import {Alert} from "@material-ui/lab";


const useStyles = makeStyles(() => ({
    alert: {
        width: '280px',
        '@media (max-width: 767px) and (orientation: portrait)': {
            width: '100vw',
        },
    },
    anchorOriginTopRight: {
        top: '15%',
        zIndex: "20",
        '@media (max-width: 767px) and (orientation: portrait)': {
            top: 'calc(100vh*(1/11))',
        },
        '@media (min-width: 767px) and (orientation: portrait)': {
            top: 'calc(100vh*(1/14))',
        },
        '@media (max-width: 814px) and (orientation: landscape)': {
            top: 'calc(100vh*(1/5))',
        }
    },
}));


export default function AlertSuccess({successOpen, setSuccessOpen}) {
    const classes = useStyles();
    let {pathname} = useLocation();

    if (pathname !== '/home-employee/newtransport') return null;

    function handleClose() {
        setSuccessOpen(false);
    }

    return (
        <Snackbar
            open={successOpen}
            onClose={handleClose}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            autoHideDuration={5500}
            className={classes.anchorOriginTopRight}>
            <Alert
                variant="filled"
                elevation={3}
                severity="success"
                className={classes.alert}>
                <strong>Transport wurde aufgegeben</strong>
            </Alert>
        </Snackbar>
    );
}