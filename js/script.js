/** @format */
document.addEventListener("DOMContentLoaded", function () {
	const heroVideo = document.querySelector(".hero-video");

	// Parallax effect on scroll
	window.addEventListener("scroll", function () {
		const scrollPosition = window.pageYOffset;
		const heroSection = document.querySelector(".hero");
		const heroHeight = heroSection.offsetHeight;

		// Only apply parallax when in view
		if (scrollPosition <= heroHeight) {
			const translateY = scrollPosition * 0.2; // Adjust speed (higher = faster)
			heroVideo.style.transform = `translate3d(0, ${translateY}px, 0)`;

			// Optional: add opacity effect
			const opacity = 1 - (scrollPosition / heroHeight) * 1.2;
			heroSection.style.opacity = Math.max(opacity, 0);
		}
	});
});
