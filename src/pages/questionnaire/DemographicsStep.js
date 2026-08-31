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
  LinearProgress,
  Box,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const GENDER_KEYS = ['female', 'male', 'non_binary', 'prefer_not_to_say'];

const EXPERIENCE_OPTIONS = [
  { key: 'never', label: 'Never used' },
  { key: 'once', label: 'Used once briefly' },
  { key: 'several', label: 'Used several times' },
  { key: 'often', label: 'Used very often' },
];

const useStyles = makeStyles((theme) => ({
  title: { fontSize: '2rem', fontWeight: 800 },
  description: { fontSize: '1.25rem', marginBottom: theme.spacing(2), color: '#333' },
  fieldLabel: { fontSize: '1.35rem', fontWeight: 700, color: '#000', marginBottom: theme.spacing(1.5) },
  inputLarge: {
    '& .MuiInputBase-root': { fontSize: '1.4rem', height: '64px', borderRadius: '10px' },
    '& .MuiInputLabel-root': { fontSize: '1.25rem' },
    '& .MuiFormHelperText-root': { fontSize: '1.1rem', marginTop: '8px' },
  },
  radioCard: {
    padding: '16px 20px',
    borderRadius: '10px',
    border: '2px solid #ccc',
    display: 'flex',
    alignItems: 'center',
    margin: 0,
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '& .MuiFormControlLabel-label': { fontSize: '1.3rem', fontWeight: 600, marginLeft: '8px' },
  },
  actionButton: {
    fontSize: '1.4rem',
    fontWeight: 800,
    height: '64px',
    padding: '0 48px',
    borderRadius: '12px',
    textTransform: 'none',
  },
  progressBar: {
    height: '10px',
    borderRadius: '5px',
    marginBottom: theme.spacing(3),
  },
}));

export default function DemographicsStep({ onSubmit }) {
  const classes = useStyles();
  const { t } = useTranslation();

  const TOTAL_SUB_STEPS = 2;
  const [currentSubStep, setCurrentSubStep] = useState(1);

  // Form Field States
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [errors, setErrors] = useState({});

  // Validation Logic
  const ageNum = Number(age);
  const isAgeValid = age !== '' && Number.isInteger(ageNum) && ageNum >= 0 && ageNum <= 120;
  const isGenderValid = Boolean(gender);
  const isScreen1Valid = isAgeValid && isGenderValid;
  const isScreen2Valid = Boolean(experienceLevel);

  // Field Handlers
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

  const handleExperienceChange = (e) => {
    const val = e.target.value;
    setExperienceLevel(val);
    setErrors((prev) => ({ ...prev, experienceLevel: !val }));
  };

  // Navigation Handlers
  const handleNext = () => {
    if (currentSubStep === 1 && isScreen1Valid) {
      setCurrentSubStep(2);
    } else if (currentSubStep === 2 && isScreen2Valid) {
      onSubmit({
        age: ageNum,
        gender,
        experience_level: experienceLevel,
      });
    }
  };

  const handleBack = () => {
    if (currentSubStep > 1) {
      setCurrentSubStep(1);
    }
  };

  const progressPercent = (currentSubStep / TOTAL_SUB_STEPS) * 100;

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" className={classes.title}>
            {t('questionnaire.demographics.title', 'Demographic Questions')}
          </Typography>
          <Typography variant="h6" style={{ fontWeight: 700, color: '#555' }}>
            Step {currentSubStep} of {TOTAL_SUB_STEPS}
          </Typography>
        </Box>
        <Typography className={classes.description}>
          {t('questionnaire.demographics.description', 'Please complete these questions to finish the experiment.')}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={progressPercent}
          className={classes.progressBar}
        />
      </Grid>

      {/* SCREEN 1: Age & Gender */}
      {currentSubStep === 1 && (
        <>
          {/* Age Field */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              variant="outlined"
              type="number"
              className={classes.inputLarge}
              label={t('questionnaire.personal.age', 'Age')}
              value={age}
              onChange={handleAgeChange}
              error={Boolean(errors.age)}
              helperText={
                errors.age
                  ? t('questionnaire.personal.ageError', 'Please enter a valid age.')
                  : t('questionnaire.personal.ageHelper', 'e.g., 25')
              }
              inputProps={{ min: 0, max: 120, step: 1 }}
            />
          </Grid>

          {/* Gender Field */}
          <Grid item xs={12}>
            <FormControl component="fieldset" error={Boolean(errors.gender)} required style={{ width: '100%' }}>
              <FormLabel component="legend" className={classes.fieldLabel}>
                {t('questionnaire.personal.gender', 'Gender')}
              </FormLabel>
              <RadioGroup row value={gender} onChange={handleGenderChange} style={{ gap: '1rem', flexWrap: 'wrap' }}>
                {GENDER_KEYS.map((key) => (
                  <Grid item xs={12} sm={5} key={key}>
                    <Paper
                      elevation={0}
                      className={classes.radioCard}
                      style={{
                        borderColor: gender === key ? '#1976d2' : '#ccc',
                        backgroundColor: gender === key ? '#e3f2fd' : '#fff',
                      }}
                      onClick={() => handleGenderChange({ target: { value: key } })}
                    >
                      <FormControlLabel
                        value={key}
                        control={<Radio color="primary" style={{ transform: 'scale(1.5)' }} />}
                        label={t(`questionnaire.personal.genders.${key}`, key)}
                        style={{ width: '100%', margin: 0 }}
                      />
                    </Paper>
                  </Grid>
                ))}
              </RadioGroup>
              {errors.gender && (
                <FormHelperText style={{ fontSize: '1.1rem', marginTop: '12px' }}>
                  {t('questionnaire.personal.genderError', 'Please select an option.')}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
        </>
      )}

      {/* SCREEN 2: Experience Level */}
      {currentSubStep === 2 && (
        <Grid item xs={12}>
          <FormControl component="fieldset" error={Boolean(errors.experienceLevel)} required style={{ width: '100%' }}>
            <FormLabel component="legend" className={classes.fieldLabel}>
              {t(
                'questionnaire.demographics.robotrainerExperience',
                'How much prior experience do you have with RoboTrainer?'
              )}
            </FormLabel>

            <RadioGroup value={experienceLevel} onChange={handleExperienceChange}>
              {/* 2x2 Grid Container */}
              <Grid container spacing={2}>
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <Grid item xs={12} sm={6} key={opt.key}>
                    <Paper
                      elevation={0}
                      className={classes.radioCard}
                      style={{
                        borderColor: experienceLevel === opt.key ? '#1976d2' : '#ccc',
                        backgroundColor: experienceLevel === opt.key ? '#e3f2fd' : '#fff',
                      }}
                      onClick={() => handleExperienceChange({ target: { value: opt.key } })}
                    >
                      <FormControlLabel
                        value={opt.key}
                        control={<Radio color="primary" style={{ transform: 'scale(1.5)' }} />}
                        label={t(`questionnaire.demographics.experience.${opt.key}`, opt.label)}
                        style={{ width: '100%', margin: 0 }}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </RadioGroup>

            {errors.experienceLevel && (
              <FormHelperText style={{ fontSize: '1.1rem', marginTop: '12px' }}>
                {t('questionnaire.demographics.experienceError', 'Please select your level of experience.')}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>
      )}

      {/* Navigation Actions */}
      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <Button
          variant="outlined"
          className={classes.actionButton}
          onClick={handleBack}
          disabled={currentSubStep === 1}
        >
          {t('common.back', 'Back')}
        </Button>

        <Button
          variant="contained"
          color="primary"
          className={classes.actionButton}
          onClick={handleNext}
          disabled={currentSubStep === 1 ? !isScreen1Valid : !isScreen2Valid}
        >
          {currentSubStep === TOTAL_SUB_STEPS
            ? t('common.submit', 'Submit')
            : t('common.next', 'Next')}
        </Button>
      </Grid>
    </Grid>
  );
}