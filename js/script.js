/** @format */
document.addEventListener("DOMContentLoaded", function () {
	// Mobile menu functionality
	const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
	const navbar = document.getElementById("navbar");

	if (mobileMenuBtn && navbar) {
		mobileMenuBtn.addEventListener("click", () => {
			navbar.classList.toggle("active");
		});
	}

	// Header scroll effect
	const header = document.querySelector("header");
	window.addEventListener("scroll", () => {
		if (window.scrollY > 50) {
			header.classList.add("scrolled");
		} else {
			header.classList.remove("scrolled");
		}
	});

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
});
