import {MeetingRoom, Power} from "@material-ui/icons";
import { GiElevator } from "react-icons/gi";
import { FaWarehouse } from "react-icons/fa";

class LocationType {
    _value = 0;
    _translation = "";
    _icon = () => null;

    constructor(value, translation, icon) {
        this._value = value;
        this._icon = icon;
        this._translation = translation;
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
        return this.v === v;
    }
}

export const allLocationTypes = [
    new LocationType(0, "location_type_room", MeetingRoom),
    new LocationType(1, "location_type_elevator", GiElevator),
    new LocationType(2, "location_type_charging", Power),
    new LocationType(3, "location_type_storage", FaWarehouse)
];

export function getLocationType(v) {
    return allLocationTypes.find(lt => lt.matches(v));
}

export default {
    ROOM: getLocationType(0),
    ELEVATOR: getLocationType(1),
    CHARGING: getLocationType(2),
    STORAGE: getLocationType(3),
};
