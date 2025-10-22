const express = require("express");
const { renderForm } = require("./pagerender.controller.js");

const router = express.Router();

router.get("/", renderForm);

module.exports = router;
