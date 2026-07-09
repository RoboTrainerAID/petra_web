import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import axios from "axios"

//Styling
import "./Login.css";
import {makeStyles} from "@material-ui/core/styles";

//Icons&Images
import rfid from "../../assets/icon_rfid.png";
import fingerprint from "../../assets/icon_fingerprint.png";

//Components
import {Button, Form} from "react-bootstrap";
import {Container, Grid, Paper} from '@material-ui/core';
import {FLASK_BACKEND_URL} from "../../constants";
import {VpnKey} from "@material-ui/icons";


const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        alignItems: 'flex-start',
        maxWidth: '30em',
        marginTop: 'calc(4% - 25px)',
        '@media (orientation: portrait)': {
            marginTop: 'calc(100vh*(1/9))',
        },
        '@media (max-width: 767px)': {
            marginTop: '12vh',
        }
    },
    paper: {
        display: 'flex',
        alignItems: 'center',
        width: "100%",
        paddingTop: '1.5em',
        paddingBottom: '1.5em',
    },
    item: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        width: "100%",
    },
    buttonContent: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem"
    },
}));


export default function Login() {
    const { t } = useTranslation();
    const classes = useStyles();
    const [userData, setUserData] = useState({ username: "", password: "" });
    const [validated, setValidated] = useState(false);
    let [isChecked, setIsChecked] = useState(true);
    const [ error, setError ] = useState(false);

    function handleChange() {
        setIsChecked(isChecked = !isChecked);
        console.log(isChecked);
    }

    function handleInputChange(e) {
        setValidated(false);
        setUserData((prevState) => {
            return {
                ...prevState,
                [e.target.name]: e.target.value,
            };
        });
    }

    function handleSubmit(event) {
        setError(false);
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
        event.preventDefault();

        axios.post(FLASK_BACKEND_URL + "/login", {
            username: userData.username,
            password: userData.password
        }, { 'Content-Type': 'application/json' })
            .then(function (response) {
                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem('isChecked', isChecked);
                localStorage.setItem("username", userData.username);
                window.location.pathname = "/home-employee/showtransports";

                console.log(response.data.message);
                // response.data.message ist "Login successful"
            })
            .catch(function (error) {
                if (error.response) {
                    setError(true);
                    setValidated(false);
                    console.log(error.response.data.message);
                } else {
                    console.log("No response from server recieved")
                }
            })

        if (
            (userData.username.toLowerCase() === "admin" &&
                userData.password === "1234") ||
            (userData.username.toLowerCase() === "petra" &&
                userData.password === "demo")
        ) {
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem('isChecked', isChecked);
            localStorage.setItem("username", userData.username);
            window.location.pathname = "/home-employee/showtransports";
        }
    }


    return (
        <Container className={classes.root}>
            <Paper className={classes.paper}>
                <Grid container justify="center" direction="row" spacing="1">
                    <Grid item xs={10} sm={8} className={classes.item}>
                        <Form
                            noValidate
                            validated={validated}
                            onSubmit={handleSubmit}
                            className="form">
                            <Form.Group controlId="formUserName">
                                <Form.Label>{t('login_form_username')}</Form.Label>
                                <Form.Control
                                    name="username"
                                    isInvalid={error}
                                    required type="text"
                                    placeholder={t('login_form_enterusername')}
                                    feedback={t('login_form_enterusername')}
                                    onChange={(e) => handleInputChange(e)} />
                                <Form.Control.Feedback type="invalid">
                                    {error ? t('login_form_error') : t('login_form_enterusernamefeedback')}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="formPassword">
                                <Form.Label>{t('login_form_password')}</Form.Label>
                                <Form.Control
                                    name="password"
                                    isInvalid={error}
                                    required type="password"
                                    placeholder={t('login_form_enterpassword')}
                                    feedback={t('login_form_enterpassword')}
                                    onChange={(e) => handleInputChange(e)} />
                                <Form.Control.Feedback type="invalid">
                                    {error ? t('login_form_error') : t('login_form_enterpasswordfeedback')}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="formStayLoggedIn">
                                <Form.Check
                                    type="checkbox"
                                    label={t('login_form_stayloggedin')}
                                    checked={isChecked}
                                    onChange={handleChange} />
                            </Form.Group>
                            <Button variant="primary" type="submit" size="lg" block>
                                <div className={classes.buttonContent}>
                                    <VpnKey/>
                                    {t('login_form_login')}
                                </div>
                            </Button>
                        </Form>
                        <Grid item xs={12} sm={12} className={classes.item}>
                            {t('login_form_alternativelogin')}
                        </Grid>
                        <Grid>
                            <img className="rfid-icon" src={rfid} alt={"RFID"} width={"55px"} height={"55px"} />
                            <img className="fingerprint-icon" src={fingerprint} alt={"Fingerprint"} width={"55px"}
                                height={"55px"} />
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}
