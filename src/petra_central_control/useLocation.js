/*
    Query Naming Constants
 */

import {FLASK_BACKEND_URL} from "../constants";
import axios from "axios";
import {useQuery, useQueryClient} from "react-query";
import {useCallback} from "react";

function locationListQueryName() {
    return "location-list";
}

function locationSingleQueryName(id) {
    return `location-${id}`
}

/*
    Urls
 */

function locationListUrl() {
    return `${FLASK_BACKEND_URL}/locations`;
}

function locationSingleUrl(id) {
    return `${FLASK_BACKEND_URL}/location/${id}`
}

/*
    Utilities for interacting with the server
 */

function fetchLocationList() {
    return axios.get(locationListUrl());
}

function addLocation(location) {
    const realLocation = {...location};
    realLocation._id && delete realLocation._id;
    return axios.post(locationListUrl(), realLocation, {headers: {'Content-Type': "application/json"}});
}

function setLocation(location) {
    const realLocation = {...location};
    realLocation._id && delete realLocation._id;
    return axios.put(locationSingleUrl(location._id), realLocation, {headers: {'Content-Type': "application/json"}});
}

function removeLocation(id) {
    return axios.delete(locationSingleUrl(id));
}

function fetchLocation(id) {
    return axios.get(locationSingleUrl(id));
}

/*
    Actual Hooks
 */

/**
 * Fetches a list of all locations from the backend and provides methods to modify them
 * @returns [location[], info, addTransport, setTransport, removeTransport]
 */
export function useLocationList() {
    const queryClient = useQueryClient();

    const addLocationImpl = useCallback((location, onSuccess=() =>{}, onError=(error) => {}) => {
        return addLocation(location).then(() => {
            queryClient.invalidateQueries(locationListQueryName());
            onSuccess();
        }).catch(onError);
    }, [ queryClient ]);

    const setLocationImpl = useCallback((location, onSuccess=() =>{}, onError=(error) => {}) => {
        return setLocation(location).then(() => {
            queryClient.invalidateQueries(locationListQueryName());
            queryClient.invalidateQueries(locationSingleQueryName(location._id));
            onSuccess();
        }).catch(onError);
    }, [ queryClient ]);

    const removeLocationImpl = useCallback((location, onSuccess=() =>{}, onError=(error) => {}) => {
        return removeLocation(location._id).then(() => {
            queryClient.invalidateQueries(locationListQueryName());
            queryClient.invalidateQueries(locationSingleQueryName(location._id));
            onSuccess();
        }).catch(onError);
    }, [ queryClient ]);

    const refreshLocationsImpl = useCallback(() => queryClient.invalidateQueries(locationListQueryName()), [ queryClient ]);

    const locations = useQuery(locationListQueryName(), fetchLocationList);

    return [ locations.data?.data, locations, addLocationImpl, setLocationImpl, removeLocationImpl, refreshLocationsImpl ];
}

/**
 * Fetches data for a single location and provides methods to modify it
 * @param id the id of the location to retrieve
 * @returns [ location, info, setLocation, removeLocation ]
 */
export function useLocation(id) {
    const queryClient = useQueryClient();
    const setLocationImpl = useCallback((location, onSuccess=() =>{}, onError=(error) => {}) => {
        const realLocation = {...location, _id: id}; //force correct id without modifying parameter
        return setLocation(realLocation).then(() => {
            queryClient.invalidateQueries(locationListQueryName());
            queryClient.invalidateQueries(locationSingleQueryName(id));
            onSuccess();
        }).catch(onError);
    }, [ id, queryClient ]);

    const removeLocationImpl = useCallback((onSuccess=() =>{}, onError=(error) => {}) => {
        return removeLocation(id).then(() => {
            queryClient.invalidateQueries(locationListQueryName());
            queryClient.invalidateQueries(locationSingleQueryName(id));
            onSuccess();
        }).catch(onError);
    }, [ queryClient, id ]);

    const refreshLocationImpl = useCallback(() => queryClient.invalidateQueries(locationSingleQueryName(id)), [ queryClient, id ]);

    const location = useQuery(locationSingleQueryName(id), () => fetchLocation(id), { enabled: !!id });

    return [ location.data?.data, location, setLocationImpl, removeLocationImpl, refreshLocationImpl ];
}
