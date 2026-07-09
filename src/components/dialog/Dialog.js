import React from "react";
import {useTranslation} from "react-i18next";

//Styling
import {makeStyles} from "@material-ui/core/styles";

//Icons&Images
import face from "../../assets/face_placeholder.png";
import {RiWifiOffLine} from "react-icons/ri";

//Components
import {AppBar, Button, Card} from "@material-ui/core";
import {Route, Switch, useLocation} from "react-router-dom";
import {useTTS} from "../../tts/useTTS";


const useStyles = makeStyles(() => ({
    dialogContainer: {
        top: 'auto',
        bottom: 0,
        height: '260px',
        backgroundColor: 'transparent',
        zIndex: 20,
        '@media (max-width: 767px)': {
            display: "none !important",
        },
    },
    dialogContent: {
        marginTop: '10px',
        marginLeft: '25px',
        marginRight: '25px',
        height: '60%',
        display: 'flex',
        alignItems: 'center',
        '@media (max-width: 767px)': {
            marginRight: '10px',
            marginLeft: '10px',
            height: '60%',
        },
    },
    faceDiv: {
        height: '140px',
        width: '140px',
        border: '1px solid white',
        marginLeft: '8px',
        '@media (max-width: 767px)': {
            height: '100px',
            width: '100px'
        },
    },
    textDiv: {
        fontSize: '22px',
        height: '140px',
        width: '73%',
        marginLeft: '20px',
        marginRight: '20px',
        '@media (max-width: 767px)': {
            fontSize: '15px',
            height: '100px',
            marginLeft: '10px',
            marginRight: '10px',
        },
    },
    connectionIcon: {
        color: 'rgba(0,0,0,0.38)',
        position: 'relative',
        fontSize: 120,
        top: -125,
        left: 10,
        zIndex: 9000,
    }
}));


export default function Dialog(props) {
    const [ hasTTS, speak ] = useTTS();

    const {t} = useTranslation();
    const classes = useStyles();
    let {pathname} = useLocation();

    if (pathname !== '/' && pathname !== '/navigation' && pathname !== '/translation' && pathname !== '/entertainment' && pathname !== '/entertainment/news' && pathname !== '/entertainment/games') return null;

    const routes = [
        {
            path: "/",
            exact: true,
            dialog: () => <span>{t('dialog_home_1')}<br/>{t('dialog_home_2')}</span>
        },
        {
            path: "/navigation",
            exact: true,
            dialog: () => props.start === null ? <span>{t('dialog_navigation_map')}</span> :
                <span>{t('dialog_navigation_transport1')}{props.lastName}{t('dialog_navigation_transport2')}</span>
        },
        {
            path: "/translation",
            exact: true,
            dialog: () => <span>{t('dialog_translation')}</span>
        },
        {
            path: "/entertainment",
            exact: true,
            dialog: () => <span>{t('dialog_entertainment')}</span>
        },
        {
            path: "/entertainment/news",
            exact: true,
            dialog: () => <span>{t('dialog_entertainment_news')}</span>
        },
        {
            path: "/entertainment/games",
            exact: true,
            dialog: () => <span>{t('dialog_entertainment_games')}</span>
        },
        {
            path: "/login",
            exact: true,
            dialog: () => <span>{t('dialog_login')}</span>
        },
    ]


    return (
        <AppBar position="fixed" elevation={0} className={classes.dialogContainer}>
            <Card className={[classes.dialogContent, 'step1']}>
                <div className={classes.faceDiv}>
                    <img src={face} alt="PeTRA face" width={"100%"} height={"100%"}/>
                    {navigator.onLine ? null : <RiWifiOffLine className={classes.connectionIcon}/>}
                </div>
                <div className={classes.textDiv}>
                    <Switch>
                        {routes.map((route, index) => (
                            <Route
                                key={index}
                                path={route.path}
                                exact={route.exact}
                                children={<route.dialog/>}
                            />
                        ))}
                    </Switch>
                </div>
                <Button
                    variant={"contained"}
                    color={"primary"}
                    disabled={!hasTTS}
                    onClick={() => speak(t("dialog_home_1"))}
                >
                    TTS
                </Button>
            </Card>
        </AppBar>
    );
}
