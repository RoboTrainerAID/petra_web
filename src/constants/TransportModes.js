import {Accessible, DirectionsWalk} from "@material-ui/icons";
import {FaSkiingNordic, FaTractor, FaTrailer,} from "react-icons/fa";
import PayloadTypes from "./PayloadTypes";

class TransportMode {
    _value = 0;
    _translation = "";
    _icon = () => null;
    _compatible_payloads = [];
    constructor(value, translation, icon, payloads) {
        this._value = value;
        this._translation = translation;
        this._icon = icon;
        this._compatible_payloads = payloads;
    }

    isCompatible(payload) {
        return this._compatible_payloads.some(p => p.matches(payload.v));
    }

    get v() {
        return this._value;
    }

    get t() {
        return this._translation;
    }

    get i() {
        return this._icon
    }

    matches(v) {
        return v === this.v;
    }
}

export const allTransportModes = [
    new TransportMode(0, "transport_mode_wheelchair", Accessible, [PayloadTypes.PATIENT]),
    new TransportMode(1, "transport_mode_free_walking", DirectionsWalk, [PayloadTypes.PATIENT]),
    new TransportMode(2, "transport_mode_guided_walking", FaSkiingNordic, [PayloadTypes.PATIENT]),
    new TransportMode(3, "transport_mode_on_board", FaTractor, [PayloadTypes.CARGO]),
    new TransportMode(4, "transport_mode_trailer", FaTrailer, [PayloadTypes.CARGO])
];

export function getTransportMode(v) {
    return allTransportModes.find(m => m.matches(v));
}
export default {
    WHEELCHAIR: getTransportMode(0),
    FREE_WALKING: getTransportMode(1),
    GUIDED_WALKING: getTransportMode(2),
    ON_BOARD: getTransportMode(3),
    TRAILER: getTransportMode(4)
}
