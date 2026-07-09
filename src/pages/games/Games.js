import React from "react";

//Styling
import {makeStyles} from "@material-ui/core/styles";

//Components
import {Container, Grid} from '@material-ui/core';


const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        maxWidth: '58em',
        marginTop: 'calc(8% - 25px)',
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
        width: '100%',
    },
}));


export default function Games() {
    const classes = useStyles();
    // const [articles, setArticles] = React.useState([]);

    return (
        <Container className={classes.root}>
            <Grid item xs={12} sm={12} md={12} className={classes.item}>
                Ups... irgendjemand hat alle Spiele ausgeliehen und nicht zurückgegeben!
            </Grid>
        </Container>
    );
}
