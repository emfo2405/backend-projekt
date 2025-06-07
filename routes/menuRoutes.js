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
//Kopplar till API
router.get("/api", (req, res) => {
    res.json({message: "Välkommen till mitt API"});
});

//Funktion för att kunna hämta in information från databas
router.get("/menu", (req, res) => {
    //Hämta in information från databas och tabellen menu
    client.query(`SELECT * FROM menu;`, (err, results) => {
        //Felmeddelande om något går fel
         if(err) {
        res.status(500).json({error: "Något gick fel: " + err});
        return;
         }
         //Om det inte finns något i tabellen visas felmeddelande annars returneras resultat
         if(results.rows.length === 0) {
            res.status(200).json({error: "Det finns inga produkter"});
         } else {
            res.json(results);
         }
    });
});

//Funktion för att kunna hämta in information från databas för ett specifikt id
router.get("/menu/:id", (req, res) => {
    let id = req.params.id;
    //Hämta in information från databas och tabellen menu
    client.query(`SELECT * FROM menu WHERE id=$1`, [id], (err, results) => {
        //Felmeddelande om något går fel
         if(err) {
        res.status(500).json({error: "Något gick fel: " + err});
        return;
         }
         //Om det inte finns något i tabellen visas felmeddelande annars returneras resultat
         if(results.rows.length === 0) {
            res.status(200).json({error: "Det finns inga produkter"});
         } else {
            res.json(results);
         }
    });
});

//Funktion för att uppdatera databas med ny information
router.post("/menu", async (req, res) => {
//Hämtar element från body
const { drinkName, drinkType, price, description, allergens } = req.body;

    //Kontrollera om alla fält är ifyllda annars visas ett felmeddelande
        if(!drinkName) {
           return res.status(400).json({error: "Se till att dryckens namn är ifyllt"})
    } else if (!drinkType){
        return res.status(400).json({error: "Se till att dryckens typ är vald"})
    }else if(!price) {
        return res.status(400).json({error: "Se till att pris är satt"})
    }else if (!description) {
        return res.status(400).json({error: "Se till att en beskrivning finns"})
    }else if (!allergens){
        return res.status(400).json({error: "Se till att allergener är ifyllda"})
    }

//Hämtar alla element från menu med specifikt drinkname
   try { const result = await client.query(`SELECT * FROM menu WHERE drinkName=$1`, [drinkName]);
         if (result.rows.length > 0) {
                return res.status(400).json({message: "Drycken finns redan i menyn"});
            }
    

    //Om inget är fel ska information läggas till i databas
    await client.query(`INSERT INTO menu (drinkName, drinkType, price, description, allergens) VALUES ($1, $2, $3, $4, $5);`, [drinkName, drinkType, price, description, allergens]);

        //Ny data läggs till i databasen med strukturen
        let menu = {
            drinkName: drinkName,
            drinkType: drinkType,
            price: price,
            description: description,
            allergens: allergens
        };

        res.json({message: "Ny produkt tillagd i menyn", menu});
    } catch (err) {
        res.status(500).json({message: "Något gick fel" });
    }

});

//För att uppdatera data i databasen används put med ett specifikt id för datan
router.put("/menu/:id", (req, res) => {
    //Hämtar element från body
    let id = req.params.id;
    let { drinkName, drinkType, price, description, allergens} = req.body;

    //Om inte allt är ifyllt visas ett felmeddelande
    if(!drinkName || !drinkType || !price || !description || !allergens) {
        return res.status(400).json({message: "drinkName, drinkType, price, description, allergens måste vara ifyllda"})
        //Om allt är korrekt uppdateras informationen i databasen
    } else {
        client.query(`UPDATE menu SET drinkName=$1, drinkType=$2, price=$3, description=$4, allergens=$5 WHERE id=$6`, [drinkName, drinkType, price, description, allergens, id], (error, results) => {
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
router.delete("/menu/:id", (req,res) => {
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

module.exports = router;

