import {Fab, makeStyles, Typography} from "@material-ui/core";
import {useTTS} from "../../tts/useTTS";
import face from "../../assets/face_placeholder.png";
import {VolumeUp} from "@material-ui/icons";
import React from "react";
import LanguageSwitcher from "../../components/header/LanguageSwitcher";
import {useTranslation} from "react-i18next";

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
    content: {
        maxWidth: "40rem",
    },
    language: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
    }
}));

export function TourSetupStep({ text }) {
    const styles = useStyles();
    const { t } = useTranslation();
    const [ hasTTS, speak ] = useTTS();

    return (
        <div className={styles.container}>
            <div className={styles.avatar}>
                <img src={face} alt="PeTRA face" width={"100%"} height={"100%"}/>
            </div>
            <div className={styles.content}>
                <Typography variant={"h5"}>
                    {text}
                </Typography>
                <div className={styles.language}>
                    <Typography variant={"h5"}>
                        {t("tour_setup_language")}
                    </Typography>
                    <LanguageSwitcher/>
                </div>
            </div>
            <Fab color={"primary"} disabled={!hasTTS} onClick={() => speak(text)}>
                <VolumeUp/>
            </Fab>
        </div>
    );
}
