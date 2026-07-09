import React, {useCallback} from "react"
import {useTranslation} from "react-i18next";

//Styling
import {makeStyles} from "@material-ui/core/styles";

//Components
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import {allTransportModes, getTransportMode} from "../../constants/TransportModes";
import {ListItemIcon, ListItemText, Typography} from "@material-ui/core";


const useStyles = makeStyles({
    root: {
        '@media (max-width: 767px)': {
            paddingTop: "12px",
            paddingBottom: "3px",
            height: "25px",
        }
    },
    select: {
        width: "88%",
        marginRight: '3vw',
        '@media (max-width: 767px)': {
            width: "100%",
            marginRight: '1px',
        }
    },
});


export default function ModeSelector({ mode, errorMode, onModeChange, disabled, payloadType }) {
    const classes = useStyles();
    const { t } = useTranslation();

    const handleModeChange = useCallback(e => onModeChange(e.target.value), [ onModeChange ]);

    return (
        <FormControl variant="outlined" className={classes.select}>
            <Select
                disabled={disabled}
                value={mode}
                onChange={handleModeChange}
                error={errorMode}
                classes={{
                    root: classes.root
                }}
                displayEmpty
                renderValue={value => {
                    const transportMode = getTransportMode(value);
                    if (!transportMode) {
                        return (<div style={{color: "grey"}}>
                            {t('newtransport_form_mode')}
                        </div>);
                    }

                    return (<div style={{display: "flex", alignItems: "center", gap: "1rem"}}>
                        <transportMode.i style={{color: "grey"}}/>
                        <Typography>{t(transportMode.t)}</Typography>
                    </div>)
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
            >
                {allTransportModes.filter(mode => !payloadType || mode.isCompatible(payloadType)).map(tmode => {
                    return (
                        <MenuItem value={tmode.v}>
                            <ListItemIcon>
                                <tmode.i/>
                            </ListItemIcon>
                            <ListItemText primary={t(tmode.t)}/>
                        </MenuItem>
                    )
                })}
            </Select>
            {errorMode && <Typography color={"error"}>
                {t("newtransport_form_errormode")}
            </Typography>}
        </FormControl>
    );
}
