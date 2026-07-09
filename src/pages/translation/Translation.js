import React from "react";
// import axios from "axios";
//Styling
import {makeStyles} from '@material-ui/core/styles';

//Icons&Images
import MicIcon from "@material-ui/icons/Mic";
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';

//Components
import {Container, Fab, Grid, TextField} from '@material-ui/core';
import TranslatorInput from "../../components/translate/TranslatorInput";
import TranslatorOutput from "../../components/translate/TranslatorOutput";
import TranslateButtonRight from "../../components/translate/TranslateButtonRight";
import TranslateButtonLeft from "../../components/translate/TranslateButtonLeft";


const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        maxWidth: '100em',
    },
    item: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        height: 'fit-content',
        justifyContent: 'center',
    },
    itemButtons: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: 'calc(100vh * (5/15))',
        marginTop: '50px',
        justifyContent: 'space-evenly',
        '@media (orientation: portrait)': {
            marginTop: '90px'
        },
        '@media (max-width: 767px)': {
            height: '10vh',
            marginTop: '0px',
            flexDirection: 'row',
        }
    },
    textField: {
        width: '100%',
        marginTop: '20px',
        justifyContent: 'top',
        height: "fit-content",
    },
    input: {
        height: 'calc(100vh * (5/15))',
        justifyContent: 'top',
        display: 'flex',
        flexDirection: 'column',
        '@media (max-width: 767px)': {
            height: '170px',
        }
    },
    talkButton: {
        boxShadow: 'none',
        color: 'white',
        backgroundColor: '#007bff',
        marginRight: '2vw',
        height: 60,
        width: 60,
        '@media (max-width: 767px)': {
            marginLeft: '4px',
            marginRight: '2px',
            height: 40,
            width: 40,
        },
        '@media (min-width: 1024px) and (orientation: landscape)': {
            marginLeft: '-8px',
            marginRight: '20px',
        }
    },
    readButton: {
        boxShadow: 'none',
        color: 'white',
        backgroundColor: '#007bff',
        height: 60,
        width: 60,
        '@media (max-width: 767px)': {
            marginLeft: '1px',
            marginRight: '0px',
            height: 40,
            width: 40,
        },
        '@media (min-width: 1024px) and (orientation: landscape)': {
            marginLeft: '0px',
            marginRight: '0px',
        },
    },
}))


export default function Translation() {
    const classes = useStyles();
    const [input, setInput] = React.useState("");
    const [output, setOutput] = React.useState("");
    const [language1, setLanguage1] = React.useState('de');
    const [language2, setLanguage2] = React.useState('en');

    function handleClick1() {
        // axios.post(window.FLASK_WEBSERVER_URL + "/transports", {
        //     status: 0, //0=not started
        //     mode: props.mode,
        //     first_name: props.firstName,
        //     last_name: props.lastName,
        //     language: props.languagePatient,
        //     start_time: props.startTime,
        //     start_location: props.start,
        //     goal_time: props.arrivalTime,
        //     goal_location: props.destination
        // }, {'Content-Type': 'application/json'})
        //     .then(function (response) {
        //         console.log(response.data);
        //         // response.data ist hier das dictionary des neuen Transports wie er in der Datenbank erfolgreich gespeichert wurde:
        //         // {"_id":1
        //         // "status":0, //0=not started
        //         // "mode":0, //0=wheelchair
        //         // "first_name":"Petra",
        //         // "last_name":"Müller",
        //         // "language":"de",
        //         // "start_time":"05.07.2021, 10:15",
        //         // "start_location":"R100",
        //         // "goal_time":"05.07.2021, 11:15",
        //         // "goal_location":"R201"}
        //     })
        //     .catch(function (error) {
        //         if (error.response) {
        //             console.log(error.response.data.message);
        //         } else {
        //             console.log("No response from server recieved")
        //         }
        //     })
        setOutput(input)
    }

    function handleClick2() {
        setInput(output)
    }

    return (
        <Container className={classes.root}>
            <Grid container justify="center" direction="row" spacing="3" className="demo">
                <Grid item xs={11} sm={5} lg={5} className={classes.item}>
                    <div>
                        <TranslatorInput language1={language1} setLanguage1={setLanguage1} />
                        <Fab aria-label="voice input" className={classes.talkButton}>
                            <MicIcon />
                        </Fab>
                        <Fab aria-label="voice input" className={classes.readButton}>
                            <ChatBubbleOutlineIcon />
                        </Fab>
                    </div>
                    <TextField
                        className={classes.textField}
                        InputProps={{ className: classes.input }}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        variant="outlined"
                        multiline
                    />
                </Grid>
                <Grid item xs={11} sm={1} lg={1} className={classes.itemButtons}>
                    <Grid item xs={10} sm={1} lg={1} className={classes.itemButtons}>
                        <TranslateButtonRight onClick={handleClick1} />
                        <TranslateButtonLeft onClick={handleClick2} />
                    </Grid>
                </Grid>
                <Grid item xs={11} sm={5} lg={5} className={classes.item}>
                    <div>
                        <TranslatorOutput language2={language2} setLanguage2={setLanguage2} />
                        <Fab aria-label="voice input" className={classes.talkButton}>
                            <MicIcon />
                        </Fab>
                        <Fab aria-label="voice input" className={classes.readButton}>
                            <ChatBubbleOutlineIcon />
                        </Fab>
                    </div>
                    <TextField
                        className={classes.textField}
                        value={output}
                        onChange={e => setOutput(e.target.value)}
                        variant="outlined"
                        InputProps={{ className: classes.input }}
                        multiline
                    />
                </Grid>
            </Grid>
        </Container>
    );
}
