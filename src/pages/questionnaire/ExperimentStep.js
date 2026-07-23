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

export default function ExperimentStep({
  experimentIndex,
  totalExperiments,
  scores,
  onScoreChange,
  onNext,
  onBack,
}) {
  const { t } = useTranslation();
  const [showError, setShowError] = useState(false);
  const isLastExperiment = experimentIndex === totalExperiments - 1;

  // Check if every NASA TLX key has a valid value between 1 and 10
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
    setShowError(false); // Clear error message when user makes a selection
    onScoreChange(key, value);
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} pb={2}>
      <Typography variant="h6">
        {t('questionnaire.tlx.experimentTitle', {
          current: experimentIndex + 1,
          total: totalExperiments,
        })}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {t('questionnaire.tlx.description')}
      </Typography>

      {showError && (
        <Alert severity="error">
          {t('questionnaire.tlx.validationError', 'Please answer all questions before proceeding.')}
        </Alert>
      )}

      <Grid container spacing={2}>
        {NASA_KEYS.map((key, index) => {
          const hasScore = typeof scores[key] === 'number' && scores[key] >= 1;

          return (
            <Grid item xs={12} key={key}>
              <Paper
                elevation={1}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  border: showError && !hasScore ? '1px solid #f44336' : '1px solid transparent',
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="subtitle1" style={{ fontWeight: 600 }}>
                    {index + 1}. {t(`questionnaire.tlx.dimensions.${key}.label`)}
                  </Typography>
                  <Chip
                    label={hasScore ? scores[key] : '-'}
                    color={hasScore ? 'primary' : 'default'}
                    size="small"
                  />
                </Box>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  display="block"
                  style={{ marginBottom: '0.75rem' }}
                >
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
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      rowGap: '0.5rem',
                    }}
                  >
                    {RATING_OPTIONS.map((val) => (
                      <FormControlLabel
                        key={val}
                        value={val}
                        control={<Radio color="primary" size="small" />}
                        label={val.toString()}
                        labelPlacement="top"
                        style={{ margin: 0 }}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>

                <Box display="flex" justifyContent="space-between" mt={1}>
                  <Typography variant="caption" color="textSecondary">
                    {t('questionnaire.tlx.minLabel')}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {t('questionnaire.tlx.maxLabel')}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button variant="outlined" onClick={onBack}>
          {t('questionnaire.tlx.back')}
        </Button>
        <Button
          variant="contained"
          color="primary"
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