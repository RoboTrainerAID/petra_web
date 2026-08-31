import React, { useState } from 'react';
import {
  Typography,
  Chip,
  Slider,
  Button,
  Paper,
  Box,
  makeStyles,
  LinearProgress,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useTranslation } from 'react-i18next';

const NASA_KEYS = [
  'mental_demand',
  'physical_demand',
  'temporal_demand',
  'performance',
  'effort',
  'frustration',
];

// Generate 0 to 100 marks with step 5 and larger marks every 20 steps
const SLIDER_MARKS = Array.from({ length: 21 }, (_, i) => ({
  value: i * 5,
  label: i % 4 === 0 ? (i * 5).toString() : '',
}));

const useStyles = makeStyles((theme) => ({
  questionCard: {
    padding: theme.spacing(4),
    borderRadius: '16px',
    marginBottom: theme.spacing(1),
  },
  questionTitle: {
    fontSize: '1.75rem',
    fontWeight: 800,
  },
  questionDescription: {
    fontSize: '1.3rem',
    margin: '16px 0 28px 0',
    color: '#333',
    lineHeight: 1.5,
  },
  chipLarge: {
    fontSize: '1.3rem',
    height: '40px',
    minWidth: '50px',
    fontWeight: 800,
  },
  scaleLabel: {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: '#555',
  },
  actionButton: {
    fontSize: '1.35rem',
    fontWeight: 800,
    height: '60px',
    padding: '0 36px',
    borderRadius: '12px',
    textTransform: 'none',
  },
  progressBar: {
    height: '10px',
    borderRadius: '5px',
    marginBottom: theme.spacing(2),
  },
  // Custom Slider Styling for Touch-friendly 0-100 scale
  customSlider: {
    height: 12,
    padding: '24px 0',
    '& .MuiSlider-track': {
      height: 12,
      borderRadius: 6,
    },
    '& .MuiSlider-rail': {
      height: 12,
      borderRadius: 6,
      backgroundColor: '#bfbfbf',
      opacity: 1,
    },
    '& .MuiSlider-thumb': {
      height: 32,
      width: 32,
      backgroundColor: '#1976d2',
      border: '4px solid #fff',
      marginTop: -10,
      marginLeft: -16,
      boxShadow: '0 3px 6px rgba(0,0,0,0.3)',
      '&:focus, &:hover, &$active': {
        boxShadow: '0 0 0 10px rgba(25, 118, 210, 0.16)',
      },
    },
    '& .MuiSlider-mark': {
      backgroundColor: '#555',
      height: 8,
      width: 2,
      marginTop: -10, // Places tick marks on TOP of the slider rail
    },
    '& .MuiSlider-markActive': {
      opacity: 0.8,
      backgroundColor: '#fff',
    },
    '& .MuiSlider-markLabel': {
      fontSize: '1.2rem',
      fontWeight: 800,
      color: '#333',
      top: -30, // Displays labels above top tick marks
    },
  },
}));

export default function ExperimentStep({
  experimentIndex,
  totalExperiments,
  scores,
  onScoreChange,
  onNext,
  onBack,
}) {
  const classes = useStyles();
  const { t } = useTranslation();

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [showError, setShowError] = useState(false);

  const currentKey = NASA_KEYS[activeQuestionIndex];
  const isFirstQuestion = activeQuestionIndex === 0;
  const isLastQuestion = activeQuestionIndex === NASA_KEYS.length - 1;

  // Check if a score between 0 and 100 is selected
  const hasScore =
    typeof scores[currentKey] === 'number' &&
    scores[currentKey] >= 0 &&
    scores[currentKey] <= 100;

  const handleNextQuestion = () => {
    if (!hasScore) {
      setShowError(true);
      return;
    }
    setShowError(false);

    if (isLastQuestion) {
      onNext();
    } else {
      setActiveQuestionIndex((prev) => prev + 1);
    }
  };

  const handleBackQuestion = () => {
    setShowError(false);
    if (isFirstQuestion) {
      if (onBack) onBack();
    } else {
      setActiveQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSliderChange = (event, newValue) => {
    setShowError(false);
    onScoreChange(currentKey, newValue);
  };

  const progressPercent = ((activeQuestionIndex + 1) / NASA_KEYS.length) * 100;

  return (
    <Box display="flex" flexDirection="column" gap={2} pb={2}>
      {/* Title Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" style={{ fontWeight: 800 }}>
          {t('questionnaire.tlx.experimentTitle', {
            current: experimentIndex + 1,
            total: totalExperiments,
          })}
        </Typography>
        <Typography variant="h6" style={{ fontWeight: 700, color: '#555' }}>
          Question {activeQuestionIndex + 1} of {NASA_KEYS.length}
        </Typography>
      </Box>

      {/* Progress Bar */}
      <LinearProgress
        variant="determinate"
        value={progressPercent}
        className={classes.progressBar}
      />

      {showError && (
        <Alert severity="error" style={{ fontSize: '1.2rem', borderRadius: '10px' }}>
          {t(
            'questionnaire.tlx.selectOptionError',
            'Please select a value on the slider before proceeding.'
          )}
        </Alert>
      )}

      {/* Single Active Question Card */}
      <Paper
        elevation={2}
        className={classes.questionCard}
        style={{
          border: showError && !hasScore ? '3px solid #f44336' : '1px solid #d0d0d0',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography className={classes.questionTitle}>
            {activeQuestionIndex + 1}. {t(`questionnaire.tlx.dimensions.${currentKey}.label`)}
          </Typography>
          <Chip
            className={classes.chipLarge}
            label={hasScore ? scores[currentKey] : '-'}
            color={hasScore ? 'primary' : 'default'}
          />
        </Box>

        <Typography className={classes.questionDescription}>
          {t(`questionnaire.tlx.dimensions.${currentKey}.description`)}
        </Typography>

        {/* 0 to 100 Touch Slider */}
        <Box px={3} pt={4} pb={1}>
          <Slider
            className={classes.customSlider}
            value={typeof scores[currentKey] === 'number' ? scores[currentKey] : 0}
            min={0}
            max={100}
            step={5}
            marks={SLIDER_MARKS}
            valueLabelDisplay="auto"
            onChange={handleSliderChange}
          />
        </Box>

        <Box display="flex" justifyContent="space-between" mt={1}>
          <Typography className={classes.scaleLabel}>
            {t('questionnaire.tlx.minLabel', 'Low')}
          </Typography>
          <Typography className={classes.scaleLabel}>
            {t('questionnaire.tlx.maxLabel', 'High')}
          </Typography>
        </Box>
      </Paper>

      {/* Navigation Controls */}
      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button
          variant="outlined"
          className={classes.actionButton}
          onClick={handleBackQuestion}
          disabled={isFirstQuestion && !onBack}
        >
          {t('questionnaire.tlx.previousQuestion', 'Previous')}
        </Button>

        <Button
          variant="contained"
          color="primary"
          className={classes.actionButton}
          onClick={handleNextQuestion}
          disabled={!hasScore}
        >
          {isLastQuestion
            ? t('questionnaire.tlx.submitScores', 'Submit Answers')
            : t('questionnaire.tlx.nextQuestion', 'Next Question')}
        </Button>
      </Box>
    </Box>
  );
}