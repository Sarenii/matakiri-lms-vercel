import React from "react";
import Slider from "react-slick"; // Import Slider from react-slick
import "slick-carousel/slick/slick.css"; // Import slick-carousel default styles
import "slick-carousel/slick/slick-theme.css";
import "./../styles/heroSection.css";

function HeroSection() {
    const slides = [
        {
            id: 1,
            image: "/assets/images/hero 9.jpg",
            title: "Discover Your Potential with SomaNet",
            description:
                "Join thousands of learners on their journey to success. Explore our wide range of courses tailored to meet your goals.",
        },
        {
            id: 2,
            image: "/assets/images/hero 8.jpg",
            title: "Learn from the Best Instructors",
            description:
                "Our courses are designed and taught by industry experts with years of experience.",
        },
        {
            id: 3,
            image: "/assets/images/hero 7.jpg",
            title: "Achieve Your Goals with SomaNet",
            description:
                "Get certified and advance your career with our expert-designed programs.",
        },
    ];

    const settings = {
        dots: true,            // Enable dots below the slider
        infinite: true,        // Infinite loop of slides
        speed: 500,            // Transition speed
        slidesToShow: 1,       // Show one slide at a time
        slidesToScroll: 1,     // Scroll one slide at a time
        autoplay: true,        // Enable auto-play
        autoplaySpeed: 3000,   // Auto-play interval (3 seconds)
        arrows: false,         // Hide navigation arrows
    };

    return (
        <section className="hero-section">
            <Slider {...settings}>
                {slides.map((slide) => (
                    <div key={slide.id} className="hero-slide">
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="hero-slide__image"
                        />
                        <div className="hero-slide__content">
                            <h1 className="hero-slide__title">{slide.title}</h1>
                            <p className="hero-slide__description">{slide.description}</p>
                            <a href="/signup" className="hero-slide__button">Get Started</a>
                        </div>
                    </div>
                ))}
            </Slider>
        </section>
    );
}

export default HeroSection;
