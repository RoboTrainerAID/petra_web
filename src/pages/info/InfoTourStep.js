import {makeStyles} from "@material-ui/core/styles";
import face from "../../assets/face_placeholder.png";
import React from "react";
import {Fab, Typography} from "@material-ui/core";
import {useTTS} from "../../tts/useTTS";
import {VolumeUp} from "@material-ui/icons";

const useStyles = makeStyles(() => ({
    container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
    },
    avatar: {
        position: "relative",
        minWidth: "8rem",
        minHeight: "8rem",
        maxWidth: "8rem",
        maxHeight: "8rem"
    },
    text: {
        maxWidth: "40rem",
    }
}))
export function InfoTourStep({text}) {
    const styles = useStyles();
    const [ hasTTS, speak ] = useTTS();

    return (
        <div className={styles.container}>
            <div className={styles.avatar}>
                <img src={face} alt="PeTRA face" width={"100%"} height={"100%"}/>
            </div>
            <Typography variant={"h5"} className={styles.text}>
                {text}
            </Typography>
            <Fab color={"primary"} disabled={!hasTTS} onClick={() => speak(text)}>
                <VolumeUp/>
            </Fab>
        </div>
    );
}
