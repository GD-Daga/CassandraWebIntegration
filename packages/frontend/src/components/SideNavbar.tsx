import React, { useRef, useEffect } from "react";

interface SideNavbarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideNavbar: React.FC<SideNavbarProps> = ({ isOpen, onClose }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen, onClose]);

  return (
    <div
      ref={sidebarRef}
      className={`fixed h-full bg-[#7c3732] w-64 shadow-md z-30 transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:relative lg:translate-x-0`}
    >
      <nav className="mt-4">
        <ul className="space-y-4">
          <li className="px-6 py-3 hover:bg-[#6b2e2e] rounded-md">
            <a href="/" className="flex items-center space-x-4 text-gray-300 hover:text-white">
            <img src="/icons/home.png" alt="Home Icon" className="h-6 w-6" />
              <span>Home</span>
            </a>
          </li>
          <li className="px-6 py-3 hover:bg-[#6b2e2e] rounded-md">
            <a href="/about" className="flex items-center space-x-4 text-gray-300 hover:text-white">
              <img src="/icons/info.png" alt="About Icon" className="h-6 w-6" />
              <span>About</span>
            </a>
          </li>
          <li className="px-6 py-3 hover:bg-[#6b2e2e] rounded-md">
            <a href="/contact" className="flex items-center space-x-4 text-gray-300 hover:text-white">
              <img src="/icons/location-mark.png" alt="Contact Icon" className="h-6 w-6" />
              <span>Contact</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideNavbar;
