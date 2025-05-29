require("dotenv").config();
const express = require("express");
const router = express.Router();
const { Client } = require("pg");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Lägga till en användare
router.post("/register", async(req, res) => {
    console.log("Registrering påbörjad");
});

//Logga in en användare
router.post("/login", async(req,res) => {
    console.log("Inloggning påbörjad");
});

module.exports = router;