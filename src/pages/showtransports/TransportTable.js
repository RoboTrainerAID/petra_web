import {Grid, IconButton, InputLabel, makeStyles, Paper, Typography} from "@material-ui/core";
import {TransportTableRow} from "./TransportTableRow";
import {useTransportList} from "../../petra_central_control/useTransport";
import {useTranslation} from "react-i18next";
import {useCallback, useMemo, useState} from "react";
import Divider from "@material-ui/core/Divider";
import ModalAssignPlatform from "../../components/modals/ModalAssignPlatform";
import ModalRealeasePlatform from "../../components/modals/ModalReleasePlatform";
import TransportStates, {allTransportStates, compareStates, getTransportState} from "../../constants/TransportStates";
import ModalTransportInformation from "../../components/modals/ModalTransportInformation";
import {usePayloadList} from "../../petra_central_control/usePayload";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {Add, ArrowUpward} from "@material-ui/icons";
import FormControl from "@material-ui/core/FormControl";
import {getPayloadType} from "../../constants/PayloadTypes";
import {useLocationList} from "../../petra_central_control/useLocation";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import {ModalEditTransport} from "../../components/modals/ModalEditTransport";
import FilterList from "@material-ui/icons/FilterList";
import Clear from "@material-ui/icons/Clear";

export const STATE_COLUMN_WIDTH = 3;
export const PAYLOAD_COLUMN_WIDTH = 2;
export const LOCATION_COLUMN_WIDTH = 2;
export const PLATFORM_COLUMN_WIDTH = 2;
export const ACTION_COLUMN_WIDTH = 1;

const useStyles = makeStyles(() => ({
    headerItem: {
        padding: ".5rem",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: ".5rem",
    },
    filterItem: {
        padding: ".5rem",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    filterStateControl: {
        position: "relative",
        maxWidth: "16rem",
        minWidth: "16rem",
        display: "block",
    },
    filterStateSelect: {
        maxWidth: "100%",
        minWidth: "100%"
    },
    filterPayloadControl: {
        position: "relative",
        maxWidth: "16rem",
        minWidth: "16rem",
        display: "block",
    },
    filterPayloadSelect: {
        maxWidth: "100%",
        minWidth: "100%",
    },
    filterLocationControl: {
        position: "relative",
        maxWidth: "12rem",
        minWidth: "12rem",
        display: "block",
    },
    filterLocationSelect: {
        maxWidth: "100%",
        minWidth: "100%",
    }
}));

export function  TransportTable() {
    const { t } = useTranslation();
    const styles = useStyles();
    const [ transports, info, addTransport, setTransport, removeTransport, ] = useTransportList();
    const [ payloads, pInfo, ] = usePayloadList();
    const [ locations, lInfo, ] = useLocationList();

    const [ showCreateTransport, setShowCreateTransport] = useState();

    const [ editTransportId, setEditTransportId ] = useState(0);
    const [ deleteTransportId, setDeleteTransportId ] = useState(0);
    const [ assignPlatformTransport, setAssignPlatformTransport ] = useState(0); //transport ids are bigger than 0
    const [ releasePlatformTransport, setReleasePlatformTransport ] = useState(0);
    const [ infoTransportId, setInfoTransportId ] = useState(0);

    const [ filterPayload, setFilterPayload ] = useState(0);
    const [ filterState, setFilterState ] = useState(-1);
    const [ filterStartLocation, setFilterStartLocation ] = useState(0);
    const [ filterGoalLocation, setFilterGoalLocation ] = useState(0);

    const filteredTransports = transports?.filter(t => filterPayload <= 0 || t.payload === filterPayload)
        .filter(t => filterState <= -1 || t.status === filterState)
        .filter(t => filterGoalLocation <= 0 || t.goal_location === filterGoalLocation)
        .filter(t => filterStartLocation <= 0 || (t.override_start_location > 0 ? t.override_start_location === filterStartLocation
            : payloads?.find(p => p._id === t.payload)?.location === filterStartLocation));

    const sorters = useMemo(() => ({
        state: (a, b) => {
            const stateComp = compareStates(getTransportState(a?.status), getTransportState(b?.status));
            if (stateComp === 0) {
                const aStamp = a?.time_stamp - (a?.is_start_time ? 0 : a?.duration) * 60000;
                const bStamp = b?.time_stamp -  (b?.is_start_time ? 0 : b?.duration) * 60000;

                return -(aStamp - bStamp) // bigger timestamps are more recent
            }

            return stateComp;
        },
        payload: (a, b) => {
            const aPayload = payloads?.find(p => p._id === a?.payload);
            const bPayload = payloads?.find(p => p._id === b?.payload);
            return aPayload?.name.localeCompare(bPayload?.name);
        },
        start: (a, b) => {
            const aPayload = payloads?.find(p => p._id === a?.payload);
            const bPayload = payloads?.find(p => p._id === b?.payload);
            const aLocation = locations?.find(l => l._id === (a?.override_start_location || aPayload?.location));
            const bLocation = locations?.find(l => l._id === (b?.override_start_location || bPayload?.location));

            return aLocation?.name.localeCompare(bLocation?.name);
        },
        goal: (a, b) => {
            const aLocation = locations?.find(l => l._id === a?.goal_location);
            const bLocation = locations?.find(l => l._id === b?.goal_location);

            return aLocation?.name.localeCompare(bLocation?.name);
        }
    }), [ payloads, locations ]);

    const sorterConfigs = useMemo(() => ({
        state: ["goal", "start", "payload", "state"],
        payload: ["goal", "start", "state", "payload"],
        start: ["goal", "payload", "state", "start"],
        goal: ["start", "payload", "state", "goal"],
    }), []);
    const [ sorter, setSorter ] = useState("state");
    const [ sortReverse, setSortReverse] = useState(false);
    let sortedTransports = filteredTransports;
    for (const sort of sorterConfigs[sorter]) {
        sortedTransports = sortedTransports?.sort((a, b) => ((sort === sorter) && (sortReverse) ? -1 : 1) * sorters[sort](a, b));
    }

    const infoTransport = useCallback(id => {
        setInfoTransportId(id);
    }, []);

    const editTransport = useCallback(id => {
        setEditTransportId(id);
    }, []);

    const editTransportConfirmed = useCallback( transport => {
        setTransport(transport);
        setEditTransportId(0);
    }, [ setTransport ]);

    const deleteTransport = useCallback(id => {
        setDeleteTransportId(id);
    }, []);

    const confirmDeleteTransport = useCallback(id => {
        const transport = transports.find(t => t._id === id);
        if (!!transport) {
            removeTransport(transport);
        }
    }, [transports, removeTransport]);

    const assignPlatform = useCallback(id => {
        setAssignPlatformTransport(id);
    }, []);

    const assignPlatformConfirmed = useCallback((id, platform) => {
        const transport = transports.find(t => t._id === id);
        if (!!transport) {
            const newTransport = {...transport};
            newTransport.platform_nr = platform;
            if (TransportStates.WAITING_FOR_PLATFORM_ASSIGNMENT.matches(newTransport.status)) {
                newTransport.status = TransportStates.COUPLING.v;
            }

            setTransport(newTransport);
        }
    }, [ transports, setTransport ]);

    const releasePlatform = useCallback(id => {
        setReleasePlatformTransport(id);
    }, []);

    const releasePlatformConfirmed = useCallback( id => {
        const transport = transports.find(t => t._id === id);
        if (!!transport) {
            const newTransport = {...transport};
            newTransport.platform_nr = -1;
            if (TransportStates.WAITING_FOR_UNLOAD.matches(newTransport.status)) {
                newTransport.status = TransportStates.DONE.v
            }
            setTransport(newTransport);
        }
    }, [ transports, setTransport ]);

    const transportToDelete = transports?.find(t => t._id === deleteTransportId);
    const transportForInfo = transports?.find(t => t._id === infoTransportId);

    return (
        <>
            <ModalEditTransport
                show={showCreateTransport}
                onCancel={() => setShowCreateTransport(false)}
                onSubmit={t => {
                    addTransport(t);
                    setShowCreateTransport(false);
                }}
            />
            <ModalEditTransport
                show={editTransportId > 0}
                transport={transports?.find(t => t._id === editTransportId)}
                onCancel={() => setEditTransportId(0)}
                onSubmit={t => editTransportConfirmed(t)}
            />
            <ModalAssignPlatform
                show={assignPlatformTransport > 0}
                selectedPlatform={0}
                onSetPlatform={p => {
                    assignPlatformConfirmed(assignPlatformTransport, p);
                    setAssignPlatformTransport(0);
                }}
                onHide={() => setAssignPlatformTransport(0)}
            />
            <ModalRealeasePlatform
                show={releasePlatformTransport > 0}
                transport={releasePlatformTransport}
                onConfirm={() => {
                    releasePlatformConfirmed(releasePlatformTransport);
                    setReleasePlatformTransport(0);
                }}
                onHide={() => setReleasePlatformTransport(0)}
            />
            {deleteTransportId > 0 && <ModalTransportInformation
                transport={transportToDelete}
                onAccept={() => {
                    confirmDeleteTransport(deleteTransportId);
                    setDeleteTransportId(0);
                }}
                onCancel={() => setDeleteTransportId(0)}
                title={"modal_delete_transport_title"}
                message={"modal_delete_transport_message"}
                accept={"modal_delete_transport_confirm"}
                cancel={"modal_delete_transport_cancel"}
            />}
            {infoTransportId > 0 && <ModalTransportInformation
                transport={transportForInfo}
                onAccept={() => setInfoTransportId(0)}
                onCancel={() => setInfoTransportId(0)}
                title={"modal_info_transport_title"}
                message={"modal_info_transport_message"}
                accept={"modal_info_transport_confirm"}
                cancel={"modal_info_transport_cancel"}
            />}
            <Paper>
                <Grid container>
                    <Grid item xs={STATE_COLUMN_WIDTH} className={styles.headerItem}>
                        <IconButton size={"small"} color={sorter === "state" ? "primary" : undefined} onClick={() => {
                            if (sorter === "state") {
                                setSortReverse(!sortReverse);
                            } else {
                                setSorter("state");
                                setSortReverse(false);
                            }
                        }}>
                            {sorter !== "state" && <FilterList/>}
                            {sorter === "state" && sortReverse && <ArrowDownward/>}
                            {sorter === "state" && !sortReverse && <ArrowUpward/>}
                        </IconButton>

                        <Typography variant={"h6"}>
                            {t('transport_table_column_state')}
                        </Typography>
                    </Grid>
                    <Grid item xs={PAYLOAD_COLUMN_WIDTH} className={styles.headerItem}>
                        <IconButton size={"small"} color={sorter === "payload" ? "primary" : undefined} onClick={() => {
                            if (sorter === "payload") {
                                setSortReverse(!sortReverse);
                            } else {
                                setSorter("payload");
                                setSortReverse(false);
                            }
                        }}>
                            {sorter !== "payload" && <FilterList/>}
                            {sorter === "payload" && sortReverse && <ArrowDownward/>}
                            {sorter === "payload" && !sortReverse && <ArrowUpward/>}
                        </IconButton>

                        <Typography variant={"h6"}>
                            {t('transport_table_column_payload')}
                        </Typography>
                    </Grid>
                    <Grid item xs={LOCATION_COLUMN_WIDTH} className={styles.headerItem}>
                        <IconButton size={"small"} color={sorter === "start" ? "primary" : undefined} onClick={() => {
                            if (sorter === "start") {
                                setSortReverse(!sortReverse);
                            } else {
                                setSorter("start");
                                setSortReverse(false);
                            }
                        }}>
                            {sorter !== "start" && <FilterList/>}
                            {sorter === "start" && sortReverse && <ArrowDownward/>}
                            {sorter === "start" && !sortReverse && <ArrowUpward/>}
                        </IconButton>

                        <Typography variant={"h6"}>
                            {t('transport_table_column_start_location')}
                        </Typography>
                    </Grid>
                    <Grid item xs={LOCATION_COLUMN_WIDTH} className={styles.headerItem}>
                        <IconButton size={"small"} color={sorter === "goal" ? "primary" : undefined} onClick={() => {
                            if (sorter === "goal") {
                                setSortReverse(!sortReverse);
                            } else {
                                setSorter("goal");
                                setSortReverse(false);
                            }
                        }}>
                            {sorter !== "goal" && <FilterList/>}
                            {sorter === "goal" && sortReverse && <ArrowDownward/>}
                            {sorter === "goal" && !sortReverse && <ArrowUpward/>}
                        </IconButton>

                        <Typography variant={"h6"}>
                            {t('transport_table_column_goal_location')}
                        </Typography>
                    </Grid>
                    <Grid item xs={PLATFORM_COLUMN_WIDTH} className={styles.headerItem}>
                        <Typography variant={"h6"}>
                            {t('transport_table_column_platform')}
                        </Typography>
                    </Grid>
                    <Grid item xs={ACTION_COLUMN_WIDTH} className={styles.headerItem}>
                        <Typography variant={"h6"}>
                            {t('transport_table_column_actions')}
                        </Typography>
                    </Grid>
                    <Grid item xs={STATE_COLUMN_WIDTH} className={styles.filterItem}>
                        <FormControl
                            className={styles.filterStateControl}
                            variant={"outlined"}
                            size={"small"}
                        >
                            <InputLabel id={"filter-state-select-label"}>{t("transport_table_filter_state")}</InputLabel>
                            <Select
                                className={styles.filterStateSelect}
                                label={t("transport_table_filter_state")}
                                labelId={"filter-state-select-label"}
                                id={"filter-state-select"}
                                value={filterState < 0 ? "" : filterState}
                                onChange={e => setFilterState(e.target.value)}
                            >
                                {allTransportStates.map(ts => <MenuItem value={ts.v}>
                                    {t(ts.t)}
                                </MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={PAYLOAD_COLUMN_WIDTH} className={styles.filterItem}>
                        <FormControl
                            className={styles.filterPayloadControl}
                            variant={"outlined"}
                            size={"small"}
                        >
                            <InputLabel id={"filter-payload-select-label"}>{t("transport_table_filter_payload")}</InputLabel>
                            <Select
                                className={styles.filterPayloadSelect}
                                label={t("transport_table_filter_payload")}
                                labelId={"filter-payload-select-label"}
                                id={"filter-payload-select"}
                                value={filterPayload <= 0 ? "" : filterPayload}
                                onChange={e => setFilterPayload(e.target.value)}
                            >
                                {!!payloads && payloads.map(p => {
                                    const pType = getPayloadType(p.type);
                                    return <MenuItem key={p._id} value={p._id}>
                                        {pType.formatName(p)}
                                    </MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={LOCATION_COLUMN_WIDTH} className={styles.filterItem}>
                        <FormControl
                            className={styles.filterLocationControl}
                            variant={"outlined"}
                            size={"small"}
                        >
                            <InputLabel id={"filter-start-select-label"}>{t("transport_table_filter_start_location")}</InputLabel>
                            <Select
                                className={styles.filterLocationSelect}
                                label={t("transport_table_filter_start_location")}
                                labelId={"filter-start-select-label"}
                                id={"filter-start-select"}
                                value={filterStartLocation <= 0 ? "" : filterStartLocation}
                                onChange={e => setFilterStartLocation(e.target.value)}
                            >
                                {lInfo.isSuccess && locations.map(l => <MenuItem value={l._id}>
                                    {l.name}
                                </MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={LOCATION_COLUMN_WIDTH} className={styles.filterItem}>
                        <FormControl
                            className={styles.filterLocationControl}
                            variant={"outlined"}
                            size={"small"}
                        >
                            <InputLabel id={"filter-goal-select-label"}>{t("transport_table_filter_goal_location")}</InputLabel>
                            <Select
                                className={styles.filterLocationSelect}
                                label={t("transport_table_filter_goal_location")}
                                labelId={"filter-goal-select-label"}
                                id={"filter-goal-select"}
                                value={filterGoalLocation <= 0 ? "" : filterGoalLocation}
                                onChange={e => setFilterGoalLocation(e.target.value)}
                            >
                                {lInfo.isSuccess && locations.map(l => <MenuItem value={l._id}>
                                    {l.name}
                                </MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={PLATFORM_COLUMN_WIDTH}/>
                    <Grid item xs={ACTION_COLUMN_WIDTH} className={styles.filterItem}>
                        <IconButton
                            variant={"outlined"}
                            color={"primary"}
                            size={"small"}
                            disabled={filterState < 0 && filterStartLocation <= 0 && filterGoalLocation <= 0 && filterPayload <= 0}
                            onClick={() => {
                                setFilterState(-1);
                                setFilterStartLocation(0);
                                setFilterGoalLocation(0);
                                setFilterPayload(0);
                            }}
                        >
                            <Clear/>
                        </IconButton>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider variant={"fullWidth"}/>
                    </Grid>
                    <Grid item xs={12} className={styles.headerItem} onClick={() => setShowCreateTransport(true)}>
                        <Add color={"primary"}/>
                        <Typography color={"primary"}>
                            {t("transport_table_add_transport")}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider variant={"fullWidth"}/>
                    </Grid>
                    {info.isSuccess && sortedTransports.map(t => <TransportTableRow
                        key={t._id}
                        transport_id={t._id}
                        infoTransport={() => infoTransport(t._id)}
                        editTransport={() => editTransport(t._id)}
                        deleteTransport={() => deleteTransport(t._id)}
                        assignPlatform={() => assignPlatform(t._id)}
                        releasePlatform={() => releasePlatform(t._id)}
                    />)}
                </Grid>
            </Paper>
        </>
    );
}
