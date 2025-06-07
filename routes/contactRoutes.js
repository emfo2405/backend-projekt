require("dotenv").config();
const express = require("express");
const router = express.Router();
const { Client } = require("pg");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Uppkoppling till databas
const client = new Client({
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
    if (err) {
        console.error("Fel vid anslutning: " + err);
    }
});

router.get("/api", (req, res) => {
    res.json({ message: "Välkommen till mitt API" });
});

//Funktion för att kunna hämta in information från databas
router.get("/contact", (req, res) => {
    //Hämta in information från databas och tabellen contact
    client.query(`SELECT * FROM contact;`, (err, results) => {
        //Felmeddelande om något går fel
        if (err) {
            res.status(500).json({ error: "Något gick fel: " + err });
            return;
        }
        //Om det inte finns något i tabellen visas felmeddelande annars returneras resultat
        if (results.rows.length === 0) {
            res.status(200).json({ error: "Det finns inga meddelanden" });
        } else {
            res.json(results);
        }
    });
});

//Funktion för att kunna hämta in information från databas för ett specifikt id
router.get("/contact/:id", (req, res) => {
    let id = req.params.id;
    //Hämta in information från databas och tabellen contact
    client.query(`SELECT * FROM contact WHERE id=$1`, [id], (err, results) => {
        //Felmeddelande om något går fel
        if (err) {
            res.status(500).json({ error: "Något gick fel: " + err });
            return;
        }
        console.log(results);
        //Om det inte finns något i tabellen visas felmeddelande annars returneras resultat
        if (results.rows.length === 0) {
            res.status(200).json({ error: "Det finns inga meddelanden" });
        } else {
            res.json(results);
        }
    });
});

//Funktion för att uppdatera databas med ny information

router.post("/contact", (req, res) => {
    //Hämtar in element från body
    const { name, email, message } = req.body;

    //Kontrollera om alla fält är ifyllda
    if (!name) {
        res.status(400).json({ error: "Se till att namn är ifyllt" });
        return;
    } else if (!email) {
        res.status(400).json({ error: "Se till att e-postadress är ifyllt" });
        return;
    } else if (!message) {
        res.status(400).json({ error: "Se till att meddelande är ifyllt" });
        return;
    }


    //Om inget är fel ska information läggas till i databas
    client.query(`INSERT INTO contact (name, email, message) VALUES ($1, $2, $3);`, [name, email, message], (err, results) => {
        //Om något går fel visas felmeddelande
        if (err) {
            res.status(500).json({ error: "Something went wrong: " + err });
            return;
        } else {
            console.log("Nytt meddelande skickat: " + results);

            //Ny data läggs till i databasen med strukturen
            let contact = {
                name: name,
                email: email,
                message: message
            };

            res.json({ message: "Ditt meddelande är skickat", contact });
        }
    });

});

//För att uppdatera data i databasen används put med ett specifikt id för datan
router.put("/contact/:id", (req, res) => {
    let id = req.params.id;
    let { name, email, message } = req.body;

    //Om inte allt är ifyllt visas ett felmeddelande
    if (!name || !email || !message) {
        return res.status(400).json({ message: "name, email, message måste vara ifyllda" })
        //Om allt är korrekt uppdateras informationen i databasen
    } else {
        client.query(`UPDATE contact SET name=$1, email=$2, message=$3 WHERE id=$3`, [name, email, message, id], (error, results) => {
            //Om något går fel visas felmeddelanden annars uppdateras inlägget
            if (error) {
                res.status(500).json({ message: "Något gick fel, försök igen senare" });
            } else if (results.rowCount === 0) {
                res.status(404).json({ message: "Meddelandet hittades inte" });
            } else {
                res.json({ message: "Meddelandet har uppdaterats" })
            }
        })
    }
});

//Funktion för att radera ett inlägg i databasen
router.delete("/contact/:id", (req, res) => {
    id = req.params.id;
    //Raderar inlägg i databasen där id är ett specifikt nummer
    client.query(`DELETE FROM contact WHERE id=$1`, [id], (error, results) => {
        //Om något går fel eller id inte hittas visas felmeddelande annars raderas inlägget
        if (error) {
            res.status(500).json({ message: "Något gick fel, försök igen senare" });
        } else if (results.rowCount === 0) {
            res.status(404).json({ message: "Meddelandet hittades inte" });
        } else {
            res.json({ message: "Meddelandet har raderats" });
        }
    });
});

module.exports = router;