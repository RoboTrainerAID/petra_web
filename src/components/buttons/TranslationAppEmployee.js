import React from "react";
import {useTranslation} from "react-i18next";

//Styling
import "./ButtonApp.css";
import {makeStyles} from "@material-ui/core";

//Icons&Images
import TranslateIcon from '@material-ui/icons/Translate';

//Components
import {Button} from "react-bootstrap";
import {Link} from "react-router-dom";
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


export default function TranslationAppEmployee() {
    const {t} = useTranslation();
    const classes = useStyles();

    return (
        <Link to="/home-employee/translation">
            <div className="app">
                <Button className="app-button app-mobile" variant="primary">
                    <p><TranslateIcon className={classes.appIcon}/></p>
                </Button>
                <br/>
                <p className="app-text">{t('home_patient_app_translation')}</p>
            </div>
        </Link>
    );
}
