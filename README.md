# Little-Feeder

## Installation

installation:
git clone the repo and install the dependencies with
`npm install`
setup a .env file with the following env vars:

```
DB_NAME='little_feeder_db'
DB_USER='<your user>'
DB_PASS='<your password>'
SSECRET='<your session secret>'
```

setup the db and seed it with the following command:
`npm run scrub`

start the web server with:
`npm start`
