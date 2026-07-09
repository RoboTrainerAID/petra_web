/*
    Query naming constants
 */

import {FLASK_BACKEND_URL} from "../constants";
import axios from "axios";
import {useQuery, useQueryClient} from "react-query";
import {useCallback} from "react";

function payloadListQueryName() {
    return "payload-list";
}

function payloadSingleQueryName(id) {
    return `payload-${id}`;
}

/*
    Urls
 */

function payloadListUrl() {
    return `${FLASK_BACKEND_URL}/payloads`
}

function payloadSingleUrl(id) {
    return `${FLASK_BACKEND_URL}/payload/${id}`
}

/*
    Utilities for interacting with the server
 */

function fetchPayloadList() {
    return axios.get(payloadListUrl());
}

function addPayload(payload) {
    const realPayload = {...payload};
    realPayload._id && delete realPayload._id;
    return axios.post(payloadListUrl(), realPayload, {headers:{'Content-Type': "application/json"}});
}

function setPayload(payload) {
    const realPayload = {...payload};
    realPayload._id && delete realPayload._id;
    return axios.put(payloadSingleUrl(payload._id), realPayload, {headers:{'Content-Type': "application/json"}});
}

function removePayload(id) {
    return axios.delete(payloadSingleUrl(id));
}

function fetchPayload(id) {
    return axios.get(payloadSingleUrl(id));
}

/*
    Actual hooks
 */

/**
 * Fetches a list of Payloads from the backend and updates should any changes be done
 * @returns {(any|QueryObserverIdleResult<AxiosResponse<any>, unknown>|QueryObserverLoadingErrorResult<AxiosResponse<any>, unknown>|QueryObserverLoadingResult<AxiosResponse<any>, unknown>|QueryObserverRefetchErrorResult<AxiosResponse<any>, unknown>|QueryObserverSuccessResult<AxiosResponse<any>, unknown>|(function(*, function(*)=): Promise<AxiosResponse<any>>)|(function(*, function(*)=): Promise<AxiosResponse<any>>)|(function(*, function(*)=): Promise<AxiosResponse<any>>))[]}
 */
export function usePayloadList() {
    const queryClient = useQueryClient();

    const addPayloadImpl = useCallback((payload, onSuccess=response => {}, onError=(error) => {}) => {
        return addPayload(payload).then(r => {
            queryClient.invalidateQueries(payloadListQueryName());
            onSuccess(r.data);
        }).catch(onError);
    }, [ queryClient ]);

    const setPayloadImpl = useCallback((payload, onSuccess=() =>{}, onError=(error) => {}) => {
        return setPayload(payload).then(() => {
            queryClient.invalidateQueries(payloadListQueryName());
            queryClient.invalidateQueries(payloadSingleQueryName(payload._id));
            onSuccess();
        }).catch(onError);
    }, [ queryClient ]);

    const removePayloadImpl = useCallback((payload, onSuccess=() =>{}, onError=(error) => {}) => {
        return removePayload(payload._id).then(() => {
            queryClient.invalidateQueries(payloadListQueryName());
            queryClient.invalidateQueries(payloadSingleQueryName(payload._id));
            onSuccess();
        }).catch(onError);
    }, [ queryClient ]);

    const refreshPayloadsImpl = useCallback(() => queryClient.invalidateQueries(payloadListQueryName()), [ queryClient ]);

    const payloads = useQuery(payloadListQueryName(), fetchPayloadList);

    return [ payloads.data?.data, payloads, addPayloadImpl, setPayloadImpl, removePayloadImpl, refreshPayloadsImpl ];
}

/**
 * Fetches a single payload from the backend and updates it should changes occur
 * @param id
 * @returns {(any|QueryObserverIdleResult<AxiosResponse<any>, unknown>|QueryObserverLoadingErrorResult<AxiosResponse<any>, unknown>|QueryObserverLoadingResult<AxiosResponse<any>, unknown>|QueryObserverRefetchErrorResult<AxiosResponse<any>, unknown>|QueryObserverSuccessResult<AxiosResponse<any>, unknown>|(function(*, function(*)=): Promise<AxiosResponse<any>>)|(function(function(*)=): Promise<AxiosResponse<any>>))[]}
 */
export function usePayload(id) {
    const queryClient = useQueryClient();

    const setPayloadImpl = useCallback((payload, onSuccess=() =>{}, onError=(error) => {}) => {
        const realPayload = {...payload};
        return setPayload(realPayload).then(() => {
            queryClient.invalidateQueries(payloadListQueryName());
            queryClient.invalidateQueries(payloadSingleQueryName(id));
            onSuccess();
        }).catch(onError);
    }, [ queryClient, id ]);

    const removePayloadImpl = useCallback((onSuccess=() =>{}, onError=(error) => {}) => {
        return removePayload(id).then(() => {
            queryClient.invalidateQueries(payloadListQueryName());
            queryClient.invalidateQueries(payloadSingleQueryName(id));
            onSuccess();
        }).catch(onError);
    }, [ queryClient, id ]);

    const refreshPayloadImpl = useCallback(() => queryClient.invalidateQueries(payloadSingleQueryName(id)), [ queryClient, id ]);

    const payload = useQuery(payloadSingleQueryName(id), () => fetchPayload(id), { enabled: !!id });
    return [ payload.data?.data, payload, setPayloadImpl, removePayloadImpl, refreshPayloadImpl ];
}
