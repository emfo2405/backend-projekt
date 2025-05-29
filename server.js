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

//Uppkoppling till databas
const client = new Client ({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    }
});

//Felmeddelande om inte anslutningen fungerar korrekt
client.connect((err) => {
if(err) {
    console.error("Fel vid anslutning: " + err);
}
});

const port = process.env.PORT || 3001;

//Routes
app.use("/api", regRoutes);

//Skapa en skyddad route
app.get("/api/secret", authenticateToken, (req, res) => {
    res.json({message: "skyddad route"})
});

//Validera token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null ) res.status(401).json({message: "Ingen tillgång till denna sida - token saknas"});

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if(err) return res.status(403).json({message: "Ogiltig JWT"})

            req.username = user.username;
            next();
    });    
}

//Starta applikationen
app.listen(port, () => {
    console.log("Server running at http://localhost:" + port);
});