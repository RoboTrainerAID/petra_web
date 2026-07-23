import React, { useState } from 'react';
import { Grid, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Button, Typography, FormHelperText } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const GENDER_KEYS = ['female', 'male', 'non_binary', 'prefer_not_to_say'];

export default function PersonalInfoStep({ initialValues, onSubmit }) {
  const { t } = useTranslation();
  const [age, setAge] = useState(initialValues?.age ?? '');
  const [gender, setGender] = useState(initialValues?.gender ?? '');
  const [errors, setErrors] = useState({});

  const handleContinue = () => {
    const ageNum = Number(age);
    const isAgeValid = Number.isInteger(ageNum) && ageNum >= 0 && ageNum <= 120;
    const isGenderValid = Boolean(gender);

    const newErrors = {
      age: !isAgeValid,
      gender: !isGenderValid,
    };

    setErrors(newErrors);

    if (!newErrors.age && !newErrors.gender) {
      onSubmit({ age: ageNum, gender });
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6">{t('questionnaire.personal.title')}</Typography>
        <Typography variant="body2" color="textSecondary">
          {t('questionnaire.personal.description')}
        </Typography>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          variant="outlined"
          type="number"
          label={t('questionnaire.personal.age')}
          value={age}
          onChange={(e) => setAge(e.target.value)}
          error={errors.age}
          helperText={errors.age ? t('questionnaire.personal.ageError') : t('questionnaire.personal.ageHelper')}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl component="fieldset" error={errors.gender}>
          <FormLabel component="legend">{t('questionnaire.personal.gender')}</FormLabel>
          <RadioGroup value={gender} onChange={(e) => setGender(e.target.value)}>
            {GENDER_KEYS.map((key) => (
              <FormControlLabel
                key={key}
                value={key}
                control={<Radio color="primary" />}
                label={t(`questionnaire.personal.genders.${key}`)}
              />
            ))}
          </RadioGroup>
          {errors.gender && <FormHelperText>{t('questionnaire.personal.genderError')}</FormHelperText>}
        </FormControl>
      </Grid>

      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <Button variant="contained" color="primary" onClick={handleContinue}>
          {t('questionnaire.personal.continueBtn')}
        </Button>
      </Grid>
    </Grid>
  );
}