import React from "react";
import "../assets/styles/card.css";

interface CardProps {
  title: string;
  description: string;
  linkText: string;
  linkUrl: string;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  linkText,
  linkUrl,
}) => {
  return (
    <div className="bg-[#7c3732] border-gray-200 rounded-lg p-8 md:p-12">
      <h2 className="text-white text-3xl font-extrabold mb-2">{title}</h2>
      <p className="text-mono text-lg text-white font-normal mb-4">
        {description}
      </p>
      <a
        href={linkUrl}
        className="text-white text-mono hover:underline font-medium text-lg inline-flex items-center"
      >
        {linkText}
        <svg
          className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
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
      </a>
    </div>
  );
};

export default Card;
