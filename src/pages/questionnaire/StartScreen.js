import React, { useState } from 'react';
import { Button, Typography, Box, Paper, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: theme.spacing(2),
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: '#000',
    marginBottom: theme.spacing(2),
  },
  subtitle: {
    fontSize: '1.4rem',
    color: '#333',
    maxWidth: '700px',
    marginBottom: theme.spacing(4),
    lineHeight: 1.5,
  },
  warningPaper: {
    width: '100%',
    maxWidth: '700px',
    padding: '20px 24px',
    backgroundColor: '#fff4e5',
    color: '#663c00',
    border: '3px solid #ffe2b7',
    borderRadius: '12px',
    marginBottom: theme.spacing(3),
  },
  warningText: {
    fontSize: '1.25rem',
    fontWeight: 700,
  },
  buttonBox: {
    display: 'flex',
    flexDirection: 'column', // Vertical stack for massive touch targets on tablet
    gap: '1.5rem',
    width: '100%',
    maxWidth: '500px',
  },
  actionButton: {
    fontSize: '1.5rem',
    fontWeight: 800,
    height: '68px', // 68px minimum height for easy tapping
    borderRadius: '12px',
    textTransform: 'none',
  },
}));

export default function StartScreen({ onStartNew, onContinue }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const [warning, setWarning] = useState(false);

  const handleContinueAttempt = () => {
    const savedData = localStorage.getItem('nasa_tlx_session');
    if (savedData) {
      onContinue(JSON.parse(savedData));
    } else {
      setWarning(true);
      setTimeout(() => {
        onStartNew();
      }, 2000);
    }
  };

  return (
    <Box className={classes.container}>
      <Typography variant="h3" className={classes.title}>
        {t('questionnaire.start.title')}
      </Typography>
      <Typography className={classes.subtitle}>
        {t('questionnaire.start.subtitle')}
      </Typography>

      {warning && (
        <Paper elevation={0} className={classes.warningPaper}>
          <Typography className={classes.warningText}>
            {t('questionnaire.start.noSavedWarning')}
          </Typography>
        </Paper>
      )}

      <Box className={classes.buttonBox}>
        <Button
          variant="contained"
          color="primary"
          className={classes.actionButton}
          onClick={onStartNew}
        >
          {t('questionnaire.start.startNew')}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          className={classes.actionButton}
          onClick={handleContinueAttempt}
        >
          {t('questionnaire.start.continue')}
        </Button>
      </Box>
    </Box>
  );
}