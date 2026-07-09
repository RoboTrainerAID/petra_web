import React from "react";

//Styling
import {makeStyles} from '@material-ui/core/styles';

//Components
import {Container, Grid, Hidden} from '@material-ui/core';
import ShowTransportsApp from "../../components/buttons/ShowTransportsApp";
import TranslationAppEmployee from "../../components/buttons/TranslationAppEmployee";


const useStyles = makeStyles(() => ({
    root: {
        width: "100%",
        display: 'flex',
        alignItems: 'center',
    },
    item: {
        display: 'flex',
        justifyContent: 'center',
    },
}))


export default function HomeEmployee() {
    const classes = useStyles();

    return (
        <Container className={classes.root}>
            <Grid container justify="center" direction="row" spacing="1">
                <Grid item xs={6} sm={3} md={3} className={classes.item}>
                    <ShowTransportsApp/>
                </Grid>
                <Grid item xs={6} sm={3} md={3} className={classes.item}>
                    <TranslationAppEmployee/>
                </Grid>
                <Hidden only={['sm', 'md', 'lg']}>
                    <Grid item xs={6} sm={3} md={3} className={classes.item}>
                    </Grid>
                </Hidden>
            </Grid>
        </Container>
    );
}
