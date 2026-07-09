import {useTTS} from "../../tts/useTTS";
import {makeStyles} from "@material-ui/core/styles";
import {Fab, Paper, Typography} from "@material-ui/core";
import face from "../../assets/face_placeholder.png";
import React, {useCallback} from "react";
import {VolumeUp} from "@material-ui/icons";
import InfoTourTargets from "../../pages/info/InfoTourTargets";

const useStyles = makeStyles(() => ({
    container: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    child_and_action_area: {
        position: "relative",
        flexGrow: 1,
        width: "100%",
        display: "flex",
        flexDirection: "column",
    },
    emergency: {
        backgroundColor: "#df4759",
    },
    header: {
        width: "100%",
        display: "flex",
        padding: ".5rem",
        flexDirection: "row",
        alignItems: "center",
        gap: "1rem",
        justifyContent: "flex-start",
        borderBottomStyle: "solid",
        borderWidth: "1px",
        borderColor: "lightgrey",

        backgroundColor: 'transparent',
        zIndex: 21,
        '@media (max-width: 767px)': {
            display: "none !important",
        },
    },
    avatar: {
        position: "relative",
        minWidth: "8rem",
        minHeight: "8rem",
        maxWidth: "8rem",
        maxHeight: "8rem"
    },
    headerText: {
        padding: "1rem",
        alignSelf: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
    },
    spacer: {
        flexGrow: 1
    },
    customActionArea: {
        padding: "1rem",
        alignSelf: "center",
        display: "flex",
        direction: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem"
    },
    actionArea: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }
}));

export function PetraTransportDialog({comment, actions, children, emergency, startTour}) {
    const styles = useStyles();

    const [ hasTTS, speak ] = useTTS();
    const readComment = useCallback(() => speak(comment), [ speak, comment ]);

    return (
        <Paper className={styles.container} elevation={4}>
            <div className={`${styles.header} ${InfoTourTargets.PETRA_DIALOG_AREA.css}`}>
                <div className={`${styles.avatar} ${InfoTourTargets.PETRA_AVATAR.css}`} onClick={() => startTour && startTour()}>
                    <img src={face} alt="PeTRA face" width={"100%"} height={"100%"}/>
                </div>
                <div className={styles.headerText}>
                    <Typography variant={"h5"}>
                        {comment}
                    </Typography>
                </div>
                <div className={styles.spacer}/>
                <div className={styles.actionArea}>
                    <Fab className={InfoTourTargets.PETRA_SPEAK_BUTTON.css} color={"primary"} disabled={!hasTTS} onClick={readComment}>
                        <VolumeUp/>
                    </Fab>
                </div>
            </div>
            <div className={`${styles.child_and_action_area} ${emergency && styles.emergency} ${InfoTourTargets.TRANSPORT_DETAILS_AREA.css}`}>
                {children}
                <div className={styles.spacer}/>
                <div className={styles.customActionArea}>
                    {actions}
                </div>
            </div>
        </Paper>
    )
}
