import React from 'react';
import {Link, useLocation} from "react-router-dom";

//Styling
import {makeStyles} from '@material-ui/core/styles';

//Icons&Images
import {BiLogOut} from "react-icons/bi";

//Components
import Snackbar from '@material-ui/core/Snackbar';
import {Alert} from "@material-ui/lab";


const useStyles = makeStyles((theme) => ({
    alert: {
        width: '280px',
        '@media (max-width: 767px) and (orientation: portrait)': {
            width: '100vw',
        },
    },
    anchorOriginTopRight: {
        position: 'absolute',
        top: '9%',
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
    link: {
        color: "white",
        display: 'flex',
        justifyContent: 'top',
    },
}));


export default function AlertLogin({setOpen}) {
    const classes = useStyles();
    const username = localStorage.getItem('username');
    let {pathname} = useLocation();

    if (pathname !== '/home-employee' && pathname !== '/home-employee/translation' && pathname !== '/home-employee/navigation' && pathname !== '/home-employee/newtransport' && pathname !== '/home-employee/showtransports') return null;

    function onButtonClick(open) {
        setOpen(open);
        localStorage.clear();
    }

    return (
        <Snackbar
            open="true"
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            className={classes.anchorOriginTopRight}>
            <Alert
                icon={<Link className={classes.link} to="/"><BiLogOut onClick={() => onButtonClick(true)}/></Link>}
                variant="filled"
                elevation={3} severity="info"
                className={classes.alert}>
                <strong>Eingeloggt als: </strong>{username}
            </Alert>
        </Snackbar>
    );
}