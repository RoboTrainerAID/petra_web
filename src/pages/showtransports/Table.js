import React, {forwardRef, useCallback, useMemo} from 'react';
import deLocale from "date-fns/locale/de"
import DateFnsUtils from "@date-io/date-fns";

//Styling
import {makeStyles} from "@material-ui/core/styles";

//Icons&Images
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteI from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

//Components
import {KeyboardDateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import ModalAssignPlatform from "../../components/modals/ModalAssignPlatform";
import ModalRealeasePlatform from "../../components/modals/ModalReleasePlatform";
import {useTransportList} from "../../petra_central_control/useTransport";
import {useLocationList} from "../../petra_central_control/useLocation";
import LocationSelector from "../../components/selects/LocationSelector";
import {useTranslation} from "react-i18next";
import {usePayloadList} from "../../petra_central_control/usePayload";
import {PayloadTableCell} from "./PayloadTableCell";
import {TimeTableCell} from "./TimeTableCell";
import {LocationTableCell} from "./LocationTableCell";
import {ModeTableCell} from "./ModeTableCell";
import {StateTableCell} from "./StateTableCell";
import {getPayloadType} from "../../constants/PayloadTypes";
import {allTransportModes} from "../../constants/TransportModes";
import {PlatformTableCell} from "./PlatformTableCell";
import TransportStates, {allTransportStates} from "../../constants/TransportStates";
import {TransportTable} from "./TransportTable";


const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteI {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const useStyles = makeStyles({
    root: {
        zIndex: "1020",
        height: "20px",
        paddingTop: "12px",
        paddingBottom: "10px"
    },
    button: {
        fontSize: "15px",
        width: '100%',
        textAlign: 'left'
    },
    logo: {
        marginRight: 5,
    },
    filter: {
        marginTop: "-3rem",
        marginBottom: "2rem",
        marginLeft: "2px",
        display: "flex",
        flexDirection: "row",
        '@media (max-width: 767px)': {
            display: "none !important",
        }
    },
    filterLabel: {
        display: "inline-block",
        marginTop: "9px",
    }
})

const localeMap = {
    de: deLocale,
};


export default function DataTable() {
    const { useState } = React;
    const classes = useStyles();
    const [locale] = useState("de");
    const tableRef = React.createRef();

    const { t, i18n } = useTranslation();

    const [modalShow, setModalShow] = React.useState(false);
    const [modalReleaseShow, setModalReleaseShow] = React.useState(false);
    const [selectedId, setSelectedId] = React.useState(null);
    const [selectedPlatform, setSelectedPlatform] = React.useState(null);

    const [ transports, transportsInfo, addTransport, setTransport, removeTransport, refreshTransports ] = useTransportList();
    //deep copy transports to avoid unwanted fields coming into react-queries state
    const transportsCopy = useMemo(() => transports?.map(t => ({...t})), [transports]);

    const [ locations, locationInfo, addLocation, setLocation, removeLocation ] = useLocationList();
    const location_lookup = useMemo(() => {
        if (!locations) {
            return {};
        }

        const result = {};
        for (const location of locations) {
            result[location._id] = location.name;
        }

        return result;
    }, [ locations ]);

    const [ payloads, payloadInfo, addPayload, setPayload, removePayload ] = usePayloadList();
    const payload_lookup = useMemo(() => {
        if (!payloads) {
            return {};
        }

        const result = {};
        for (const payload of payloads) {
            result[payload._id] = getPayloadType(payload.type).formatName(payload);
        }

        return result;
    }, [ payloads ]);

    const mode_lookup = useMemo(() => {
        const result = {};
        for (const mode of allTransportModes) {
            result[mode.v] = t(mode.t);
        }

        return result;
    }, [ t ]);

    const state_lookup = useMemo(() => {
        const result = {};
        for (const state of allTransportStates) {
            result[state.v] = t(state.t);
        }

        return result;
    }, [ t ]);

    const columns = useMemo( () => [
        {
            title: t('transport_table_column_payload'),
            editable: 'never',
            field: 'payload',
            type: 'number',
            headerStyle: {
                fontSize: '15px',
                fontWeight: 'bold',
            },
            cellStyle: {
                fontSize: '15px',
                minWidth: 190,
            },
            render: rowData => <PayloadTableCell payload={rowData.payload}/>,
            lookup: payload_lookup,
        },
        {
            title: t('transport_table_column_time'),
            field: 'time_stamp',
            editable: 'never',
            type: "datetime",
            defaultSort: "asc",
            headerStyle: {
                fontSize: '15px',
                fontWeight: 'bold'
            },
            cellStyle: {
                fontSize: '15px',
                minWidth: 190,
            },
            render: rowData => <TimeTableCell isStart={rowData.is_start_time} timeStamp={rowData.time_stamp} duration={rowData.duration}/>,
            editComponent: props =>
            (
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMap[locale]}>
                    <KeyboardDateTimePicker
                        format="dd.MM.yyyy',' HH:mm 'Uhr'"
                        mask="__.__.____, __:__ Uhr"
                        ampm={false}
                        style={{
                            width: "210px",
                        }}
                        id="start-picker"
                        value={props.value}
                        onChange={e => props.onChange(e)}
                        KeyboardButtonProps={{
                            'aria-label': 'change time',
                        }}
                        invalidDateMessage='Unzulässiges Format'
                        minDateMessage='Datum liegt in der Vergangenheit'
                        showTodayButton={true}
                        todayLabel={React.createElement('span', null, 'Jetzt')}
                        cancelLabel={React.createElement('span', null, 'Zurück')}
                        disablePast
                    />
                </MuiPickersUtilsProvider>),
            customSort: (a, b) => a.time_stamp - b.time_stamp,
            filtering: false,
        },
        {
            title: t('transport_table_column_start_location'),
            field: 'override_start_location',
            type: "string",
            headerStyle: {
                fontSize: '15px',
                fontWeight: 'bold'
            },
            cellStyle: {
                fontSize: '15px',
            },
            render: rowData => <LocationTableCell fallbackPayload={rowData.payload} location={rowData.override_start_location}/>,
            editComponent: props => (
                <LocationSelector
                    location={props.value || -1}
                    onChange={v => props.onChange(v)}
                    fallbackPayload={props.rowData.payload}
                />
            ),
            filtering: true,
            lookup: location_lookup,
            customFilterAndSearch: (term, rowData) => {
                if (!term.length) return true;
                if (!!rowData.override_start_location) {
                    return term.includes(`${rowData.override_start_location}`);
                }

                //search for payload and use its default location
                const payload = payloads.find(p => p._id === rowData.payload);
                return term.includes(`${payload.location}`);
            }
        },
        {
            title: t('transport_table_column_goal_location'),
            field: 'goal_location',
            type: "string",
            headerStyle: {
                fontSize: '15px',
                fontWeight: 'bold'
            },
            cellStyle: {
                fontSize: '15px',
            },
            render: rowData => <LocationTableCell fallbackPayload={rowData.payload} location={rowData.goal_location}/>,
            editComponent: props => (
                <LocationSelector
                    location={props.value}
                    onChange={v => props.onChange(v)}
                />
            ),
            filtering: true,
            lookup: location_lookup,
        },
        {
            title: t('transport_table_column_transport_mode'),
            field: 'override_mode',
            type: "string",
            editable: 'never',
            render: rowData => <ModeTableCell mode={rowData.override_mode} fallbackPayload={rowData.payload}/>,
            headerStyle: {
                fontSize: '15px',
                fontWeight: 'bold',
            },
            cellStyle: {
                fontSize: '15px',
            },
            lookup: mode_lookup,
            customFilterAndSearch: (term, rowData) => {
                if (!term.length) return true;
                if (!!rowData.override_mode) {
                    return term.includes(`${rowData.override_mode}`);
                }

                //search for payload and use its default location
                const payload = payloads.find(p => p._id === rowData.payload);
                return term.includes(`${payload.preferred_mode}`);
            }
        },
        {
            title: t("transport_table_column_platform"),
            editable: 'never',
            type: 'number',
            headerStyle: {
                fontSize: '15px',
                fontWeight: 'bold',
            },
            cellStyle: {
                fontSize: '15px',
            },
            render: rowData => <PlatformTableCell
                state={rowData.status}
                fallbackPayload={rowData.payload}
                mode={rowData.override_mode}
                platform={rowData.platform_nr}
                onSetPlatform={() => {
                    setSelectedId(rowData._id);
                    setModalShow(true);
                }}
                onReleasePlatform={() => {
                    setSelectedId(rowData._id);
                    setModalReleaseShow(true);
                }}
            />
        },
        {
            title: t('transport_table_column_eta'),
            editable: 'never',
            type: 'string',
            render: rowData => <StateTableCell
                state={rowData.status}
                timeStamp={rowData.time_stamp}
                isStartTime={rowData.is_start_time}
                duration={rowData.duration}
            />,
            filtering: true,
            lookup: state_lookup,
            customFilterAndSearch: (term, rowData) => {
                if (!term.length) return true;
                return term.includes(`${rowData.status}`);
            },
            headerStyle: {
                fontSize: '15px',
                fontWeight: 'bold',
            },
            cellStyle: {
                fontSize: '15px',
            },
        },
    ], [ i18n.language, payload_lookup, location_lookup ]);

    const onAssignPlatformConfirmed = useCallback((platform) => {
        //search transport
        const transport = transportsCopy.find(t => t._id === selectedId);
        if (!!transport) {
            const real_transport = {...transport};
            delete real_transport.tableData;
            real_transport.platform_nr = platform;

            if (TransportStates.WAITING_FOR_PLATFORM_ASSIGNMENT.matches(real_transport.status)) {
                real_transport.status = TransportStates.COUPLING.v;
            }

            setTransport(real_transport);
        }
    }, [ selectedId, transportsCopy, setTransport ]);

    const onReleasePlatformConfirmed = useCallback(() => {
        //search transport
        const transport = transportsCopy.find(t => t._id === selectedId);
        if (!!transport) {
            const real_transport = {...transport};
            delete real_transport.tableData;
            real_transport.platform_nr = -1;

            if (TransportStates.WAITING_FOR_UNLOAD.matches(real_transport.status)) {
                real_transport.status = TransportStates.DONE.v;
            }

            setTransport(real_transport);
        }
    }, [ selectedId, transportsCopy, setTransport ]);

    return (
        <>
            <ModalAssignPlatform
                show={modalShow}
                selectedPlatform={0}
                onSetPlatform={p => {
                    onAssignPlatformConfirmed(p);
                    setModalShow(false);
                }}
                onHide={() => setModalShow(false)} />
            <ModalRealeasePlatform
                show={modalReleaseShow}
                transport={selectedId}
                onConfirm={() => {
                    onReleasePlatformConfirmed();
                    setModalReleaseShow(false);
                }}
                onHide={() => setModalReleaseShow(false)} />
            <TransportTable/>
            {/*<MaterialTable*/}
            {/*    tableRef={tableRef}*/}
            {/*    icons={tableIcons}*/}
            {/*    columns={columns}*/}
            {/*    data={transportsCopy}*/}
            {/*    options={{*/}
            {/*        actionsColumnIndex: -1,*/}
            {/*        showTitle: false,*/}
            {/*        draggable: false,*/}
            {/*        filtering: true,*/}
            {/*        pageSizeOptions: false,*/}
            {/*    }}*/}
            {/*    localization={{*/}
            {/*        body: {*/}
            {/*            emptyDataSourceMessage: 'Keine Einträge',*/}
            {/*            addTooltip: 'Hinzufügen',*/}
            {/*            deleteTooltip: 'Löschen',*/}
            {/*            editTooltip: 'Bearbeiten',*/}
            {/*            filterRow: {*/}
            {/*                filterTooltip: 'Filter'*/}
            {/*            },*/}
            {/*            editRow: {*/}
            {/*                deleteText: 'Wollen Sie diesen Transport wirklich löschen?',*/}
            {/*                cancelTooltip: 'Abbrechen',*/}
            {/*                saveTooltip: 'Speichern'*/}
            {/*            }*/}
            {/*        },*/}
            {/*        header: {*/}
            {/*            actions: 'Aktionen'*/}
            {/*        },*/}
            {/*        pagination: {*/}
            {/*            labelDisplayedRows: '{from}-{to} von {count}',*/}
            {/*            labelRowsSelect: 'Zeilen',*/}
            {/*            labelRowsPerPage: 'Zeilen pro Seite:',*/}
            {/*            firstAriaLabel: 'Erste Seite',*/}
            {/*            firstTooltip: 'Erste Seite',*/}
            {/*            previousAriaLabel: 'Vorherige Seite',*/}
            {/*            previousTooltip: 'Vorherige Seite',*/}
            {/*            nextAriaLabel: 'Nächste Seite',*/}
            {/*            nextTooltip: 'Nächste Seite',*/}
            {/*            lastAriaLabel: 'Letzte Seite',*/}
            {/*            lastTooltip: 'Letzte Seite'*/}
            {/*        },*/}
            {/*        toolbar: {*/}
            {/*            searchTooltip: 'Suche',*/}
            {/*            searchPlaceholder: 'Suche'*/}
            {/*        }*/}
            {/*    }}*/}
            {/*    components={{*/}
            {/*        Toolbar: props => (*/}
            {/*            <div*/}
            {/*                style={{*/}
            {/*                    display: "flex",*/}
            {/*                    flexDirection: "row",*/}
            {/*                    padding: ".5rem"*/}
            {/*                }}*/}
            {/*            >*/}
            {/*                <div style={{flexGrow: 1}}/>*/}
            {/*                <MTableToolbar{...props}/>*/}
            {/*                <Button*/}
            {/*                    onClick={refreshTransports}*/}
            {/*                    startIcon={<Refresh/>}*/}
            {/*                >*/}
            {/*                    Refresh*/}
            {/*                </Button>*/}
            {/*            </div>*/}
            {/*        ),*/}
            {/*    }}*/}
            {/*    editable={{*/}
            {/*        onRowUpdate: (newData, oldData) => setTransport(newData),*/}
            {/*        onRowDelete: oldData => removeTransport(oldData),*/}
            {/*    }}*/}
            {/*/>*/}
        </>);
}

