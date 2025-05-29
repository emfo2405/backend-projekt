require("dotenv").config();
const express = require("express");
const router = express.Router();
const { Client } = require("pg");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Lägga till en användare
router.post("/register", async(req, res) => {
    try {
        const { username, password, email } = req.body;

        //Validera input
        if(!username || username.length < 6) {
            return res.status(400).json({error: "Användarnamn ska vara ifyllt och längre än 5 tecken"})
        } else if(!password || password.length < 9) {
            return res.status(400).json({error: "Lösenord ska vara ifyllt och längre än 8 tecken"})
        } else if(!email) {
            return res.status(400).json({error: "E-post ska vara ifyllt"})
        }

        res.status(201).json({message: "Användare skapad"});
        

    } catch {
        res.status(500).json({error: "Server error"});
    }
});

//Logga in en användare
router.post("/login", async(req,res) => {
    console.log("Inloggning påbörjad");
});

module.exports = router;