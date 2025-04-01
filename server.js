/** @format */

const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const {RecaptchaV3} = require("express-recaptcha");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Configure email transporter
const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_HOST,
	port: process.env.EMAIL_PORT,
	secure: false, // true for 465, false for other ports
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

const recaptcha = new RecaptchaV3(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY);

// Routes
app.get("/", (req, res) => {
	const formSubmitted = req.query.formSubmitted === "true";
	const formError = req.query.formError === "true";
	res.render("index", {
		title: "Digital Arts Technology Training Center Inc.",
		formSubmitted,
		formError,
	});
});

// Contact form submission handler
app.post("/submit-contact", async (req, res) => {
	try {
		const recaptchaResponse = req.body["g-recaptcha-response"];

		// Verify reCAPTCHA
		const verificationURL = "https://www.google.com/recaptcha/api/siteverify";
		const response = await fetch(verificationURL, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				secret: process.env.RECAPTCHA_SECRET_KEY,
				response: recaptchaResponse,
			}),
		});

		const recaptchaData = await response.json();
		console.log("reCAPTCHA verification response:", recaptchaData); // For debugging

		// Check if reCAPTCHA validation passed
		if (!recaptchaData.success || recaptchaData.score < 0.5) {
			return res.status(400).send("Failed reCAPTCHA verification");
		}

		const {name, email, phone, program, message} = req.body;

		// Email content
		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: process.env.RECIPIENT_EMAIL,
			subject: `New Contact Form Submission from ${name}`,
			html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Program of Interest:</strong> ${program || "Not specified"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
		};

		// Send confirmation email to the user
		const confirmationEmail = {
			from: process.env.EMAIL_USER,
			to: email,
			subject: "Thank you for contacting Digital Arts Technology Training Center Inc.",
			html: `
        <h2>Thank You for Contacting Us</h2>
        <p>Dear ${name},</p>
        <p>We have received your inquiry about our ${program || "programs"} and will get back to you shortly.</p>
        <p>Here's a copy of the information you submitted:</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Program of Interest:</strong> ${program || "Not specified"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <br>
        <p>Best regards,</p>
        <p>The Digital Arts Technology Training Center Team</p>
      `,
		};

		// Send both emails
		await transporter.sendMail(mailOptions);
		await transporter.sendMail(confirmationEmail);

		console.log("Form submitted and emails sent:", req.body);
		res.redirect("/?formSubmitted=true");
	} catch (error) {
		console.error("Error sending email:", error);
		res.redirect("/?formError=true");
	}
});

// Start server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
