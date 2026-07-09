import {ListItemText} from "@material-ui/core";
import {useTranslation} from "react-i18next";

export function TimeTableCell({ timeStamp, isStart, duration }) {
    const { t } = useTranslation();

    const date = new Date(timeStamp);
    const datePrefix = isStart ? t('transport_date_time_starts') : t('transport_date_time_ends');
    const dateFormatContent = t('date_time_formatted', {
        date: date.toLocaleDateString([], {
            month: '2-digit',
            day: '2-digit',
            year: '2-digit'
        }),
        time: date.toLocaleTimeString([],
            {
                hour: '2-digit',
                minute: '2-digit'
            }),
    });

    return <ListItemText
        primary={`${datePrefix} ${dateFormatContent}`}
        secondary={`${t('transport_date_time_duration')}: ${duration}${t('transport_date_time_minutes')}`}
    />
}
