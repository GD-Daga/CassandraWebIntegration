import React from "react";
import "../assets/styles/card.css";

interface CardProps {
  title: string;
  description: string;
  linkText: string;
  linkUrl: string;
}

const Card: React.FC<CardProps> = ({ title, description, linkText, linkUrl }) => {
  const handleButtonClick = () => {
    window.location.href = linkUrl; // Redirect when button is clicked
  };

  return (
    <div className="bg-[#7c3732] border-gray-200 rounded-lg p-8 md:p-12 shadow-md hover:shadow-lg transition-shadow duration-300">
      <h2 className="text-white text-3xl font-extrabold mb-2">{title}</h2>
      <p className="text-lg text-white font-normal mb-6">{description}</p>

      <button
        onClick={handleButtonClick}
        className="bg-white text-[#7c3732] hover:bg-[#592925] hover:text-white font-medium text-lg inline-flex items-center justify-center py-2 px-4 rounded-lg transition-colors duration-300"
      >
        {linkText}
        <svg
          className="w-4 h-4 ml-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
      </button>
    </div>
  );
};

export default Card;
