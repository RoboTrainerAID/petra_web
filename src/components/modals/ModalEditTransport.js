import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    makeStyles,
    Switch,
    Typography
} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import React, {useEffect, useMemo, useState} from "react";
import TransportModes from "../../constants/TransportModes";
import {PayloadSelector} from "../selects/PayloadSelector";
import {usePayloadList} from "../../petra_central_control/usePayload";
import {getPayloadType} from "../../constants/PayloadTypes";
import {TransportTimeSelector} from "../selects/TransportTimeSelector";
import ModeSelector from "../selects/ModeSelector";
import {Form} from "react-bootstrap";
import LocationSelector from "../selects/LocationSelector";
import TransportStates from "../../constants/TransportStates";

const useStyles = makeStyles(() => ({
    contentItem: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%"
    },
    dialog: {
        width: "60vw",
        maxWidth: "none",
        maxHeight: "none",
    }
}));

export function ModalEditTransport({ show, transport, onSubmit, onCancel }) {
    const { t } = useTranslation();
    const styles = useStyles();

    const [ payloads, pInfo, ] = usePayloadList();

    const [ isEdit, setIsEdit ] = useState(false);

    const [ payload, setPayload ] = useState(0);
    const [ goal, setGoal ] = useState(0);
    const [ timestamp, setTimeStamp ] = useState(0);
    const [ isStartTime, setIsStartTime ] = useState(true);

    const [ overrideMode, setOverrideMode ] = useState(false);
    const [ mode, setMode ] = useState(TransportModes.FREE_WALKING.v);

    const [ overrideStartLocation, setOverrideStartLocation ] = useState(false);
    const [ startLocation, setStartLocation ] = useState(0);

    //when modal is shown and transport is present, initialize state to match the given transport
    useEffect(() => {
        if (show && !!transport) {
            setPayload(transport.payload)
            setGoal(transport.goal_location)
            setTimeStamp(transport.time_stamp);
            setIsStartTime(transport.is_start_time);

            setOverrideMode(transport.override_mode !== null);
            setMode(transport.override_mode !== null ? transport.override_mode : -1);

            setOverrideStartLocation(transport.override_start_location > 0);
            setStartLocation(transport.override_start_location > 0 ? transport.override_start_location : 0);

            setIsEdit(true);
        } else if (show) {
            setPayload(0)
            setGoal(0)
            setTimeStamp(new Date().getTime());
            setIsStartTime(true);

            setOverrideMode(false);
            setMode(TransportModes.FREE_WALKING.v);

            setOverrideStartLocation(false);
            setStartLocation(0);

            setIsEdit(false);
        }
    }, [ show, transport ]);

    const errorPayload = useMemo(() => payload <= 0, [ payload ]);
    const errorGoal = useMemo(() => goal <= 0, [ goal ]);
    const errorTimeStamp = useMemo(() => timestamp <= (new Date().getTime() - 5 * 60000), [timestamp]); // we allow 5 minutes of editing after setting date to "now"

    const canSubmit = useMemo(() => {
        return !errorPayload && !errorGoal && !errorTimeStamp;
    }, [ errorPayload, errorGoal, errorTimeStamp ]);

    return (
        <Dialog
            open={show}
            onClose={onCancel}
            classes={{
                paper: styles.dialog,
            }}
        >
            <DialogTitle>
                <Typography variant={"h4"}>
                    {isEdit ? t("transport_edit_title") : t("transport_new_title")}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={"1"}>
                    <Grid item xs={6}>
                        <Typography variant={"h6"}>
                            {t("transport_edit_payload")}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Switch
                            size={"small"}
                            color={"primary"}
                            checked={overrideMode}
                            onChange={e => {
                                setOverrideMode(e.target.checked);
                                setMode(payloads?.find(p => p._id === payload)?.preferred_mode || null);
                            }}
                        />
                        <Form.Label>{t('transport_edit_override_mode')}</Form.Label>
                    </Grid>
                    <Grid item xs={6}>
                        <PayloadSelector
                            payload={payload}
                            onPayloadChange={setPayload}
                            errorPayload={errorPayload}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <ModeSelector
                            disabled={!overrideMode}
                            mode={overrideMode ? mode : (payloads?.find(p => p._id === payload)?.preferred_mode || -1)}
                            onModeChange={setMode}
                            payloadType={getPayloadType(payloads?.find(p => p._id === payload)?.type)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant={"h6"}>
                            {t("transport_edit_transport")}
                        </Typography>
                    </Grid>
                    <Grid container item xs={12} spacing={"1"}>
                        <TransportTimeSelector
                            date={new Date(timestamp)}
                            isStart={isStartTime}
                            onChangeDate={d => setTimeStamp(d.getTime())}
                            onChangeIsStart={setIsStartTime}
                            error={errorTimeStamp}
                        />
                    </Grid>
                    <Grid container item xs={12} spacing={"1"}>
                        <Grid item xs={6}>
                            <Switch
                                size={"small"}
                                color={"primary"}
                                checked={overrideStartLocation}
                                onChange={e => {
                                    setOverrideStartLocation(e.target.checked);
                                }}
                            />
                            <Form.Label>{t('transport_edit_override_start')}</Form.Label>
                        </Grid>
                        <Grid item xs={6}/>
                        <Grid item xs={6}>
                            <LocationSelector
                                disabled={!overrideStartLocation}
                                location={startLocation}
                                fallbackPayload={payload}
                                onChange={setStartLocation}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <LocationSelector
                                location={goal}
                                onChange={setGoal}
                                error={errorGoal}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant={"contained"} onClick={onCancel}>
                    {t("transport_edit_cancel")}
                </Button>
                <Button variant={"contained"} color={"primary"} disabled={!canSubmit} onClick={() => canSubmit && onSubmit({
                    ...(transport || {status: TransportStates.WAITING.v, platform_nr: -1}),
                    payload: payload,
                    goal_location: goal,
                    time_stamp: timestamp,
                    is_start_time: isStartTime,
                    override_mode: overrideMode ? mode : null,
                    override_start_location: overrideStartLocation ? startLocation : null,
                })}>
                    {isEdit ? t("transport_edit_submit") : t("transport_new_submit")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
