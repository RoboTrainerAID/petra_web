import React from 'react';

//Styling
import {makeStyles} from "@material-ui/core/styles";

//Components
import {Button, Modal} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {useTransport} from "../../petra_central_control/useTransport";
import {CircularProgress} from "@material-ui/core";
// import FormControl from "@material-ui/core/FormControl";
// import { MenuItem } from "@material-ui/core";
// import Select from "@material-ui/core/Select";

const useStyles = makeStyles({
    root: {
        height: "20px",
        paddingTop: "12px",
        paddingBottom: "10px",
    },
})


export default function ModalRealeasePlatform(props) {
    const classes = useStyles();
    const { t } = useTranslation();

    const [ transport, info, setTransport, removeTransport, refreshTransport ] = useTransport(props.transport);

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {t("platform_release_title")}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {info.isSuccess ? (
                    <p>
                        {t("platform_release_body", {platform: transport.platform_nr})}
                    </p>
                ) : <CircularProgress/>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>{t("platform_release_cancel")}</Button>
                <Button disabled={!info.isSuccess} onClick={props.onConfirm}>{t("platform_release_confirm")}</Button>
            </Modal.Footer>
        </Modal>
    );
}
