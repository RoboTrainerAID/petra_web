import {makeStyles, Typography} from "@material-ui/core";
import {getTransportState} from "../../constants/TransportStates";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(() => ({
    container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: ".5rem",
    },
}));

export function StateAndDate({ transport }) {
    const { t, i18n } = useTranslation();
    const styles = useStyles();

    const state = getTransportState(transport?.status);

    const startTimeStamp = transport?.time_stamp - (transport?.is_start_time ? 0 : transport?.duration) * 60000;
    const endTimeStamp = transport?.time_stamp + (transport?.is_start_time ? transport?.duration : 0) * 60000;
    const startDate = new Date(startTimeStamp);
    const endDate = new Date(endTimeStamp);

    return (
        <div className={styles.container}>
            {!!state && <state.i/>}
            <Typography>{startDate.toLocaleDateString([ i18n.language ], {
                month: '2-digit',
                day: '2-digit',
                year: '2-digit'
            })}</Typography>

            <Typography>
                {startDate.toLocaleTimeString([ i18n.language ],
                {
                        hour: '2-digit',
                        minute: '2-digit'
                })} - {endDate.toLocaleTimeString([],
                {
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </Typography>
        </div>
    );
}
