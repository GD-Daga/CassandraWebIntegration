import React, { useEffect, useState } from "react";
import CatholicChurches from "./quick-links/CatholicChurches";
import CurrencyExchange from "./quick-links/CurrencyExchange";
import Groceries from "./quick-links/Groceries";
import Restaurants from "./quick-links/Restaurants";

const Gallery: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="w-full h-fit bg-[#7c3732] rounded-lg p-4 md:p-8 gap-4">
        <h2 className="text-white text-2xl font-extrabold mb-4">Quick Links</h2>
        <div className="text-white font-semibold text-center">
          You must be logged in to use Quick Links. Please log in.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-fit bg-[#7c3732] rounded-lg p-4 md:p-8 gap-4">
      <h2 className="text-white text-2xl font-extrabold mb-4">Quick Links</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <CurrencyExchange />
        <CatholicChurches />
        <Restaurants />
        <Groceries />
      </div>
    </div>
  );
};

export default Gallery;
