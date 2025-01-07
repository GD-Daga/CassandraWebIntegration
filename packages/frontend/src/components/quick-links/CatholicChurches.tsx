import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import churchList from "../../assets/data/churches.json";

const CatholicChurches: React.FC = () => {
  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All Churches");
  const [openDistrict, setOpenDistrict] = useState<string | null>(null);
  const [showBookmarksModal, setShowBookmarksModal] = useState(false);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState<{ type: string; text: string } | null>(null);
  const navigate = useNavigate();
  const districtModalRef = useRef<HTMLDivElement>(null);
  const bookmarksModalRef = useRef<HTMLDivElement>(null);

  const username = localStorage.getItem("username") || "guest";

  const districts = ["All Churches", ...Array.from(new Set(churchList.map((church) => church.district)))];

  const getChurchesByDistrict = (district: string) => {
    return district === "All Churches" ? churchList : churchList.filter((church) => church.district === district);
  };

  const handleDistrictToggle = (district: string) => {
    setSelectedDistrict(district);
    setOpenDistrict((prev) => (prev === district ? null : district));
  };

  const handleChurchSelect = (churchName: string) => {
    setShowDistrictModal(false);
    navigate(`/district-map?district=${encodeURIComponent(selectedDistrict || '')}&church=${encodeURIComponent(churchName)}`);
  };

  const handleViewBookmarkOnMap = (bookmark: any) => {
    setShowBookmarksModal(false);
    navigate(`/district-map?district=${encodeURIComponent(bookmark.district)}&church=${encodeURIComponent(bookmark.church_name)}`);
  };

  const handleAddBookmark = async (church: any) => {
    if (bookmarks.some((b) => b.church_name === church.name)) {
      setToastMessage({ type: "error", text: `${church.name} is already bookmarked!` });
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/bookmarks/add-bookmark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, church }),
      });

      if (!response.ok) {
        throw new Error('Failed to add bookmark');
      }

      setBookmarks((prev) => [...prev, { church_name: church.name, district: church.district, address: church.address }]);

      // Show success notification
      setToastMessage({
        type: "success",
        text: `${church.name} has been successfully added to your bookmarks!`,
      });
    } catch (error) {
      setToastMessage({ type: "error", text: "Failed to add bookmark. Please try again." });
      console.error("Error adding bookmark:", error);
    } finally {
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const response = await fetch(`http://localhost:5000/bookmarks/get-bookmarks?username=${username}`);
      if (!response.ok) {
        throw new Error('Failed to fetch bookmarks');
      }
      const data = await response.json();
      setBookmarks(data.bookmarks);
    } catch (error) {
      setToastMessage({ type: "error", text: "Failed to fetch bookmarks." });
      console.error("Error fetching bookmarks:", error);
    }
  };

  const handleDeleteBookmark = async (churchName: string) => {
    try {
      const response = await fetch('http://localhost:5000/bookmarks/remove-bookmark', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, church_name: churchName }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete bookmark');
      }

      setBookmarks((prev) => prev.filter((bookmark) => bookmark.church_name !== churchName));
      setToastMessage({ type: "success", text: `${churchName} has been removed from your bookmarks.` });
    } catch (error) {
      setToastMessage({ type: "error", text: "Failed to delete bookmark. Please try again." });
      console.error("Error deleting bookmark:", error);
    } finally {
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleViewBookmarks = async () => {
    await fetchBookmarks();
    setShowBookmarksModal(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (districtModalRef.current && !districtModalRef.current.contains(event.target as Node)) {
        setShowDistrictModal(false);
      }
      if (bookmarksModalRef.current && !bookmarksModalRef.current.contains(event.target as Node)) {
        setShowBookmarksModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      {/* Main Card */}
      <div
        className="relative flex items-center justify-center flex-col cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-100"
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
          <div className="bg-white p-4 rounded-lg w-[90%] md:w-[50%] relative max-h-[80vh] overflow-y-auto" ref={districtModalRef}>
            <h3 className="text-xl font-bold mb-4">Select a District</h3>
            <button className="mb-2 text-blue-600" onClick={handleViewBookmarks}>
              View Bookmarked Churches
            </button>

            {/* Notification Toast Inside Modal */}
            {toastMessage && (
              <div
                className={`absolute top-2 right-2 z-50 p-2 rounded shadow-lg text-white text-sm ${
                  toastMessage.type === "success" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {toastMessage.text}
              </div>
            )}

            <ul className="space-y-4">
              {districts.map((district, idx) => (
                <li key={idx} className="border-b pb-2">
                  <div
                    className="flex items-center justify-between cursor-pointer text-blue-500"
                    onClick={() => handleDistrictToggle(district)}
                  >
                    <span>{district}</span>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`transition-transform ${openDistrict === district ? 'rotate-180' : ''}`}
                    />
                  </div>
                  {openDistrict === district && (
                    <ul className="ml-4 mt-2 max-h-[300px] overflow-y-auto border rounded p-2 bg-gray-50">
                      {getChurchesByDistrict(district).map((church) => (
                        <li key={church.name} className="mb-2">
                          <div className="flex justify-between items-center">
                            <span className="cursor-pointer" onClick={() => handleChurchSelect(church.name)}>
                              {church.name}
                            </span>
                            <button
                              className="text-sm text-green-500 ml-4"
                              onClick={() => handleAddBookmark(church)}
                            >
                              Bookmark
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
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

      {/* Bookmarked Churches Modal */}
      {showBookmarksModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-[90%] md:w-[50%] relative max-h-[80vh] overflow-y-auto" ref={bookmarksModalRef}>
            <h3 className="text-xl font-bold mb-4">Bookmarked Churches</h3>
            <ul className="space-y-2">
              {bookmarks.length > 0 ? (
                bookmarks.map((bookmark, idx) => (
                  <li key={idx} className="flex justify-between items-center">
                    <span className="text-blue-600">{bookmark.church_name}</span> - {bookmark.address}
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-500 text-sm"
                        onClick={() => handleViewBookmarkOnMap(bookmark)}
                      >
                        View on Map
                      </button>
                      <button
                        className="text-red-500 text-sm"
                        onClick={() => handleDeleteBookmark(bookmark.church_name)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <p>No bookmarks found.</p>
              )}
            </ul>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setShowBookmarksModal(false)}
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
