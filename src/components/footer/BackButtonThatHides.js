import React from "react";
import {withRouter} from "react-router-dom";

//Components
import {BackButton} from "./BackButton";


export const BackButtonToHide = (props) => {
    const {location} = props;

    if (location.pathname.endsWith('/home-employee')) {
        return null;
    }
    if (location.pathname.endsWith('/')) {
        return null;
    }
    return (
        <BackButton/>
    )
}
export const BackButtonThatHides = withRouter(BackButtonToHide);