/** @format */

document.addEventListener("DOMContentLoaded", function () {
	// Elements to animate during scroll
	const heroSection = document.querySelector(".hero");
	const heroContent = document.querySelector(".hero-content");
	const heroVideo = document.querySelector(".hero-video");
	const heroOverlay = document.querySelector(".hero-overlay");
	const heroHeadings = document.querySelectorAll(".hero-content h1");
	const heroParagraph = document.querySelector(".hero-content p");
	const heroButtons = document.querySelector(".hero-btns");

	// For smoother animations, use requestAnimationFrame
	let lastScrollPosition = 0;
	let ticking = false;

	// Apply initial animations (subtle entrance effect)
	if (heroContent) {
		// Set initial states with slight offset for entrance animation
		heroHeadings.forEach((heading, index) => {
			heading.style.opacity = "0";
			heading.style.transform = "translateY(20px)";
			heading.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";

			// Staggered delay for each heading
			setTimeout(() => {
				heading.style.opacity = "1";
				heading.style.transform = "translateY(0)";
			}, 300 + index * 200);
		});

		if (heroParagraph) {
			heroParagraph.style.opacity = "0";
			heroParagraph.style.transform = "translateY(20px)";
			heroParagraph.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";

			setTimeout(() => {
				heroParagraph.style.opacity = "1";
				heroParagraph.style.transform = "translateY(0)";
			}, 800);
		}

		if (heroButtons) {
			heroButtons.style.opacity = "0";
			heroButtons.style.transform = "translateY(20px)";
			heroButtons.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";

			setTimeout(() => {
				heroButtons.style.opacity = "1";
				heroButtons.style.transform = "translateY(0)";
			}, 1000);
		}
	}

	// Function to handle parallax effect on scroll with performant animation
	function handleScrollAnimations(scrollPosition) {
		const windowHeight = window.innerHeight;
		const heroHeight = heroSection ? heroSection.offsetHeight : windowHeight;

		// Calculate how far into the hero section we've scrolled (0 to 1)
		const scrollPercent = Math.min(scrollPosition / heroHeight, 1);

		// More dramatic parallax effect
		if (scrollPosition <= heroHeight * 1.5) {
			// Enhanced content movement with cubic-bezier easing
			if (heroContent) {
				// Apply vertical translation only - no scale change
				const contentTranslate = scrollPosition * 0.5; // 50% speed (more dramatic)
				const contentOpacity = 1 - scrollPercent * 1.8; // Faster fade out

				heroContent.style.transform = `translate3d(0, -${contentTranslate}px, 0)`;
				heroContent.style.opacity = Math.max(contentOpacity, 0);
			}

			// Enhanced video movement - vertical movement only
			if (heroVideo) {
				// Slower movement creates more depth
				const videoTranslate = scrollPosition * 0.2;

				heroVideo.style.transform = `translate3d(0, -${videoTranslate}px, 0)`;
			}

			// Enhanced overlay effect
			if (heroOverlay) {
				// More complex gradient for better visual interest
				const baseOpacity = 0.6;
				const overlayOpacity = baseOpacity + scrollPercent * 0.4;
				const gradientDirection = scrollPercent > 0.5 ? "135deg" : "to right";

				heroOverlay.style.background = `linear-gradient(${gradientDirection}, 
                    rgba(0, 0, 0, ${Math.min(overlayOpacity, 0.95)}), 
                    rgba(0, 0, 0, ${Math.min(overlayOpacity - 0.15, 0.8)}))`;
			}

			// Apply a subtle vertical shift to the hero section instead of tilt
			if (heroSection) {
				const shiftAmount = scrollPercent * 10; // 10px maximum shift
				heroSection.style.transform = `translateY(${shiftAmount}px)`;
			}
		}
	}

	// More efficient scroll handler using requestAnimationFrame
	function onScroll() {
		lastScrollPosition = window.pageYOffset;

		if (!ticking) {
			window.requestAnimationFrame(() => {
				handleScrollAnimations(lastScrollPosition);
				ticking = false;
			});

			ticking = true;
		}
	}

	// Throttled resize handler for responsive adjustments
	let resizeTimeout;
	function onResize() {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => {
			handleScrollAnimations(window.pageYOffset);
		}, 100);
	}

	// Add event listeners
	window.addEventListener("scroll", onScroll, {passive: true});
	window.addEventListener("resize", onResize, {passive: true});

	// Initialize on page load
	setTimeout(() => {
		handleScrollAnimations(window.pageYOffset);
	}, 100);
});
