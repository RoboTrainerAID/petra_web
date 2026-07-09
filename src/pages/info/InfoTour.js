import React from "react";

//Styling
import {makeStyles} from "@material-ui/core/styles";

//Components
import Tour from 'reactour';
import {Button} from "react-bootstrap";


const useStyles = makeStyles(() => ({
    tour: {
        maxWidth: "none",
    },
}))

export default function InfoTour({isTourOpen, setIsTourOpen, steps}) {
    const classes = useStyles();

    return (
        <>
            <Tour
                className={classes.tour}
                steps={steps}
                isOpen={isTourOpen}
                onRequestClose={() => setIsTourOpen(false)}
                startAt={0}
                rounded={5}
                closeWithMask={false}
                lastStepNextButton={<Button>Tour Beenden</Button>}
            />
        </>
    );
}
