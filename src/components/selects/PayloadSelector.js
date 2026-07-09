import {makeStyles} from "@material-ui/core/styles";
import {usePayloadList} from "../../petra_central_control/usePayload";
import {FormControl, ListItemIcon, ListItemText, Typography} from "@material-ui/core";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import React, {useCallback, useState} from "react";
import {Add} from "@material-ui/icons";
import {getPayloadType} from "../../constants/PayloadTypes";
import {useLocationList} from "../../petra_central_control/useLocation";
import {useTranslation} from "react-i18next";
import {AddPayloadDialog} from "./AddPayloadDialog";

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
    }
});
export function PayloadSelector({ payload, onPayloadChange, errorPayload }) {
    const classes = useStyles();
    const {t} = useTranslation();
    const [payloads, info, addPayload, setPayload, removePayload] = usePayloadList();
    const [locations, locationInfo, addLocation, setLocation, removeLocation] = useLocationList();

    const [ showAddDialog, setShowAddDialog ] = useState();

    const handlePayloadChange = useCallback(e => {
        console.log(e.target.value)
        if (e.target.value < 0) {
            setShowAddDialog(true);
        } else {
            onPayloadChange(e.target.value);
        }
    }, [onPayloadChange]);

    return <FormControl variant={"outlined"} className={classes.select} error={errorPayload}>
        <AddPayloadDialog
            show={showAddDialog}
            onClose={() => setShowAddDialog(false)}
            onPayloadAdded={p => {
                setShowAddDialog(false);
                onPayloadChange(p._id);
            }}
        />
        <Select
            value={payload}
            onChange={handlePayloadChange}
            classes={{
                root: classes.root
            }}
            displayEmpty
            renderValue={value => {
                const p = payloads?.find(item => item._id === value);
                if (!p) {
                    return (<div style={{color: "grey"}}>
                        {t('newtransport_form_payload')}
                    </div>);
                }

                const payloadType = getPayloadType(p.type);
                const payloadName = payloadType.formatName(p);
                return (
                    <div style={{display: "flex", alignItems: "center", gap: "1rem"}}>
                        <payloadType.i style={{color: "grey"}} />
                        <Typography>{payloadName}</Typography>
                    </div>
                )
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
            {(info.isLoading || locationInfo.isLoading) && <MenuItem disabled>Loading</MenuItem>}
            {(info.isError || locationInfo.isError) && <MenuItem disabled>Something went wrong</MenuItem>}
            {(info.isSuccess && locationInfo.isSuccess) && (
                <MenuItem value={-1}>
                    <ListItemIcon>
                        <Add/>
                    </ListItemIcon>
                    <ListItemText primary={t("payload_selector_add_payload")}/>
                </MenuItem>
            )}
            {(info.isSuccess && locationInfo.isSuccess) && payloads.map(p => {
                const payloadType = getPayloadType(p.type);
                const payloadName = payloadType.formatName(p);
                const payloadLocation = locations.find(l => l._id === p.location)
                const payloadDescription = t("location_descriptive_text", {
                    name: payloadLocation.name,
                    floor: payloadLocation.floor
                });
                return (<MenuItem value={p._id}>
                    <ListItemIcon>
                        <payloadType.i/>
                    </ListItemIcon>
                    <ListItemText primary={payloadName} secondary={payloadDescription}/>
                </MenuItem>)
            })}
        </Select>
    </FormControl>
}
