import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import {Paper, Typography} from "@material-ui/core";
import TransportStates from "../../constants/TransportStates";
import {TransportDetailsGrid} from "../../components/transport/TransportDetailsGrid";
import {Button} from "react-bootstrap";
import * as BiIcons from "react-icons/fi";
import React from "react";

const useStyles = makeStyles(() => ({
    paper: {
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "97%"
    },
    spacer: {
        flexGrow: 1
    },
    emergency: {
        fontWeight: "bold",
        width: "80%",
        height: "20%"
    }
}));

/**
 * Shown while a transport is active
 * Shows transport details, map and button for assistance and emergency stops
 * @param transport
 * @constructor
 */
export function TransportRunningCard({ transport, startEmergency }) {
    const { t } = useTranslation();
    const styles = useStyles();

    return (
        <Paper className={styles.paper}>
            <Typography variant={"h6"}>
                {t(TransportStates.RUNNING.t)}
            </Typography>
            <div className={styles.spacer}/>
            <TransportDetailsGrid transport={transport}/>
            <div className={styles.spacer}/>
            <Button
                variant={"danger"}
                className={styles.emergency}
                size={"lg"}
                onClick={startEmergency}
            >
                <BiIcons.FiAlertTriangle className="emergency-icon"/>
                {t("footer_button_emergency")}
            </Button>
        </Paper>
    );
}
