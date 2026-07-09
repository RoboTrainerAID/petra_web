import React from "react";
import {Link, Route, Switch, useLocation} from "react-router-dom";
import {useTranslation} from "react-i18next";

//Styling
//Components
import {AppBar, IconButton, makeStyles, Toolbar, Typography} from "@material-ui/core";

//Icons&Images
import {BiLogOut} from "react-icons/bi";
import Logo from "./Logo";
import Clock from "./Clock";
import LanguageSwitcher from "./LanguageSwitcher";


const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    bar: {
        backgroundColor: '#93bae2',
    },
    menuButton: {
        marginRight: theme.spacing(2),
        paddingTop: 0,
        paddingBottom: 0,
    },
    title: {
        '@media (max-width: 767px)': {
            fontSize: '18px',
            marginLeft: '-17px',
        }
    },
    time: {
        marginRight: '35px',
        '@media (max-width: 767px)': {
            display: "none !important",
        },
        '@media (orientation: portrait)': {
            display: "none !important",
        },
    },
    logindiv: {
        textAlign: 'center',
        display: 'block',
        color: 'white',
        fontSize: 15,
        marginRight: 30,
        '@media (max-width: 767px)': {
            marginRight: 0,
        }
    },
    login: {
        fontSize: 30,
        '@media (max-width: 767px)': {
            marginRight: 0,
            fontSize: 30,
        }
    },
    logintext: {
        '@media (max-width: 767px)': {
            display: "none !important",
        }
    },
    sectionDesktop: {
        display: 'flex',
        alignItems: 'center',
    },
}));


export default function HeaderEmployee({setOpen}) {
    const classes = useStyles();
    const {t} = useTranslation();
    let {pathname} = useLocation();

    if (pathname !== '/home-employee' && pathname !== '/home-employee/translation' && pathname !== '/home-employee/navigation' && pathname !== '/home-employee/newtransport' && pathname !== '/home-employee/showtransports') return null;

    function onButtonClick(open) {
        setOpen(open);
        localStorage.clear();
    }

    const routes = [
        {
            path: "/",
            exact: true,
            header: () => <div>{t('header_navigation_home')}</div>
        },
        {
            path: "/navigation",
            exact: true,
            header: () => <div>{t('header_navigation_navigation')}</div>
        },
        {
            path: "/translation",
            exact: true,
            header: () => <div>{t('header_navigation_translation')}</div>
        },
        {
            path: "/entertainment",
            exact: true,
            header: () => <div>{t('header_navigation_entertainment')}</div>
        },
        {
            path: "/entertainment/media",
            exact: true,
            header: () => <div>{t('header_navigation_medialibrary')}</div>
        },
        {
            path: "/info",
            exact: true,
            header: () => <div>{t('header_navigation_info')}</div>
        },
        {
            path: "/login",
            exact: true,
            header: () => <div>{t('header_navigation_login')}</div>
        },
        {
            path: "/home-employee",
            exact: true,
            header: () => <div>{t('header_navigation_home')}</div>
        },
        {
            path: "/home-employee/translation",
            exact: true,
            header: () => <div>{t('header_navigation_translation')}</div>
        },
        {
            path: "/home-employee/newtransport",
            exact: true,
            header: () => <div>{t('header_navigation_newtransport')}</div>
        },
        {
            path: "/home-employee/showtransports",
            exact: true,
            header: () => <div>{t('header_navigation_showtransports')}</div>
        },
    ]
    return (
            <AppBar position="static" className={classes.bar}>
                <Toolbar>
                    <Link to="/home-employee/showtransports">
                        <IconButton
                            edge="start"
                            className={classes.menuButton}>
                            <Logo/>
                        </IconButton>
                    </Link>
                    <Typography variant="h5" noWrap className={classes.title}>
                        <Switch>
                            {routes.map((route, index) => (
                                <Route
                                    key={index}
                                    path={route.path}
                                    exact={route.exact}
                                    children={<route.header/>}
                                />
                            ))}
                        </Switch>
                    </Typography>
                    <div className={classes.grow}/>
                    <div className={classes.sectionDesktop}>
                        <Typography className={classes.time}>
                            <Clock/>
                        </Typography>
                        <Link to="/">
                            <div className={classes.logindiv} onClick={() => onButtonClick(true)}>
                                <BiLogOut className={classes.login}/>
                                <div className={classes.logintext}>{t('header_logout_topatientview')}</div>
                            </div>
                        </Link>
                        <LanguageSwitcher/>
                    </div>
                </Toolbar>
            </AppBar>
    );
}

