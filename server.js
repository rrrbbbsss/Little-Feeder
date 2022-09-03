const path = require("path");
const express = require("express");
const routes = require("./controllers");
const dbconn = require("./config/connection");
const exphbs = require("express-handlebars");
const hbs = exphbs.create({});
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

require("dotenv").config();
SSECRET = process.env.SSECRET;

const sess = {
  secret: SSECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: dbconn,
  }),
};

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sess));
// handlebars
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// turn on routes
app.use(routes);

// turn on connection to db and server
dbconn.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});
