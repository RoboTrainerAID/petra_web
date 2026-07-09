import React from "react";

//Styling
import {makeStyles} from "@material-ui/core/styles";

//Components
import {Container, Grid, Hidden} from "@material-ui/core";
import NewsApp from "../../components/buttons/NewsApp";
import GamesApp from "../../components/buttons/GamesApp";
import MediaApp from "../../components/buttons/MediaApp";

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        '@media (orientation: portrait)': {
            marginTop: 'calc(100vh*(1/9))',
        },
        '@media (max-width: 767px)': {
            marginTop: '12vh',
        }
    },
    item: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
}))

export default function Entertainment() {
    const classes = useStyles();

    return (
        <Container className={classes.root}>
            <Grid container justify="center" direction="row" spacing="1">
                <Grid item xs={6} sm={4} md={4} className={classes.item}>
                    <NewsApp/>
                </Grid>
                <Grid item xs={6} sm={4} md={4} className={classes.item}>
                    <MediaApp/>
                </Grid>
                <Grid item xs={6} sm={4} md={4} className={classes.item}>
                    <GamesApp/>
                </Grid>
            </Grid>
        </Container>

    );
}
