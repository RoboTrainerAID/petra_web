import {useTranslation} from "react-i18next";
import Select from "@material-ui/core/Select";
import React, {useCallback} from "react";
import {allPayloadTypes, getPayloadType} from "../../constants/PayloadTypes";
import {ListItemIcon, ListItemText, MenuItem, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";

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

export function PayloadTypeSelector({payloadType, onPayloadTypeChange, disabled}) {
    const { t } = useTranslation();
    const styles = useStyles();

    const handlePayloadTypeChange = useCallback(e => onPayloadTypeChange(getPayloadType(e.target.value)), [ onPayloadTypeChange ]);

    return (
        <FormControl variant={"outlined"} className={styles.select}>
            <Select
                disabled={disabled}
                value={payloadType.v}
                onChange={handlePayloadTypeChange}
                displayEmpty
                renderValue={value => {
                    const pt = getPayloadType(value);
                    if (!pt) {
                        return (<div style={{color: "grey"}}>
                            {t('payload_type_selector_select_type')}
                        </div>);
                    }

                    return (
                        <div style={{display: "flex", alignItems: "center", gap: "1rem"}}>
                            <pt.i style={{color: "grey"}}/>
                            <Typography>{t(pt.t)}</Typography>
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
                {allPayloadTypes.map(pt => (
                    <MenuItem value={pt.v}>
                        <ListItemIcon>
                            <pt.i/>
                        </ListItemIcon>
                        <ListItemText primary={t(pt.t)}/>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}
