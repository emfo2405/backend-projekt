require("dotenv").config();
const express = require("express");
const router = express.Router();
const { Client } = require("pg");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

app.get("/api", (req, res) => {
    res.json({message: "Välkommen till mitt API"});
});

//Funktion för att kunna hämta in information från databas
app.get("/api/menu", (req, res) => {
    //Hämta in information från databas och tabellen menu
    client.query(`SELECT * FROM menu;`, (err, results) => {
        //Felmeddelande om något går fel
         if(err) {
        res.status(500).json({error: "Något gick fel: " + err});
        return;
         }
         console.log(results);
         //Om det inte finns något i tabellen visas felmeddelande annars returneras resultat
         if(results.rows.length === 0) {
            res.status(200).json({error: ""});
         } else {
            res.json(results);
         }
    });
});