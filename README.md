<!-- @format -->

## Digital Arts Technology Training Center (DATTC) Web Application Documentation

# Overview

    The DATTC web application is a responsive website for the Digital Arts Technology Training Center Inc., a TESDA-registered educational institution offering technical skills and vocational programs in digital arts and information technology. This Node.js web application serves as the institution's online presence, providing information about programs, facilities, and contact methods.

# Technical Architecture

    Frontend
        HTML/EJS: Uses EJS templating engine for dynamic content rendering
        CSS: Custom styling with responsive design using media queries
        JavaScript: Client-side interactivity with vanilla JavaScript
    Backend
        Node.js/Express: Server-side application framework
        Nodemailer: Email functionality for contact form submissions
        Express-Recaptcha: Integration with Google reCAPTCHA v3 for form security
        Express-Rate-Limit: Protection against form submission abuse
        XSS: Input sanitization for security

# Key Features

# Interactive UI Elements

    Responsive Navigation:
        Mobile-friendly hamburger menu
        Smooth scrolling to page sections
        Active state tracking during scroll

    Program Tabs:
        Tab-based content switching for different programs
        Animated transitions between content sections

    Facilities Gallery:
        Responsive grid layout with different image sizes
        Lightbox functionality for image viewing
        Navigation between gallery images

    Parallax Effects:
        Background parallax scrolling in hero section
        Mouse movement tracking for subtle interactive effects

# Form Handling

    Contact Form:
        Client-side validation with form-validation.js
        reCAPTCHA v3 integration for bot protection
        Rate limiting to prevent abuse
        Email notifications to administrators
        Confirmation emails to users

    Security Measures:

        Input sanitization using XSS library
        Form rate limiting
        CSRF protection
