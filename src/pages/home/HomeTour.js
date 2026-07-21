import Tour from "reactour";
import {useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {Button, makeStyles} from "@material-ui/core";
import InfoTourTargets from "../info/InfoTourTargets";
import {InfoTourStep} from "../info/InfoTourStep";
import {TourSetupStep} from "../info/TourSetupStep";

const useStyles = makeStyles(() => ({
    dialogContainer: {
        maxWidth: "none",
    },
}));

export function HomeTour({show, onClose, transport}) {
    const { t } = useTranslation();
    const styles = useStyles();

    const [ currentStep, setCurrentStep ] = useState();

    const steps = useMemo(() => [
        {
            selector: InfoTourTargets.APP_NAVIGATION.target,
            content: <InfoTourStep text={t("home_tour_navigation")}/>
        },
        {
            selector: InfoTourTargets.APP_QUESTIONNAIRE.target,
            content: <InfoTourStep text={t("home_tour_questionnaire")}/>
        },
        {
            selector: InfoTourTargets.APP_HOME.target,
            content: <InfoTourStep text={t("home_tour_home")}/>,
        },
        {
            content: <InfoTourStep text={t("home_tour_continue_basic_functionality")}/>
        },
        {
            selector: InfoTourTargets.PETRA_AVATAR.target,
            content: <InfoTourStep text={t("home_tour_petra")}/>
        },
        {
            selector: InfoTourTargets.PETRA_SPEAK_BUTTON.target,
            content: <InfoTourStep text={t("home_tour_speak")}/>
        },
        {
            content: <TourSetupStep text={t("home_tour_select_language")}/>
        },
        {
            selector: InfoTourTargets.PETRA_LANGUAGE_SELECTOR.target,
            content: <InfoTourStep text={t("home_tour_language_selector")}/>
        },
        {
            selector: !!transport && InfoTourTargets.BUTTON_EMERGENCY.target,
            content: <InfoTourStep text={t(!!transport ? "home_tour_emergency_button_shown" : "home_tour_emergency_button_hidden")}/>
        },
        {
            content: <InfoTourStep text={t("home_tour_done")}/>
        }
    ], [ t, transport ]);

    return (
        <Tour
            className={styles.dialogContainer}
            isOpen={show}
            steps={steps}
            getCurrentStep={setCurrentStep}
            onRequestClose={() => !!onClose && onClose()}
            startAt={0}

            rounded={5}
            showCloseButton={false}
            showNumber={false}
            showNavigation={false}
            closeWithMask={false}

            nextButton={<Button variant={"contained"} color={"primary"}>
                {currentStep === 4 ? t("home_tour_continue") : t("nav_tour_next")}
            </Button> }
            prevButton={<Button variant={"contained"} onClick={currentStep === 4 && (() => !!onClose && onClose())}>
                {currentStep === 4 ? t("home_tour_abort") : t("nav_tour_previous")}
            </Button>}
            lastStepNextButton={<Button variant={"contained"} color={"primary"}>
                {t("nav_tour_end_tour")}
            </Button>}
        />
    )
}
