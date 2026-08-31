import React, { useState } from 'react';
import { 
  Grid, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Box, 
  makeStyles 
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
  },
  title: {
    fontWeight: 900,
    fontSize: '2.6rem',
    marginBottom: theme.spacing(4),
    color: '#000',
  },
  fieldPaper: {
    padding: theme.spacing(2),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
  },
  // Floating label styling (default & top position)
  label: {
    fontSize: '1.6rem !important',
    fontWeight: '600 !important',
    color: '#555555 !important',
    backgroundColor: '#ffffff',
    padding: '0 6px',
    '&$labelShrink': {
      fontSize: '1.25rem !important',
      fontWeight: '800 !important',
      color: '#000000 !important',
      transform: 'translate(14px, -10px) scale(1) !important',
    },
  },
  labelShrink: {},
  // Typed value styling
  inputRoot: {
    fontSize: '2.0rem !important',
    fontWeight: '700 !important',
    color: '#000000 !important',
  },
  inputElement: {
    padding: '22px 16px !important',
  },
  submitBtn: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(2.5, 5),
    fontSize: '1.5rem',
    fontWeight: 900,
    borderRadius: '10px',
    '&.Mui-disabled': {
      backgroundColor: '#e0e0e0',
      color: '#9e9e9e',
    },
  },
}));

export default function ClinicalScalesStep({ onSubmit }) {
  const classes = useStyles();
  const [scales, setScales] = useState({
    hand_grip_left: '',
    hand_grip_right: '',
    ruler_drop: '',
    jump_and_reach: '',
    tandem_walk: '',
    single_leg_stance: '',
    robotrainer_max_force_front: '',
    robotrainer_max_force_left: '',
    robotrainer_max_force_right: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScales((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = Object.values(scales).every(
    (val) => val !== null && val !== undefined && String(val).trim() !== ''
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      onSubmit(scales);
    }
  };

  const fields = [
    { name: 'hand_grip_left', label: 'Hand Grip Left (kg)' },
    { name: 'hand_grip_right', label: 'Hand Grip Right (kg)' },
    { name: 'ruler_drop', label: 'Ruler Drop (cm)' },
    { name: 'jump_and_reach', label: 'Jump & Reach (cm)' },
    { name: 'tandem_walk', label: 'Tandem Walk (sec)' },
    { name: 'single_leg_stance', label: 'Single Leg Stance (sec / errors)' },
    { name: 'robotrainer_max_force_front', label: 'RoboTrainer Force Front (N)' },
    { name: 'robotrainer_max_force_left', label: 'RoboTrainer Force Left (N)' },
    { name: 'robotrainer_max_force_right', label: 'RoboTrainer Force Right (N)' },
  ];

  return (
    <form onSubmit={handleSubmit} className={classes.container}>
      <Typography variant="h3" className={classes.title}>
        Clinical Scales Assessment
      </Typography>
      
      <Grid container spacing={3}>
        {fields.map((field) => (
          <Grid item xs={12} sm={6} md={4} key={field.name}>
            <Paper elevation={3} className={classes.fieldPaper}>
              <TextField
                fullWidth
                variant="outlined"
                type="number"
                name={field.name}
                label={field.label}
                value={scales[field.name]}
                onChange={handleChange}
                required
                InputLabelProps={{
                  classes: {
                    root: classes.label,
                    shrink: classes.labelShrink,
                  },
                }}
                InputProps={{
                  className: classes.inputRoot,
                }}
                inputProps={{
                  step: "any",
                  className: classes.inputElement,
                }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box display="flex" justifyContent="flex-end">
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!isFormValid}
          className={classes.submitBtn}
        >
          Save Clinical Scales & Continue
        </Button>
      </Box>
    </form>
  );
}