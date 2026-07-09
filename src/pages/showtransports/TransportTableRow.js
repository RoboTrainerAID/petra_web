import {Grid, IconButton, makeStyles} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {useTransport} from "../../petra_central_control/useTransport";
import {usePayload} from "../../petra_central_control/usePayload";
import {useLocation} from "../../petra_central_control/useLocation";
import TransportModes, {getTransportMode} from "../../constants/TransportModes";
import TransportStates, {getTransportState} from "../../constants/TransportStates";
import {getPayloadType} from "../../constants/PayloadTypes";
import {getLocationType} from "../../constants/LocationTypes";
import Edit from "@material-ui/icons/Edit";
import {Delete, Info} from "@material-ui/icons";
import {LocationName} from "./LocationName";
import {PayloadName} from "./PayloadName";
import {PlatformDisplay} from "./PlatformDisplay";
import Divider from "@material-ui/core/Divider";
import {
    ACTION_COLUMN_WIDTH,
    LOCATION_COLUMN_WIDTH,
    PAYLOAD_COLUMN_WIDTH,
    PLATFORM_COLUMN_WIDTH,
    STATE_COLUMN_WIDTH
} from "./TransportTable";
import {StateAndDate} from "./StateAndDate";

const useStyles = makeStyles(() => ({
    item: {
        padding: ".5rem",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: ".5rem",
    },
    itemCentered: {
        padding: ".5rem",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: ".5rem",
    },
    emergency: {
        backgroundColor: "#df4759",
    },
}));

export function TransportTableRow({ transport_id, infoTransport, editTransport, assignPlatform, releasePlatform, deleteTransport }) {
    const { t } = useTranslation();
    const styles = useStyles();

    /*
        Collect data from backend
     */

    const [ transport, tInfo, ] = useTransport(transport_id);
    const [ payload, pInfo,,, ] = usePayload(transport?.payload);
    const [ startLocation, slInfo,,, ] = useLocation(transport?.override_start_location || payload?.location);
    const [ goalLocation, glInfo,,, ] = useLocation(transport?.goal_location);

    /*
        Map States and types to objects
     */

    const mode = getTransportMode(
        (transport?.override_mode !== null && transport?.override_mode !== undefined) ? transport?.override_mode : payload?.preferred_mode);
    const state = getTransportState(transport?.status);
    const payload_type = getPayloadType(payload?.type);
    const startLocationType = getLocationType(startLocation?.type);
    const goalLocationType = getLocationType(goalLocation?.type);
    const isEmergency = TransportStates.EMERGENCY_STOP.matches(state?.v);
    const requiresPlatform = TransportModes.TRAILER.matches(mode?.v) || TransportModes.WHEELCHAIR.matches(mode?.v);

    /*
        Render row
     */

    return <>
        <Grid item xs={STATE_COLUMN_WIDTH} className={`${isEmergency ? styles.emergency : ""} ${styles.item}`}>
            <StateAndDate transport={transport}/>
        </Grid>
        <Divider orientation={"vertical"} variant={"fullWidth"} flexItem style={{marginRight: "-1px"}}/>
        <Grid item xs={PAYLOAD_COLUMN_WIDTH} className={`${isEmergency ? styles.emergency : ""} ${styles.item}`}>
            <PayloadName payload={payload}/>
        </Grid>
        <Divider orientation={"vertical"} variant={"fullWidth"} flexItem style={{marginRight: "-1px"}}/>
        <Grid item xs={LOCATION_COLUMN_WIDTH} className={`${isEmergency ? styles.emergency : ""} ${styles.item}`}>
            <LocationName location={startLocation}/>
        </Grid>
        <Divider orientation={"vertical"} variant={"fullWidth"} flexItem style={{marginRight: "-1px"}}/>
        <Grid item xs={LOCATION_COLUMN_WIDTH} className={`${isEmergency ? styles.emergency : ""} ${styles.item}`}>
            <LocationName location={goalLocation}/>
        </Grid>
        <Divider orientation={"vertical"} variant={"fullWidth"} flexItem style={{marginRight: "-1px"}}/>
        <Grid item xs={PLATFORM_COLUMN_WIDTH} className={`${isEmergency ? styles.emergency : ""} ${styles.itemCentered}`}>
            {requiresPlatform && <PlatformDisplay transport={transport} mode={mode} assignPlatform={assignPlatform} releasePlatform={releasePlatform}/> }
        </Grid>
        <Divider orientation={"vertical"} variant={"fullWidth"} flexItem style={{marginRight: "-1px"}}/>
        <Grid item xs={ACTION_COLUMN_WIDTH} className={`${isEmergency ? styles.emergency : ""} ${styles.itemCentered}`}>
            <IconButton size={"small"} onClick={infoTransport}>
                <Info/>
            </IconButton>
            <IconButton size={"small"} onClick={editTransport} disabled={!TransportStates.WAITING.matches(state?.v)}>
                <Edit/>
            </IconButton>
            <IconButton size={"small"} onClick={deleteTransport}>
                <Delete/>
            </IconButton>
        </Grid>
    </>
}
