import {useCallback, useState} from "react";
import PayloadTypes from "../../constants/PayloadTypes";
import {getTransportMode} from "../../constants/TransportModes";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Typography
} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {usePayloadList} from "../../petra_central_control/usePayload";
import {PayloadTypeSelector} from "./PayloadTypeSelector";
import ModeSelector from "./ModeSelector";
import LanguageSelectorPatient from "./LanguageSelectorPatient";
import LocationSelector from "./LocationSelector";
import {makeStyles} from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";

const useStyles = makeStyles(() => ({
    textField: {
        width: "88%",
        marginRight: "3vw",
        '@media (max-width: 767px)': {
            width: "100%",
            marginRight: '1px',
        }
    },
}));

export function AddPayloadDialog({show, onClose, onPayloadAdded}) {
    const { t } = useTranslation();
    const styles = useStyles();

    const [payloadList, info, addPayload, setPayload, removePayload, refreshPayloads] = usePayloadList();

    const [ isLoading, setIsLoading ] = useState(false);
    const [ networkError, setNetworkError ] = useState(false);

    const [ type, setType ] = useState(PayloadTypes.PATIENT);

    const [ name, setName ] = useState(null);
    const [ nameError, setNameError ] = useState(false);

    const [ lastName, setLastName ] = useState(null);
    const [ lastNameError, setLastNameError ] = useState(false);

    const [ preferredMode, setPreferredMode ] = useState(-1);
    const [ preferredModeError, setPreferredModeError ] = useState(false);

    const [ preferredLanguage, setPreferredLanguage ] = useState("de");

    const [ location, setLocation ] = useState(0);
    const [ locationError, setLocationError ] = useState(false);

    const checkErrors = useCallback(() => {
        const nE = !name || "" === name;
        const lnE = PayloadTypes.PATIENT.matches(type.v) && (!lastName || "" === lastName);
        const pmE = !getTransportMode(preferredMode);
        const lE = location <= 0;
        setNameError(nE);
        setPreferredModeError(pmE);
        setLocationError(lE);
        setLastNameError(lnE);
        setNetworkError(false);

        return nE || lnE || pmE || lE;
    }, [ type, name, lastName, preferredMode, location ]);

    const reset = useCallback(() => {
        setType(PayloadTypes.PATIENT);
        setName(null);
        setLastName(null);
        setPreferredMode(-1);
        setPreferredLanguage("de");
        setLocation(0);

        setNameError(false);
        setLastNameError(false);
        setPreferredModeError(false);
        setLocationError(false);
        setNetworkError(false);
    }, []);

    const handleAddPayload = useCallback(() => {
        if (checkErrors()) {
            return; // we do nothing if any error occurred
        }

        //if no errors are present, we can add the new payload
        setIsLoading(true);
        const newPayload = {
            type: type.v,
            name: name,
            preferred_mode: preferredMode,
            location: location,
        };
        if (PayloadTypes.PATIENT.matches(type.v)) { //preferred language and last name are only added for patients
            newPayload.preferred_language = preferredLanguage;
            newPayload.last_name = lastName;
        }

        addPayload(newPayload, p => {
            reset();
            setIsLoading(false);
            onPayloadAdded && onPayloadAdded(p);
        }, e => {
            setNetworkError(true);
            setIsLoading(false);
        });
    }, [ onPayloadAdded, reset, addPayload, checkErrors, type, name, lastName, preferredMode, location, preferredLanguage ]);

    const handleClose = useCallback(() => {
        if (isLoading) return;
        reset();
        onClose();
    }, [ reset, onClose, isLoading ]);

    const isPatient = PayloadTypes.PATIENT.matches(type.v);

    return (
        <Dialog open={show} onClose={handleClose}>
            <DialogTitle>
                {t("add_payload_title")}
            </DialogTitle>
            <DialogContent>
                {info.isSuccess ? (
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <PayloadTypeSelector
                                payloadType={type}
                                onPayloadTypeChange={pt => setType(pt)}
                                disabled={isLoading}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            {isPatient && <LanguageSelectorPatient
                                disabled={isLoading}
                                languagePatient={preferredLanguage}
                                handleLanguageChange={e => setPreferredLanguage(e.target.value)}
                            />}
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl variant={"outlined"} className={styles.textField}>
                                <TextField
                                    value={name || ""}
                                    onChange={e => setName(e.target.value)}
                                    disabled={isLoading}

                                    error={nameError}
                                    helperText={nameError && <Typography color={"error"}>
                                        {t(isPatient ? "add_payload_first_name_error" : "add_payload_name_error")}
                                    </Typography>}

                                    variant={"outlined"}
                                    label={t(isPatient ? "add_payload_first_name" : "add_payload_name")}
                                    placeholder={t(isPatient ? "add_payload_first_name_enter" : "add_payload_name_enter")}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            {isPatient &&
                                <FormControl variant={"outlined"} className={styles.textField}>
                                    <TextField
                                        value={lastName || ""}
                                        onChange={e => setLastName(e.target.value)}
                                        disabled={isLoading}

                                        error={lastNameError}
                                        helperText={lastNameError && <Typography color={"error"}>{t("add_payload_last_name_error")}</Typography>}

                                        variant={"outlined"}
                                        label={t("add_payload_last_name")}
                                        placeholder={t("add_payload_last_name_enter")}
                                    />
                                </FormControl>
                            }
                        </Grid>
                        <Grid item xs={6}>
                            <ModeSelector
                                errorMode={preferredModeError}
                                mode={preferredMode}
                                onModeChange={setPreferredMode}
                                disabled={isLoading}
                                payloadType={type}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <LocationSelector
                                error={locationError}
                                disabled={isLoading}
                                location={location}
                                onChange={setLocation}
                            />
                        </Grid>
                    </Grid>
                ) : <CircularProgress/>}
            </DialogContent>
            <DialogActions>
                { networkError && <Typography color={"error"}>
                    {t("add_payload_network_error")}
                </Typography>}
                <Button color={"primary"} disabled={!info.isSuccess} onClick={handleAddPayload}>
                    {t("add_payload_confirm")}
                </Button>
                <Button
                    disabled={!info.isSuccess}
                    onClick={handleClose}
                >
                    {t("add_payload_cancel")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
