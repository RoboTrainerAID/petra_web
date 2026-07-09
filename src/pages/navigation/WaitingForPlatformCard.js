import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";
import {Paper, Typography} from "@material-ui/core";
import TransportStates from "../../constants/TransportStates";
import {useTransport} from "../../petra_central_control/useTransport";
import ModalAssignPlatform from "../../components/modals/ModalAssignPlatform";
import {Button} from "react-bootstrap";
import {TransportDetailsGrid} from "../../components/transport/TransportDetailsGrid";
import {useState} from "react";

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
 * Shown when petra waits for a platform assignment to start coupling
 * shows transport details and option to assign platform
 * @param transport
 * @constructor
 */
export function WaitingForPlatformCard({ transport, requireLogin }) {
    const { t } = useTranslation();
    const styles = useStyles();

    const [ showModal, setShowModal ] = useState(false);
    const [ , info, setTransport,, ] = useTransport(transport._id);

    return (
        <>
            <ModalAssignPlatform
                show={showModal}
                selectedPlatform={0}
                onSetPlatform={p => {
                    setShowModal(false);
                    setTransport({
                        ...transport,
                        platform_nr: p,
                        status: TransportStates.COUPLING.v,
                    });
                }}
                onHide={() => {
                    setShowModal(false);
                }}
            />
            <Paper className={styles.paper}>
                <Typography variant={"h6"}>
                    {t(TransportStates.WAITING_FOR_PLATFORM_ASSIGNMENT.t)}
                </Typography>
                <div className={styles.spacer}/>
                <TransportDetailsGrid transport={transport}/>
                <div className={styles.spacer}/>
                <Button
                    disabled={!info.isSuccess}
                    onClick={() => requireLogin(() => setShowModal(true))}
                >
                    {t("platform_assign_title")}
                </Button>
            </Paper>
        </>
    )
}
