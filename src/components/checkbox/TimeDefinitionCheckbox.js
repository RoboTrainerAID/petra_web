import React from "react"
import {useTranslation} from "react-i18next";

//Styling
import {makeStyles} from "@material-ui/core/styles";

//Components
import {FormControl, FormControlLabel, Radio, RadioGroup} from "@material-ui/core";


const useStyles = makeStyles({
    radioGroup: {
        display: "flex",
        flexDirection: "row",
    },
})


export default function TimeDefinitionCheckbox({timeDefinition, errorTimeDefinition, handleTimeDefinitionChange}) {
    const classes = useStyles();
    const {t} = useTranslation();

    return (
        <FormControl component="fieldset">
            <RadioGroup
                aria-label="timeDefinition"
                value={timeDefinition}
                error={errorTimeDefinition}
                onChange={handleTimeDefinitionChange}
                className={classes.radioGroup}>
                <FormControlLabel
                    value="start"
                    control={<Radio color="primary"/>}
                    label={t('newtransport_checkbox_timedefinition_start')}/>
                <FormControlLabel
                    value="arrival"
                    control={<Radio color="primary"/>}
                    label={t('newtransport_checkbox_timedefinition_arrival')}/>
            </RadioGroup>
        </FormControl>
    );
}

