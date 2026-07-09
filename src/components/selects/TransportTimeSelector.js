import {Grid, Radio, Typography} from "@material-ui/core";
import React from "react";
import {Form} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {KeyboardDateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import deLocale from "date-fns/locale/de";

export function TransportTimeSelector({date, isStart, error, onChangeDate, onChangeIsStart}) {
    const { t, i18n } = useTranslation();

    const localeMap = {
        de: deLocale,
    };

    return (
        <>
            <Grid item xs={12} sm={6} md={6} xl={6}>
                <Form.Group>
                    <Radio
                        color={"primary"}
                        checked={isStart}
                        onChange={() => onChangeIsStart(true)}
                    />
                    <Form.Label>{t('newtransport_checkbox_choose_start_time')}</Form.Label>
                    <br/>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMap[i18n.language]}>
                        <KeyboardDateTimePicker
                            id={"date-picker-dialog"}

                            value={isStart ? date : null}
                            onChange={d => onChangeDate(d)}
                            disabled={!isStart}

                            format={"dd.MM.yyyy',' HH:mm 'Uhr'"}
                            mask={"__.__.____, __:__ Uhr"}
                            ampm={false}
                            showTodayButton
                            invalidDateMessage={t("newtransport_form_date_invalid")}
                            minDateMessage={t("newtransport_form_date_min")}
                            todayLabel={t("newtransport_form_date_today")}
                            cancelLabel={t("newtransport_form_date_cancel")}
                            okLabel={t("newtransport_form_date_accept")}

                            inputVariant={"outlined"}
                            keyboardButtonPrompts={{
                                "aria-label": t("newtransport_form_date_prompt"),
                            }}
                        />
                    </MuiPickersUtilsProvider>
                    {error && isStart && <>
                        <br/>
                        <Typography color={"error"}>
                            {t("transport_edit_date_error")}
                        </Typography>
                    </>}
                </Form.Group>
            </Grid>
            <Grid item xs={12} sm={6} md={6} xl={6}>
                <Form.Group>
                    <Radio
                        color={"primary"}
                        checked={!isStart}
                        onChange={() => onChangeIsStart(false)}
                    />
                    <Form.Label>{t('newtransport_checkbox_choose_arrival_time')}</Form.Label>
                    <br/>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMap[i18n.language]}>
                        <KeyboardDateTimePicker
                            id={"date-picker-dialog"}

                            value={isStart ? null : date}
                            onChange={d => onChangeDate(d)}
                            disabled={isStart}

                            format={"dd.MM.yyyy',' HH:mm 'Uhr'"}
                            mask={"__.__.____, __:__ Uhr"}
                            ampm={false}
                            showTodayButton
                            invalidDateMessage={t("newtransport_form_date_invalid")}
                            minDateMessage={t("newtransport_form_date_min")}
                            todayLabel={t("newtransport_form_date_today")}
                            cancelLabel={t("newtransport_form_date_cancel")}
                            okLabel={t("newtransport_form_date_accept")}

                            inputVariant={"outlined"}
                            keyboardButtonPrompts={{
                                "aria-label": t("newtransport_form_date_prompt"),
                            }}
                        />
                    </MuiPickersUtilsProvider>
                    {error && !isStart && <>
                        <br/>
                        <Typography color={"error"}>
                            {t("transport_edit_date_error")}
                        </Typography>
                    </>}
                </Form.Group>
            </Grid>
        </>
    );
}
