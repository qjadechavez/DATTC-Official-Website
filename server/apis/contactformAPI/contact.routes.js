const express = require("express");
const { submitContact }= require("./contact.controller.js");
const { contactFormLimiter } = require("./ratelimiter/contactformlimiter.js");

const router = express.Router();

router.post("/submit-contact", contactFormLimiter, submitContact);

module.exports = router;