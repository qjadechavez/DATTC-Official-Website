const axios = require("axios");

async function verifyRecaptcha(token) {
  if (!token) return false;

  const verifyURL = "https://www.google.com/recaptcha/api/siteverify";
  const { data } = await axios.post(verifyURL, null, {
    params: {
      secret: process.env.RECAPTCHA_SECRET_KEY,
      response: token,
    },
  });

  return data.success;
}

module.exports = { verifyRecaptcha };
