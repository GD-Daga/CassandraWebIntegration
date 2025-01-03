import React from "react";
import CatholicChurches from "./quick-links/CatholicChurches";
import CurrencyExchange from "./quick-links/CurrencyExchange";
import Groceries from "./quick-links/Groceries";
import Restaurants from "./quick-links/Restaurants";

const Gallery: React.FC = () => {
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
