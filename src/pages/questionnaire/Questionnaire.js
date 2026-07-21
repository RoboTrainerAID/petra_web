import React, {useCallback, useMemo, useState} from "react";
import {Container, Divider, FormControl, FormControlLabel, FormLabel, Grid, LinearProgress, Paper, Radio, RadioGroup, Slider, TextField, Typography, Chip} from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignItems: 'center',
        maxWidth: '72em',
        width: '100%',
        padding: '2rem 0',
        '@media (max-width: 767px)': {
            width: '92%',
            paddingTop: '1rem',
        },
    },
    paper: {
        width: '100%',
        padding: '2rem',
        '@media (max-width: 767px)': {
            padding: '1.25rem',
        },
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        gap: '.75rem',
        marginBottom: '1.5rem',
    },
    stepRow: {
        display: 'flex',
        gap: '.75rem',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    stepChip: {
        fontWeight: 600,
    },
    section: {
        marginTop: '1.5rem',
    },
    field: {
        width: '100%',
        marginTop: '1rem',
    },
    questionCard: {
        border: '1px solid rgba(0, 0, 0, 0.08)',
        borderRadius: '12px',
        padding: '1rem 1.1rem',
        background: 'rgba(255, 255, 255, 0.72)',
    },
    questionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '.75rem',
    },
    sliderRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    slider: {
        flexGrow: 1,
    },
    helper: {
        marginTop: '.5rem',
        color: '#666',
    },
    actions: {
        marginTop: '1.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap',
    },
    summaryBox: {
        marginTop: '1.5rem',
        padding: '1rem',
        borderRadius: '12px',
        background: 'rgba(0, 123, 255, 0.06)',
    },
    summaryGrid: {
        marginTop: '.5rem',
    },
}));

const genderOptions = [
    {value: 'female', label: 'Female'},
    {value: 'male', label: 'Male'},
    {value: 'non_binary', label: 'Non-binary / diverse'},
    {value: 'prefer_not_to_say', label: 'Prefer not to say'},
];

const nasaQuestions = [
    {key: 'mental_demand', label: 'Mental demand'},
    {key: 'physical_demand', label: 'Physical demand'},
    {key: 'temporal_demand', label: 'Temporal demand'},
    {key: 'performance', label: 'Performance'},
    {key: 'effort', label: 'Effort'},
    {key: 'frustration', label: 'Frustration'},
];

const initialTlxScores = nasaQuestions.reduce((accumulator, question) => {
    accumulator[question.key] = 50;
    return accumulator;
}, {});

export default function Questionnaire() {
    const classes = useStyles();
    const [step, setStep] = useState(0);
    const [completedData, setCompletedData] = useState(null);

    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [personalErrors, setPersonalErrors] = useState({age: false, gender: false});
    const [tlxScores, setTlxScores] = useState(initialTlxScores);

    const progressValue = step === 0 ? 50 : 100;

    const ageNumber = Number(age);
    const isAgeValid = Number.isInteger(ageNumber) && ageNumber >= 0 && ageNumber <= 120;
    const isPersonalStepValid = isAgeValid && !!gender;

    const handleNext = useCallback(() => {
        const nextErrors = {
            age: !isAgeValid,
            gender: !gender,
        };
        setPersonalErrors(nextErrors);

        if (nextErrors.age || nextErrors.gender) {
            return;
        }

        setStep(1);
    }, [gender, isAgeValid]);

    const handleSubmit = useCallback(() => {
        const submission = {
            personalInfo: {
                age: ageNumber,
                gender,
            },
            nasaTlx: tlxScores,
        };

        setCompletedData(submission);
    }, [ageNumber, gender, tlxScores]);

    const restart = useCallback(() => {
        setStep(0);
        setAge('');
        setGender('');
        setPersonalErrors({age: false, gender: false});
        setTlxScores(initialTlxScores);
        setCompletedData(null);
    }, []);

    const handleScoreChange = useCallback((questionKey, value) => {
        setTlxScores(previousScores => ({
            ...previousScores,
            [questionKey]: value,
        }));
    }, []);

    const summaryEntries = useMemo(() => {
        if (!completedData) {
            return [];
        }

        return [
            {label: 'Age', value: completedData.personalInfo.age},
            {label: 'Gender', value: completedData.personalInfo.gender},
            ...nasaQuestions.map(question => ({label: question.label, value: completedData.nasaTlx[question.key]})),
        ];
    }, [completedData]);

    return (
        <Container className={classes.root}>
            <Paper elevation={4} className={classes.paper}>
                <div className={classes.header}>
                    <Typography variant="h4">Questionnaire</Typography>
                    <Typography variant="body1" color="textSecondary">
                        Please complete the personal information section first, then answer the NASA TLX questions.
                    </Typography>
                    <div className={classes.stepRow}>
                        <Chip className={classes.stepChip} color={step === 0 ? 'primary' : 'default'} label="1. Personal information" />
                        <Chip className={classes.stepChip} color={step === 1 ? 'primary' : 'default'} label="2. NASA TLX" />
                    </div>
                    <LinearProgress variant="determinate" value={progressValue} />
                </div>

                {!completedData && step === 0 && (
                    <section className={classes.section}>
                        <Typography variant="h6">Personal information</Typography>
                        <Typography variant="body2" color="textSecondary">
                            Enter your age and gender before continuing.
                        </Typography>
                        <Grid container spacing={3} className={classes.summaryGrid}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    className={classes.field}
                                    label="Age"
                                    type="number"
                                    value={age}
                                    onChange={event => setAge(event.target.value)}
                                    error={personalErrors.age}
                                    helperText={personalErrors.age ? 'Please enter a valid age between 0 and 120.' : 'Use whole years only.'}
                                    inputProps={{min: 0, max: 120, step: 1}}
                                    variant="outlined"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl className={classes.field} component="fieldset" error={personalErrors.gender}>
                                    <FormLabel component="legend">Gender</FormLabel>
                                    <RadioGroup value={gender} onChange={event => setGender(event.target.value)}>
                                        {genderOptions.map(option => (
                                            <FormControlLabel
                                                key={option.value}
                                                value={option.value}
                                                control={<Radio color="primary" />}
                                                label={option.label}
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <div className={classes.actions}>
                            <div />
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleNext}
                                disabled={!isPersonalStepValid}
                            >
                                Continue to NASA TLX
                            </button>
                        </div>
                    </section>
                )}

                {!completedData && step === 1 && (
                    <section className={classes.section}>
                        <Typography variant="h6">NASA TLX questionnaire</Typography>
                        <Typography variant="body2" color="textSecondary">
                            Rate each dimension on a scale from 0 to 100.
                        </Typography>

                        <Grid container spacing={2} className={classes.summaryGrid}>
                            {nasaQuestions.map((question, index) => (
                                <Grid item xs={12} key={question.key}>
                                    <div className={classes.questionCard}>
                                        <div className={classes.questionHeader}>
                                            <Typography variant="subtitle1">
                                                {index + 1}. {question.label}
                                            </Typography>
                                            <Chip label={`${tlxScores[question.key]}`} color="primary" />
                                        </div>
                                        <div className={classes.sliderRow}>
                                            <Slider
                                                className={classes.slider}
                                                value={tlxScores[question.key]}
                                                onChange={(_, value) => handleScoreChange(question.key, value)}
                                                step={5}
                                                min={0}
                                                max={100}
                                                valueLabelDisplay="auto"
                                                aria-labelledby={`${question.key}-slider`}
                                            />
                                        </div>
                                        <Typography variant="caption" className={classes.helper}>
                                            0 = very low, 100 = very high
                                        </Typography>
                                    </div>
                                </Grid>
                            ))}
                        </Grid>

                        <div className={classes.actions}>
                            <button type="button" className="btn btn-outline-secondary" onClick={() => setStep(0)}>
                                Back
                            </button>
                            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                                Finish questionnaire
                            </button>
                        </div>
                    </section>
                )}

                {completedData && (
                    <section className={classes.section}>
                        <Typography variant="h6">Questionnaire completed</Typography>
                        <Typography variant="body2" color="textSecondary">
                            The answers are stored locally in the page state and can be reviewed below.
                        </Typography>

                        <div className={classes.summaryBox}>
                            {summaryEntries.map(entry => (
                                <Typography key={entry.label} variant="body1">
                                    <strong>{entry.label}:</strong> {entry.value}
                                </Typography>
                            ))}
                        </div>

                        <Divider style={{margin: '1.5rem 0'}} />

                        <div className={classes.actions}>
                            <div />
                            <button type="button" className="btn btn-primary" onClick={restart}>
                                Start over
                            </button>
                        </div>
                    </section>
                )}
            </Paper>
        </Container>
    );
}
