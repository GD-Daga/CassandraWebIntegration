// Navbar.tsx
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
    <nav className="bg-[#7c3732] drop-shadow-lg sticky top-0 z-40">
      <div className="flex items-center justify-between mx-auto">
        <a href="#" className="flex items-center rtl:space-x-reverse">
          <img
            src="/tblogo.png"
            height={20}
            width={20}
            className="h-20 w-20"
            alt="Logo"
          />
          <span className="text-sm md:text-2xl font-semibold text-white whitespace-nowrap">
            Tabing Kanto Singapore
          </span>
        </a>

        <div className="flex-grow"></div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="pr-8 p-4 z-40 lg:hidden"
        >
          <span className="text-white text-2xl">
            <FontAwesomeIcon icon={faBars} />
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
