const express = require("express");
const { Client } = require("pg");
const bodyParser = require("body-parser");
const regRoutes = require("./routes/regRoutes");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3001;

//Routes
app.use("/api", regRoutes);

//Starta applikationen
app.listen(port, () => {
    console.log("Server running at http://localhost:" + port);
});