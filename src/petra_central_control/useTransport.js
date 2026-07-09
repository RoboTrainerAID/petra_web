/*
    This File contains hooks for loading/writing Transports from/to petra_central_control
 */

import {FLASK_BACKEND_URL} from "../constants";
import {useQuery, useQueryClient} from "react-query";
import {useCallback} from "react";
import axios from "axios";
import TransportStates from "../constants/TransportStates";
import TransportModes, {getTransportMode} from "../constants/TransportModes";

/*
    Query Naming Constants
 */

function transportListQueryName() {
    return "transport-list";
}

function transportSingleQueryName(id) {
    return `transport-${id}`;
}

/*
    Urls
 */

function transportListUrl() {
    return `${FLASK_BACKEND_URL}/transports`
}

function transportSingleUrl(id) {
    return `${FLASK_BACKEND_URL}/transport/${id}`
}

/*
    Utility for interacting with the server
 */

function fetchTransportList() {
    return axios.get(transportListUrl());
}

function addTransport(transport) {
    const realTransport = {...transport};
    !!realTransport._id && delete realTransport._id;
    !!realTransport.duration && delete realTransport.duration;
    console.log(realTransport);
    return axios.post(transportListUrl(), realTransport, {headers: {'Content-Type': "application/json"}});
}

function setTransport(transport) {
    const realTransport = {...transport};
    !!realTransport._id && delete realTransport._id;
    !!realTransport.duration && delete realTransport.duration;
    return axios.put(transportSingleUrl(transport._id), realTransport, {headers: {'Content-Type': "application/json"}});
}

function removeTransport(id) {
    return axios.delete(transportSingleUrl(id));
}

function fetchTransport(id) {
    return axios.get(transportSingleUrl(id));
}

/*
    Actual Hooks
 */

/**
 * Retrieves a list of all known transports and utilities for modification
 * @returns [transport[], info, addTransport, setTransport, removeTransport]
 */
export function useTransportList(refetchInterval = undefined) {
    const queryClient = useQueryClient();
    const addTransportImpl = useCallback((transport, onSuccess=() =>{}, onError=(error) => {}) => {
        return addTransport(transport).then(() => {
            queryClient.invalidateQueries(transportListQueryName());
            onSuccess();
        }).catch(onError);
    }, [ queryClient ]);

    const setTransportImpl = useCallback((transport, onSuccess=() =>{}, onError=(error) => {}) => {
        return setTransport(transport).then(() => {
            queryClient.invalidateQueries(transportListQueryName());
            queryClient.invalidateQueries(transportSingleQueryName(transport._id)); //changing value of an existing transport should update its query
            onSuccess();
        }).catch(onError);
    }, [ queryClient ]);

    const removeTransportImpl = useCallback((transport, onSuccess=() =>{}, onError=(error) => {}) => {
        return removeTransport(transport._id).then(() => {
            queryClient.invalidateQueries(transportListQueryName());
            queryClient.invalidateQueries(transportSingleQueryName(transport._id)); //deleting a transport should invalidate its query
            onSuccess();
        }).catch(onError);
    }, [ queryClient ]);

    const refreshTransportsImpl = useCallback(() => queryClient.invalidateQueries(transportListQueryName()), [ queryClient ]);

    const transports = useQuery(transportListQueryName(), fetchTransportList, { refetchInterval: refetchInterval });

    return [ transports.data?.data, transports, addTransportImpl, setTransportImpl, removeTransportImpl, refreshTransportsImpl ]
}

/**
 * Retrieves a single transport and provides utility to modify it
 * @param id the id of the transport to retrieve
 * @return [transport, info, setTransport, removeTransport]
 */
export function useTransport(id) {
    const queryClient = useQueryClient();

    const setTransportImpl = useCallback((transport, onSuccess=() =>{}, onError=(error) => {}) => {
        const realTransport = { ...transport, _id: id } //force correct id to avoid setting wrong transport by mistake
        setTransport(realTransport).then(() => {
            queryClient.invalidateQueries(transportSingleQueryName(id));
            queryClient.invalidateQueries(transportListQueryName()); //transport list values change aswell
            onSuccess();
        }).catch(onError);
    }, [ queryClient, id ]);

    const removeTransportImpl = useCallback((onSuccess=() =>{},onError=(error) => {}) => {
        removeTransport(id).then(() => {
            queryClient.invalidateQueries(transportSingleQueryName(id));
            queryClient.invalidateQueries(transportListQueryName());
            onSuccess();
        }).catch(onError);
    }, [ queryClient, id ]);

    const refreshTransportImpl = useCallback(() => queryClient.invalidateQueries(transportSingleQueryName(id)), [ queryClient, id ]);

    const transport = useQuery(transportSingleQueryName(id), () => fetchTransport(id), { enabled: !!id });

    return [ transport.data?.data, transport, setTransportImpl, removeTransportImpl, refreshTransportImpl ];
}

/**
 * Calculates the next transport state given a transport and its payload
 * @param transport
 * @param payload
 * @returns {T|*}
 */
export function getNextTransportMode(transport, payload) {
    //retrieve transport mode since this is important
    let transport_mode = getTransportMode(transport.override_mode);
    if (!transport_mode) {
        transport_mode = getTransportMode(payload.preferred_mode);
    }

    //waiting can only go to inbound
    if (TransportStates.WAITING.matches(transport.status)) {
        return TransportStates.INBOUND.v;
    }

    //inbound can go to safety check, patient approval or running depending on configuration
    if (TransportStates.INBOUND.matches(transport.status)) {
        if (TransportModes.WHEELCHAIR.matches(transport_mode.v)) {
            return transport.platform_nr >= 0 ? TransportStates.WAITING_FOR_SECURITY_CHECK.v : TransportStates.WAITING_FOR_PLATFORM_ASSIGNMENT.v;
        }
    }

    //Security check can only end if platform is defined for wheelchair and trailer modes
    if (TransportStates.WAITING_FOR_SECURITY_CHECK.matches(transport.status)) {
        if (transport.platform_nr < 0) {
            return TransportStates.WAITING_FOR_SECURITY_CHECK.v;
        }

        if (TransportModes.TRAILER.matches(transport_mode.v)) {
            return TransportStates.RUNNING.v;
        }

        return TransportStates.WAITING_FOR_PATIENT_APPROVAL;
    }

    //When patient gives approval we enter running state
    if (TransportStates.WAITING_FOR_PATIENT_APPROVAL.matches(transport.status)) {
        return TransportStates.RUNNING.v;
    }

    //when running the only states following are done or waiting for unloading
    if (TransportStates.RUNNING.matches(transport_mode.v)) {
        if (transport.platform_nr >= 0) {
            return TransportStates.WAITING_FOR_UNLOAD.v;
        }

        return TransportStates.DONE;
    }
}
