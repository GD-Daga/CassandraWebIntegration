import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import churchList from "../../assets/data/churches.json";

const CatholicChurches: React.FC = () => {
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [openDistrict, setOpenDistrict] = useState<string | null>(null);
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);

  const districts = Array.from(new Set(churchList.map((church) => church.district)));

  const getChurchesByDistrict = (district: string) => {
    return churchList.filter((church) => church.district === district);
  };

  const handleDistrictToggle = (district: string) => {
    if (openDistrict === district) {
      setOpenDistrict(null);
    } else {
      setOpenDistrict(district);
    }
  };

  const handleChurchSelect = (churchName: string) => {
    setShowDistrictModal(false);
    navigate(`/district-map?district=${encodeURIComponent(selectedDistrict || '')}&church=${encodeURIComponent(churchName)}`);
  };

  const handleDistrictClick = (district: string) => {
    setSelectedDistrict(district);
    handleDistrictToggle(district);
  };

  // Handle clicks outside the modal to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowDistrictModal(false);
      }
    };

    if (showDistrictModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDistrictModal]);

  return (
    <div>
      {/* Main Card */}
      <div
        className="relative flex items-center justify-center flex-col cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105"
        onClick={() => setShowDistrictModal(true)}
      >
        <img
          className="w-full h-[200px] object-cover rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105"
          src="/images/church.jpg"
          alt="Catholic Churches"
        />
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          Catholic Churches around Singapore
        </div>
      </div>

      {/* District Selection Modal */}
      {showDistrictModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white p-4 rounded-lg w-[90%] md:w-[50%] relative"
            ref={modalRef}
          >
            <h3 className="text-xl font-bold mb-4">Select a District</h3>
            <ul>
              {districts.map((district, idx) => (
                <li key={idx} className="mb-4">
                  <div
                    className="flex items-center justify-between cursor-pointer text-blue-500"
                    onClick={() => handleDistrictClick(district)}
                  >
                    <span>{district}</span>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`transition-transform ${openDistrict === district ? 'rotate-180' : ''}`}
                    />
                  </div>
                  {openDistrict === district && (
                    <ul className="ml-4 mt-2">
                      {getChurchesByDistrict(district).map((church) => (
                        <li
                          key={church.name}
                          className="cursor-pointer mb-1"
                          onClick={() => handleChurchSelect(church.name)}
                        >
                          {church.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              <li className="mb-4">
                <div
                  className="flex items-center justify-between cursor-pointer text-blue-500"
                  onClick={() => {
                    setSelectedDistrict("All Churches");
                    navigate(`/district-map?district=All%20Churches`);
                  }}
                >
                  <span>All Churches</span>
                </div>
              </li>
            </ul>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setShowDistrictModal(false)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatholicChurches;
