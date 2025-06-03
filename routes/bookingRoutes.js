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

router.get("/api", (req, res) => {
    res.json({message: "Välkommen till mitt API"});
});

//Funktion för att kunna hämta in information från databas
router.get("/booking", (req, res) => {
    //Hämta in information från databas och tabellen booking
    client.query(`SELECT * FROM booking;`, (err, results) => {
        //Felmeddelande om något går fel
         if(err) {
        res.status(500).json({error: "Något gick fel: " + err});
        return;
         }
         console.log(results);
         //Om det inte finns något i tabellen visas felmeddelande annars returneras resultat
         if(results.rows.length === 0) {
            res.status(200).json({error: "Det finns inga produkter"});
         } else {
            res.json(results);
         }
    });
});

//Funktion för att kunna hämta in information från databas för ett specifikt id
router.get("/booking/:id", (req, res) => {
    let id = req.params.id;
    //Hämta in information från databas och tabellen booking
    client.query(`SELECT * FROM booking WHERE id=$1`, [id], (err, results) => {
        //Felmeddelande om något går fel
         if(err) {
        res.status(500).json({error: "Något gick fel: " + err});
        return;
         }
         console.log(results);
         //Om det inte finns något i tabellen visas felmeddelande annars returneras resultat
         if(results.rows.length === 0) {
            res.status(200).json({error: "Det finns inga produkter"});
         } else {
            res.json(results);
         }
    });
});

//Funktion för att uppdatera databas med ny information

router.post("/booking", (req, res) => {

const { name, email, date, time, message } = req.body;

    //Struktur för error-meddelanden
    let errors = {
        message: "",
        detail: "",
        https_response: {

        }
    };

    //Kontrollera om alla fält är ifyllda
        if(!name || !email || !date || !time) {
                //Error meddelamde
                errors.message = "Alla fält måste vara ifyllda";
                errors.detail = "Du måste fylla i name, email, date och time";
        
                //response kod
                errors.https_response.message = "Bad request";
                errors.https_response.code = 400;
        
                res.status(400).json(errors);
        
                return;
    }


    //Om inget är fel ska information läggas till i databas
    client.query(`INSERT INTO booking (name, email, date, time, message) VALUES ($1, $2, $3, $4, $5);`, [name, email, date, time, message], (err, results) => {
    //Om något går fel visas felmeddelande
    if(err) {
        res.status(500).json({error: "Something went wrong: " + err});
        return;
    } else {
        console.log("Ny bokning skapat: " + results);

        //Ny data läggs till i databasen med strukturen
        let booking = {
            name: name,
            email: email,
            date: date,
            time: time,
            message: message
        };

        res.json({message: "Ny bokning gjord", booking});
    }
});

});

//För att uppdatera data i databasen används put med ett specifikt id för datan
router.put("/booking/:id", (req, res) => {
    let id = req.params.id;
    let { name, email, date, time, message} = req.body;

    //Om inte allt är ifyllt visas ett felmeddelande
    if(!name || !email || !date || !time) {
        return res.status(400).json({message: "name, email, date, time måste vara ifyllda"})
        //Om allt är korrekt uppdateras informationen i databasen
    } else {
        client.query(`UPDATE booking SET name=$1, email=$2, date=$3, time=$4, message=$5 WHERE id=$6`, [name, email, date, time, message, id], (error, results) => {
            //Om något går fel visas felmeddelanden annars uppdateras inlägget
            if(error) {
                res.status(500).json({message: "Något gick fel, försök igen senare"});
            } else if (results.rowCount === 0) {
                res.status(404).json({message: "Bokningen hittades inte"});
            } else {
                res.json({message: "Bokningen har uppdaterats"})
            }
        })
    }
});

//Funktion för att radera ett inlägg i databasen
router.delete("/booking/:id", (req,res) => {
id= req.params.id;
//Raderar inlägg i databasen där id är ett specifikt nummer
client.query(`DELETE FROM booking WHERE id=$1`, [id], (error, results) => {
    //Om något går fel eller id inte hittas visas felmeddelande annars raderas inlägget
    if(error) {
        res.status(500).json({message: "Något gick fel, försök igen senare"});
    } else if (results.rowCount === 0) {
        res.status(404).json({message: "Bokningen hittades inte"});
    } else {
        res.json({message: "Bokningen har raderats"});
    }
});
});

module.exports = router;