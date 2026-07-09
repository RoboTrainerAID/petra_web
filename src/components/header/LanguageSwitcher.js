import {useTranslation} from "react-i18next";
import React from "react";

//Styling
import {makeStyles} from '@material-ui/core/styles';

//Icons&Images
import german from "../../assets/flag_german.png";
import english from "../../assets/flag_english.png";
import french from "../../assets/flag_french.png";
import croatian from "../../assets/flag_croatian.png";
import russian from "../../assets/flag_russian.png";
import turkish from "../../assets/flag_turkish.png";

//Components
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InfoTourTargets from "../../pages/info/InfoTourTargets";


const useStyles = makeStyles({
    root: {
        paddingTop: "11px",
        paddingBottom: "12.5px",
        height: "33px",
    },
    language: {
        '@media (max-width: 767px)': {
            display: "none !important",
        },
    },
});

export default function LanguageSwitcher() {
    const classes = useStyles();
    const {i18n} = useTranslation();

    return (
        <FormControl variant="outlined" className={[classes.language, InfoTourTargets.PETRA_LANGUAGE_SELECTOR.css]}>
            <Select
                displayEmpty
                value={i18n.language}
                classes={{
                    root: classes.root,
                }}
                MenuProps={{
                    style: { zIndex: 1000000 }
                }}

                onChange={(e) =>
                    i18n.changeLanguage(e.target.value)}>
                <MenuItem value="de">
                    <div><img src={german} width={"55px"} height={"35px"} alt="De"/></div>
                </MenuItem>
                <MenuItem value="en">
                    <div><img src={english} width={"55px"} height={"35px"} alt="En"/></div>
                </MenuItem>
                <MenuItem value="fr">
                    <div><img src={french} width={"55px"} height={"35px"} alt="Fr"/></div>
                </MenuItem>
                <MenuItem value="cr">
                    <div><img src={croatian} width={"55px"} height={"35px"} alt="Cr"/></div>
                </MenuItem>
                <MenuItem value="ru">
                    <div><img src={russian} width={"55px"} height={"35px"} alt="Ru"/></div>
                </MenuItem>
                <MenuItem value="tu">
                    <div><img src={turkish} width={"55px"} height={"35px"} alt="Tu"/></div>
                </MenuItem>
            </Select>
        </FormControl>
    );
}



