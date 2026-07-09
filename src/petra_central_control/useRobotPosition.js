import {FLASK_BACKEND_URL} from "../constants";
import axios from "axios";
import {useQuery} from "react-query";

function robotPositionRelayUrl() {
    return `${FLASK_BACKEND_URL}/relay/position`
}

function robotPositionQueryName() {
    return "robot-position"
}

function fetchRobotPosition() {
    return axios.get(robotPositionRelayUrl());
}

/**
 * Fetches robot position from the backend
 * @returns {(any|QueryObserverIdleResult<AxiosResponse<any>, unknown>|QueryObserverLoadingErrorResult<AxiosResponse<any>, unknown>|QueryObserverLoadingResult<AxiosResponse<any>, unknown>|QueryObserverRefetchErrorResult<AxiosResponse<any>, unknown>|QueryObserverSuccessResult<AxiosResponse<any>, unknown>)[]}
 */
export function useRobotPosition() {
    const positionData = useQuery(robotPositionQueryName(), fetchRobotPosition, { refetchInterval: 200 });
    return [ positionData.data?.data, positionData ];
}
