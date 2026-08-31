import React, { useState } from 'react';
import { Grid, TextField, Button, Typography, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  title: { fontSize: '2rem', fontWeight: 800 },
  description: { fontSize: '1.25rem', marginBottom: theme.spacing(2), color: '#333' },
  inputLarge: {
    '& .MuiInputBase-root': { fontSize: '1.4rem', height: '64px', borderRadius: '10px' },
    '& .MuiInputLabel-root': { fontSize: '1.25rem' },
    '& .MuiFormHelperText-root': { fontSize: '1.1rem', marginTop: '8px' },
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
  const [error, setError] = useState(false);

  const isUserIdValid = Boolean(userId.trim());

  const handleUserIdChange = (e) => {
    const val = e.target.value;
    setUserId(val);
    setError(!val.trim());
  };

  const handleContinue = () => {
    if (isUserIdValid) {
      onSubmit({ userId: userId.trim() });
    }
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h4" className={classes.title}>
          {t('questionnaire.personal.title', 'Participant Identification')}
        </Typography>
        <Typography className={classes.description}>
          {t('questionnaire.personal.description', 'Please enter your User ID to begin.')}
        </Typography>
      </Grid>

      <Grid item xs={12} md={8}>
        <TextField
          fullWidth
          required
          variant="outlined"
          className={classes.inputLarge}
          label={t('questionnaire.personal.userId', 'User ID')}
          value={userId}
          onChange={handleUserIdChange}
          error={error}
          helperText={
            error
              ? t('questionnaire.personal.userIdError', 'Please enter a valid User ID.')
              : t('questionnaire.personal.userIdHelper', 'e.g., Participant_01')
          }
        />
      </Grid>

      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <Button
          variant="contained"
          color="primary"
          className={classes.actionButton}
          onClick={handleContinue}
          disabled={!isUserIdValid}
        >
          {t('questionnaire.personal.continueBtn', 'Continue')}
        </Button>
      </Grid>
    </Grid>
  );
}