/** @format */

// Form validation function
function validateForm() {
	let isValid = true;

	// Reset all error messages
	document.querySelectorAll(".error-message").forEach((el) => {
		el.style.display = "none";
		el.textContent = "";
	});

	// Validate name (required)
	const name = document.getElementById("name");
	if (!name.value.trim()) {
		document.getElementById("name-error").textContent = "Name is required";
		document.getElementById("name-error").style.display = "block";
		name.classList.add("invalid");
		isValid = false;
	} else if (name.value.trim().length < 2) {
		document.getElementById("name-error").textContent = "Name must be at least 2 characters";
		document.getElementById("name-error").style.display = "block";
		name.classList.add("invalid");
		isValid = false;
	} else {
		name.classList.remove("invalid");
		name.classList.add("valid");
	}

	// Validate email (required and format)
	const email = document.getElementById("email");
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!email.value.trim()) {
		document.getElementById("email-error").textContent = "Email is required";
		document.getElementById("email-error").style.display = "block";
		email.classList.add("invalid");
		isValid = false;
	} else if (!emailRegex.test(email.value.trim())) {
		document.getElementById("email-error").textContent = "Please enter a valid email address";
		document.getElementById("email-error").style.display = "block";
		email.classList.add("invalid");
		isValid = false;
	} else {
		email.classList.remove("invalid");
		email.classList.add("valid");
	}

	// Validate phone (required and format)
	const phone = document.getElementById("phone");
	const phoneRegex = /^[0-9\+\-\(\)\s]{7,20}$/;
	if (!phone.value.trim()) {
		document.getElementById("phone-error").textContent = "Phone number is required";
		document.getElementById("phone-error").style.display = "block";
		phone.classList.add("invalid");
		isValid = false;
	} else if (!phoneRegex.test(phone.value.trim())) {
		document.getElementById("phone-error").textContent = "Please enter a valid phone number";
		document.getElementById("phone-error").style.display = "block";
		phone.classList.add("invalid");
		isValid = false;
	} else {
		phone.classList.remove("invalid");
		phone.classList.add("valid");
	}

	// Validate program selection (required)
	const program = document.getElementById("program");
	if (!program.value) {
		document.getElementById("program-error").textContent = "Please select a program";
		document.getElementById("program-error").style.display = "block";
		program.classList.add("invalid");
		isValid = false;
	} else {
		program.classList.remove("invalid");
		program.classList.add("valid");
	}

	// Validate message (required and minimum length)
	const message = document.getElementById("message");
	if (!message.value.trim()) {
		document.getElementById("message-error").textContent = "Message is required";
		document.getElementById("message-error").style.display = "block";
		message.classList.add("invalid");
		isValid = false;
	} else if (message.value.trim().length < 10) {
		document.getElementById("message-error").textContent = "Message must be at least 10 characters";
		document.getElementById("message-error").style.display = "block";
		message.classList.add("invalid");
		isValid = false;
	} else {
		message.classList.remove("invalid");
		message.classList.add("valid");
	}

	return isValid;
}

// Add input event listeners to clear errors on typing
document.querySelectorAll("#contactForm input, #contactForm textarea, #contactForm select").forEach((el) => {
	el.addEventListener("input", function () {
		const errorId = this.id + "-error";
		const errorElement = document.getElementById(errorId);
		if (errorElement) {
			errorElement.style.display = "none";
			this.classList.remove("invalid");
		}
	});
});

// Make sure reCAPTCHA is available and working properly
let recaptchaLoaded = false;

// Check if reCAPTCHA is loaded
window.onload = function () {
	if (typeof grecaptcha !== "undefined") {
		recaptchaLoaded = true;
	} else {
		console.error("reCAPTCHA not loaded. Check your internet connection and site key.");
		document.getElementById("recaptcha-error").textContent = "reCAPTCHA could not be loaded. Please refresh the page.";
		document.getElementById("recaptcha-error").style.display = "block";
	}
};

// Form submission handler with validation
document.getElementById("contactForm").addEventListener("submit", function (event) {
	event.preventDefault();

	// Validate form first
	if (!validateForm()) {
		// Focus the first invalid field
		const firstInvalid = document.querySelector(".invalid");
		if (firstInvalid) {
			firstInvalid.focus();
			firstInvalid.scrollIntoView({behavior: "smooth", block: "center"});
		}
		return false;
	}

	// Show loading state on button
	const submitBtn = this.querySelector(".submit-btn");
	const originalBtnText = submitBtn.innerHTML;
	submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
	submitBtn.disabled = true;

	// Check if reCAPTCHA is loaded
	if (!recaptchaLoaded) {
		submitBtn.innerHTML = originalBtnText;
		submitBtn.disabled = false;
		document.getElementById("recaptcha-error").textContent = "reCAPTCHA verification is required. Please refresh the page.";
		document.getElementById("recaptcha-error").style.display = "block";
		return false;
	}

	// If form is valid, proceed with reCAPTCHA verification
	try {
		grecaptcha.ready(function () {
			grecaptcha
				.execute("6Ld6lQYrAAAAAOBSzF6b1BsSxcwDeoTl1TDlsIrF", {action: "submit"})
				.then(function (token) {
					// Set the token value in the hidden field
					document.getElementById("g-recaptcha-response").value = token;

					// Debug - log token to console
					console.log("reCAPTCHA token generated:", token.substring(0, 10) + "...");

					// Submit the form
					document.getElementById("contactForm").submit();
				})
				.catch(function (error) {
					// Restore button state
					submitBtn.innerHTML = originalBtnText;
					submitBtn.disabled = false;

					// Handle reCAPTCHA errors
					document.getElementById("recaptcha-error").textContent = "reCAPTCHA verification failed. Please try again.";
					document.getElementById("recaptcha-error").style.display = "block";
					console.error("reCAPTCHA error:", error);
				});
		});
	} catch (error) {
		// Fallback for any errors
		submitBtn.innerHTML = originalBtnText;
		submitBtn.disabled = false;
		document.getElementById("recaptcha-error").textContent = "Error processing form. Please try again.";
		document.getElementById("recaptcha-error").style.display = "block";
		console.error("Form submission error:", error);
	}
});
