import React, { useState } from 'react';
import {
  Grid,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Typography,
  FormHelperText,
  makeStyles,
  Paper,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const GENDER_KEYS = ['female', 'male', 'non_binary', 'prefer_not_to_say'];

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: '2rem',
    fontWeight: 800,
  },
  description: {
    fontSize: '1.25rem',
    marginBottom: theme.spacing(2),
    color: '#333',
  },
  fieldLabel: {
    fontSize: '1.35rem',
    fontWeight: 700,
    color: '#000',
    marginBottom: theme.spacing(1.5),
  },
  inputLarge: {
    '& .MuiInputBase-root': {
      fontSize: '1.4rem',
      height: '64px', // Touch optimized input height
      borderRadius: '10px',
    },
    '& .MuiInputLabel-root': {
      fontSize: '1.25rem',
    },
    '& .MuiFormHelperText-root': {
      fontSize: '1.1rem',
      marginTop: '8px',
    },
  },
  radioCard: {
    padding: '12px 20px',
    borderRadius: '10px',
    border: '2px solid #ccc',
    display: 'flex',
    alignItems: 'center',
    margin: 0,
    width: '100%',
    '& .MuiFormControlLabel-label': {
      fontSize: '1.3rem',
      fontWeight: 600,
      marginLeft: '8px',
    },
  },
  actionButton: {
    fontSize: '1.4rem',
    fontWeight: 800,
    height: '64px',
    padding: '0 48px',
    borderRadius: '12px',
    textTransform: 'none',
  },
}));

export default function PersonalInfoStep({ initialValues, onSubmit }) {
  const classes = useStyles();
  const { t } = useTranslation();

  const [userId, setUserId] = useState(initialValues?.userId ?? '');
  const [age, setAge] = useState(initialValues?.age ?? '');
  const [gender, setGender] = useState(initialValues?.gender ?? '');
  const [errors, setErrors] = useState({});

  const isUserIdValid = Boolean(userId.trim());
  const ageNum = Number(age);
  const isAgeValid = age !== '' && Number.isInteger(ageNum) && ageNum >= 0 && ageNum <= 120;
  const isGenderValid = Boolean(gender);

  const isFormValid = isUserIdValid && isAgeValid && isGenderValid;

  const handleUserIdChange = (e) => {
    const val = e.target.value;
    setUserId(val);
    setErrors((prev) => ({ ...prev, userId: !val.trim() }));
  };

  const handleAgeChange = (e) => {
    const val = e.target.value;
    setAge(val);
    const num = Number(val);
    const valid = val !== '' && Number.isInteger(num) && num >= 0 && num <= 120;
    setErrors((prev) => ({ ...prev, age: !valid }));
  };

  const handleGenderChange = (e) => {
    const val = e.target.value;
    setGender(val);
    setErrors((prev) => ({ ...prev, gender: !val }));
  };

  const handleContinue = () => {
    if (isFormValid) {
      onSubmit({ userId: userId.trim(), age: ageNum, gender });
    }
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h4" className={classes.title}>
          {t('questionnaire.personal.title')}
        </Typography>
        <Typography className={classes.description}>
          {t('questionnaire.personal.description')}
        </Typography>
      </Grid>

      {/* User ID Field */}
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          required
          variant="outlined"
          className={classes.inputLarge}
          label={t('questionnaire.personal.userId', 'User ID')}
          value={userId}
          onChange={handleUserIdChange}
          error={Boolean(errors.userId)}
          helperText={
            errors.userId
              ? t('questionnaire.personal.userIdError', 'Please enter a valid User ID.')
              : t('questionnaire.personal.userIdHelper', 'e.g., Participant_01')
          }
        />
      </Grid>

      {/* Age Field */}
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          required
          variant="outlined"
          type="number"
          className={classes.inputLarge}
          label={t('questionnaire.personal.age')}
          value={age}
          onChange={handleAgeChange}
          error={Boolean(errors.age)}
          helperText={
            errors.age
              ? t('questionnaire.personal.ageError')
              : t('questionnaire.personal.ageHelper')
          }
          inputProps={{ min: 0, max: 120, step: 1 }}
        />
      </Grid>

      {/* Gender Field */}
      <Grid item xs={12}>
        <FormControl component="fieldset" error={Boolean(errors.gender)} required style={{ width: '100%' }}>
          <FormLabel component="legend" className={classes.fieldLabel}>
            {t('questionnaire.personal.gender')}
          </FormLabel>
          <RadioGroup
            row
            value={gender}
            onChange={handleGenderChange}
            style={{ gap: '1rem', flexWrap: 'wrap' }}
          >
            {GENDER_KEYS.map((key) => (
              <Grid item xs={12} sm={5} key={key}>
                <Paper
                  elevation={0}
                  className={classes.radioCard}
                  style={{
                    borderColor: gender === key ? '#1976d2' : '#ccc',
                    backgroundColor: gender === key ? '#e3f2fd' : '#fff',
                  }}
                >
                  <FormControlLabel
                    value={key}
                    control={<Radio color="primary" style={{ transform: 'scale(1.5)' }} />}
                    label={t(`questionnaire.personal.genders.${key}`)}
                    style={{ width: '100%', margin: 0 }}
                  />
                </Paper>
              </Grid>
            ))}
          </RadioGroup>
          {errors.gender && (
            <FormHelperText style={{ fontSize: '1.1rem', marginTop: '12px' }}>
              {t('questionnaire.personal.genderError')}
            </FormHelperText>
          )}
        </FormControl>
      </Grid>

      {/* Submit Button */}
      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <Button
          variant="contained"
          color="primary"
          className={classes.actionButton}
          onClick={handleContinue}
          disabled={!isFormValid}
        >
          {t('questionnaire.personal.continueBtn')}
        </Button>
      </Grid>
    </Grid>
  );
}