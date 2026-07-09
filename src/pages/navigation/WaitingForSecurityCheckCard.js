import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import {Paper, Typography} from "@material-ui/core";
import TransportStates from "../../constants/TransportStates";
import {TransportDetailsGrid} from "../../components/transport/TransportDetailsGrid";
import {Button} from "react-bootstrap";
import {useTransport} from "../../petra_central_control/useTransport";
import {useCallback} from "react";
import {usePayload} from "../../petra_central_control/usePayload";
import PayloadTypes from "../../constants/PayloadTypes";

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
    }
}));

/**
 * Shown after coupling is complete and needs approval by a staff member
 * shows transport details and button to approve the transport conditions
 * @param transport
 * @constructor
 */
export function WaitingForSecurityCheckCard({ transport, requireLogin }) {
    const { t } = useTranslation();
    const styles = useStyles();

    const [ , info, setTransport,,] = useTransport(transport?._id);
    const [ payload, pInfo,,, ] = usePayload(transport?.payload);

    const advanceState = useCallback(() => {
        const isCargo = PayloadTypes.CARGO.matches(payload?.type);

        setTransport({
            ...transport,
            status: isCargo ? TransportStates.RUNNING.v : TransportStates.WAITING_FOR_PATIENT_APPROVAL.v,
        });
    }, [ transport, setTransport, payload ]);

    return (
        <Paper className={styles.paper}>
            <Typography variant={"h6"}>
                {t(TransportStates.WAITING_FOR_SECURITY_CHECK.t)}
            </Typography>
            <div className={styles.spacer}/>
            <TransportDetailsGrid transport={transport}/>
            <div className={styles.spacer}/>
            <Button
                disabled={!info.isSuccess || !pInfo.isSuccess}
                onClick={() => requireLogin(advanceState)}
            >
                {t("transport_cards_coupling_secure")}
            </Button>
        </Paper>
    );
}
