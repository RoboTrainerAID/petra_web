import React, {useCallback} from "react"

//Styling
import {makeStyles} from "@material-ui/core/styles";

//Components
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import {useLocationList} from "../../petra_central_control/useLocation";
import {ListItemIcon, ListItemText, Typography} from "@material-ui/core";
import {getLocationType} from "../../constants/LocationTypes";
import {useTranslation} from "react-i18next";
import Edit from "@material-ui/icons/Edit";
import {usePayload} from "../../petra_central_control/usePayload";


const useStyles = makeStyles({
    root: {
        '@media (max-width: 767px)': {
            paddingTop: "12px",
            paddingBottom: "3px",
            height: "25px",
        }
    },
    select: {
        width: '88%',
        marginRight: '3vw',
        '@media (max-width: 767px)': {
            width: '100%',
            marginRight: '1px',
        }
    },
});

export default function LocationSelector({ disabled, location, onChange, error, fallbackPayload}) {
    const classes = useStyles();
    const { t } = useTranslation();

    const [ payload, pInfo,, ] = usePayload(fallbackPayload);
    const [ locations, info, addLocation, setLocation, removeLocation ] = useLocationList();

    const fallbackLocation = locations?.find(l => l._id === (payload?.location));
    const fallbackLocationType = getLocationType(fallbackLocation?.type);

    const handleChange = useCallback(e => onChange(e.target.value), [ onChange ]);

    return (
        <FormControl variant="outlined" className={classes.select}>
            <Select
                disabled={disabled}
                value={location}
                displayEmpty
                onChange={handleChange}
                error={error}
                classes={{
                    root: classes.root
                }}
                MenuProps={{
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left"
                    },
                    transformOrigin: {
                        vertical: "top",
                        horizontal: "left"
                    },
                    getContentAnchorEl: null
                }}
                renderValue={value => {
                    const location = !!locations ? locations.find(l => l._id === value) : null;
                    if (!location) {
                        if (!!fallbackLocation) {
                            const locationType = getLocationType(fallbackLocation.type)
                            return <div style={{color: "grey", display: "flex", alignItems: "center", gap: "1rem"}}>
                                <locationType.i style={{color: "grey", width: "1.2rem", height: "1.2rem"}}/>
                                {t('location_payload_default')}
                            </div>
                        }

                        return <div style={{color: "grey", display: "flex", alignItems: "center", gap: "1rem"}}>
                            <Edit style={{color: "grey", width: "1.2rem", height: "1.2rem"}}/>
                            {t('newtransport_form_location')}
                        </div>
                    }

                    const locationType = getLocationType(location.type);
                    return (<div style={{display: "flex", alignItems: "center", gap: "1rem"}}>
                        <locationType.i style={{color: "grey", width: "1.2rem", height: "1.2rem"}}/>
                        {location.name}
                    </div>);
                }}
            >
                {info.isLoading && <MenuItem disabled>Loading</MenuItem>}
                {info.isError && <MenuItem disabled>Something went wrong</MenuItem>}
                {info.isSuccess && !!fallbackLocation && (
                    <MenuItem value={null}>
                        <ListItemIcon>
                            <fallbackLocationType.i/>
                        </ListItemIcon>
                        <ListItemText primary={t('location_payload_default')} secondary={fallbackLocation.name}/>
                    </MenuItem>
                )}
                {info.isSuccess && locations.map(data => {
                    const locationType = getLocationType(data.type);

                    return <MenuItem value={data._id}>
                        <ListItemIcon>
                            <locationType.i/>
                        </ListItemIcon>
                        <ListItemText primary={data.name} secondary={t(locationType.t)}/>
                    </MenuItem>
                })}
            </Select>
            {error && <Typography color={"error"}>
                {t("newtransport_form_location")}
            </Typography>}
        </FormControl>
    );
}
