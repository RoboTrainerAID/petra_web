import Tour from "reactour";
import {useMemo, useState} from "react";
import {InfoTourStep} from "../info/InfoTourStep";
import InfoTourTargets from "../info/InfoTourTargets";
import {makeStyles} from "@material-ui/core/styles";
import {Button} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import TransportStates from "../../constants/TransportStates";
import {TourSetupStep} from "../info/TourSetupStep";
import {usePayload} from "../../petra_central_control/usePayload";

const useStyles = makeStyles(() => ({
    dialogContainer: {
        maxWidth: "none",
    },
}));

export function NavigationTour({show, onClose, askIfNecessary, transport}) {
    const styles = useStyles();
    const { t, i18n } = useTranslation();

    const [ payload, pInfo, ] = usePayload(transport?.payload);
    const [ currentStep, setCurrentStep ] = useState();

    const steps = useMemo(() => [
        {
            content: <TourSetupStep text={t("nav_tour_select_language")}/>
        },
        TransportStates.WAITING_FOR_PATIENT_APPROVAL.matches(transport?.status) && {
            content: <InfoTourStep text={t("nav_tour_check_details", {first_name: payload?.name, last_name: payload?.last_name})}/>
        },
        {
            content: <InfoTourStep text={t("nav_tour_inquiry")}/>,
        },
        {
            selector: InfoTourTargets.PETRA_AVATAR.target,
            content: <InfoTourStep text={t("nav_tour_open_tours")}/>
        },
        {
            selector: InfoTourTargets.PETRA_DIALOG_AREA.target,
            content: <InfoTourStep text={t("nav_tour_dialog_area")}/>,
        },
        {
            selector: InfoTourTargets.PETRA_SPEAK_BUTTON.target,
            content: <InfoTourStep text={t("nav_tour_read_comment")}/>,
        },
        {
            selector: InfoTourTargets.PETRA_LANGUAGE_SELECTOR.target,
            content: <InfoTourStep text={t("nav_tour_language_setting")}/>
        },
        {
            selector: InfoTourTargets.APP_HOME.target,
            content: <InfoTourStep text={t("nav_tour_app_home")}/>
        },
        {
            selector: InfoTourTargets.TRANSPORT_DETAILS_AREA.target,
            content: <InfoTourStep text={t("nav_tour_transport_details")}/>
        },
        !!transport && {
            selector: InfoTourTargets.BUTTON_EMERGENCY.target,
            content: <InfoTourStep text={t("nav_tour_emergency_button_shown")}/>,
        },
        !transport && {
            content: <InfoTourStep text={t("nav_tour_emergency_button_hidden")}/>,
        },
        TransportStates.WAITING_FOR_PATIENT_APPROVAL.matches(transport?.status) && {
            selector: InfoTourTargets.BUTTON_START_TRANSPORT.target,
            content: <InfoTourStep text={t("nav_tour_start_transport")}/>
        },
    ].filter(s => !!s), [ i18n.language, transport, transport?.status, payload ]);

    return (
        <Tour
            className={styles.dialogContainer}
            steps={steps}
            isOpen={show}
            startAt={askIfNecessary ? 0 : 3}
            onRequestClose={() => !!onClose && onClose()}
            rounded={5}
            showCloseButton={false}
            showNumber={false}
            showNavigation={false}
            closeWithMask={false}
            disableInteraction={true}

            nextButton={<Button variant={"contained"} color={"primary"}>
                {currentStep === 2 ? t("nav_tour_accept") : t("nav_tour_next")}
            </Button>}
            prevButton={<Button variant={"contained"} onClick={currentStep === 2 && (() => !!onClose && onClose())}>
                {currentStep === 2 ? t("nav_tour_dismiss") : t("nav_tour_previous")}
            </Button>}
            lastStepNextButton={<Button variant={"contained"} color={"primary"}>
                {t("nav_tour_end_tour")}
            </Button>}

            getCurrentStep={setCurrentStep}
        />
    )
}
