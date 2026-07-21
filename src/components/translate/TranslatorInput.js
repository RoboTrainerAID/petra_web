import React from "react"
import {useTranslation} from "react-i18next";

//Styling
import {makeStyles} from "@material-ui/core/styles";

//Icons&Images
import german from "../../assets/flag_german.png";
import english from "../../assets/flag_english.png";
import french from "../../assets/flag_french.png";
import croatian from "../../assets/flag_croatian.png";
import ukraine from "../../assets/flag_ukraine.png";
import turkish from "../../assets/flag_turkish.png";

//Components
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";


const useStyles = makeStyles({
    root: {
        paddingTop: "11px",
        paddingBottom: "12.5px",
        height: "33px",
        width: "170px",
        verticalAlign: "middle",
        '@media (max-width: 767px)': {
            paddingTop: "5px",
            paddingBottom: "10px",
            height: "25px",
            width: "145px",
            paddingLeft: "5px",
        }
    },
    language: {
        marginRight: '3vw',
        '@media (max-width: 767px)': {
            marginRight: '1px',
        }
    },
    image: {
        width: "55px",
        height: "35px",
        '@media (max-width: 767px)': {
            height: "30px",
            width: "45px",
        }
    },
    text: {
        marginLeft: "15px",
    }

});

export default function TranslatorInput({language1, setLanguage1}) {
    const classes = useStyles();
    const {t} = useTranslation();


    return (
        <FormControl variant="outlined" className={classes.language}>
            <Select
                value={language1}
                onChange={e => setLanguage1(e.target.value)}
                MenuProps={{
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left"
                    },
                    transformOrigin: {
                        vertical: "top",
                        horizontal: "left"
                    },
                    getContentAnchorEl: null
                }}
                classes={{
                    root: classes.root
                }}>
                <MenuItem value="de">
                    <div>
                        <img src={german} className={classes.image} alt="german"/>
                        <span className={classes.text}>{t('translation_text_german')}</span>
                    </div>
                </MenuItem>
                <MenuItem value="en">
                    <div>
                        <img src={english} className={classes.image} alt="english"/>
                        <span className={classes.text}>{t('translation_text_english')}</span>
                    </div>
                </MenuItem>
                <MenuItem value="fr">
                    <div>
                        <img src={french} className={classes.image} alt="french"/>
                        <span className={classes.text}>{t('translation_text_french')}</span>
                    </div>
                </MenuItem>
                <MenuItem value="cr">
                    <div>
                        <img src={croatian} className={classes.image} alt="croatian"/>
                        <span className={classes.text}>{t('translation_text_croatian')}</span></div>
                </MenuItem>
                <MenuItem value="ua">
                    <div>
                        <img src={ukraine} className={classes.image} alt="ukraine"/>
                        <span className={classes.text}>{t('translation_text_ukrainian')}</span>
                    </div>
                </MenuItem>
                <MenuItem value="tu">
                    <div>
                        <img src={turkish} className={classes.image} alt="turkish"/>
                        <span className={classes.text}>{t('translation_text_turkish')}</span>
                    </div>
                </MenuItem>
            </Select>
        </FormControl>
    );
}

