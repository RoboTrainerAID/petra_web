import React from "react";

//Styling
import "./MediaLib.css";

//Components
import {Container} from "react-bootstrap";
import Iframe from 'react-iframe';


export default function MediaLib() {

    return (
        <body className="media-body">
        <Container fluid className="layout-media">
            <div className="media-player">
                <Iframe
                    url="https://www.ardmediathek.de/"
                    height="100%"
                    width="100%"
                    position="relative"
                    overflow="hidden"/>
            </div>
        </Container>
        </body>
    );
}