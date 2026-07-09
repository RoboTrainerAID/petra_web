import React from "react";
import {useLocation} from "react-router-dom";

//Styling
import {AppBar, Fab, IconButton, makeStyles, Toolbar} from "@material-ui/core";

//Icons&Images
import MicIcon from '@material-ui/icons/Mic';
import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';

//Components
import {BackButtonThatHides} from "./BackButtonThatHides";


const useStyles = makeStyles(() => ({
    appBar: {
        height: '5.3em',
        top: 'auto',
        bottom: 0,
        zIndex: 20,
        backgroundColor: '#93bae2',
        '@media (max-width: 767px)': {
            display: "none !important",
        },
        '@media (max-width: 813px) and (max-height: 415px)': {
            display: "none !important",
        },
        '@media (min-width: 1281px)': {
            display: "none !important",
        }
    },
    grow: {
        flexGrow: 1,
    },
    talkButton: {
        backgroundColor: '#007bff',
        position: 'absolute',
        zIndex: 1,
        top: -30,
        left: 0,
        right: 0,
        margin: '0 auto',
        height: 100,
        width: 100,
        '&:active': {
            backgroundColor: '#0d47a1',
        },
    },
    vdownButton: {
        backgroundColor: '#007bff',
        position: 'fixed',
        bottom: 13,
        left: -480,
        right: 0,
        margin: '0 auto',
        height: 60,
        width: 60,
        '&:active': {
            backgroundColor: '#0d47a1',
        },
        '@media (orientation: portrait)': {
            display: "none !important",
        }
    },
    vupButton: {
        backgroundColor: '#007bff',
        position: 'fixed',
        bottom: 13,
        left: -280,
        right: 0,
        margin: '0 auto',
        height: 60,
        width: 60,
        '&:active': {
            backgroundColor: '#0d47a1',
        },
        '@media (max-width: 767px)': {
            display: "none !important",
        },
        '@media (orientation: portrait)': {
            display: "none !important",
        },
    },
    soundIcon: {
        fontSize: 35,
        color: 'white'
    },
}));


export default function FooterEmployee() {
    const classes = useStyles();
    let {pathname} = useLocation();

    if (pathname !== '/home-employee' && pathname !== '/home-employee/translation' && pathname !== '/home-employee/navigation' && pathname !== '/home-employee/newtransport' && pathname !== '/home-employee/showtransports') return null;

    return (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="back button">
                    <BackButtonThatHides/>
                </IconButton>
                <Fab aria-label="volume up" className={classes.vdownButton}>
                    <VolumeDownIcon className={classes.soundIcon}/>
                </Fab>
                <Fab aria-label="volume down" className={classes.vupButton}>
                    <VolumeUpIcon className={classes.soundIcon}/>
                </Fab>
                <Fab aria-label="voice input" className={classes.talkButton}>
                    <MicIcon className={classes.soundIcon}/>
                </Fab>
            </Toolbar>
        </AppBar>
    );
}
