import React, {useState} from "react";

//Styling
import {makeStyles} from '@material-ui/core/styles';

//Components
import {Container, Grid} from '@material-ui/core';
import NavigationApp from "../../components/buttons/NavigationApp";
import TranslationAppPatient from "../../components/buttons/TranslationAppPatient";
import QuestionnaireApp from "../../components/buttons/QuestionnaireApp";
import {PetraTextDialog} from "../../components/dialog/PetraTextDialog";
import {useTranslation} from "react-i18next";
import InfoTourTargets from "../info/InfoTourTargets";
import {HomeTour} from "./HomeTour";


const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: 'center',
        maxWidth: '60em',
        '@media (max-width: 767px)': {
            width: '85%',
        },
    },
    item: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
}))


export default function HomePatient({transport}) {
    const { t } = useTranslation();
    const classes = useStyles();

    const [ showTour, setShowTour ] = useState();

    return (
        <>
            <HomeTour transport={transport} show={showTour} onClose={() => setShowTour(false)}/>
            <Container className={[classes.root, "step5"]}>
                <Grid container justify="flex-start" direction="row" spacing="1">
                    <Grid item sm={6} md={6} className={[classes.item, InfoTourTargets.APP_NAVIGATION.css]}>
                        <NavigationApp/>
                    </Grid>
                    <Grid item sm={6} md={6} className={[classes.item, InfoTourTargets.APP_QUESTIONNAIRE.css]}>
                        <QuestionnaireApp/>
                    </Grid>
                </Grid>
                <PetraTextDialog startTour={() => setShowTour(true)} title={t("home_view_greeting")} text={[
                    t("home_view_content_0"),
                    t("home_view_content_1")
                ]}/>
            </Container>
        </>
    );
}
