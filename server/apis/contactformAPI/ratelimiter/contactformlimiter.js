const rateLimit = require("express-rate-limit");

const contactFormLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 3,
  message: "Too many inquiries, try again after 24 hours",
  handler: (req,res) => res.redirect("/?formError=true&message=rateLimit"),
});

module.exports = { contactFormLimiter };