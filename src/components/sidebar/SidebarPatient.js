import React from 'react';
import {Link, useLocation} from "react-router-dom";

//Styling
import {makeStyles} from '@material-ui/core/styles';

//Icons&Images
import NavigationIcon from "@material-ui/icons/Navigation";
import TranslateIcon from "@material-ui/icons/Translate";
import CasinoIcon from "@material-ui/icons/Casino";

//Components
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import HomeIcon from "@material-ui/icons/Home";


const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
    },
    paper: {
        backgroundColor: '#007bff',
        width: 83,
        height: 320,
        left: -15,
        top: '18%',
        border: 'lightgray 1px solid',
        borderRadius: 16,
        position: '-webkit-sticky',
        overflow: 'hidden',
        animation: '$slideInFromLeft 1000ms',
        '@media (max-width: 767px)': {
            width: 65,
            left: -15,
        },
        '@media (orientation: portrait)': {
            top: '25%',
        }
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

export default function SidebarPatient() {
    const classes = useStyles();
    let {pathname} = useLocation();

    if (pathname !== '/navigation' && pathname !== '/translation' && pathname !== '/entertainment' && pathname !== '/entertainment/news' && pathname !== '/entertainment/games' && pathname !== '/info') return null;


    return (
        <div className={classes.root}>
            <Drawer variant="permanent" classes={{paper: classes.paper}}>
                <Divider/>
                <List>
                    <ListItem className={classes.list}>
                        <Link to="/">
                            <HomeIcon className={classes.icon}/>
                        </Link>
                    </ListItem>
                    <ListItem className={classes.list}>
                        <Link to="/navigation">
                            <NavigationIcon className={classes.icon}/>
                        </Link>
                    </ListItem>
                    <ListItem className={classes.list}>
                        <Link to="/translation">
                            <TranslateIcon className={classes.icon}/>
                        </Link>
                    </ListItem>
                    <ListItem className={classes.list}>
                        <Link to="/entertainment">
                            <CasinoIcon className={classes.icon}/>
                        </Link>
                    </ListItem>
                </List>
            </Drawer>
        </div>
    );
}