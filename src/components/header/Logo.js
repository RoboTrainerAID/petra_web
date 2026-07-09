import React from "react";

//Styling
import {makeStyles} from "@material-ui/core";

//Icons&Images
import logo from "../../assets/logo_petra.png";


const useStyles = makeStyles(() => ({
    logo: {
        height: 45,
        width: 90,
        '@media (max-width: 767px)': {
            height: 40,
            width: 80,
        },
    }
}));

export default function Logo() {
    const classes = useStyles();
    return (
        <img src={logo} className={classes.logo} alt={"Logo"}/>
    );
}