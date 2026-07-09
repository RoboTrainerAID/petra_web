import React from "react";
import IdleTimer from "react-idle-timer";
import {useHistory, useLocation} from "react-router-dom";


export default function Timeout({setOpen}) {
    let [idleTimer] = React.useState(null);
    let [logoutTimer, setLogoutTimer] = React.useState(null);
    const history = useHistory();
    let {pathname} = useLocation();

    if (pathname !== '/home-employee' && pathname !== '/home-employee/translation' && pathname !== '/home-employee/navigation' && pathname !== '/home-employee/newtransport' && pathname !== '/home-employee/showtransports') return null;

    function handleLogout() {
        history.push('/');
        clearTimeout(logoutTimer);
        setLogoutTimer(null);
    }

    function onIdle() {
        const stayloggedin = localStorage.getItem('isChecked');
        if (stayloggedin === 'false') {
            logoutTimer = setTimeout(() => {
                handleLogout();
                setOpen(true);
            }, 10000 * 3 * 1);
        } else {

        }
    }

    function handleStayLoggedIn() {
        if (logoutTimer) {
            clearTimeout(logoutTimer);
            setLogoutTimer(null);
        }
        idleTimer.reset();
    }


    return (
        <IdleTimer
            ref={idleTimer}
            element={document}
            stopOnIdle={true}
            onIdle={onIdle}
            timeout={10000 * 10 * 1}
        />
    );
}
