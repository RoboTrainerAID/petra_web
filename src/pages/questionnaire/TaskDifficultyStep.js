import React, { useState } from 'react';
import { Box, Typography, Button, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(3),
  },
  questionText: {
    fontSize: '2.2rem',
    fontWeight: 800,
    lineHeight: 1.3,
    marginBottom: theme.spacing(4),
    color: '#000000',
  },
  optionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  optionButton: {
    width: '100%',
    padding: theme.spacing(2.5, 3),
    fontSize: '1.4rem',
    fontWeight: 700,
    justifyContent: 'flex-start',
    textAlign: 'left',
    textTransform: 'none',
    borderRadius: '12px',
    border: '2px solid #e0e0e0',
    backgroundColor: '#ffffff',
    color: '#1a1a1a',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: '#f0f7ff',
      borderColor: theme.palette.primary.main,
      transform: 'translateY(-1px)',
    },
    '&:active': {
      backgroundColor: theme.palette.primary.main,
      color: '#ffffff',
    },
  },
  selectedButton: {
    backgroundColor: theme.palette.primary.main,
    color: '#ffffff',
    borderColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

export default function TaskDifficultyStep({ initialValue, onSubmit }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState(initialValue || null);

  const OPTIONS = [
    { value: 1, label: t('questionnaire.difficulty.opt1', '1 = Much too easy') },
    { value: 2, label: t('questionnaire.difficulty.opt2', '2 = Too easy') },
    { value: 3, label: t('questionnaire.difficulty.opt3', '3 = A little too easy') },
    { value: 4, label: t('questionnaire.difficulty.opt4', '4 = Just right') },
    { value: 5, label: t('questionnaire.difficulty.opt5', '5 = A little too hard') },
    { value: 6, label: t('questionnaire.difficulty.opt6', '6 = Too hard') },
    { value: 7, label: t('questionnaire.difficulty.opt7', '7 = Much too hard') },
  ];

  const handleSelectOption = (value) => {
    setSelectedValue(value);
    onSubmit(value);
  };

  return (
    <Box className={classes.container}>
      <Typography className={classes.questionText}>
        {t(
          'questionnaire.difficulty.question',
          'Imagine a training programme lasting several weeks. It should be challenging, but you should be able to stick with it. How well was the difficulty of this task suited to you?'
        )}
      </Typography>

      <Box className={classes.optionsList}>
        {OPTIONS.map((opt) => {
          const isSelected = selectedValue === opt.value;
          return (
            <Button
              key={opt.value}
              variant="outlined"
              className={`${classes.optionButton} ${isSelected ? classes.selectedButton : ''}`}
              onClick={() => handleSelectOption(opt.value)}
            >
              {opt.label}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
}