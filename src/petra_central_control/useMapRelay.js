import {FLASK_BACKEND_URL} from "../constants";
import axios from "axios";
import {useQuery} from "react-query";

function mapRelayUrl() {
    return `${FLASK_BACKEND_URL}/relay/map`;
}

function mapQueryName() {
    return "transport-map";
}

function fetchMap() {
    return axios.get(mapRelayUrl());
}

function toImageString(image) {
    return `data:image/png;base64,${image}`;
}

export function useMapRelay() {
    const mapData = useQuery(mapQueryName(), fetchMap, {refetchInterval: 1000});
    const data = mapData.isSuccess && {
        ...mapData.data.data,
        image: toImageString(mapData.data.data.data),
    }

    return [data || mapData.data?.data, mapData];
}
