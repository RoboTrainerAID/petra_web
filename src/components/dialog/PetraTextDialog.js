import {Fab, Paper, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import face from "../../assets/face_placeholder.png";
import React, {useCallback} from "react";
import {VolumeUp} from "@material-ui/icons";
import {useTTS} from "../../tts/useTTS";
import InfoTourTargets from "../../pages/info/InfoTourTargets";

const useStyles = makeStyles(() => ({
    container: {
        margin: "1rem",
        display: "flex",
        padding: ".5rem",
        flexDirection: "row",
        alignItems: "center",
        gap: "1rem",
        justifyContent: "flex-start",

        backgroundColor: 'transparent',
        zIndex: 21,
        '@media (max-width: 767px)': {
            display: "none !important",
        },
    },
    avatar: {
        position: "relative",
        width: "8rem",
        height: "8rem",
        minWidth: "8rem",
        minHeight: "8rem",
    },
    text: {
        alignSelf: "flex-start",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    spacer: {
        flexGrow: 1,
    },
    actionArea: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }
}));

export function PetraTextDialog({title, text, startTour}) {
    const styles = useStyles();

    const isMultiline = Array.isArray(text);
    const [ hasTTS, speak ] = useTTS();
    const readText = useCallback(() => {
        speak(`${title}.\n ${isMultiline ? text.join('\n') : text}`)
    }, [ title, text, isMultiline, speak ]);

    return (
        <Paper className={`${styles.container} ${InfoTourTargets.PETRA_DIALOG_AREA.css}`} elevation={4}>
            <div className={`${styles.avatar} ${InfoTourTargets.PETRA_AVATAR.css}`} onClick={() => startTour && startTour()}>
                <img src={face} alt="PeTRA face" width={"100%"} height={"100%"}/>
            </div>
            <div className={styles.text}>
                <Typography variant={"h5"}>
                    {title}
                </Typography>
                {isMultiline && text.map(t => <Typography>{t}</Typography>)}
                {!isMultiline && <Typography>{text}</Typography>}
            </div>
            <div className={styles.spacer}/>
            <div>
                <Fab className={InfoTourTargets.PETRA_SPEAK_BUTTON.css} color={"primary"} onClick={readText} disabled={!hasTTS}>
                    <VolumeUp/>
                </Fab>
            </div>
        </Paper>
    )
}
