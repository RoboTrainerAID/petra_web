import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import {Paper, Typography} from "@material-ui/core";
import TransportStates from "../../constants/TransportStates";
import {TransportDetailsGrid} from "../../components/transport/TransportDetailsGrid";
import {Button} from "react-bootstrap";
import {useTransport} from "../../petra_central_control/useTransport";
import {useCallback} from "react";

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
 * Shown when petra is ready to begin the transport
 * Shows transport details and option to start the transport
 * @param transport
 * @constructor
 */
export function WaitingForPatientApprovalCard({ transport }) {
    const { t } = useTranslation();
    const styles = useStyles();

    const [ tr, trInfo, setTr,, ] = useTransport(transport._id);
    const startTransport = useCallback(() => { // starting the transport is done by setting its state to running
        setTr({
            ...transport,
            status: TransportStates.RUNNING.v,
        });
    }, [ setTr ]);

    return (
        <Paper className={styles.paper}>
            <Typography variant={"h6"}>
                {t(TransportStates.WAITING_FOR_PATIENT_APPROVAL.t)}
            </Typography>
            <div className={styles.spacer}/>
            <TransportDetailsGrid transport={transport}/>
            <div className={styles.spacer}/>
            <Button
                variant={"success"}
                disabled={!trInfo.isSuccess}
                onClick={startTransport}
            >
                {t("navigation_button_start")}
            </Button>
        </Paper>
    )
}
