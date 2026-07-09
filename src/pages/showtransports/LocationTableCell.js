import {useTranslation} from "react-i18next";
import {useLocation} from "../../petra_central_control/useLocation";
import {CircularProgress, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {usePayload} from "../../petra_central_control/usePayload";
import {getLocationType} from "../../constants/LocationTypes";

export function LocationTableCell({ location, fallbackPayload }) {
    const { t } = useTranslation();

    const [ locationData, info,, ] = useLocation(location);
    const [ fallback, fallbackInfo,, ] = usePayload(fallbackPayload);
    const [ fallbackLocation, flInfo,, ] = useLocation(fallbackInfo.isSuccess ? fallback.location : 0)

    if ((location > 0 && !info.isSuccess) || !fallbackInfo.isSuccess || !flInfo.isSuccess) {
        return <ListItem>
            <ListItemIcon>
                <CircularProgress/>
            </ListItemIcon>
        </ListItem>
    }

    if (location <= 0) {
        const fallbackDescription = t("location_descriptive_text", {
            name: fallbackLocation.name,
            floor: fallbackLocation.floor
        });

        const locationType = getLocationType(fallbackLocation.type);

        return <ListItem>
            <ListItemText
                primary={t('location_payload_default')}
                secondary={
                    <div style={{display: "flex", gap: "1rem", alignItems: "center"}}>
                        <locationType.i/>
                        {fallbackDescription}
                    </div>
                }
            />
        </ListItem>
    }

    const locationType = getLocationType(locationData.type);

    return <ListItem>
        <ListItemText
            primary={locationData.name}
            secondary={
                <div style={{display: "flex", gap: "1rem", alignItems: "center"}}>
                    <locationType.i/>
                    {t('location_floor_text', {floor: locationData.floor})}
                </div>
            }
        />
    </ListItem>
}
