import React from "react";

//Styling
import {makeStyles} from '@material-ui/core/styles';

//Components
import {Container} from '@material-ui/core';
import {TransportTable} from "./TransportTable";


const useStyles = makeStyles(() => ({
    root: {
        display: 'block',
        alignItems: 'start',
        maxWidth: '100em',
    },
}))


export default function ShowTransports() {
    const classes = useStyles();

    return (
        <Container className={classes.root}>
            <TransportTable/>
        </Container>
    );
}
