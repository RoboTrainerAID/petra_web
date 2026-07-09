import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from "react-i18next";

//Styling
import {makeStyles} from "@material-ui/core/styles";

//Icons&Images
//Components
import {Button, Modal} from "react-bootstrap";


const useStyles = makeStyles({
    modal: {
        zIndex: "9000",
        border: "8px solid red",
    },
    modalHeader: {
        color: "white",
        backgroundColor: "red",
        closeVariant: "white",
    },
    modalBody: {
        display: 'flex',
        flexDirection: 'column',
        lineHeight: 1.5,
        fontSize: '21px',
        alignItems: 'center',
    },
    callIcon: {
        fontSize: '90px',
        marginTop: '25px',
        marginBottom: '5px',
        color: 'dimgrey',
    },
    counter: {
        fontSize: '115px',
        fontWeight: "bold",
    }
})

export default function ModalEmergency({ show, activateEmergency, cancelEmergency }) {
    const classes = useStyles();
    const {t} = useTranslation();

    const [ counter, setCounter ] = useState(0);
    const counterRef = useRef(0);

    const showRef = useRef(show);
    showRef.current = show;

    //Timer function
    const countDownRef = useRef(() => {});
    countDownRef.current = useCallback(() => {
        counterRef.current = counterRef.current - 1;
        setCounter(counterRef.current);

        if (counterRef.current <= 0) { // only trigger emergency if modal is shown
            showRef.current && activateEmergency && activateEmergency();
        } else { // only continue countdown if modal is shown
            setTimeout(() => showRef.current && countDownRef.current(), 1000);
        }
    }, [ activateEmergency ]);

    //start timer when modal is shown
    useEffect(() => {
        if (show) {
            setCounter(4);
            counterRef.current = 4;
            setTimeout(() => countDownRef.current(), 1000);
        }
    }, [ show ]);

    return (
        <Modal
            show={show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className={classes.modal}>
            <Modal.Header closeButton className={classes.modalHeader}>
                <Modal.Title id="contained-modal-title-vcenter">
                    <strong>{t('modal_emergency_title')}</strong>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className={classes.modalBody}>
                    {t('modal_emergency_body1')}
                    <p className={classes.counter}>{counter}</p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={cancelEmergency}
                >
                    {counter} {t('modal_emergency_cancel')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
