import {Grid} from "@material-ui/core";
import {PayloadTableCell} from "../../pages/showtransports/PayloadTableCell";
import {ModeTableCell} from "../../pages/showtransports/ModeTableCell";
import {LocationTableCell} from "../../pages/showtransports/LocationTableCell";
import {ArrowRightAlt} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    arrow: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
    },
}));

/**
 * Shows details of the given transport
 * @param transport
 * @returns {JSX.Element}
 * @constructor
 */
export function TransportDetailsGrid({ transport }) {
    const styles = useStyles();

    return (
        <Grid container>
            <Grid item xs={6}>
                <PayloadTableCell payload={transport.payload}/>
            </Grid>
            <Grid item xs={6}>
                <ModeTableCell mode={transport.override_mode} fallbackPayload={transport.payload}/>
            </Grid>
            <Grid item xs={6}>
                <LocationTableCell location={transport.override_start_location} fallbackPayload={transport.payload}/>
            </Grid>
            <Grid item xs={1}>
                <div className={styles.arrow}>
                    <ArrowRightAlt/>
                </div>
            </Grid>
            <Grid item xs={5}>
                <LocationTableCell location={transport.goal_location} fallbackPayload={transport.payload}/>
            </Grid>
        </Grid>
    );
}
