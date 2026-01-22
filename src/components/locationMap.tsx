"use client";

import React, { useState, useCallback, useEffect } from "react";
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
  onMarkerDrag?: (lat: number, lng: number) => void;
  draggable?: boolean;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const LocationMap: React.FC<MapProps> = ({ 
  latitude, 
  longitude, 
  onMarkerDrag,
  draggable = false 
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [markerPosition, setMarkerPosition] = useState({ lat: latitude, lng: longitude });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const center = {
    lat: latitude || 0,
    lng: longitude || 0,
  };

  // Update marker position when latitude/longitude props change
  useEffect(() => {
    if (latitude !== 0 && longitude !== 0) {
      setMarkerPosition({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude]);

  const handleMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();
      setMarkerPosition({ lat: newLat, lng: newLng });
      if (onMarkerDrag) {
        onMarkerDrag(newLat, newLng);
      }
    }
  }, [onMarkerDrag]);

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
        {markerPosition.lat !== 0 && markerPosition.lng !== 0 && (
          <>
            <Marker 
              position={markerPosition} 
              onClick={() => setShowInfo(true)}
              draggable={draggable}
              onDragEnd={handleMarkerDragEnd}
              icon={draggable ? {
                url: 'data:image/svg+xml;base64,' + btoa(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#3b82f6"/>
                    <circle cx="12" cy="9" r="2.5" fill="white"/>
                  </svg>
                `),
                scaledSize: new google.maps.Size(40, 50),
                anchor: new google.maps.Point(20, 50),
              } : undefined}
            />

            {showInfo && (
              <InfoWindow
                position={markerPosition}
                onCloseClick={() => setShowInfo(false)}
              >
                <div className="p-2">
                  <p className="font-semibold text-gray-900 mb-1">
                    Property Location
                  </p>
                  <p className="text-xs text-gray-600">
                    Lat: {markerPosition.lat.toFixed(6)}
                  </p>
                  <p className="text-xs text-gray-600">
                    Lng: {markerPosition.lng.toFixed(6)}
                  </p>
                  {draggable && (
                    <p className="text-xs text-sky-600 mt-1 font-medium">
                      💡 Drag the marker to adjust location
                    </p>
                  )}
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
      {markerPosition.lat !== 0 && markerPosition.lng !== 0 && (
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center gap-2 text-xs">
            <MapPin className="w-4 h-4 text-sky-600" />
            <span className="font-mono text-gray-700">
              {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
            </span>
          </div>
          {draggable && (
            <p className="text-xs text-gray-500 mt-1">
              Drag marker to adjust
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(LocationMap);
