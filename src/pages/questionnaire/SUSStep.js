import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  LinearProgress,
  makeStyles,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const SUS_QUESTIONS = [
  'I think that I would like to use this system frequently.',
  'I found the system unnecessarily complex.',
  'I thought the system was easy to use.',
  'I think that I would need the support of a technical person to be able to use this system.',
  'I found the various functions in this system were well integrated.',
  'I thought there was too much inconsistency in this system.',
  'I would imagine that most people would learn to use this system very quickly.',
  'I found the system very cumbersome to use.',
  'I felt very confident using the system.',
  'I needed to learn a lot of things before I could get going with this system.',
];

const LIKERT_OPTIONS = [
  { value: 1, labelKey: 'opt1', defaultLabel: '1 — Strongly Disagree' },
  { value: 2, labelKey: 'opt2', defaultLabel: '2 — Disagree' },
  { value: 3, labelKey: 'opt3', defaultLabel: '3 — Neutral' },
  { value: 4, labelKey: 'opt4', defaultLabel: '4 — Agree' },
  { value: 5, labelKey: 'opt5', defaultLabel: '5 — Strongly Agree' },
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
    marginBottom: theme.spacing(1.5),
    color: '#000000',
  },
  instruction: {
    fontSize: '1.5rem',
    fontWeight: 500,
    color: '#444444',
    marginBottom: theme.spacing(4),
  },
  optionContainer: {
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

export default function SusStep({ onSubmitSus }) {
  const classes = useStyles();
  const { t } = useTranslation();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const questionKey = `q${currentIndex + 1}`;
  const currentQuestionText = SUS_QUESTIONS[currentIndex];
  const progressPercent = ((currentIndex + 1) / SUS_QUESTIONS.length) * 100;

  const handleSelectOption = (value) => {
    const updatedAnswers = {
      ...answers,
      [questionKey]: value,
    };
    setAnswers(updatedAnswers);

    if (currentIndex + 1 < SUS_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Completed all 10 questions
      onSubmitSus(updatedAnswers);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} pb={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography className={classes.mainTitle}>
          {t('sus.title', 'System Usability Scale (SUS)')}
        </Typography>
        <Typography className={classes.stepTracker}>
          Question {currentIndex + 1} of {SUS_QUESTIONS.length}
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={progressPercent}
        className={classes.progressBar}
      />

      <Paper elevation={3} className={classes.card}>
        <Typography className={classes.questionTitle}>
          {currentIndex + 1}. {t(`sus.questions.q${currentIndex + 1}`, currentQuestionText)}
        </Typography>
        <Typography className={classes.instruction}>
          {t('sus.instruction', 'Select how strongly you agree or disagree with this statement.')}
        </Typography>

        <Box className={classes.optionContainer}>
          {LIKERT_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              variant="outlined"
              className={classes.optionButton}
              onClick={() => handleSelectOption(opt.value)}
            >
              {t(`sus.options.${opt.labelKey}`, opt.defaultLabel)}
            </Button>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}