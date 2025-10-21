/** @format */
document.addEventListener("DOMContentLoaded", function () {
	// Add this at the beginning of your DOMContentLoaded function

	// Video loading handler
	const heroVideo = document.querySelector(".hero-video");
	const videoLoader = document.querySelector(".video-loader");

	if (heroVideo && videoLoader) {
		// Function to hide loader when video is ready
		function hideLoader() {
			videoLoader.classList.add("hidden");
			// Remove loader from DOM after transition completes
			setTimeout(() => {
				videoLoader.remove();
			}, 500);
		}

		// Hide loader when video can play through
		heroVideo.addEventListener("canplaythrough", hideLoader);

		// Fallback - hide loader after 5 seconds maximum wait time
		setTimeout(hideLoader, 5000);

		// If video is already loaded
		if (heroVideo.readyState >= 3) {
			hideLoader();
		}
	}

	// Simplified mobile menu functionality
	const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
	const navbar = document.getElementById("navbar");
	const menuIcon = mobileMenuBtn?.querySelector("i");

	// Add index to navbar items for staggered animation
	if (navbar) {
		const navItems = navbar.querySelectorAll("li");
		navItems.forEach((item, index) => {
			item.style.setProperty("--i", index);
		});
	}

	if (mobileMenuBtn && navbar) {
		// Simple toggle function
		function toggleMenu() {
			navbar.classList.toggle("active");

			// Toggle icon
			if (menuIcon) {
				if (navbar.classList.contains("active")) {
					menuIcon.className = "fas fa-times";
				} else {
					menuIcon.className = "fas fa-bars";
				}
			}
		}

		// Event listeners for menu button
		mobileMenuBtn.addEventListener("click", toggleMenu);

		// Close menu when clicking a link
		const navLinks = navbar.querySelectorAll("a");
		navLinks.forEach((link) => {
			link.addEventListener("click", function () {
				if (navbar.classList.contains("active")) {
					toggleMenu();
				}
			});
		});

		// Close when clicking outside
		document.addEventListener("click", function (e) {
			if (navbar.classList.contains("active") && !navbar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
				toggleMenu();
			}
		});
	}

	// Header scroll effect
	const header = document.querySelector("header");
	if (header) {
		window.addEventListener("scroll", () => {
			if (window.scrollY > 20) {
				header.classList.add("scrolled");
			} else {
				header.classList.remove("scrolled");
			}
		});
	}

	// Program tabs functionality
	const programTabs = document.querySelectorAll(".program-tab");
	const programContents = document.querySelectorAll(".program-content");

	if (programTabs.length > 0 && programContents.length > 0) {
		// Set first tab and content as active by default
		programTabs[0].classList.add("active");

		const firstTabContent = document.getElementById(programTabs[0].getAttribute("data-program"));
		if (firstTabContent) {
			firstTabContent.classList.add("active");
		}

		// Add click event to each tab
		programTabs.forEach((tab) => {
			tab.addEventListener("click", () => {
				// Remove active class from all tabs and contents
				programTabs.forEach((t) => t.classList.remove("active"));
				programContents.forEach((c) => c.classList.remove("active"));

				// Add active class to clicked tab
				tab.classList.add("active");

				// Show corresponding content
				const programId = tab.getAttribute("data-program");
				const programContent = document.getElementById(programId);
				if (programContent) {
					programContent.classList.add("active");
				}
			});
		});
	}

	// Smooth scroll for navbar links
	const navLinks = document.querySelectorAll("nav a");
	navLinks.forEach((link) => {
		link.addEventListener("click", function (e) {
			// Only process links that point to an ID on the page
			const targetId = this.getAttribute("href");
			if (targetId.startsWith("#") && targetId.length > 1) {
				e.preventDefault();

				const targetElement = document.querySelector(targetId);
				if (targetElement) {
					// Close mobile menu if open
					if (navbar.classList.contains("active")) {
						navbar.classList.remove("active");

						// Add this block to ensure the icon changes back
						if (mobileMenuBtn) {
							const icon = mobileMenuBtn.querySelector("i");
							if (icon) {
								icon.classList.remove("fa-times");
								icon.classList.add("fa-bars");
							}
						}
					}

					// Scroll to element with offset for header
					const headerHeight = header.offsetHeight;
					const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

					window.scrollTo({
						top: targetPosition,
						behavior: "smooth",
					});
				}
			}
		});
	});

	// Improved smooth scroll for all navbar links
	document.querySelectorAll("#navbar a[href^='#']").forEach((link) => {
		link.addEventListener("click", function (e) {
			e.preventDefault();
			const targetId = this.getAttribute("href");
			if (targetId === "#") return;

			const targetElement = document.querySelector(targetId);
			if (targetElement) {
				// Close mobile menu if open
				if (navbar && navbar.classList.contains("active")) {
					navbar.classList.remove("active");

					// Reset the hamburger icon
					const icon = mobileMenuBtn.querySelector("i");
					if (icon) {
						icon.classList.remove("fa-times");
						icon.classList.add("fa-bars");
					}
				}

				// Scroll to element with offset for header
				const headerHeight = document.querySelector("header").offsetHeight;
				const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

				window.scrollTo({
					top: targetPosition,
					behavior: "smooth",
				});
			}
		});
	});

	// Enhanced Gallery lightbox functionality with navigation
	const galleryItems = document.querySelectorAll(".gallery-item");

	if (galleryItems.length > 0) {
		// Create lightbox element
		const lightbox = document.createElement("div");
		lightbox.className = "gallery-lightbox";

		const lightboxContent = document.createElement("div");
		lightboxContent.className = "lightbox-content";

		const lightboxImage = document.createElement("img");

		// Navigation buttons
		const prevButton = document.createElement("div");
		prevButton.className = "lightbox-prev";
		prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';

		const nextButton = document.createElement("div");
		nextButton.className = "lightbox-next";
		nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';

		const closeButton = document.createElement("div");
		closeButton.className = "lightbox-close";
		closeButton.innerHTML = "&times;";

		lightboxContent.appendChild(lightboxImage);
		lightbox.appendChild(closeButton);
		lightbox.appendChild(prevButton);
		lightbox.appendChild(nextButton);
		lightbox.appendChild(lightboxContent);
		document.body.appendChild(lightbox);

		let currentIndex = 0;

		// Function to update lightbox with current image
		function updateLightbox(index) {
			currentIndex = index;
			const imgSrc = galleryItems[index].querySelector("img").src;
			const imgAlt = galleryItems[index].querySelector("img").alt;

			lightboxImage.src = imgSrc;
			lightboxImage.alt = imgAlt;
		}

		// Add click event to gallery items
		galleryItems.forEach((item, index) => {
			item.addEventListener("click", function () {
				updateLightbox(index);
				lightbox.classList.add("active");
				document.body.style.overflow = "hidden";
			});
		});

		// Navigation functions
		function showPrevImage() {
			currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
			updateLightbox(currentIndex);
		}

		function showNextImage() {
			currentIndex = (currentIndex + 1) % galleryItems.length;
			updateLightbox(currentIndex);
		}

		prevButton.addEventListener("click", showPrevImage);
		nextButton.addEventListener("click", showNextImage);

		// Close lightbox on click
		closeButton.addEventListener("click", function () {
			lightbox.classList.remove("active");
			document.body.style.overflow = "auto";
		});

		// Also close on background click
		lightbox.addEventListener("click", function (e) {
			if (e.target === lightbox) {
				lightbox.classList.remove("active");
				document.body.style.overflow = "auto";
			}
		});

		// Keyboard navigation
		document.addEventListener("keydown", function (e) {
			if (!lightbox.classList.contains("active")) return;

			if (e.key === "Escape") {
				lightbox.classList.remove("active");
				document.body.style.overflow = "auto";
			} else if (e.key === "ArrowLeft") {
				showPrevImage();
			} else if (e.key === "ArrowRight") {
				showNextImage();
			}
		});
	}

	// Animate gallery items on scroll
	const observeGallery = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					// Reset the animation
					entry.target.style.animation = "none";
					// Trigger reflow
					void entry.target.offsetWidth;
					// Restore animation
					const index = Array.from(galleryItems).indexOf(entry.target);
					entry.target.style.animation = `fadeInUp 0.8s forwards ${index * 0.1}s`;

					observeGallery.unobserve(entry.target);
				}
			});
		},
		{
			threshold: 0.2,
		}
	);

	galleryItems.forEach((item) => {
		observeGallery.observe(item);
	});

	// Smooth scrolling for anchor links
	const anchorLinks = document.querySelectorAll('a[href^="#"]');
	anchorLinks.forEach((link) => {
		link.addEventListener("click", function (e) {
			e.preventDefault();
			const targetId = this.getAttribute("href");
			if (targetId === "#") return;
			const targetElement = document.querySelector(targetId);
			if (targetElement) {
				// Important fix: Always reset the menu icon when a link is clicked
				if (navbar && navbar.classList.contains("active")) {
					navbar.classList.remove("active");

					// Fix icon state - this was the missing part
					if (mobileMenuBtn) {
						const icon = mobileMenuBtn.querySelector("i");
						if (icon) {
							icon.classList.remove("fa-times");
							icon.classList.add("fa-bars");
						}
					}
				}

				const headerHeight = document.querySelector("header").offsetHeight;
				const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
				window.scrollTo({
					top: targetPosition,
					behavior: "smooth",
				});
			}
		});
	});

	// Update active nav item based on scroll position
	window.addEventListener("scroll", function () {
		const sections = document.querySelectorAll("section[id]");
		const scrollPosition = window.scrollY + 100; // Offset for header height

		sections.forEach((section) => {
			const sectionTop = section.offsetTop;
			const sectionHeight = section.offsetHeight;
			const sectionId = section.getAttribute("id");

			if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
				document.querySelectorAll("#navbar li a").forEach((item) => {
					item.classList.remove("active");
					if (item.getAttribute("href") === "#" + sectionId) {
						item.classList.add("active");
					}
				});
			}
		});
	});

	// Form handling
	const urlParams = new URLSearchParams(window.location.search);
	const formSubmitted = urlParams.get("formSubmitted");
	const formError = urlParams.get("formError");

	if (formSubmitted === "true") {
		const contactForm = document.getElementById("contactForm");
		if (contactForm) {
			contactForm.reset();

			// Scroll to the success message
			const formMessage = document.querySelector(".form-message");
			if (formMessage) {
				formMessage.scrollIntoView({ behavior: "smooth", block: "center" });
			}

			// Remove the parameter from the URL without refreshing the page
			window.history.replaceState({}, document.title, window.location.pathname);
		}
	}

	// Modal handling
	const successModal = document.getElementById("successModal");
	const errorModal = document.getElementById("errorModal");

	// Get all close elements
	const closeButtons = document.querySelectorAll(".close-modal, .modal-btn");

	// Show appropriate modal based on URL parameters
	if (formSubmitted === "true") {
		showModal(successModal);

		// Reset the form
		const contactForm = document.getElementById("contactForm");
		if (contactForm) {
			contactForm.reset();
		}

		// Remove the parameter from URL
		removeUrlParameters();
	} else if (formError === "true") {
		showModal(errorModal);

		// Remove the parameter from URL
		removeUrlParameters();
	}

	// Add click event to all close buttons
	closeButtons.forEach((button) => {
		button.addEventListener("click", function () {
			hideModals();
		});
	});

	// Close modal when clicking outside
	window.addEventListener("click", function (event) {
		if (event.target === successModal || event.target === errorModal) {
			hideModals();
		}
	});

	// Close modal with Escape key
	document.addEventListener("keydown", function (event) {
		if (event.key === "Escape") {
			hideModals();
		}
	});

	// Function to show a modal
	function showModal(modal) {
		modal.style.display = "block";
		document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
	}

	// Function to hide all modals
	function hideModals() {
		successModal.style.display = "none";
		errorModal.style.display = "none";
		document.body.style.overflow = ""; // Restore scrolling
	}

	// Function to remove URL parameters
	function removeUrlParameters() {
		window.history.replaceState({}, document.title, window.location.pathname);
	}

	// Form validation
	const contactForm = document.getElementById("contactForm");
	if (contactForm) {
		// Create validation error container for each input
		const formInputs = contactForm.querySelectorAll("input, textarea, select");
		formInputs.forEach((input) => {
			const errorSpan = document.createElement("span");
			errorSpan.className = "error-message";
			errorSpan.style.color = "#ff3860";
			errorSpan.style.fontSize = "14px";
			errorSpan.style.marginTop = "5px";
			errorSpan.style.display = "none";
			input.parentNode.insertBefore(errorSpan, input.nextSibling);
		});

		contactForm.addEventListener("submit", function (e) {
			let isValid = true;
			let firstError = null;

			// Clear all error messages first
			const errorMessages = contactForm.querySelectorAll(".error-message");
			errorMessages.forEach((span) => {
				span.style.display = "none";
				span.textContent = "";
			});

			// Validate name (required, at least 2 characters)
			const nameInput = contactForm.querySelector("input[name='name']");
			if (nameInput) {
				const errorSpan = nameInput.nextElementSibling;
				if (!nameInput.value.trim()) {
					errorSpan.textContent = "Name is required";
					errorSpan.style.display = "block";
					isValid = false;
					firstError = firstError || nameInput;
				} else if (nameInput.value.trim().length < 2) {
					errorSpan.textContent = "Name must be at least 2 characters";
					errorSpan.style.display = "block";
					isValid = false;
					firstError = firstError || nameInput;
				}
			}

			// Validate email (required, valid format)
			const emailInput = contactForm.querySelector("input[name='email']");
			if (emailInput) {
				const errorSpan = emailInput.nextElementSibling;
				if (!emailInput.value.trim()) {
					errorSpan.textContent = "Email is required";
					errorSpan.style.display = "block";
					isValid = false;
					firstError = firstError || emailInput;
				} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
					errorSpan.textContent = "Please enter a valid email address";
					errorSpan.style.display = "block";
					isValid = false;
					firstError = firstError || emailInput;
				}
			}

			// Validate phone (optional, but must be valid if provided)
			const phoneInput = contactForm.querySelector("input[name='phone']");
			if (phoneInput && phoneInput.value.trim()) {
				const errorSpan = phoneInput.nextElementSibling;
				// Simple validation - at least 10 digits
				if (!/^[0-9]{10,15}$/.test(phoneInput.value.replace(/[^0-9]/g, ""))) {
					errorSpan.textContent = "Please enter a valid phone number";
					errorSpan.style.display = "block";
					isValid = false;
					firstError = firstError || phoneInput;
				}
			}

			// Validate message (required, minimum length)
			const messageInput = contactForm.querySelector("textarea[name='message']");
			if (messageInput) {
				const errorSpan = messageInput.nextElementSibling;
				if (!messageInput.value.trim()) {
					errorSpan.textContent = "Message is required";
					errorSpan.style.display = "block";
					isValid = false;
					firstError = firstError || messageInput;
				} else if (messageInput.value.trim().length < 10) {
					errorSpan.textContent = "Message must be at least 10 characters";
					errorSpan.style.display = "block";
					isValid = false;
					firstError = firstError || messageInput;
				}
			}

			// Prevent form submission if validation fails
			if (!isValid) {
				e.preventDefault();
				// Scroll to first error
				if (firstError) {
					firstError.focus();
					firstError.scrollIntoView({ behavior: "smooth", block: "center" });
				}
			}
		});

		// Real-time validation as user types
		formInputs.forEach((input) => {
			input.addEventListener("input", function () {
				const errorSpan = this.nextElementSibling;
				if (errorSpan && errorSpan.classList.contains("error-message")) {
					errorSpan.style.display = "none";
					errorSpan.textContent = "";
				}
			});
		});
	}
});
