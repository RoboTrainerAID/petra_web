import React from "react";
import {Redirect, Route} from "react-router-dom";

export default function ProtectedRoute({component: Component, ...rest}) {
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    return (
        <Route
            {...rest}
            render={(props) =>
                isAuthenticated ? <Component {...props}{...rest} /> : <Redirect to="/login"/>
            }
        />
    );
}

