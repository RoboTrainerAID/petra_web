import React from 'react';
import {useTranslation} from "react-i18next";

//Styling
import {makeStyles} from "@material-ui/core/styles";

//Icons&Images
import ScheduleIcon from '@material-ui/icons/Schedule';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import {FaRoute} from "react-icons/fa";

//Components
import Grid from '@material-ui/core/Grid';
import {Button, Modal} from "react-bootstrap";
import {Avatar, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Typography} from '@material-ui/core';
import {useLocation} from "../../petra_central_control/useLocation";
import {usePayload} from "../../petra_central_control/usePayload";
import {getPayloadType} from "../../constants/PayloadTypes";
import {getTransportMode} from "../../constants/TransportModes";


const useStyles = makeStyles({
    modal: {
        zIndex: "9000",
    },
    container: {
        marginTop: '8px',
        display: 'flex',
        alignItems: 'start',
        maxWidth: '70em',
    },
    root: {
        height: "20px",
        paddingTop: "12px",
        paddingBottom: "10px",
    },
    data: {
        fontWeight: "bold",
    }
})

const mode_name = ['Rollstuhl', 'Freies Gehen', 'Geführtes Gehen', 'Material']


export default function ModalTransportInformation({ transport, onAccept, onCancel, message, title, accept, cancel }) {
    const classes = useStyles();
    const { t } = useTranslation();

    const [ payload, payloadsInfo,, ] = usePayload(transport.payload);
    const [ startLocation, startLocationInfo,, ] = useLocation(transport.override_start_location ? transport.start_location : (payload?.location || 0));
    const [ destinationLocation, destinationLocationInfo,, ] = useLocation(transport.goal_location);

    const payloadType = getPayloadType(payload?.type || 0);
    const payloadName = payloadType.formatName(payload);
    const transportMode = getTransportMode(!!transport.override_mode ? transport.override_mode : (payload?.preferred_mode || 0))

    const startLocationDescription = t('location_descriptive_text', {
        name: startLocation?.name,
        floor: startLocation?.floor,
    });

    const destinationLocationDescription = t('location_descriptive_text', {
        name: destinationLocation?.name,
        floor: destinationLocation?.floor,
    });

    const date = new Date();
    date.setTime(transport.time_stamp)
    const dateFormatPrefix = transport.is_start_time ? t('transport_date_time_starts') : t('transport_date_time_ends');
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
    })
    const dateFormatted = `${dateFormatPrefix} ${dateFormatContent}`
    return (
        <Modal
            show={true}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className={classes.modal}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {t(title)}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Typography variant="h7">
                    {t(message)}
                </Typography>
                <List>
                    <Grid container spacing={2} className={classes.container}>
                        <Grid item xs={12} md={6} xl={6}>
                            <ListItem>
                                <ListItemIcon>
                                    <payloadType.i/>
                                </ListItemIcon>
                                <ListItemText primary={payloadName}/>
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <ScheduleIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={dateFormatted}/>
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <FaRoute />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText>
                                    {t('modal_transportinformation_from')}<span
                                        className={classes.data}>{startLocationDescription}</span>
                                    <ArrowRightAltIcon />
                                    {t('modal_transportinformation_to')}<span
                                        className={classes.data}>{destinationLocationDescription}</span>
                                </ListItemText>
                            </ListItem>
                        </Grid>
                        <Grid item xs={12} md={6} xl={6}>
                            {/*<ListItem>*/}
                            {/*    <ListItemAvatar>*/}
                            {/*        <Avatar>*/}
                            {/*            <LanguageIcon />*/}
                            {/*        </Avatar>*/}
                            {/*    </ListItemAvatar>*/}
                            {/*    <ListItemText>*/}
                            {/*        {t('modal_transportinformation_preferredlanguage')}<span*/}
                            {/*            className={classes.data}>{props.languagePatient}</span>*/}
                            {/*    </ListItemText>*/}
                            {/*</ListItem>*/}
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <transportMode.i/>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={t(transportMode.t)}/>
                            </ListItem>
                        </Grid>
                    </Grid>
                </List>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>{t(cancel)}</Button>
                <Button onClick={onAccept}>{t(accept)}</Button>
            </Modal.Footer>
        </Modal>
    );
}
