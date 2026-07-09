import React from "react";

//Styling
import "./TranslateButton.css";

//Icons&Images
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

//Components
import {Button} from "react-bootstrap";


export default function TranslateButtonLeft(props) {
    return (
        <Button className="translate-button" variant="primary" onClick={props.onClick}>
            <ArrowBackIosIcon className={"icon-arrow"}/>
            <ExpandLessIcon className={"icon-arrow-mobile"}/>
        </Button>
    );
}