import React, { useState } from 'react';
import { Button, Typography, Box, Paper } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

export default function StartScreen({ onStartNew, onContinue }) {
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
      }, 1800);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={3} alignItems="center" py={4}>
      <Typography variant="h5">{t('questionnaire.start.title')}</Typography>
      <Typography color="textSecondary">{t('questionnaire.start.subtitle')}</Typography>

      {warning && (
        <Paper
          elevation={0}
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: '#fff4e5',
            color: '#663c00',
            border: '1px solid #ffe2b7',
            borderRadius: '4px',
          }}
        >
          <Typography variant="body2">{t('questionnaire.start.noSavedWarning')}</Typography>
        </Paper>
      )}

      <Box display="flex" gap={2} mt={2}>
        <Button variant="contained" color="primary" size="large" onClick={onStartNew}>
          {t('questionnaire.start.startNew')}
        </Button>
        <Button variant="outlined" color="primary" size="large" onClick={handleContinueAttempt}>
          {t('questionnaire.start.continue')}
        </Button>
      </Box>
    </Box>
  );
}