const express = require("express");
const path = require('path');
const env = require("dotenv");
const cookie_parser = require('cookie-parser');

const app = express();
const port = 7000;

env.config({
  path: "./.env",
});

// Define the default engine - Handlebars
app.set("view engine", "hbs");

// Parser for URL Data sent by Users from Forms
app.use(
  express.urlencoded({
    extended: true,
  })
);



// Parser for Incoming JSON Data
app.use(express.json());

// Configure the Server to Listen to the specified Port
app
  .listen(port, () => {
    console.log(`\nServer successfully started at Port: ${port}`);
  })
  .on("error", (error) => {
    console.error(
      `\n!!! Server failed to start at Port: ${port} !!!\n${error.message}\n`
    );
  });

app.use(cookie_parser());



// Routes imported from other files
app.use("/listaccounts", require("./routes/auth.js"));
app.use("/register", require("./routes/registerRoutes.js"));
