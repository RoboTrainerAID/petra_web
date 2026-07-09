import TransportModes from "../../constants/TransportModes";
import {Button, IconButton, Typography} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {Cancel} from "@material-ui/icons";
import {usePayload} from "../../petra_central_control/usePayload";
import TransportStates from "../../constants/TransportStates";

export function PlatformTableCell({state, mode, platform, onSetPlatform, onReleasePlatform, fallbackPayload}) {
    const { t } = useTranslation();

    const [ payload, info, setPayload, removePayload, refreshPayload ] = usePayload(fallbackPayload);

    let resolvedMode = mode;
    if (info.isSuccess && (mode === null || mode === undefined)) {
        resolvedMode = payload.preferred_mode;
    }

    //if waiting for platform removal, show the button
    if (TransportStates.WAITING_FOR_UNLOAD.matches(state)) {
        return (
            <div style={{
                display: "flex",
                gap: ".25rem",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Typography>
                    {t("transport_platform", {platform: platform})}
                </Typography>
                <IconButton onClick={onReleasePlatform}>
                    <Cancel color={"primary"}/>
                </IconButton>
            </div>
        )
    }

    //if mode is not wheelchair or platform or transport is done, we do not need to assign a platform
    if ((!TransportModes.TRAILER.matches(resolvedMode) && !TransportModes.WHEELCHAIR.matches(resolvedMode)) || TransportStates.DONE.matches(state)) {
        return null;
    }

    //if no platform is assigned and we can assign a platform still, show the button
    if (
        TransportStates.WAITING.matches(state)
        || TransportStates.INBOUND.matches(state)
        || TransportStates.WAITING_FOR_PLATFORM_ASSIGNMENT.matches(state)
    ) {
        if (platform < 0) {
            return (
                <Button onClick={onSetPlatform} variant={"contained"} color={"primary"}>
                    {t("platform_assign_title")}
                </Button>
            );
        }
        // if a platform is assigned we can still unassign it
        return (
            <div style={{
                display: "flex",
                gap: ".25rem",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Typography>
                    {t("transport_platform", {platform: platform})}
                </Typography>
                <IconButton onClick={onReleasePlatform}>
                    <Cancel color={"primary"}/>
                </IconButton>
            </div>
        );
    }

    //otherwise we just show the platform number
    return (
        <div style={{
            display: "flex",
            gap: ".25rem",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <Typography>
                {t("transport_platform", {platform: platform})}
            </Typography>
        </div>
    );
}
