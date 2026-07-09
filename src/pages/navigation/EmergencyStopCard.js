import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";
import {Grid, Paper, Typography} from "@material-ui/core";
import TransportStates from "../../constants/TransportStates";
import {TransportDetailsGrid} from "../../components/transport/TransportDetailsGrid";
import {Button} from "react-bootstrap";
import {useCallback} from "react";
import {useTransport} from "../../petra_central_control/useTransport";

const useStyles = makeStyles(() => ({
    paper: {
        backgroundColor: "#df4759",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "97%",
    },
    spacer: {
        flexGrow: 1,
    },
}));

/**
 * Shown when transport is in emergency state
 * Shows transport details and option to stop the emergency (only by staff member)
 * @param transport
 * @constructor
 */
export function EmergencyStopCard({ transport, requireLogin }) {
    const { t } = useTranslation();
    const styles = useStyles();

    const [ , info, setTransport,, ] = useTransport(transport?._id);

    const abortTransport = useCallback(() => {
        setTransport({
            ...transport,
            status: TransportStates.DONE.v,
        });
    }, [ setTransport, transport ]);

    const continueTransport = useCallback(() => {
        setTransport({
            ...transport,
            status: TransportStates.RUNNING.v,
        });
    }, [ setTransport, transport ]);

    return (
        <Paper className={styles.paper}>
            <Typography variant={"h6"}>
                {t(TransportStates.EMERGENCY_STOP.t)}
            </Typography>
            <div className={styles.spacer}/>
            <TransportDetailsGrid transport={transport}/>
            <div className={styles.spacer}/>
            <Grid container>
                <Grid item xs={6}>
                    <Button
                        variant={"success"}
                        disabled={!info.isSuccess}
                        onClick={() => requireLogin(continueTransport)}
                    >
                        {t("transport_cards_continue_transport")}
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        variant={"warning"}
                        disabled={!info.isSuccess}
                        onClick={() => requireLogin(abortTransport)}
                    >
                        {t("transport_cards_abort_transport")}
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    )
}
