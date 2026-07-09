import {makeStyles, Typography} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {getLocationType} from "../../constants/LocationTypes";

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

export function LocationName({ location }) {
    const { t } = useTranslation();
    const styles = useStyles();

    const locationType = getLocationType(location?.type);

    return (
        <div className={styles.container}>
            {!!locationType && <locationType.i/>}
            <div className={styles.text}>
                <Typography variant={"body"}>{location?.name}</Typography>
                <Typography variant={"body2"}>{t('location_floor_text', {floor: location?.floor})}</Typography>
            </div>
        </div>
    );
}
