import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useLocation, useNavigate } from "react-router-dom";
import churchList from "../assets/data/churches.json";
import ZoomControl from "../components/ZoomControl";

// Define the custom icon for the church
const churchIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Define the custom icon for the range indicator
const rangeIndicatorIcon = L.divIcon({
  className: "range-indicator-icon",
  html: `<img src='/images/pin.png' />`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const DistrictMap: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const district = params.get("district");

  const [searchTerm, setSearchTerm] = useState("");

  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [selectedChurchName, setSelectedChurchName] = useState<string | null>(
    null
  );
  const [showAllChurches, setShowAllChurches] = useState<boolean>(false);

  const [mapCenter, setMapCenter] = useState<[number, number]>([
    1.3521, 103.8198,
  ]); // Singapore coordinates
  const [mapZoom, setMapZoom] = useState<number>(13); // Default zoom level

  const districts = Array.from(
    new Set(churchList.map((church) => church.district))
  );

  const filteredChurches =
    district === "All Churches"
      ? churchList
      : churchList.filter((church) => church.district === district);

  const churchesToShow = showAllChurches
    ? filteredChurches
    : filteredChurches.filter((church) => church.name === selectedChurchName);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredMenuItems = filteredChurches.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (showAllChurches) {
      setMapCenter([1.3521, 103.8198]);
      setMapZoom(13);
    } else {
      setMapZoom(15);
    }
  }, [showAllChurches]);

  const handleDistrictChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedDistrict = event.target.value;
    navigate(`/district-map?district=${encodeURIComponent(selectedDistrict)}`);
  };

  const handleSelectChurch = (church: (typeof churchList)[0]) => {
    if (selectedChurchName === church.name) {
      setSelectedChurchName(null);
      setShowAllChurches(true);
      setMapCenter([1.3521, 103.8198]);
      setMapZoom(13);
    } else {
      setSelectedChurchName(church.name);
      setMapCenter([church.lat, church.lon]);
      setMapZoom(15);
      setShowAllChurches(false);
    }
  };

  const handleCheckboxChange = () => {
    if (!showAllChurches) {
      setSelectedChurchName(null); // Deselect the selected church
      setShowAllChurches(true); // Show all churches
      setMapCenter([1.3521, 103.8198]); // Center the map on Singapore
      setMapZoom(13); // Adjust zoom level
    } else {
      setShowAllChurches(false);
    }
  };

  const MapUpdater: React.FC<{
    position: [number, number] | null;
    zoom: number;
    bounds: L.LatLngBounds | null;
  }> = ({ position, zoom, bounds }) => {
    const map = useMap();

    useEffect(() => {
      if (bounds) {
        map.fitBounds(bounds);
      } else if (position) {
        map.setView(position, zoom);
      }
    }, [position, zoom, bounds, map]);

    return null;
  };

  const selectedChurch = filteredChurches.find(
    (church) => church.name === selectedChurchName
  );

  // Create bounds if both user location and selected church exist
  const bounds =
    selectedChurch && userLocation
      ? L.latLngBounds([userLocation, [selectedChurch.lat, selectedChurch.lon]])
      : null;

  return (
    <div>
      <h1 className="text-center text-2xl font-bold my-4">
        {district === "All Churches"
          ? "All Churches"
          : `Churches in ${district}`}
      </h1>

      <div className="flex lg:p-8 pt-0 rounded-lg text-sm">
        <div className="w-full lg:w-1/4 bg-gray-200 p-4 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Search churches"
            value={searchTerm}
            onChange={handleSearch}
            className="mb-4 p-2 rounded border border-gray-300 text-mono"
          />
          <div className="">
            <label htmlFor="district-select" className="mr-2 text-mono">
              Choose a district:
            </label>
            <select
              id="district-select"
              className="p-2 border rounded"
              value={district || ""}
              onChange={handleDistrictChange}
            >
              <option value="All Churches">All Churches</option>
              {districts.map((dist, idx) => (
                <option key={idx} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          <div className="flex lg:hidden">
            <MapContainer
              center={[1.3521, 103.8198]}
              zoom={13}
              scrollWheelZoom={false}
              className="z-20 h-[400px] w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ZoomControl />
              <MapUpdater position={mapCenter} zoom={mapZoom} bounds={bounds} />
              {churchesToShow.map((church, idx) => (
                <Marker
                  key={idx}
                  position={[church.lat, church.lon]}
                  icon={churchIcon}
                  eventHandlers={{
                    click: () => handleSelectChurch(church),
                  }}
                >
                  <Popup>{church.name}</Popup>
                </Marker>
              ))}
              {selectedChurch && userLocation && (
                <Marker position={userLocation} icon={rangeIndicatorIcon}>
                  <Popup>
                    {/* Implement or remove this line as necessary */}
                    Distance to {selectedChurch.name}:{" "}
                    {/* Add distance calculation here */}
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
          <div className="flex items-center text-mono">
            <p className="font-bold mr-4">Churches Pin Location:</p>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showAllChurches}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <span>Show All</span>
            </label>
          </div>

          <div className="h-[500px] overflow-auto">
            <ul className="space-y-4">
              {filteredMenuItems.map((church, idx) => (
                <li
                  key={idx}
                  className={`mb-2 cursor-pointer bg-white p-4 border border-gray-300 ${
                    selectedChurchName === church.name ? "bg-gray-200" : ""
                  }`}
                  onClick={() => handleSelectChurch(church)}
                >
                  <p className="text-lg">{church.name}</p>
                  <p className="text-sm text-gray-500 text-mono">
                    {church.address}
                  </p>
                  <div className="text-sm text-black text-mono pt-4">
                    {" "}
                    Nearest MRT:{" "}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        church.nearest_mrt
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-500 underline"
                    >
                      {church.nearest_mrt}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="hidden lg:flex flex-1 bg-gray-300 items-center justify-center">
          <MapContainer
            center={[1.3521, 103.8198]}
            zoom={13}
            scrollWheelZoom={false}
            className="z-20 h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl />
            <MapUpdater position={mapCenter} zoom={mapZoom} bounds={bounds} />
            {churchesToShow.map((church, idx) => (
              <Marker
                key={idx}
                position={[church.lat, church.lon]}
                icon={churchIcon}
                eventHandlers={{
                  click: () => handleSelectChurch(church),
                }}
              >
                <Popup>{church.name}</Popup>
              </Marker>
            ))}
            {selectedChurch && userLocation && (
              <Marker position={userLocation} icon={rangeIndicatorIcon}>
                <Popup>
                  {/* Implement or remove this line as necessary */}
                  Distance to {selectedChurch.name}:{" "}
                  {/* Add distance calculation here */}
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default DistrictMap;
