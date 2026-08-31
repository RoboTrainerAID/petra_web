import React, { useState, useEffect, useRef } from 'react';
import { Container, Paper, Typography, Chip, Box, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import StartScreen from './StartScreen';
import PersonalInfoStep from './PersonalInfoStep';
import ExperimentStep from './ExperimentStep';
import TaskDifficultyStep from './TaskDifficultyStep';
import WaitingScreen from './WaitingScreen';
import DemographicsStep from './DemographicsStep';
import PairwiseComparisonStep from './PairwiseComparisonStep';
import IFISStep from './IFISStep';
import SusStep from './SUSStep';
import ClinicalScalesStep from './ClinicalScalesStep';
import { FLASK_BACKEND_URL } from "../../constants";

const useStyles = makeStyles((theme) => ({
  outerContainer: {
    padding: `${theme.spacing(2)}px !important`,
    maxWidth: 'none !important',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  paper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3),
    borderRadius: '16px',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  header: {
    flexShrink: 0,
    marginBottom: theme.spacing(2),
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: 800,
    color: '#000',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    minHeight: 0,
    paddingRight: theme.spacing(1),
    '& .MuiGrid-container': {
      width: '100%',
      margin: 0,
    },
  },
}));

const INITIAL_TLX = {
  mental_demand: null,
  physical_demand: null,
  temporal_demand: null,
  performance: null,
  effort: null,
  frustration: null,
  task_difficulty: null, // Extra field saved alongside standard NASA-TLX
};

export default function QuestionnaireContainer() {
  const classes = useStyles();
  const { t } = useTranslation();

  // Mode: 'start' | 'personal' | 'waiting' | 'experiments' | 'task_difficulty' | 'pairwise' | 'demographics' | 'ifis' | 'sus' | 'summary'
  const [screen, setScreen] = useState('start');
  const [personalInfo, setPersonalInfo] = useState(null);
  const [participantDbId, setParticipantDbId] = useState(null);
  const [hasExtraStep, setHasExtraStep] = useState(false);
  
  // Experiment Dynamic State
  const [currentExpId, setCurrentExpId] = useState(null);
  const [expCount, setExpCount] = useState(1);
  const [scores, setScores] = useState({ ...INITIAL_TLX });

  const pollingTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    };
  }, []);

  const startPollingForNextExperiment = (partId) => {
    setScreen('waiting');

    pollingTimerRef.current = setInterval(async () => {
      try {
        const response = await fetch(`${FLASK_BACKEND_URL}/participants/${partId}/next-experiment`);
        const data = await response.json();

        if (data.status === 'ready') {
          clearInterval(pollingTimerRef.current);
          setCurrentExpId(data.experiment_id);
          setExpCount(data.experiment_number || expCount);
          setHasExtraStep(!!data.extra_step); 
          setScores({ ...INITIAL_TLX });
          setScreen('experiments');
        } else if (data.status === 'waiting') {
          if (data.next_experiment_number) {
            setExpCount(data.next_experiment_number);
          }
        } 
        else if (data.status === 'finished') {
          clearInterval(pollingTimerRef.current);
          setScreen('pairwise');
        }
      } catch (err) {
        console.error("Error polling backend:", err);
      }
    }, 3000);
  };

  const handleStartNew = () => {
    localStorage.removeItem('nasa_tlx_session');
    setPersonalInfo(null);
    setParticipantDbId(null);
    setCurrentExpId(null);
    setExpCount(1);
    setScores({ ...INITIAL_TLX });
    setScreen('personal');
  };

  const handlePersonalSubmit = async (data) => {
    setPersonalInfo(data);
    try {
      const res = await fetch(`${FLASK_BACKEND_URL}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      setParticipantDbId(resData.participant_db_id);
      
      setScreen('clinical');
    } catch (err) {
      console.error("Failed to save personal info:", err);
    }
  };

  const handleClinicalScalesSubmit = async (clinicalData) => {
    try {
      await fetch(`${FLASK_BACKEND_URL}/participants/${participantDbId}/clinical-scales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clinicalData),
      });

      // Start experiment polling after saving clinical scale data
      startPollingForNextExperiment(participantDbId);
    } catch (err) {
      console.error("Failed to save clinical scales:", err);
    }
  };

  const handleScoreChange = (key, value) => {
    setScores((prev) => ({ ...prev, [key]: value }));
  };

  // Triggered after finishing NASA-TLX rating screen
  const handleExperimentStepNext = () => {
    if (hasExtraStep) {
      setScreen('task_difficulty');
    } else {
      submitAllScores(scores);
    }
  };

  // Triggered after finishing Task Difficulty screen
  const handleDifficultySubmit = (difficultyRating) => {
    const updatedScores = { ...scores, task_difficulty: difficultyRating };
    setScores(updatedScores);
    submitAllScores(updatedScores);
  };

  // Sends combined NASA-TLX + task_difficulty object to backend in a single API call
  const submitAllScores = async (payloadScores) => {
    try {
      await fetch(`${FLASK_BACKEND_URL}/experiments/${currentExpId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scores: payloadScores }),
      });

      startPollingForNextExperiment(participantDbId);
    } catch (err) {
      console.error("Failed to submit experiment answers:", err);
    }
  };

  const handleWeightsSubmit = async (calculatedWeights) => {
    try {
      await fetch(`${FLASK_BACKEND_URL}/participants/${participantDbId}/weights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weights: calculatedWeights }),
      });
      setScreen('demographics');
    } catch (err) {
      console.error("Failed to submit weights:", err);
    }
  };

  const handleDemographicsSubmit = async (demographicData) => {
    try {
      await fetch(`${FLASK_BACKEND_URL}/participants/${participantDbId}/demographics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demographicData),
      });
      setScreen('ifis');
    } catch (err) {
      console.error("Failed to save demographics:", err);
    }
  };

  const handleIFISSubmit = async (ifisAnswers) => {
    try {
      await fetch(`${FLASK_BACKEND_URL}/participants/${participantDbId}/ifis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ifis: ifisAnswers }),
      });
      setScreen('sus');
    } catch (err) {
      console.error("Failed to save IFIS scores:", err);
    }
  };

  const handleSusSubmit = async (susAnswers) => {
    try {
      await fetch(`${FLASK_BACKEND_URL}/participants/${participantDbId}/sus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(susAnswers),
      });
      setScreen('summary');
    } catch (err) {
      console.error("Failed to save SUS responses:", err);
    }
  };

  return (
    <Container disableGutters className={classes.outerContainer}>
      <Paper elevation={3} className={classes.paper}>
        <div className={classes.header}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {(screen === 'experiments' || screen === 'task_difficulty') && (
              <Chip
                label={`Experiment #${expCount}`}
                color="primary"
                style={{ fontSize: '1.2rem', height: '44px', fontWeight: 700 }}
              />
            )}
          </Box>
        </div>

        <div className={classes.content}>
          {screen === 'start' && (
            <StartScreen onStartNew={handleStartNew} onContinue={() => {}} />
          )}

          {screen === 'personal' && (
            <PersonalInfoStep initialValues={personalInfo} onSubmit={handlePersonalSubmit} />
          )}

          {screen === 'clinical' && (
            <ClinicalScalesStep onSubmit={handleClinicalScalesSubmit} />
          )}

          {screen === 'waiting' && (
            <WaitingScreen experimentNumber={expCount} />
          )}

          {screen === 'experiments' && (
            <ExperimentStep
              experimentIndex={expCount - 1}
              totalExperiments={expCount}
              scores={scores}
              onScoreChange={handleScoreChange}
              onNext={handleExperimentStepNext}
              onBack={() => {}}
            />
          )}

          {screen === 'task_difficulty' && (
            <TaskDifficultyStep
              initialValue={scores.task_difficulty}
              onSubmit={handleDifficultySubmit}
            />
          )}

          {screen === 'demographics' && (
            <DemographicsStep onSubmit={handleDemographicsSubmit} />
          )}

          {screen === 'pairwise' && (
            <PairwiseComparisonStep onSubmitWeights={handleWeightsSubmit} />
          )}

          {screen === 'ifis' && (
            <IFISStep onSubmitIFIS={handleIFISSubmit} />
          )}

          {screen === 'sus' && (
            <SusStep onSubmitSus={handleSusSubmit} />
          )}

          {screen === 'summary' && (
            <Box textAlign="center" py={6}>
              <Typography variant="h3" style={{ fontWeight: 800 }}>
                {t('questionnaire.summary.title', 'Thank You!')}
              </Typography>
              <Typography style={{ fontSize: '1.4rem', marginTop: '1rem', color: '#444' }}>
                {t('questionnaire.summary.description', 'All experiments have been completed and your responses have been saved.')}
              </Typography>
            </Box>
          )}
        </div>
      </Paper>
    </Container>
  );
}