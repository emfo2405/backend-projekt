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

//Hämta alla användare från databas
router.get("/register", (req, res) => {


        client.query(`SELECT * FROM users;`, (err, results) =>{
        //Felmeddelande om något går fel
         if(err) {
        res.status(500).json({error: "Något gick fel: " + err});
        return;
         }
         //Om det inte finns något i tabellen visas felmeddelande annars returneras resultat
         if(results.rows.length === 0) {
            res.status(200).json({error: "Inga användare hittades"});
         } else {
            res.json(results.rows);
         }
        })
        
});

//Lägga till en användare
router.post("/register", async(req, res) => {
    try {
        const { username, password, email } = req.body;

        //Validera input
        if(!username || username.length < 5) {
            return res.status(400).json({message: "Användarnamn ska vara ifyllt och minst 5 tecken långt"})
        } else if(!password || password.length < 8) {
            return res.status(400).json({message: "Lösenord ska vara ifyllt och minst 8 tecken långt"})
        } else if(!email) {
            return res.status(400).json({message: "E-post ska vara ifyllt"})
        }

                client.query(`SELECT * FROM users WHERE username=$1 OR email=$2`, [username, email], async(err, results) => {
            if(err) {
                return res.status(500).json({ message: "Databasfel"});
            } else if (results.rows.length > 0) {
                return res.status(400).json({message: "Användarnamn eller e-post finns redan"});
            }

                    //Kryptera lösenord
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        client.query(`INSERT INTO users (username, password, email) VALUES($1,$2,$3)`, [username, hashedPassword, email], (err) => {

        if(err) {
            res.status(400).json({message: "Det gick inte att skapa användaren..."});
        } else {
            res.status(201).json({message: "Användare skapad"});
        }
})
        }); 
        

    } catch {
        res.status(500).json({error: "Server error"});
    }
});

//Logga in en användare
router.post("/login", async(req,res) => {
    try {
                const { username, password } = req.body;

        //Validera input
        if(!username || !password) {
            return res.status(400).json({message: "Användarnamn och lösenord behöver vara ifyllt"})
        } 

         //Kolla om användaren finns i databasen
        client.query(`SELECT * FROM users WHERE username=$1`, [username], async (err, results) => {
            if(err) {
                res.status(400).json({message: "Autentiseringen gick fel"})
            } else if (results.rows.length === 0) {
                res.status(400).json({message: "Lösenord eller användarnamn stämde inte"})
            } else {
                let user = results.rows[0];
                const passwordMatch = await bcrypt.compare(password, user.password);

                if(!passwordMatch) {
                    res.status(401).json({message: "Lösenordet eller användarnamn stämde inte"})
                } else {

                    //Skapa JWT 
                    const payload = {username: username };
                    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: '1h'});
                    const response = {
                        message: "Användaren loggade in",
                        token: token
                    }
                    res.status(200).json({response});
                }}})


    } catch {
        res.status(500).json({error: "Server error"});
    }
});

module.exports = router;