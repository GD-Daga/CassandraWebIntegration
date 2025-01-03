import React, { useEffect } from "react";
import { useMap } from "react-leaflet";

const ZoomControl: React.FC = () => {
  const map = useMap();

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    if (event.deltaY < 0) {
      map.zoomIn();
    } else {
      map.zoomOut();
    }
  };

  useEffect(() => {
    map.getContainer().addEventListener("wheel", handleWheel);
    return () => {
      map.getContainer().removeEventListener("wheel", handleWheel);
    };
  }, [map]);

  return null;
};

export default ZoomControl;
