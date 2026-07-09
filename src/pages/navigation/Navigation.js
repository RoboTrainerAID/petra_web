import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";

//Styling
import {makeStyles} from "@material-ui/core/styles";

//Icons&Images

//Components
import {Container, Grid} from '@material-ui/core';
import {useTransport} from "../../petra_central_control/useTransport";
import TransportStates, {getTransportState} from "../../constants/TransportStates";
import {usePayload} from "../../petra_central_control/usePayload";
import {PetraTransportDialog} from "../../components/dialog/PetraTransportDialog";
import {Button} from "react-bootstrap";
import ModalAssignPlatform from "../../components/modals/ModalAssignPlatform";
import PayloadTypes from "../../constants/PayloadTypes";
import * as BiIcons from "react-icons/fi";
import {Link} from "react-router-dom";
import {TransportDetailsGrid} from "../../components/transport/TransportDetailsGrid";
import {NavigationTour} from "./NavigationTour";
import InfoTourTargets from "../info/InfoTourTargets";
import {useMapRelay} from "../../petra_central_control/useMapRelay";
import {NavigationMap} from "./NavigationMap";


const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        width: "100%",
        '@media (orientation: portrait)': {
            marginTop: 'calc(100vh*(1/9))',
        },
        '@media (max-width: 767px)': {
            marginTop: '12vh',
        }
    },
    item: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
    },
    itemImage: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        // width: '100%',
    },
    image: {
        height: "40rem"
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: "97%",
    },
    table: {
        fontSize: '20px',
        width: '90%',
        marginTop: "1em",
        marginBottom: "2em"
    },
    tableRow: {
        height: '34px',
    },
    tableCategory: {
        width: '47%',
    },
    emergency: {
        fontWeight: "bold",
        padding: "1rem",
        width: "16rem",
    },
}));

export default function Navigation({ transport, triggerEmergency, requireLogin }) {
    const { t } = useTranslation();
    const classes = useStyles();

    //fetch transport
    const [ , info, setTransport, ] = useTransport(transport?._id);
    const [ payload, pInfo, ] = usePayload(transport?.payload);

    const [mapData, mapInfo] = useMapRelay();

    //calculated fields
    let endTimeStamp = 0;
    const currentTimeStamp = new Date().getTime();

    if (!!transport) {
        endTimeStamp = transport.time_stamp + transport.is_start_time ? (transport.duration * 60000) : 0;
    }
    const remainingTime = Math.max(0, endTimeStamp - currentTimeStamp);

    //if transport enters waiting for patient approval while in nav view, start nav tour to make patient familiar
    const [ showTour, setShowTour ] = useState();
    const [ askApproveTour, setAskApproveTour ] = useState();
    useEffect(() => {
        if (TransportStates.WAITING_FOR_PATIENT_APPROVAL.matches(transport?.status)) {
            setShowTour(true);
            setAskApproveTour(true);
        }
    }, [ transport?.status ]);

    //assigning platform stuff
    const [ assigningPlatform, setAssigningPlatform ] = useState(false);

    //security check stuff
    const securityCheckDone = useCallback(() => {
        const isCargo = PayloadTypes.CARGO.matches(payload?.type)
        setTransport({
            ...transport,
            status: isCargo ? TransportStates.RUNNING.v : TransportStates.WAITING_FOR_PATIENT_APPROVAL.v,
        });
    }, [ transport, payload, setTransport ]);

    const patientApproved = useCallback(() => {
        setTransport({
            ...transport,
            status: TransportStates.RUNNING.v,
        });
    }, [ transport, setTransport ]);

    const continueTransport = useCallback(() => {
        setTransport({
            ...transport,
            status: TransportStates.RUNNING.v,
        });
    }, [ transport, setTransport ]);

    const abortTransport = useCallback(() => {
        setTransport({
           ...transport,
           status: TransportStates.DONE.v,
        });
    }, [ transport, setTransport ]);

    const releasePlatform = useCallback(() => {
        setTransport({
            ...transport,
            status: TransportStates.DONE.v,
            platform_nr: -1,
        });
    }, [ transport, setTransport ]);

    const actions = useMemo(() => {
        if (!transport) return [
            <Link to={"/login"}>
                <Button>
                    {t("transport_cards_go_to_staff_area")}
                </Button>
            </Link>
        ];

        const state = transport?.status;
        if (TransportStates.WAITING_FOR_PLATFORM_ASSIGNMENT.matches(state)) return [
            <Button disabled={!info.isSuccess} onClick={() => requireLogin(() => setAssigningPlatform(true))}>
                {t("platform_assign_title")}
            </Button>
        ];
        if (TransportStates.WAITING_FOR_SECURITY_CHECK.matches(state)) return [
            <Button disabled={!info.isSuccess} onClick={() => requireLogin(securityCheckDone)}>
                {t("transport_cards_coupling_secure")}
            </Button>
        ];
        if (TransportStates.WAITING_FOR_PATIENT_APPROVAL.matches(state)) return [
            <Button className={InfoTourTargets.BUTTON_START_TRANSPORT.css} variant={"success"} onClick={patientApproved} disabled={!info.isSuccess}>
                {t("navigation_button_start")}
            </Button>
        ];
        if (TransportStates.RUNNING.matches(state)) return [
            <Button
                variant={"danger"}
                className={`${classes.emergency} ${InfoTourTargets.BUTTON_EMERGENCY.css}`}
                size={"lg"}
                onClick={triggerEmergency}
            >
                <BiIcons.FiAlertTriangle className="emergency-icon"/>
                {t("footer_button_emergency")}
            </Button>
        ];
        if (TransportStates.EMERGENCY_STOP.matches(state)) return [
            <Button
                variant={"success"}
                disabled={!info.isSuccess}
                onClick={() => requireLogin(continueTransport)}
            >
                {t("transport_cards_continue_transport")}
            </Button>,
            <Button
                variant={"warning"}
                disabled={!info.isSuccess}
                onClick={() => requireLogin(abortTransport)}
            >
                {t("transport_cards_abort_transport")}
            </Button>
        ];
        if (TransportStates.WAITING_FOR_UNLOAD.matches(state)) return [
            <Button
                onClick={() => requireLogin(releasePlatform)}
            >
                {t("transport_cards_release_platform")}
            </Button>
        ];
    }, [ transport, requireLogin, triggerEmergency, t, info.isSuccess, patientApproved,
        securityCheckDone, abortTransport, continueTransport, classes.emergency ]);

    return (
        <>
            <NavigationTour
                show={showTour}
                onClose={() => setShowTour(false)}
                askIfNecessary={askApproveTour}
                transport={transport}
            />
            <ModalAssignPlatform
                show={assigningPlatform}
                selectedPlatform={0}
                onSetPlatform={p => {
                    setAssigningPlatform(false);
                    setTransport({
                        ...transport,
                        platform_nr: p,
                        status: TransportStates.COUPLING.v,
                    });
                }}
                onHide={() => setAssigningPlatform(false)}
            />
            <Container className={classes.root}>
                <Grid container justify="center" direction="row" spacing="1">
                    <Grid item xs={12} sm={12} md={6} className={classes.itemImage}>
                        <NavigationMap startTour={() => {
                            setShowTour(true);
                            setAskApproveTour(false);
                        }}/>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} className={classes.item}>
                        <PetraTransportDialog
                            emergency={TransportStates.EMERGENCY_STOP.matches(transport?.status)}
                            comment={t(getTransportState(transport?.status)?.comment || "transport_cards_no_transport_active")}
                            actions={actions}
                            startTour={() => {
                                setShowTour(true);
                                setAskApproveTour(false);
                            }}
                        >
                            {!!transport && <TransportDetailsGrid transport={transport} />}
                        </PetraTransportDialog>
                    </Grid>
                </Grid>
            </Container>
        </>
    );

}
