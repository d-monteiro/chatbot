import React, { useState, useEffect } from "react";

const slides = [
  "/slideshow/OIP.jpg",
  "/slideshow/Untitled-design-23.jpg",
  "/slideshow/R.png"
];

const BackgroundSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-20" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${slide})` }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40 z-0" />
    </div>
  );
};

export default BackgroundSlideshow;
