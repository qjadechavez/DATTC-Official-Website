const path = require("path");
const express = require("express");
const { app } = require("./envconfig.js");

const configureViewEngine = () => {
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "../../views"));
  app.use(express.static(path.join(__dirname, "../../public")));
  console.log("View engine configured successfully");
};

module.exports = { configureViewEngine };
