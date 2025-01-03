import React, { useState, useEffect } from "react";
import "../assets/styles/ImageCarousel.css";

interface ImageCarouselProps {
  images: string[];
  autoSlide?: boolean;
  autoSlideInterval?: number;
  height?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  autoSlide = true,
  autoSlideInterval = 3000,
  height = "300px",
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [transitioning, setTransitioning] = useState<boolean>(false);

  const nextSlide = () => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      setTransitioning(false);
    }, 300);
  };

//   const prevSlide = () => {
//     setTransitioning(true);
//     setTimeout(() => {
//       setCurrentIndex(
//         (prevIndex) => (prevIndex - 1 + images.length) % images.length
//       );
//       setTransitioning(false);
//     }, 300);
//   };

  useEffect(() => {
    if (autoSlide) {
      const slideInterval = setInterval(nextSlide, autoSlideInterval);
      return () => clearInterval(slideInterval);
    }
  }, [autoSlide, autoSlideInterval]);

  return (
    <div className="carousel-container" style={{ height }}>
      {/* <button className="prev" onClick={prevSlide}>
        ❮
      </button> */}
      <div className="carousel-slide">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index}`}
            className={`carousel-image ${
              index === currentIndex ? "active" : ""
            } ${index === currentIndex && transitioning ? "fade" : ""}`}
          />
        ))}
      </div>
      {/* <button className="next" onClick={nextSlide}>
        ❯
      </button> */}
    </div>
  );
};

export default ImageCarousel;
