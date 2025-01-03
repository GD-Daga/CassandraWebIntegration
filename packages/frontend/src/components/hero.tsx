import React from "react";
import "../assets/styles/ImageCarousel.css";

interface HeroProps {
  heroText: string;
  heroSubtext: string;
}

const HeroComponent: React.FC<HeroProps> = ({
  heroText = "",
  heroSubtext = "",
}) => {
  return (
    <div className="p-8 md:p-6">
      <h1 className="text-gray-900 text-3xl md:text-5xl font-extrabold mb-2 text-center">
        {heroText}
      </h1>
      <p className="text-lg text-mono font-normal text-black mb-6 text-center">
        {heroSubtext}
      </p>
    </div>
  );
};

export default HeroComponent;
