import React, {useCallback, useState} from "react";
import {useTranslation} from "react-i18next";
import deLocale from "date-fns/locale/de"
import 'date-fns';

//Styling
//Icons&Images
import {createMuiTheme, makeStyles} from '@material-ui/core/styles';
import {amber, indigo} from "@material-ui/core/colors";

//Components
import {CircularProgress, Container, Grid, Paper, Switch} from '@material-ui/core';
import {Button, Form} from "react-bootstrap";
import LanguageSelectorPatient from "../../components/selects/LanguageSelectorPatient";
import LocationSelector from "../../components/selects/LocationSelector";
import ModalTransportInformation from "../../components/modals/ModalTransportInformation";
import ModeSelector from "../../components/selects/ModeSelector";
import {PayloadSelector} from "../../components/selects/PayloadSelector";
import {TransportTimeSelector} from "../../components/selects/TransportTimeSelector";
import {usePayloadList} from "../../petra_central_control/usePayload";
import PayloadTypes, {getPayloadType} from "../../constants/PayloadTypes";
import {useTransportList} from "../../petra_central_control/useTransport";

const defaultMaterialTheme = createMuiTheme({
    palette: {
        primary: indigo,
        secondary: amber,
    },
});

const useStyles = makeStyles(() => ({
    container: {
        display: 'flex',
        alignItems: 'center',
        maxWidth: '70em',
        '@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape)': {
            width: '60em',
        },
        '@media (min-width: 768px) and (max-width: 1024px) and (orientation: portrait)': {
            width: '45em'
        }
    },
    paper: {
        padding: '22px',
    },
    headerPatient: {
        marginBottom: '20px',
        '@media (max-width: 767px)': {
            marginBottom: '15px'
        },
    },
    headerTransport: {
        marginTop: '28px',
        marginBottom: '20px',
        '@media (max-width: 767px)': {
            marginTop: '23px',
            marginBottom: '15px'
        },
    },
    item: {
        display: 'flex',
        justifyContent: 'flex-start',
        width: '88%',
    },
    itemHide: {
        display: 'flex',
        justifyContent: 'flex-start',
        width: '88%',
        '@media (max-width: 767px)': {
            display: "none !important",
        },
    },
    form: {
        width: '100%',
    },
    root: {
        width: '88%',
        '@media (max-width: 767px)': {
            width: '100%',
        },
    },
    error: {
        color: "red",
        fontSize: "13px",
        marginTop: "6px",
        marginBottom: 0,
    },
    start: {
        width: '39%',
        '@media (max-width: 767px)': {
            width: '100%',
        }
    },
    textFieldMobile: {
        '@media (max-width: 767px)': {
            height: '8px',
        }
    },
    button: {
        width: '88%',
        marginTop: '20px',
        '@media (max-width: 767px)': {
            width: '100%',
            marginTop: 0,
        },
    },
}))

const localeMap = {
    de: deLocale,
};


export default function NewTransport({successOpen, setSuccessOpen}) {
    const classes = useStyles();
    const {t} = useTranslation();
    const [locale] = useState("de");

    const [ payloads, payloadsInfo,,, ] = usePayloadList();
    const [ transports, transportInfo, addTransport, setTransport, removeTransport] = useTransportList();

    const [modalShow, setModalShow] = React.useState(false);

    const [ payload, setPayload ] = useState(0);
    const [ errorPayload, setErrorPayload ] = useState(false);
    const onPayloadChanged = useCallback(p => {
        setPayload(p);
        setErrorPayload(false);
    }, []);
    const payloadData = payloads?.find(p => p._id === payload) || null;
    const isPatientPayload = !!payloadData && PayloadTypes.PATIENT.matches(payloadData.type);
    const payloadType = getPayloadType(payloadData?.type);

    const [ overrideLanguage, setOverrideLanguage ] = useState(false);
    const [ language, setLanguage ] = useState(null);

    const [isStartDate, setIsStartDate] = React.useState(true);
    const [selectedDate, setSelectedDate] = React.useState(new Date());

    const [ overrideMode, setOverrideMode ] = useState(false);
    const [mode, setMode] = React.useState(-1);
    const [errorMode, setErrorMode] = React.useState(false);
    const onModeChanged = useCallback(m => {
        setMode(m);
        setErrorMode(false);
    }, []);

    const [ overrideStart, setOverrideStart ] = useState(false);
    const [start, setStart] = React.useState(-1);
    const [errorStart, setErrorStart] = React.useState(false);
    const onStartChanged = useCallback(s => {
        setStart(s);
        setErrorStart(false);
    }, []);

    const [destination, setDestination] = React.useState(-1);
    const [errorDestination, setErrorDestination] = React.useState(false);
    const [errorStartEqualsDestination, setErrorStartEqualsDestination] = React.useState(false);
    const onDestinationChanged = useCallback(d => {
        setDestination(d);
        setErrorDestination(false);
        setErrorStartEqualsDestination(false);
    }, []);


    function handleSubmit() {
        let hasErrors = false;

        //payload id must be larger than 0 to be valid
        if (payload <= 0) {
            setErrorPayload(true);
            hasErrors |= true;
        }

        //mode must be present if overwritten
        if (overrideMode && mode < 0) {
            setErrorMode(true);
            hasErrors |= true;
        }

        //start location must be present if overwritten
        if (overrideStart && start <= 0) {
            setErrorStart(true);
            hasErrors |= true;
        }

        if (!destination || destination <= 0) {
            setErrorDestination(true);
            hasErrors |= true;
        }

        if (!!destination && !!start && destination === start) {
            setErrorStartEqualsDestination(true);
            hasErrors |= true;
        }

        //show modal only if no errors have occurred
        !hasErrors && setModalShow(true);
    }

    const stateAsTransport = useCallback(() => ({
        status: 0,
        payload: payload,
        override_mode: overrideMode ? mode : null,
        override_start_location: overrideStart ? start : null,
        goal_location: destination,
        time_stamp: selectedDate.getTime(),
        is_start_time: isStartDate,
        platform_nr: -1,
    }), [ payload, overrideMode, mode, overrideStart, start, destination, selectedDate, isStartDate, language, overrideLanguage ]);

    const handleAddTransport = useCallback(() => {
        const request = stateAsTransport();
        addTransport(request);

        //reset state
        setPayload(0);
        setOverrideMode(false);
        setOverrideLanguage(false);
        setIsStartDate(true);
        setOverrideStart(false);
        setStart(null);
        setDestination(null);
        setModalShow(false);

        //redirect to transport list
        window.location.pathname = "/home-employee/showtransports";
    }, [ stateAsTransport, addTransport ]);

    if (payloadsInfo.isLoading) {
        return <CircularProgress/>
    }

    if (payloadsInfo.isError) { //TODO: better error display
        return "Something went wrong"
    }

    return (
        <>
            {modalShow && <ModalTransportInformation
                show={modalShow}
                transport={stateAsTransport()}
                onAccept={handleAddTransport}
                onCancel={() => setModalShow(false)}
                message={"modal_transportinformation_text"}
                title={"modal_transportinformation_title"}
                cancel={"modal_transportinformation_cancel"}
                accept={"modal_transportinformation_posttransport"}
            />}
            <Form noValidate>
                <Container className={classes.container}>
                    <Paper elevation={3} className={classes.paper}>
                        <Grid container justify="flex-start" direction="row" spacing="1">
                            <Grid item xs={12} sm={12} md={12} xl={12}>
                                <h4 className={classes.headerPatient}>{t('newtransport_header_payload')}</h4>
                            </Grid>
                            <Grid item xs={12} sm={4} md={4}>
                                <Form.Group controlId="formPayload">
                                    <Form.Label>{t('newtransport_form_payload')}</Form.Label>
                                    <br/>
                                    <PayloadSelector payload={payload} onPayloadChange={onPayloadChanged} errorPayload={errorPayload}/>
                                </Form.Group>
                            </Grid>
                            {isPatientPayload &&
                                <>
                                    <Grid item xs={12} sm={4} md={4}>
                                        <Form.Group>
                                            <Switch
                                                size={"small"}
                                                color={"primary"}
                                                checked={overrideLanguage}
                                                onChange={e => {
                                                    setOverrideLanguage(e.target.checked);
                                                    !language && setLanguage(payloadData?.preferred_language || null);
                                                }}
                                            />
                                            <Form.Label>{t('newtransport_override_language')}</Form.Label>
                                            <br/>
                                            <LanguageSelectorPatient
                                                disabled={!overrideLanguage}
                                                languagePatient={overrideLanguage ? language : (payloadData?.preferred_language || null)}
                                                handleLanguageChange={e => setLanguage(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Grid>
                                    <Grid item xs={12} sm={4} md={4}>
                                        <Switch
                                            size={"small"}
                                            color={"primary"}
                                            checked={overrideMode}
                                            onChange={e => {
                                                setOverrideMode(e.target.checked);
                                                !mode && setMode(payloadData?.preferred_mode || null);
                                            }}
                                        />
                                        <Form.Label>{t('newtransport_override_mode')}</Form.Label>
                                        <br/>
                                        <ModeSelector
                                            disabled={!overrideMode}
                                            mode={overrideMode ? mode : (payloadData?.preferred_mode || null)}
                                            onModeChange={onModeChanged}
                                            payloadType={payloadType}
                                        />
                                    </Grid>
                                </>
                            }
                            <Grid item xs={12} sm={4}>

                            </Grid>
                            <Grid item xs={12} sm={12} md={12} xl={12} className={classes.item}>
                                <h4 className={classes.headerTransport}>{t('newtransport_header_transportdata')}</h4>
                            </Grid>
                            <Grid container item xs={12} sm={12} md={12} xl={12} className={classes.item}>
                                <Grid item xs={12} sm={12} md={12} xl={12}>
                                    <Form.Label>{t("newtransport_form_date")}</Form.Label>
                                </Grid>
                                <TransportTimeSelector
                                    date={selectedDate}
                                    onChangeDate={setSelectedDate}
                                    isStart={isStartDate}
                                    onChangeIsStart={setIsStartDate}
                                />
                            </Grid>
                            <Grid container item xs={12} sm={12} md={12} xl={12} className={classes.item}>
                                <Grid item xs={12} sm={12} md={4} xl={4}>
                                    <Form.Group controlId={"formStart"}>
                                        <Switch
                                            size={"small"}
                                            color={"primary"}
                                            checked={overrideStart}
                                            onChange={e => {
                                                setOverrideStart(e.target.checked);
                                                !start && setStart(payloadData?.location || null);
                                            }}
                                        />
                                        <Form.Label>{t('newtransport_override_location')}</Form.Label>
                                        <LocationSelector
                                            disabled={!overrideStart}
                                            location={overrideStart ? start : (payloadData?.location || null)}
                                            onChange={onStartChanged}
                                            error={errorStart}
                                        />
                                    </Form.Group>
                                </Grid>
                                <Grid item xs={12} sm={12} md={4} xl={4}>
                                    <Form.Group controlId={"formDestination"}>
                                        <Form.Label>{t('newtransport_form_destination')}</Form.Label>
                                        <br/>
                                        <LocationSelector
                                            location={destination}
                                            onChange={onDestinationChanged}
                                            error={errorDestination}
                                        />
                                    </Form.Group>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={4} md={4} className={classes.item}>
                                <Button variant="primary" onClick={handleSubmit} size="lg">
                                    {t('newtransport_button_confirm')}
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Container>
            </Form>
        </>
    );
}
