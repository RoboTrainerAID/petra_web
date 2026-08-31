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

const CATEGORIES = [
  'mental_demand',
  'physical_demand',
  'temporal_demand',
  'performance',
  'effort',
  'frustration',
];

// Generate all 15 unique pairs: (0,1), (0,2), ..., (4,5)
const generatePairs = () => {
  const pairs = [];
  for (let i = 0; i < CATEGORIES.length; i++) {
    for (let j = i + 1; j < CATEGORIES.length; j++) {
      pairs.push([CATEGORIES[i], CATEGORIES[j]]);
    }
  }
  return pairs;
};

const PAIRS = generatePairs();

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(4),
    borderRadius: '16px',
    textAlign: 'center',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 800,
    marginBottom: theme.spacing(1),
  },
  subtitle: {
    fontSize: '1.25rem',
    color: '#555',
    marginBottom: theme.spacing(3),
  },
  buttonContainer: {
    display: 'flex',
    gap: theme.spacing(3),
    justifyContent: 'center',
    marginTop: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  categoryButton: {
    flex: 1,
    minHeight: '120px',
    fontSize: '1.35rem',
    fontWeight: 800,
    borderRadius: '16px',
    padding: theme.spacing(2),
    textTransform: 'none',
    border: '3px solid #1976d2',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#e3f2fd',
      transform: 'scale(1.02)',
    },
  },
  progressBar: {
    height: '10px',
    borderRadius: '5px',
    marginBottom: theme.spacing(3),
  },
}));

export default function PairwiseComparisonStep({ onSubmitWeights }) {
  const classes = useStyles();
  const { t } = useTranslation();

  const [pairIndex, setPairIndex] = useState(0);

  // Store raw counts for each category
  const [weights, setWeights] = useState({
    mental_demand: 0,
    physical_demand: 0,
    temporal_demand: 0,
    performance: 0,
    effort: 0,
    frustration: 0,
  });

  const currentPair = PAIRS[pairIndex];
  const progressPercent = ((pairIndex + 1) / PAIRS.length) * 100;

  const handleSelect = (selectedCategory) => {
    // 1. Increment score for chosen category
    const updatedWeights = {
      ...weights,
      [selectedCategory]: weights[selectedCategory] + 1,
    };
    setWeights(updatedWeights);

    // 2. Advance to next pair or finish
    if (pairIndex + 1 < PAIRS.length) {
      setPairIndex((prev) => prev + 1);
    } else {
      // Completed all 15 comparisons
      onSubmitWeights(updatedWeights);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} pb={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" style={{ fontWeight: 800 }}>
          {t('questionnaire.weights.title', 'Workload Comparison')}
        </Typography>
        <Typography variant="h6" style={{ fontWeight: 700, color: '#555' }}>
          Comparison {pairIndex + 1} of {PAIRS.length}
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={progressPercent}
        className={classes.progressBar}
      />

      <Paper elevation={2} className={classes.card}>
        <Typography className={classes.title}>
          {t('questionnaire.weights.question', 'Which factor contributed MORE to the workload?')}
        </Typography>
        <Typography className={classes.subtitle}>
          {t('questionnaire.weights.instruction', 'Select the option that represents a higher contribution to your overall workload.')}
        </Typography>

        <Box className={classes.buttonContainer}>
          <Button
            variant="outlined"
            color="primary"
            className={classes.categoryButton}
            onClick={() => handleSelect(currentPair[0])}
          >
            {t(`questionnaire.tlx.dimensions.${currentPair[0]}.label`, currentPair[0])}
          </Button>

          <Button
            variant="outlined"
            color="primary"
            className={classes.categoryButton}
            onClick={() => handleSelect(currentPair[1])}
          >
            {t(`questionnaire.tlx.dimensions.${currentPair[1]}.label`, currentPair[1])}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}