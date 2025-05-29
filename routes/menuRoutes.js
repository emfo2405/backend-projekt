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

//Funktion för att uppdatera databas med ny information

app.post("/api/experience", (req, res) => {

const { drinkName, drinkType, modifications, description, allergens } = req.body;

    //Struktur för error-meddelanden
    let errors = {
        message: "",
        detail: "",
        https_response: {

        }
    };

    //Kontrollera om alla fält är ifyllda
        if(!drinkName || !drinkType || !modifications || !description || !allergens) {
                //Error meddelamde
                errors.message = "Alla fält måste vara ifyllda";
                errors.detail = "Du måste fylla i drinkName, drinkType, modifications, description och allergens";
        
                //response kod
                errors.https_response.message = "Bad request";
                errors.https_response.code = 400;
        
                res.status(400).json(errors);
        
                return;
    }

    //Om inget är fel ska information läggas till i databas
    client.query(`INSERT INTO menu (drinkName, drinkType, modifications, description, allergens) VALUES ($1, $2, $3, $4, $5, $6);`, [drinkName, drinkType, modifications, description, allergens], (err, results) => {
    //Om något går fel visas felmeddelande
    if(err) {
        res.status(500).json({error: "Something went wrong: " + err});
        return;
    } else {
        console.log("Nyprodukt tillagd skapat: " + results);

        //Ny data läggs till i databasen med strukturen
        let menu = {
            drinkName: drinkName,
            drinkType: drinkType,
            modifications: modifications,
            description: description,
            allergens: allergens
        };

        res.json({message: "Ny produkt i menyn tillagd", menu});
    }
});

});

//För att uppdatera data i databasen används put med ett specifikt id för datan
app.put("/api/menu/:id", (req, res) => {
    let id = req.params.id;
    let { drinkName, drinkType, modifications, description, allergens} = req.body;

    //Om inte allt är ifyllt visas ett felmeddelande
    if(!drinkName || !drinkType || !modifications || !description || !allergens) {
        return res.status(400).json({message: "drinkName, drinkType, modifications, description, allergens måste vara ifyllda"})
        //Om allt är korrekt uppdateras informationen i databasen
    } else {
        client.query(`UPDATE menu SET drinkName=$1, drinkType=$2, modifications=$3, description=$4, allergens=$5 WHERE id=$6`, [drinkName, drinkType, modifications, description, allergens, id], (error, results) => {
            //Om något går fel visas felmeddelanden annars uppdateras inlägget
            if(error) {
                res.status(500).json({message: "Något gick fel, försök igen senare"});
            } else if (results.rowCount === 0) {
                res.status(404).json({message: "Produkten hittades inte"});
            } else {
                res.json({message: "Produkten har uppdaterats"})
            }
        })
    }
});

//Funktion för att radera ett inlägg i databasen
app.delete("/api/menu/:id", (req,res) => {
id= req.params.id;
//Raderar inlägg i databasen där id är ett specifikt nummer
client.query(`DELETE FROM menu WHERE id=$1`, [id], (error, results) => {
    //Om något går fel eller id inte hittas visas felmeddelande annars raderas inlägget
    if(error) {
        res.status(500).json({message: "Något gick fel, försök igen senare"});
    } else if (results.rowCount === 0) {
        res.status(404).json({message: "Produkten hittades inte"});
    } else {
        res.json({message: "Produkten har raderats"});
    }
});
});

