import {Button, IconButton, makeStyles, Typography} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import TransportStates, {getTransportState} from "../../constants/TransportStates";
import TransportModes from "../../constants/TransportModes";
import {Cancel} from "@material-ui/icons";

const useStyles = makeStyles(() => ({
    container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: ".25rem",
    },
}));

export function PlatformDisplay({ transport, mode, assignPlatform, releasePlatform }) {
    const { t } = useTranslation();
    const styles = useStyles();

    const state = getTransportState(transport?.status);

    if (TransportStates.WAITING_FOR_UNLOAD.matches(state?.v)) {
        //allow platform release
        return (
            <div className={styles.container}>
                <Typography>
                    {t("transport_platform", {platform: transport?.platform_nr})}
                </Typography>
                <IconButton color={"primary"} onClick={releasePlatform}>
                    <Cancel/>
                </IconButton>
            </div>
        );
    }

    if ((!TransportModes.WHEELCHAIR.matches(mode?.v) && !TransportModes.TRAILER.matches(mode?.v)) || TransportStates.DONE.matches(state?.v)) {
        return null; // do nothing if mode does not require a platform or transport is done
    }

    if (TransportStates.WAITING.matches(state?.v)
        || TransportStates.INBOUND.matches(state?.v)
        || TransportStates.WAITING_FOR_PLATFORM_ASSIGNMENT.matches(state?.v)) {
        if (transport?.platform_nr < 0) {
            return (
                <Button variant={"contained"} color={"primary"} onClick={assignPlatform} size={"small"}>
                    {t("platform_assign_title")}
                </Button>
            )
        }

        //Transport has not yet been started, so we can still release the platform
        return (
            <div className={styles.container}>
                <Typography>
                    {t("transport_platform", {platform: transport?.platform_nr})}
                </Typography>
                <IconButton color={"primary"} onClick={releasePlatform} size={"small"}>
                    <Cancel/>
                </IconButton>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Typography>
                {t("transport_platform", {platform: transport?.platform_nr})}
            </Typography>
        </div>
    )
}
