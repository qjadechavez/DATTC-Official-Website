const express = require("express");
const { app } = require("../../serverConfig/envconfig.js");
const pagerenderAPIRoutes = require("../pagerenderAPI/pagerender.routes.js");
const contactAPIRoutes = require("../contactformAPI/contact.routes.js");

const mountRoutes = () => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use("/", pagerenderAPIRoutes);
  app.use("/digitalarts/contactformapi", contactAPIRoutes);
//app.use("/apiname", otheroutes);   
  console.log("Routes mounted successfully");
};

module.exports = { mountRoutes };