import React from "react";
import {useLocation} from "react-router-dom";

//Styling
import {AppBar, Fab, IconButton, makeStyles, Toolbar} from "@material-ui/core";

//Icson&Images
import MicIcon from '@material-ui/icons/Mic';
import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';

//Components
import {EmergencyButton} from "./EmergencyButton";
import {BackButtonThatHides} from "./BackButtonThatHides";
import {Fullscreen} from "@material-ui/icons";


const useStyles = makeStyles(() => ({
    appBar: {
        top: 'auto',
        bottom: 0,
        height: "5rem",
        backgroundColor: '#93bae2',
        zIndex: 20,
        '@media (max-width: 767px)': {
            display: "none !important",
        }
    },
    grow: {
        flexGrow: 1,
    },
    talkButton: {
        backgroundColor: '#007bff',
        position: 'absolute',
        zIndex: 21,
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
    fabProgress: {
        zIndex: 20,
        position: 'absolute',
        bottom: 8,
        left: 869,
        right: 0,
    },
    soundIcon: {
        fontSize: 35,
        color: 'white'
    },
    fullscreenButton: {
        width: "3rem",
        height: "3rem",
        aspectRatio: 1,
    }
}));


export default function FooterPatient({ triggerEmergency, showEmergencyButton, toggleFullscreen, isFullscreen }) {
    const classes = useStyles();
    let {pathname} = useLocation();

    if (pathname !== '/' && pathname !== '/navigation' && pathname !== '/questionnaire' && pathname !== '/translation' && pathname !== '/entertainment' && pathname !== '/entertainment/media' && pathname !== '/entertainment/news' && pathname !== '/entertainment/games') return null;

    return (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="back button">
                    <BackButtonThatHides/>
                </IconButton>
                <Fab aria-label="volume up" className={[classes.vdownButton, "step3"]}>
                    <VolumeDownIcon className={classes.soundIcon}/>
                </Fab>
                <Fab aria-label="volume down" className={classes.vupButton}>
                    <VolumeUpIcon className={classes.soundIcon}/>
                </Fab>
                <Fab aria-label="voice input" className={[classes.talkButton, "step2"]}>
                    <MicIcon className={classes.soundIcon}/>
                </Fab>
                <div className={classes.grow}/>
                {showEmergencyButton && <IconButton className="step4">
                    <EmergencyButton triggerEmergency={triggerEmergency}/>
                </IconButton>}
                {!isFullscreen && <IconButton onClick={toggleFullscreen}>
                    <Fullscreen className={classes.fullscreenButton}/>
                </IconButton>}
            </Toolbar>
        </AppBar>
    );
}
