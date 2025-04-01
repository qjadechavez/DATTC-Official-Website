/** @format */

const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const {RecaptchaV3} = require("express-recaptcha");
const rateLimit = require("express-rate-limit");
const xss = require("xss");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

// Validate required environment variables
const requiredEnvVars = ["EMAIL_HOST", "EMAIL_PORT", "EMAIL_USER", "EMAIL_PASS", "RECAPTCHA_SITE_KEY", "RECAPTCHA_SECRET_KEY", "RECIPIENT_EMAIL"];

const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingEnvVars.length > 0) {
	console.error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
	process.exit(1);
}

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
	secure: process.env.EMAIL_PORT === "465", // Auto-detect secure based on port
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

// Verify email configuration on startup
transporter
	.verify()
	.then(() => console.log("Email service connected and ready"))
	.catch((err) => console.error("Email configuration error:", err));

const recaptcha = new RecaptchaV3(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY);

// Add rate limiting to prevent form spam
const contactFormLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, // 5 submissions per IP per window
	message: "Too many contact requests from this IP, please try again later.",
});

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

// Helper function to sanitize user input
function sanitizeInput(input) {
	if (typeof input !== "string") return "";
	return xss(input.trim());
}

// Contact form submission handler
app.post("/submit-contact", contactFormLimiter, async (req, res) => {
	try {
		const recaptchaResponse = req.body["g-recaptcha-response"];

		// Validate required fields
		const requiredFields = ["name", "email", "message"];
		for (const field of requiredFields) {
			if (!req.body[field]?.trim()) {
				return res.status(400).send(`Missing required field: ${field}`);
			}
		}

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

		// Check if reCAPTCHA validation passed
		if (!recaptchaData.success || recaptchaData.score < 0.5) {
			console.warn("reCAPTCHA verification failed:", recaptchaData);
			return res.status(400).send("Failed reCAPTCHA verification");
		}

		// Sanitize user inputs
		const name = sanitizeInput(req.body.name);
		const email = sanitizeInput(req.body.email);
		const phone = sanitizeInput(req.body.phone || "");
		const program = sanitizeInput(req.body.program || "");
		const message = sanitizeInput(req.body.message);

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).send("Invalid email format");
		}

		// Email content
		const mailOptions = {
			from: `"DATTC Contact Form" <${process.env.EMAIL_USER}>`,
			to: process.env.RECIPIENT_EMAIL,
			subject: `New Contact Form Submission from ${name}`,
			html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Program of Interest:</strong> ${program || "Not specified"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
		};

		// Send confirmation email to the user
		const confirmationEmail = {
			from: `"Digital Arts Technology Training Center" <${process.env.EMAIL_USER}>`,
			to: email,
			subject: "Thank you for contacting Digital Arts Technology Training Center Inc.",
			html: `
        <h2>Thank You for Contacting Us</h2>
        <p>Dear ${name},</p>
        <p>We have received your inquiry about our ${program || "programs"} and will get back to you shortly.</p>
        <p>Here's a copy of the information you submitted:</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
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

		console.log("Form submitted successfully:", {name, phone, email, program, message});
		res.redirect("/?formSubmitted=true");
	} catch (error) {
		console.error("Error processing contact form:", error);
		res.redirect("/?formError=true");
	}
});

// Handle 404 errors
app.use((req, res) => {
	res.status(404).send("Page not found");
});

// Global error handler
app.use((err, req, res, next) => {
	console.error("Server error:", err);
	res.status(500).send("Internal server error");
});

// Start server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
