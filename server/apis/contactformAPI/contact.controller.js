const xss = require("xss");
const { transporter } = require("../../serverConfig/emailconfig.js");
const { verifyRecaptcha } = require("./contact.middleware.js");

const submitContact = async (req, res) => {
  try {
    const {
      name: rawName,
      email: rawEmail,
      phone: rawPhone,
      program: rawProgram,
      message: rawMessage,
      "g-recaptcha-response": recaptchaToken,
    } = req.body;

    const name = xss(rawName);
    const email = xss(rawEmail);
    const phone = xss(rawPhone);
    const program = xss(rawProgram);
    const message = xss(rawMessage);

    const valid = await verifyRecaptcha(recaptchaToken);
    // console.log("Contact form submission:", { name, email, phone, program, message });
    // console.log("Recaptcha token:", recaptchaToken);
    // console.log("reCAPTCHA valid:", valid);
    if (!valid) return res.redirect("/?formError=true");

    const adminMail = {
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Program:</strong> ${program || "Not specified"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    const confirmationMail = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank you for contacting Digital Arts Technology Training Center Inc.",
      html: `
        <h2>Thank You for Contacting Us</h2>
        <p>Dear ${name},</p>
        <p>We received your inquiry about ${program || "our programs"}.</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Program:</strong> ${program || "Not specified"}</p>
        <p><strong>Message:</strong></p><p>${message}</p>
      `,
    };

    await transporter.sendMail(adminMail);
    await transporter.sendMail(confirmationMail);

    res.redirect("/?formSubmitted=true");
  } catch (err) {
    console.error("Error submitting contact:", err);
    res.redirect("/?formError=true");
  }
};

module.exports = { submitContact };