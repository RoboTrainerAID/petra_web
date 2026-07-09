import {useTranslation} from "react-i18next";
import {usePayload} from "../../petra_central_control/usePayload";
import {CircularProgress, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {getTransportMode} from "../../constants/TransportModes";
import {Cancel} from "@material-ui/icons";

export function ModeTableCell({ mode, fallbackPayload }) {
    const { t } = useTranslation();

    const [ payload, info,, ] = usePayload(fallbackPayload);
    let transportMode = getTransportMode(mode);

    if (!info.isSuccess && !transportMode) {
        return <ListItem>
            <ListItemIcon>
                <CircularProgress/>
            </ListItemIcon>
        </ListItem>
    }

    if (!transportMode) {
        transportMode = getTransportMode(payload.preferred_mode);

        if (!transportMode) {
            return <ListItem>
                <ListItemIcon>
                    <Cancel/>
                </ListItemIcon>
                <ListItemText primary={t('transport_mode_unset')}/>
            </ListItem>
        }

        return <ListItem>
            <ListItemText
                primary={t('transport_mode_default')}
                secondary={
                    <div style={{display: "flex", gap: "1rem", alignItems: "center"}}>
                        <transportMode.i/>
                        {t(transportMode.t)}
                    </div>
                }
            />
        </ListItem>
    }


    return <ListItem>
        <ListItemIcon>
            <transportMode.i/>
        </ListItemIcon>
        <ListItemText primary={t(transportMode.t)}/>
    </ListItem>
}
