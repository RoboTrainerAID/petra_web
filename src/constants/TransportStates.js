import {
    CompareArrows,
    Done,
    ExitToApp,
    HourglassEmpty,
    QueryBuilder,
    Report,
    TransferWithinAStation,
    Warning
} from "@material-ui/icons";

class TransportState {
    _value = 0;
    _translation = "";
    _petra_comment = "";
    _icon = () => null;

    constructor(value, translation, petra_comment, icon) {
        this._value = value;
        this._translation = translation;
        this._icon = icon;
        this._petra_comment = petra_comment;
    }

    get v() {
        return this._value;
    }

    get t() {
        return this._translation;
    }

    get i() {
        return this._icon;
    }

    get comment() {
        return this._petra_comment;
    }

    matches(v) {
        return this._value === v;
    }
}

export const allTransportStates = [
    new TransportState(0, "transport_state_waiting", "transport_state_comment_waiting", QueryBuilder),
    new TransportState(1, "transport_state_inbound", "transport_state_comment_inbound", ExitToApp),
    new TransportState(2, "transport_state_waiting_for_platform", "transport_state_comment_waiting_for_platform", HourglassEmpty),
    new TransportState(3, "transport_state_coupling", "transport_state_comment_coupling", CompareArrows),
    new TransportState(4, "transport_state_waiting_for_security_check", "transport_state_comment_waiting_for_security_check", HourglassEmpty),
    new TransportState(5, "transport_state_waiting_for_patient_approval", "transport_state_comment_waiting_for_patient_approval", HourglassEmpty),
    new TransportState(6, "transport_state_running", "transport_state_comment_running", TransferWithinAStation),
    new TransportState(7, "transport_state_emergency_pending", "transport_state_comment_emergency_pending", Warning),
    new TransportState(8, "transport_state_emergency_stop", "transport_state_comment_emergency_stop", Report),
    new TransportState(9, "transport_state_waiting_for_unload", "transport_state_comment_waiting_for_unload", HourglassEmpty),
    new TransportState(10, "transport_state_done", "transport_state_comment_done", Done)
];

export function getTransportState(v) {
    return allTransportStates.find(ts => ts.matches(v));
}

export function compareStates(a, b) {
    const prioritySorted = [
        getTransportState(8),
        getTransportState(7),
        getTransportState(4),
        getTransportState(2),
        getTransportState(5),
        getTransportState(9),
        getTransportState(6),
        getTransportState(3),
        getTransportState(1),
        getTransportState(0),
        getTransportState(10),
    ];

    return prioritySorted.findIndex(ts => ts.matches(a?.v)) - prioritySorted.findIndex(ts => ts.matches(b?.v));
}

export default {
    WAITING: getTransportState(0),
    INBOUND: getTransportState(1),
    WAITING_FOR_PLATFORM_ASSIGNMENT: getTransportState(2),
    COUPLING: getTransportState(3),
    WAITING_FOR_SECURITY_CHECK: getTransportState(4),
    WAITING_FOR_PATIENT_APPROVAL: getTransportState(5),
    RUNNING: getTransportState(6),
    EMERGENCY_PENDING: getTransportState(7),
    EMERGENCY_STOP: getTransportState(8),
    WAITING_FOR_UNLOAD: getTransportState(9),
    DONE: getTransportState(10)
};
