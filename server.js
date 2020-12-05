// Imports
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const db = require("./database/database");
const exerciseRouter = require("./routes/exercise");

// Basic configuration, Environment variables and DB connection
dotenv.config();
db.connect();

const app = express()

app.use(cors({ optionsSuccessStatus: 200 })); 

app.use(bodyParser.urlencoded({
  extended: false
}));

// Static files
app.use(express.static("public"));

//  Routing
app.get("/", (req, res) => {
  res.status(200).sendFile(`${__dirname}/views/index.html`);
});

app.use("/", exerciseRouter);

// No matching route 
app.use(function(req, res) {
  res.status(404).sendFile(`${__dirname}/views/404.html`);
});

// Server listening
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("App is listening on port " + listener.address().port)
})
