require("dotenv").config();
const express = require("express");
const { Client } = require("pg");

//Funktion för att koppla till databas och skapa tabell
async function install() {

    //Koppling till databas med inställningar från .env-fil
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

    //Skapa tabell i databas
    try {
        await client.connect();
        console.log("Anslutning till databas lyckades");

        await client.query(`DROP TABLE IF EXISTS users, menu`);


        const sqlUser = `
        CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) NOT NULL,
        account_created DATE DEFAULT CURRENT_TIMESTAMP);
        `;


        await client.query(sqlUser);

        const sqlMenu = `
        CREATE TABLE menu(
        id SERIAL PRIMARY KEY,
        drinkName VARCHAR(50) NOT NULL,
        drinkType VARCHAR(50) NOT NULL,
        price INTEGER NOT NULL,
        description VARCHAR(255) NOT NULL,
        allergens VARCHAR(50) NOT NULL,
        item_created DATE DEFAULT CURRENT_TIMESTAMP);
        `;
        await client.query(sqlMenu);
        console.log("tabeller skapade");



        //Fånga upp fel
    } catch (error) {
        console.error(error);
    } finally {
        await client.end();
    }

}


//Kör funktionen för att koppla till databasen
install();