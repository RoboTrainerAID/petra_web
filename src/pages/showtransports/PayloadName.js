import {makeStyles, Typography} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {getPayloadType} from "../../constants/PayloadTypes";

const useStyles = makeStyles(() => ({
    container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
    },
    text: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
    },
}));

export function PayloadName({ payload }) {
    const { t } = useTranslation();
    const styles = useStyles();

    const payloadType = getPayloadType(payload?.type);
    const payloadName = payloadType?.formatName(payload);

    return (
        <div className={styles.container}>
            {!!payloadType && <payloadType.i/>}
            <div className={styles.text}>
                <Typography variant={"body"}>{t(payloadType?.t)}</Typography>
                <Typography variant={"body2"}>{payloadName}</Typography>
            </div>
        </div>
    )
}
