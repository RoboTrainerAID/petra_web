import React from "react";
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";

//Styling
import "./BackButton.css";

//Icons&Images
import * as BiIcons from "react-icons/io";

//Components
import {Button} from "react-bootstrap";


export function BackButton() {
    const history = useHistory();
    const {t} = useTranslation();

        return (
            <Button
                className="back-button back-button-mobile"
                variant="primary"
                size="lg"
                onClick={() => history.push("/")}>
                <BiIcons.IoMdArrowRoundBack className="back-icon back-icon-mobile"/>
                <div>
                    {t('footer_button_back')}
                </div>
            </Button>
        );
    }
