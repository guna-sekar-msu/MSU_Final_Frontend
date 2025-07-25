// src/context/GeojsonProvider.jsx
import React, { createContext, useState, useContext } from "react";

// Create a Context
const GeojsonContext = createContext();

// Create a Provider Component
export const GeojsonProvider = ({ children }) => {
  const [geojsonLayer, setGeojsonLayer] = useState(null);
  const [geojsonLayer1,setGeojsonLayer1] = useState(null);

  return (
    <GeojsonContext.Provider value={{ geojsonLayer, setGeojsonLayer,geojsonLayer1,setGeojsonLayer1 }}>
      {children}
    </GeojsonContext.Provider>
  );
};

// Custom hook to use the GeoJSON context
export const useGeojson = () => useContext(GeojsonContext);
