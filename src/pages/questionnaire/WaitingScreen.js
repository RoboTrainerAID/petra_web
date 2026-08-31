import React from 'react';
import { Box, Typography, CircularProgress, Paper, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
    padding: theme.spacing(4),
  },
  card: {
    padding: theme.spacing(5),
    borderRadius: '16px',
    maxWidth: '600px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(3),
  },
  title: {
    fontSize: '2rem',
    fontWeight: 800,
  },
  subtitle: {
    fontSize: '1.3rem',
    color: '#555',
  },
}));

export default function WaitingScreen({ experimentNumber }) {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Box className={classes.container}>
      <Paper elevation={2} className={classes.card}>
        <CircularProgress size={80} thickness={4} color="primary" />
        <Typography className={classes.title}>
          {t('questionnaire.waiting.title', 'Training in Progress...')}
        </Typography>
        <Typography className={classes.subtitle}>
          {t('questionnaire.waiting.description', `Please wait while trial #${experimentNumber} is being processed. The questionnaire will appear automatically once ready.`)}
        </Typography>
      </Paper>
    </Box>
  );
}