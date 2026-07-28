import React, { useState } from 'react';
import {
  Grid,
  Typography,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Paper,
  Box,
  makeStyles,
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

const RATING_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

const useStyles = makeStyles((theme) => ({
  questionCard: {
    padding: theme.spacing(3),
    borderRadius: '16px',
    marginBottom: theme.spacing(1),
  },
  questionTitle: {
    fontSize: '1.5rem',
    fontWeight: 800,
  },
  questionDescription: {
    fontSize: '1.2rem',
    margin: '12px 0 20px 0',
    color: '#333',
    lineHeight: 1.4,
  },
  chipLarge: {
    fontSize: '1.3rem',
    height: '40px',
    minWidth: '50px',
    fontWeight: 800,
  },
  ratingBox: {
    border: '2px solid #ccc',
    borderRadius: '10px',
    padding: '8px 4px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '56px',
    flex: 1,
    cursor: 'pointer',
  },
  ratingBoxSelected: {
    border: '3px solid #1976d2',
    backgroundColor: '#e3f2fd',
  },
  ratingText: {
    fontSize: '1.35rem',
    fontWeight: 800,
    marginTop: '2px',
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
  const [showError, setShowError] = useState(false);
  const isLastExperiment = experimentIndex === totalExperiments - 1;

  const isAllAnswered = NASA_KEYS.every(
    (key) => typeof scores[key] === 'number' && scores[key] >= 1 && scores[key] <= 10
  );

  const handleNextClick = () => {
    if (!isAllAnswered) {
      setShowError(true);
      return;
    }
    setShowError(false);
    onNext();
  };

  const handleRadioChange = (key, value) => {
    setShowError(false);
    onScoreChange(key, value);
  };

  return (
    <Box display="flex" flexDirection="column" gap={3} pb={2}>
      <Typography variant="h4" style={{ fontWeight: 800 }}>
        {t('questionnaire.tlx.experimentTitle', {
          current: experimentIndex + 1,
          total: totalExperiments,
        })}
      </Typography>
      <Typography style={{ fontSize: '1.25rem' }} color="textSecondary">
        {t('questionnaire.tlx.description')}
      </Typography>

      {showError && (
        <Alert severity="error" style={{ fontSize: '1.2rem', borderRadius: '10px' }}>
          {t('questionnaire.tlx.validationError', 'Please answer all questions before proceeding.')}
        </Alert>
      )}

      <Grid container spacing={3}>
        {NASA_KEYS.map((key, index) => {
          const hasScore = typeof scores[key] === 'number' && scores[key] >= 1;

          return (
            <Grid item xs={12} key={key}>
              <Paper
                elevation={2}
                className={classes.questionCard}
                style={{
                  border: showError && !hasScore ? '3px solid #f44336' : '1px solid #d0d0d0',
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography className={classes.questionTitle}>
                    {index + 1}. {t(`questionnaire.tlx.dimensions.${key}.label`)}
                  </Typography>
                  <Chip
                    className={classes.chipLarge}
                    label={hasScore ? scores[key] : '-'}
                    color={hasScore ? 'primary' : 'default'}
                  />
                </Box>
                <Typography className={classes.questionDescription}>
                  {t(`questionnaire.tlx.dimensions.${key}.description`)}
                </Typography>

                <FormControl component="fieldset" style={{ width: '100%' }}>
                  <RadioGroup
                    row
                    aria-label={key}
                    name={key}
                    value={scores[key] || ''}
                    onChange={(e) => handleRadioChange(key, Number(e.target.value))}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '8px',
                      flexWrap: 'nowrap',
                    }}
                  >
                    {RATING_OPTIONS.map((val) => {
                      const isSelected = scores[key] === val;
                      return (
                        <Box
                          key={val}
                          className={`${classes.ratingBox} ${isSelected ? classes.ratingBoxSelected : ''}`}
                          onClick={() => handleRadioChange(key, val)}
                        >
                          <Typography className={classes.ratingText}>{val}</Typography>
                          <Radio
                            checked={isSelected}
                            color="primary"
                            size="small"
                            style={{ padding: '2px' }}
                          />
                        </Box>
                      );
                    })}
                  </RadioGroup>
                </FormControl>

                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Typography className={classes.scaleLabel}>
                    {t('questionnaire.tlx.minLabel')}
                  </Typography>
                  <Typography className={classes.scaleLabel}>
                    {t('questionnaire.tlx.maxLabel')}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Bottom Actions */}
      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button variant="outlined" className={classes.actionButton} onClick={onBack}>
          {t('questionnaire.tlx.back')}
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.actionButton}
          onClick={handleNextClick}
          disabled={!isAllAnswered}
        >
          {isLastExperiment
            ? t('questionnaire.tlx.finish')
            : t('questionnaire.tlx.nextExperiment')}
        </Button>
      </Box>
    </Box>
  );
}