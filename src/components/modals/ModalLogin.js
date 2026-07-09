import {Button} from "react-bootstrap";
import {Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import React, {useCallback, useRef, useState} from "react";
import Grid from "@material-ui/core/Grid";
import rfid from "../../assets/icon_rfid.png";
import fingerprint from "../../assets/icon_fingerprint.png";
import axios from "axios";
import {FLASK_BACKEND_URL} from "../../constants";
import {makeStyles} from "@material-ui/core/styles";
import {VpnKey} from "@material-ui/icons";

const useStyles = makeStyles(() => ({
    paper: {
        alignSelf: "flex-start",
    },
    buttonContent: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem"
    },
}));

/**
 * Shows login options to a user and lets the user login
 * @param show whether to show the modal
 * @param cancelLogin called when the login is canceled
 * @param successLogin called when the login was successful
 * @returns {JSX.Element}
 * @constructor
 */
export function ModalLogin({ show, cancelLogin, successLogin }) {
    const { t } = useTranslation();
    const styles = useStyles();

    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ loginError, setLoginError ] = useState(false);
    const [ isLoggingIn, setIsLoggingIn ] = useState(false);

    const showRef = useRef(show);
    showRef.current = show;

    const handleCancel = useCallback(() => {
        setUsername("");
        setPassword("");
        setLoginError(false);
        setIsLoggingIn(false);
        cancelLogin();
    }, [ cancelLogin ]);

    const checkLogin = useCallback( () => {
        setIsLoggingIn(true);

        //if local login valid, do not send request to server
        if (
            (username.toLowerCase() === "admin" &&
                password === "1234") ||
            (username.toLowerCase() === "petra" &&
                password === "demo")
        ) {
            setUsername("");
            setPassword("");
            setLoginError(false);
            setIsLoggingIn(false);
            successLogin();
            return;
        }

        //send request to check login to server
        axios.post(FLASK_BACKEND_URL + "/login", {
            username: username,
            password: password
        }, { 'Content-Type': 'application/json' })
            .then(() => {
                if (!showRef.current) return; //do not do anything if dialog has been force closed

                setUsername("");
                setPassword("");
                setLoginError(false);
                setIsLoggingIn(false);
                successLogin();
            })
            .catch(error => {
                setLoginError(true);
                setIsLoggingIn(false);
            });
    }, [ successLogin, username, password ]);

    return (
        <Dialog
            classes={{
                paper: styles.paper,
            }}
            open={show}
            onClose={handleCancel}
        >
            <DialogTitle>
                {t("login_form_title")}
            </DialogTitle>
            <DialogContent>
                <Grid container justify={"center"} direction={"column"} spacing={"1"}>
                    {loginError &&
                        <Grid item>
                            <Typography color={"error"}>
                                {t("login_form_error")}
                            </Typography>
                        </Grid>
                    }

                    <Grid item>
                        <TextField
                            value={username || ""}
                            onChange={e => setUsername(e.target.value)}

                            autoFocus
                            variant={"outlined"}
                            label={t('login_form_username')}
                            placeholder={t('login_form_enterusername')}
                            error={loginError}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            value={password || ""}
                            onChange={e => setPassword(e.target.value)}

                            variant={"outlined"}
                            label={t('login_form_password')}
                            placeholder={t('login_form_enterpassword')}
                            type={"password"}
                            error={loginError}
                        />
                    </Grid>
                    <Grid item>
                        <Typography>
                            {t('login_form_alternativelogin')}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <img className="rfid-icon" src={rfid} alt={"RFID"} width={"55px"} height={"55px"} />
                        <img className="fingerprint-icon" src={fingerprint} alt={"Fingerprint"} width={"55px"}
                             height={"55px"} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={checkLogin} disabled={isLoggingIn}>
                    <div className={styles.buttonContent}>
                        <VpnKey/>
                        {t("login_form_login")}
                    </div>
                </Button>
                <Button onClick={handleCancel} disabled={isLoggingIn}>
                    {t("login_form_cancel")}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
