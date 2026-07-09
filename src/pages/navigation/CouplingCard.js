import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import {Paper, Typography} from "@material-ui/core";
import TransportStates from "../../constants/TransportStates";
import {TransportDetailsGrid} from "../../components/transport/TransportDetailsGrid";

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
 * Displayed when Petra is coupling to a platform
 * Shows Platform that is being coupled and transport details
 * @param transport
 * @constructor
 */
export function CouplingCard({ transport }) {
    const { t } = useTranslation();
    const styles = useStyles();

    return (
        <Paper className={styles.paper}>
            <Typography variant={"h6"}>
                {t(TransportStates.COUPLING.t)}
            </Typography>
            <div className={styles.spacer}/>
            <TransportDetailsGrid transport={transport}/>
            <div className={styles.spacer}/>
        </Paper>
    );
}
