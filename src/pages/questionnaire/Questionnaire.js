import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, LinearProgress, Chip, Box, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import StartScreen from './StartScreen';
import PersonalInfoStep from './PersonalInfoStep';
import ExperimentStep from './ExperimentStep';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3, 0),
  },
  paper: {
    padding: theme.spacing(3),
    height: '75vh',             // Constrain height so inner container can scroll
    maxHeight: '800px',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexShrink: 0,              // Keep header fixed at top
    marginBottom: theme.spacing(2),
  },
  content: {
    flex: 1,                    // Occupy remaining height
    overflowY: 'auto',          // Enable vertical scrolling
    minHeight: 0,               // Allow flex item to shrink below content size
    paddingRight: theme.spacing(1), // Prevents scrollbar from touching text
  },
}));

const INITIAL_TLX = {
  mental_demand: null,
  physical_demand: null,
  temporal_demand: null,
  performance: null,
  effort: null,
  frustration: null,
};

// Configure total experiments needed for your study
const TOTAL_EXPERIMENTS = 3;

export default function QuestionnaireContainer() {
  const classes = useStyles();
  const { t } = useTranslation();

  // Mode: 'start' | 'personal' | 'experiments' | 'summary'
  const [screen, setScreen] = useState('start');
  const [personalInfo, setPersonalInfo] = useState(null);
  const [currentExpIndex, setCurrentExpIndex] = useState(0);
  
  // Array holding scores for each experiment iteration
  const [experimentScores, setExperimentScores] = useState(
    Array.from({ length: TOTAL_EXPERIMENTS }, () => ({ ...INITIAL_TLX }))
  );

  // Auto-save state changes locally
  useEffect(() => {
    if (screen !== 'start') {
      const sessionData = { screen, personalInfo, currentExpIndex, experimentScores };
      localStorage.setItem('nasa_tlx_session', JSON.stringify(sessionData));
    }
  }, [screen, personalInfo, currentExpIndex, experimentScores]);

  const handleStartNew = () => {
    localStorage.removeItem('nasa_tlx_session');
    setPersonalInfo(null);
    setCurrentExpIndex(0);
    setExperimentScores(Array.from({ length: TOTAL_EXPERIMENTS }, () => ({ ...INITIAL_TLX })));
    setScreen('personal');
  };

  const handleContinueSession = (savedData) => {
    setPersonalInfo(savedData.personalInfo);
    setCurrentExpIndex(savedData.currentExpIndex ?? 0);
    setExperimentScores(savedData.experimentScores ?? Array.from({ length: TOTAL_EXPERIMENTS }, () => ({ ...INITIAL_TLX })));
    setScreen(savedData.screen || 'personal');
  };

  const handlePersonalSubmit = (data) => {
    setPersonalInfo(data);
    setScreen('experiments');
  };

  const handleScoreChange = (key, value) => {
    setExperimentScores((prev) => {
      const updated = [...prev];
      updated[currentExpIndex] = { ...updated[currentExpIndex], [key]: value };
      return updated;
    });
  };

  const handleNextExperiment = () => {
    if (currentExpIndex < TOTAL_EXPERIMENTS - 1) {
      setCurrentExpIndex((prev) => prev + 1);
    } else {
      setScreen('summary');
      localStorage.removeItem('nasa_tlx_session'); // Clear session upon complete finish
    }
  };

  const handleBackExperiment = () => {
    if (currentExpIndex > 0) {
      setCurrentExpIndex((prev) => prev - 1);
    } else {
      setScreen('personal');
    }
  };

  return (
    <Container maxWidth="md" className={classes.root}>
      <Paper elevation={3} className={classes.paper}>
        <div className={classes.header}>
          <Typography variant="h4">{t('questionnaire.title')}</Typography>
          <Typography color="textSecondary">{t('questionnaire.description')}</Typography>

          {screen !== 'start' && screen !== 'summary' && (
            <Box mt={2}>
              <Box display="flex" gap={1} mb={1}>
                <Chip
                  label={t('questionnaire.personal.title')}
                  color={screen === 'personal' ? 'primary' : 'default'}
                />
                <Chip
                  label={t('questionnaire.tlx.experimentTitle', {
                    current: currentExpIndex + 1,
                    total: TOTAL_EXPERIMENTS,
                  })}
                  color={screen === 'experiments' ? 'primary' : 'default'}
                />
              </Box>
              <LinearProgress
                variant="determinate"
                value={screen === 'personal' ? 20 : 20 + ((currentExpIndex + 1) / TOTAL_EXPERIMENTS) * 80}
              />
            </Box>
          )}
        </div>

        <div className={classes.content}>
          {screen === 'start' && (
            <StartScreen onStartNew={handleStartNew} onContinue={handleContinueSession} />
          )}

          {screen === 'personal' && (
            <PersonalInfoStep initialValues={personalInfo} onSubmit={handlePersonalSubmit} />
          )}

          {screen === 'experiments' && (
            <ExperimentStep
              experimentIndex={currentExpIndex}
              totalExperiments={TOTAL_EXPERIMENTS}
              scores={experimentScores[currentExpIndex]}
              onScoreChange={handleScoreChange}
              onNext={handleNextExperiment}
              onBack={handleBackExperiment}
            />
          )}

          {screen === 'summary' && (
            <Box textAlign="center" py={4}>
              <Typography variant="h5">{t('questionnaire.summary.title')}</Typography>
              <Typography color="textSecondary" style={{ marginTop: '0.5rem' }}>
                {t('questionnaire.summary.description')}
              </Typography>
            </Box>
          )}
        </div>
      </Paper>
    </Container>
  );
}