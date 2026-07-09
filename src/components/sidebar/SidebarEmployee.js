import React from 'react';
import {Link, useLocation} from "react-router-dom";

//Styling
import {makeStyles} from '@material-ui/core/styles';

//Icons&Images
import TranslateIcon from "@material-ui/icons/Translate";
import ScheduleIcon from '@material-ui/icons/Schedule'
import HomeIcon from '@material-ui/icons/Home';

//Components
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';


const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
    },
    paper: {
        backgroundColor: '#007bff',
        width: 83,
        height: 255,
        left: -15,
        zIndex: 20,
        border: 'lightgray 1px solid',
        borderRadius: 16,
        position: '-webkit-sticky',
        top: '23%',
        overflow: 'hidden',
        animation: '$slideInFromLeft 1000ms',
        '@media (max-width: 767px)': {
            width: 65,
            left: -15,
        },
        '@media (orientation: portrait)': {
            top: '26%',
        },
        '@media (max-width: 767px) and (orientation:landscape)': {
            display: 'none !important',
        },
    },
    '@keyframes slideInFromLeft': {
        '0%': {
            transform: 'translateX(-100%)'
        },
        '100%': {
            transform: 'translateX(0)'
        },
    },
    list: {
        paddingLeft: 33,
        paddingTop: 23,
        paddingBottom: 20,
        '@media (max-width: 767px)': {
            paddingLeft: 23,
        }
    },
    icon: {
        color: 'white',
        fontSize: 30,
    }
}));

export default function SidebarEmployee() {
    const classes = useStyles();
    let {pathname} = useLocation();

    if (pathname !== '/home-employee/translation' && pathname !== '/home-employee/navigation' && pathname !== '/home-employee/newtransport' && pathname !== '/home-employee/showtransports') return null;


    return (
        <div className={classes.root}>
            <Drawer variant="permanent" classes={{paper: classes.paper}}>
                <Divider/>
                <List>
                    <ListItem className={classes.list}>
                        <Link to="/home-employee">
                            <HomeIcon className={classes.icon}/>
                        </Link>
                    </ListItem>
                    <ListItem className={classes.list}>
                        <Link to="/home-employee/showtransports">
                            <ScheduleIcon className={classes.icon}/>
                        </Link>
                    </ListItem>
                    <ListItem className={classes.list}>
                        <Link to="/home-employee/translation">
                            <TranslateIcon className={classes.icon}/>
                        </Link>
                    </ListItem>
                </List>
            </Drawer>
        </div>
    );
}
