import React, {useCallback, useEffect, useRef, useState} from "react";
import {Route, useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";

//Styling
import "./App.css";

//Components
import PrivateRoute from "./components/privateroute/PrivateRoute";
import HeaderPatient from "./components/header/HeaderPatient";
import HeaderEmployee from "./components/header/HeaderEmployee";
import SidebarPatient from "./components/sidebar/SidebarPatient";
import FooterPatient from "./components/footer/FooterPatient";
import FooterEmployee from "./components/footer/FooterEmployee";
import NewTransport from "./pages/newtransport/NewTransport";
import Timeout from "./components/timeout/Timeout";
import AlertLogin from "./components/alerts/AlertLogin";

//Pages
import HomePatient from "./pages/home/HomePatient";
import HomeEmployee from "./pages/home/HomeEmployee";
import Login from "./pages/login/Login";
import Navigation from "./pages/navigation/Navigation";
import Questionnaire from "./pages/questionnaire/Questionnaire";
import Translation from "./pages/translation/Translation";
import Entertainment from "./pages/entertainment/Entertainment";
import MediaLib from "./pages/medialibrary/MediaLib";
import Newsfeed from "./pages/medialibrary/Newsfeed";
import ShowTransports from "./pages/showtransports/ShowTransports";
import AlertLogout from "./components/alerts/AlertLogout";
import AlertSuccess from "./components/alerts/AlertSuccess";
import Games from "./pages/games/Games";
import {useTransportList} from "./petra_central_control/useTransport";
import {usePayload} from "./petra_central_control/usePayload";
import {useLocation} from "./petra_central_control/useLocation";
import TransportStates from "./constants/TransportStates";
import ModalEmergency from "./components/modals/ModalEmergency";
import {ModalLogin} from "./components/modals/ModalLogin";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import {InfoTourStep} from "./pages/info/InfoTourStep";
import FullScreen from "react-fullscreen-crossbrowser";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#007bff",
        },
        secondary: {
            main: "#93bae2",
        },
    },
});

export default function App() {
    const { t } = useTranslation();
    const history = useHistory();
    const [open, setOpen] = React.useState(false);
    const [successOpen, setSuccessOpen] = React.useState(false);
    const [isTourOpen, setIsTourOpen] = React.useState(false);

    const [ isFullscreen, setIsFullscreen ] = React.useState(false);

    const [ showAuthDialog, setShowAuthDialog ] = useState(false);
    const [ onAuthSuccess, setOnAuthSuccess ] = useState(() => {});
    const requireLogin = useCallback(onLoginSuccess => {
        setShowAuthDialog(true);
        setOnAuthSuccess(() => onLoginSuccess);
    }, []);
    const cancelLogin = useCallback(() => {
        setShowAuthDialog(false);
        setOnAuthSuccess(() => {});
    });
    const successLogin = useCallback(() => {
        const authSuccessTmp = onAuthSuccess;
        setShowAuthDialog(false);
        setOnAuthSuccess(() => {});
        authSuccessTmp();
    });

    //load data for currently active transport
    const refetchIntervalRef = useRef(2000);
    const [ transports, info, addTransport, setTransport, removeTransport, refreshTransports ] = useTransportList(refetchIntervalRef.current);
    let currentTransport = null;
    if (info.isSuccess) {
        const activeTransports = transports.filter(t => !TransportStates.WAITING.matches(t.status) && !TransportStates.DONE.matches(t.status));
        // const activeTransports = transports;

        //TODO: use more sophisticated method, but for now only one transport can be active at a time
        currentTransport = activeTransports.length > 0 ?  activeTransports[0] : null;

        //if current transport is running, refetch interval every 500ms for more accurate data
        refetchIntervalRef.current = TransportStates.RUNNING.matches(currentTransport?.status) ? 500 : 2000;
    }

    // capture pre emergency state
    const transportStateRef = useRef(null);
    const lastTransportStateRef = useRef(null);
    const preEmergencyStateRef = useRef(null);
    useEffect(() => { //save last transport state here
        if (!TransportStates.EMERGENCY_STOP.matches(lastTransportStateRef.current)
            && !TransportStates.EMERGENCY_PENDING.matches(lastTransportStateRef.current)
            && (TransportStates.EMERGENCY_PENDING.matches(currentTransport?.status)
             || TransportStates.EMERGENCY_STOP.matches(currentTransport?.status))
        ) {
            preEmergencyStateRef.current = lastTransportStateRef.current;
        }

        lastTransportStateRef.current = transportStateRef.current;
    }, [ currentTransport?.status ]);
    transportStateRef.current = currentTransport?.status;

    const [ payload, payloadInfo,,, ] = usePayload(currentTransport?.payload); //load payload if present
    const [ startLocation, sLInfo,,, ] = useLocation(currentTransport?.override_start_location || payload?.location);

    // put data into variables to not have to rewrite a lot of other logic
    const lastName = payload?.last_name;
    const start = startLocation?.name;

    //emergency dialog stuff
    const triggerEmergency = useCallback(() => setTransport({
        ...currentTransport,
        status: TransportStates.EMERGENCY_PENDING.v,
    }), [ currentTransport, setTransport ]);
    const cancelEmergency = useCallback(() => setTransport({
        ...currentTransport,
        status: preEmergencyStateRef.current,
    }), [ currentTransport, setTransport ]);
    const activateEmergency = useCallback(() => {
        setTransport({
            ...currentTransport,
            status: TransportStates.EMERGENCY_STOP.v,
        });
        history.push("/navigation");
    }, [ history, setTransport, currentTransport ]);

    //Tutorial steps
    const steps = [
        {
            selector: '.step1',
            content: <InfoTourStep text={t('info_tour_step1')}/>,
        },
        {
            selector: '.step2',
            content: t('info_tour_step2'),
        },
        {
            selector: '.step3',
            content: t('info_tour_step3'),
        },
        {
            selector: '.step4',
            content: t('info_tour_step4'),
        },
        {
            selector: '.step5',
            content: t('info_tour_step5'),
        },
        {
            selector: '.step6',
            content: t('info_tour_step6'),
        },
        {
            selector: '.step7',
            content: t('info_tour_step7'),
        },
        {
            selector: '.step8',
            content: t('info_tour_step8'),
        },
        {
            selector: '.step9',
            content: t('info_tour_step9'),
        },
        {
            selector: '.step10',
            content: t('info_tour_step10'),
        },
    ];

    return (
        <FullScreen
            enabled={isFullscreen}
            onChange={enabled => setIsFullscreen(enabled)}
        >
            <ThemeProvider theme={theme}>
                <div style={{
                    height: "100%",
                    backgroundColor: "white",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <ModalEmergency
                        show={TransportStates.EMERGENCY_PENDING.matches(currentTransport?.status)}
                        activateEmergency={activateEmergency}
                        cancelEmergency={cancelEmergency}
                    />
                    <ModalLogin
                        show={showAuthDialog}
                        cancelLogin={cancelLogin}
                        successLogin={successLogin}
                    />

                    <HeaderPatient />
                    <AlertLogout open={open} setOpen={setOpen} />
                    <SidebarPatient />

                
                    <Route exact path="/">
                        <div className="layout-home">
                            <HomePatient setIsTourOpen={setIsTourOpen} transport={currentTransport}/>
                        </div>
                    </Route>

                    <Route exact path="/navigation">
                        <Navigation transport={currentTransport} triggerEmergency={triggerEmergency} requireLogin={requireLogin}/>
                    </Route>

                    <Route exact path="/questionnaire">
                        <div className="layout-home">
                            <Questionnaire />
                        </div>
                    </Route>

                    <Route exact path="/translation">
                        <div className="layout-translation-patient">
                            <Translation />
                        </div>
                    </Route>

                    <Route exact path="/entertainment">
                        <div className="layout-home">
                            <Entertainment />
                        </div>
                    </Route>

                    <Route exact path="/entertainment/media">
                        <MediaLib />
                    </Route>

                    <Route exact path="/entertainment/news">
                        <Newsfeed />
                    </Route>

                    <Route exact path="/entertainment/games">
                        <Games />
                    </Route>

                    <Route exact path="/login">
                        <Login />
                    </Route>
                    

                    <HeaderEmployee setOpen={setOpen} />
                    <AlertLogin setOpen={setOpen} />
                    <AlertSuccess successOpen={successOpen} setSuccessOpen={setSuccessOpen} />
                    <Timeout setOpen={setOpen} />

                    <PrivateRoute exact path="/home-employee">
                        <div className="layout-home">
                            <HomeEmployee />
                        </div>
                    </PrivateRoute>

                    <PrivateRoute exact path="/home-employee/translation">
                        <div className="layout-translation-employee">
                            <Translation />
                        </div>
                    </PrivateRoute>

                    <PrivateRoute exact path="/home-employee/newtransport">
                        <div className="layout-newtransport">
                            <NewTransport successOpen={successOpen} setSuccessOpen={setSuccessOpen} />
                        </div>
                    </PrivateRoute>

                    <PrivateRoute exact path="/home-employee/showtransports">
                        <div className="layout-showtransport">
                            <ShowTransports />
                        </div>
                    </PrivateRoute>

                    <FooterEmployee />
                    <FooterPatient triggerEmergency={triggerEmergency} showEmergencyButton={!!currentTransport} toggleFullscreen={() => setIsFullscreen(!isFullscreen)} isFullscreen={isFullscreen}/>
                </div>
            </ThemeProvider>
        </FullScreen>
    );
}
