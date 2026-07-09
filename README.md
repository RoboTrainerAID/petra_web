# PeTRA Website

This website is build with REACT in jsx.

Created as part of the masterthesis of Nadja Treffz.

## Parameters

The URL which is used to reach the petra_central_control server can be set using the
environment variable

```bash

# petra_central_control is hosted on NUC and Accessed from Tablet
export REACT_APP_FLASK_BACKEND_URL=http://172.31.1.235:5000

# petra_central_control is hosted on NUC and Accessed through HsKA8021x
export REACT_APP_FLASK_BACKEND_URL=http://10.181.252.64:5000

# petra_central_control is hosted on and accessed from the same machine
export REACT_APP_FLASK_BACKEND_URL=http://localhost:5000
```

The prefix REACT_APP_ is necessary for the environment variable to be readable in the application

## How to run in development mode

### Installation

```bash
npm install
```

If you run into dependency conflicts try running this instead:

```bash
npm install --legacy-peer-deps
```

### Start the server

```bash
npm start
```

When using Webstorm for development it is recommended to use a runconfiguration :
- create a run configuration of type "npm"
- set script to start
- copy REACT_APP_FLASK_BACKEND_URL=<insert backend url here> into the environment field
