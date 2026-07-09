import {CardTravel, Person} from "@material-ui/icons";

class PayloadType {
    _value = 0;
    _translation = "";
    _icon = () => null;
    _formatName = p => p.name;

    constructor(value, translation, icon, formatName) {
        this._value = value;
        this._translation = translation;
        this._icon = icon;
        this._formatName = formatName;
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

    formatName(payload) {
        return this._formatName(payload)
    }
    matches(v) {
        return this._value === v;
    }
}

export const allPayloadTypes = [
    new PayloadType(0, "payload_type_patient", Person, p => `${p?.name} ${p?.last_name}`),
    new PayloadType(1, "payload_type_cargo", CardTravel, p => p?.name),
];

/**
 * Retrieves the PayloadType with the matching value
 * @param v
 * @returns {PayloadType}
 */
export function getPayloadType(v) {
    return allPayloadTypes.find(t => t.matches(v));
}

/**
 * PayloadTypes by name
 */
export default {
    PATIENT: getPayloadType(0),
    CARGO: getPayloadType(1),
};
