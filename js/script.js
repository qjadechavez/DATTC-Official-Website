/** @format */
document.addEventListener("DOMContentLoaded", function () {
	// Mobile menu functionality
	const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
	const navbar = document.getElementById("navbar");

	if (mobileMenuBtn && navbar) {
		mobileMenuBtn.addEventListener("click", function () {
			navbar.classList.toggle("active");

			// Toggle icon between bars and times
			const icon = this.querySelector("i");
			if (icon.classList.contains("fa-bars")) {
				icon.classList.remove("fa-bars");
				icon.classList.add("fa-times");
			} else {
				icon.classList.remove("fa-times");
				icon.classList.add("fa-bars");
			}
		});

		// Close menu when clicking outside
		document.addEventListener("click", function (e) {
			// If menu is open AND click is outside the navbar AND not on menu button
			if (navbar.classList.contains("active") && !navbar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
				navbar.classList.remove("active");

				// Reset icon
				const icon = mobileMenuBtn.querySelector("i");
				if (icon) {
					icon.classList.remove("fa-times");
					icon.classList.add("fa-bars");
				}
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
				if (navbar && navbar.classList.contains("active")) {
					navbar.classList.remove("active");
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
});
