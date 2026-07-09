import {FLASK_BACKEND_URL} from "../constants";
import axios from "axios";
import {useQuery} from "react-query";

function robotPathRelayUrl() {
    return `${FLASK_BACKEND_URL}/relay/path`
}

function robotPathQueryName() {
    return "robot-path"
}

function fetchRobotPath() {
    return axios.get(robotPathRelayUrl());
}

/**
 * Fetches robot path from backend
 * @returns {(any|QueryObserverIdleResult<AxiosResponse<any>, unknown>|QueryObserverLoadingErrorResult<AxiosResponse<any>, unknown>|QueryObserverLoadingResult<AxiosResponse<any>, unknown>|QueryObserverRefetchErrorResult<AxiosResponse<any>, unknown>|QueryObserverSuccessResult<AxiosResponse<any>, unknown>)[]}
 */
export function useRobotPath() {
    const positionData = useQuery(robotPathQueryName(), fetchRobotPath, { refetchInterval: 1000 });
    return [ positionData.data?.data?.nodes, positionData ];
}
