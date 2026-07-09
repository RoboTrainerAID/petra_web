import React from "react";

//Styling
import "./TranslateButton.css";

//Icons&Image
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

//Components
import {Button} from "react-bootstrap";


export default function TranslateButtonRight(props) {

    return (
        <Button className="translate-button" variant="primary" onClick={props.onClick}>
            <ArrowForwardIosIcon className={"icon-arrow"}/>
            <ExpandMoreIcon className={"icon-arrow-mobile"}/>
        </Button>
    );
}