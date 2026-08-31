import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  makeStyles,
  LinearProgress,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const IFIS_QUESTIONS = [
  {
    key: 'general_fitness',
    title: 'General Physical Fitness',
    text: 'My general physical fitness is...',
  },
  {
    key: 'cardio_fitness',
    title: 'Cardiorespiratory Fitness',
    text: 'My cardiorespiratory fitness (capacity to exercise/run) is...',
  },
  {
    key: 'muscle_strength',
    title: 'Muscular Strength',
    text: 'My muscular strength is...',
  },
  {
    key: 'speed_agility',
    title: 'Speed & Agility',
    text: 'My speed and agility (ability to move quickly/change direction) is...',
  },
  {
    key: 'flexibility',
    title: 'Flexibility',
    text: 'My flexibility (ability to bend and stretch) is...',
  },
];

const IFIS_OPTIONS = [
  { value: 1, labelKey: 'very_poor', defaultText: 'Very Poor' },
  { value: 2, labelKey: 'poor', defaultText: 'Poor' },
  { value: 3, labelKey: 'average', defaultText: 'Average' },
  { value: 4, labelKey: 'good', defaultText: 'Good' },
  { value: 5, labelKey: 'very_good', defaultText: 'Very Good' },
];

const useStyles = makeStyles((theme) => ({
  mainTitle: {
    fontSize: '2.6rem',
    fontWeight: 900,
    color: '#000000',
  },
  stepTracker: {
    fontSize: '1.4rem',
    fontWeight: 800,
    color: '#444444',
  },
  card: {
    padding: theme.spacing(4, 3),
    borderRadius: '16px',
    textAlign: 'center',
  },
  questionTitle: {
    fontSize: '2.4rem',
    fontWeight: 900,
    lineHeight: 1.25,
    marginBottom: theme.spacing(2),
    color: '#000000',
  },
  questionText: {
    fontSize: '1.6rem',
    fontWeight: 500,
    color: '#333333',
    marginBottom: theme.spacing(4),
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2.5),
    maxWidth: '650px',
    margin: '0 auto',
  },
  optionButton: {
    minHeight: '68px',
    padding: theme.spacing(2, 3),
    fontSize: '1.5rem',
    fontWeight: 800,
    borderRadius: '14px',
    textTransform: 'none',
    justifyContent: 'center',
    color: '#1a1a1a',
    border: '2px solid #e0e0e0',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: '#ffffff',
      borderColor: theme.palette.primary.main,
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'scale(0.99)',
    },
  },
  progressBar: {
    height: '16px',
    borderRadius: '8px',
    marginBottom: theme.spacing(3),
  },
}));

export default function IFISStep({ onSubmitIFIS }) {
  const classes = useStyles();
  const { t } = useTranslation();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({
    general_fitness: null,
    cardio_fitness: null,
    muscle_strength: null,
    speed_agility: null,
    flexibility: null,
  });

  const currentQ = IFIS_QUESTIONS[questionIndex];
  const progressPercent = ((questionIndex + 1) / IFIS_QUESTIONS.length) * 100;

  const handleSelectOption = (value) => {
    const updatedAnswers = {
      ...answers,
      [currentQ.key]: value,
    };
    setAnswers(updatedAnswers);

    if (questionIndex + 1 < IFIS_QUESTIONS.length) {
      setQuestionIndex((prev) => prev + 1);
    } else {
      // Completed all 5 questions
      onSubmitIFIS(updatedAnswers);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} pb={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography className={classes.mainTitle}>
          {t('ifis.title', 'International Fitness Scale (IFIS)')}
        </Typography>
        <Typography className={classes.stepTracker}>
          Question {questionIndex + 1} of {IFIS_QUESTIONS.length}
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={progressPercent}
        className={classes.progressBar}
      />

      <Paper elevation={3} className={classes.card}>
        <Typography className={classes.questionTitle}>
          {t(`ifis.questions.${currentQ.key}.title`, currentQ.title)}
        </Typography>
        <Typography className={classes.questionText}>
          {t(`ifis.questions.${currentQ.key}.text`, currentQ.text)}
        </Typography>

        <Box className={classes.optionsContainer}>
          {IFIS_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              variant="outlined"
              className={classes.optionButton}
              onClick={() => handleSelectOption(opt.value)}
            >
              {t(`ifis.options.${opt.labelKey}`, opt.defaultText)}
            </Button>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}