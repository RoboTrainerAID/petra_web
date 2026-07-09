import React from "react";
import {useTranslation} from "react-i18next";

//Styling
import "./ButtonApp.css";
import {makeStyles} from "@material-ui/core";

//Icons&Images
import InfoIcon from '@material-ui/icons/Info';

//Components
import {Button} from "react-bootstrap";
import {APP_ICON_SIZE} from "../../constants/IconConfig";


const useStyles = makeStyles(() => ({
    appIcon: {
        fontSize: APP_ICON_SIZE,
        marginTop: 20,
        '@media (max-width: 767px)': {
            fontSize: 28,
        },
        '@media (max-width: 814px) and (orientation: landscape)': {
            fontSize: 28,
        }
    },
}));


export default function InfoApp({setIsTourOpen}) {
    const {t} = useTranslation();
    const classes = useStyles();

    return (
            <div className="app">
                <Button className="app-button app-mobile" variant="primary" onClick={() => setIsTourOpen(true)}>
                    <p><InfoIcon className={classes.appIcon}/></p>
                </Button>
                <br/>
                <p className="app-text">{t('home_patient_app_info')}</p>
            </div>
    );
}
