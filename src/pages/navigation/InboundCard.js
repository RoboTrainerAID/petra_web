import {Paper, Typography} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";
import TransportStates from "../../constants/TransportStates";
import {TransportDetailsGrid} from "../../components/transport/TransportDetailsGrid";

const useStyles = makeStyles(() => ({
    paper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "97%",
    },
    arrow: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
    },
    spacer: {
        flexGrow: 1
    }
}));

/**
 * Card is displayed in the navigation page when petra is on the way.
 * Shows transport details and option to assign a platform
 * @param transport
 * @returns {JSX.Element}
 * @constructor
 */
export function InboundCard({ transport }) {
    const { t } = useTranslation();
    const styles = useStyles();

    return <Paper className={styles.paper}>
        <Typography variant={"h6"}>
            {t(TransportStates.INBOUND.t)}
        </Typography>
        <div className={styles.spacer}/>
        <TransportDetailsGrid transport={transport}/>
        <div className={styles.spacer}/>
    </Paper>
}
