import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import "./i18n";
import {QueryClient, QueryClientProvider} from "react-query";
import {BrowserRouter} from "react-router-dom";

const queryClient = new QueryClient();

ReactDOM.render(
    <React.StrictMode>
        <React.Suspense fallback="Loading...">
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </QueryClientProvider>
        </React.Suspense>
    </React.StrictMode>,
    document.getElementById('root')
);

