import {ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import React from "react";
import {useTranslation} from "react-i18next";
import TransportStates, {getTransportState} from "../../constants/TransportStates";

export function StateTableCell({ state, timeStamp, isStartTime, duration }) {
    const { t } = useTranslation();

    const transportState = getTransportState(state);

    const arrival = new Date(timeStamp + (isStartTime ? duration : 0) * 60000);
    const start = new Date(timeStamp - (isStartTime ? 0 : duration) * 60000);
    const now = new Date();

    let timeContextString = "";
    if (TransportStates.WAITING.matches(state)
        || TransportStates.INBOUND.matches(state)
        || TransportStates.WAITING_FOR_SECURITY_CHECK.matches(state)
        || TransportStates.WAITING_FOR_PATIENT_APPROVAL.matches(state)) { //while the transport is not started, we show when it starts
        const mins = (start.getTime() - now.getTime()) / 60000;
        if (mins > 0) {
            timeContextString = t('transport_starts_in', { duration: Math.ceil(mins) });
        } else {
            timeContextString = t('transport_start_overdue', { duration: Math.abs(Math.ceil(mins)) });
        }
    }

    if (TransportStates.RUNNING.matches(state)) {
        const mins = (arrival.getTime() - now.getTime()) / 60000;
        if (mins > 0) {
            timeContextString = t('transport_arrives_in', { duration: Math.ceil(mins) });
        } else {
            timeContextString = t('transport_delayed_on_route', { duration: Math.abs(Math.ceil(mins)) });
        }
    }

    if (TransportStates.DONE.matches(state) || TransportStates.WAITING_FOR_UNLOAD.matches(state)) {
        timeContextString = t('transport_done');
    }

    return <ListItem>
        <ListItemIcon>
            <transportState.i/>
        </ListItemIcon>
        <ListItemText primary={t(transportState.t)} secondary={timeContextString}/>
    </ListItem>
}
