"use client";

import React, { useState, useCallback } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import { MapPin, Navigation2, ZoomIn, ZoomOut } from "lucide-react";

interface MapProps {
  latitude: number;
  longitude: number;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const LocationMap: React.FC<MapProps> = ({ latitude, longitude }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const center = {
    lat: latitude || 0,
    lng: longitude || 0,
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleZoomIn = () => {
    if (map) {
      const currentZoom = map.getZoom() || 15;
      map.setZoom(currentZoom + 1);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      const currentZoom = map.getZoom() || 15;
      map.setZoom(currentZoom - 1);
    }
  };

  const handleRecenter = () => {
    if (map) {
      map.panTo(center);
    }
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
          <p className="text-gray-600 text-sm font-medium">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        }}
      >
        {latitude !== 0 && longitude !== 0 && (
          <>
            <Marker position={center} onClick={() => setShowInfo(true)} />

            {showInfo && (
              <InfoWindow
                position={center}
                onCloseClick={() => setShowInfo(false)}
              >
                <div className="p-2">
                  <p className="font-semibold text-gray-900 mb-1">
                    Property Location
                  </p>
                  <p className="text-xs text-gray-600">
                    Lat: {latitude.toFixed(6)}
                  </p>
                  <p className="text-xs text-gray-600">
                    Lng: {longitude.toFixed(6)}
                  </p>
                </div>
              </InfoWindow>
            )}
          </>
        )}
      </GoogleMap>

      {/* Custom Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="bg-white hover:bg-gray-50 p-2.5 rounded-lg shadow-lg border border-gray-200 transition-all hover:shadow-xl"
          title="Zoom in"
        >
          <ZoomIn className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={handleZoomOut}
          className="bg-white hover:bg-gray-50 p-2.5 rounded-lg shadow-lg border border-gray-200 transition-all hover:shadow-xl"
          title="Zoom out"
        >
          <ZoomOut className="w-5 h-5 text-gray-700" />
        </button>
        {latitude !== 0 && longitude !== 0 && (
          <button
            onClick={handleRecenter}
            className="bg-white hover:bg-gray-50 p-2.5 rounded-lg shadow-lg border border-gray-200 transition-all hover:shadow-xl"
            title="Recenter map"
          >
            <Navigation2 className="w-5 h-5 text-gray-700" />
          </button>
        )}
      </div>

      {/* Coordinates Badge */}
      {latitude !== 0 && longitude !== 0 && (
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center gap-2 text-xs">
            <MapPin className="w-4 h-4 text-sky-600" />
            <span className="font-mono text-gray-700">
              {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(LocationMap);
