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
      <nav>
        <ul>
          <li className="px-6 py-2">
            <a href="/" className="text-gray-300 hover:text-white">
              Home
            </a>
          </li>
          <li className="px-6 py-2">
            <a href="/about" className="text-gray-300 hover:text-white">
              About
            </a>
          </li>
          <li className="px-6 py-2">
            <a href="/services" className="text-gray-300 hover:text-white">
              Blogs
            </a>
          </li>
          <li className="px-6 py-2">
            <a href="/contact" className="text-gray-300 hover:text-white">
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideNavbar;
