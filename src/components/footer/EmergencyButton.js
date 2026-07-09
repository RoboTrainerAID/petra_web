import React from "react";
import {useTranslation} from "react-i18next";

//Styling
import "./EmergencyButton.css";

//Icons&Images
import * as BiIcons from "react-icons/fi"

//Components
import {Button} from "react-bootstrap";
import InfoTourTargets from "../../pages/info/InfoTourTargets";


export function EmergencyButton({triggerEmergency}) {
    const {t} = useTranslation();

    return (
        <Button
            className={`emergency-button hidden-mobile ${InfoTourTargets.BUTTON_EMERGENCY.css}`}
            variant="danger"
            size="lg"
            onClick={triggerEmergency}>
            <BiIcons.FiAlertTriangle className="emergency-icon"/>
            <div className="emergency-text">
                {t('footer_button_emergency')}
            </div>
        </Button>
    );
}
