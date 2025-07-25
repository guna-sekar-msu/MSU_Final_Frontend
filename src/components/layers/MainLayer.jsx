import React, { useState, useEffect,useRef } from 'react';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import esriConfig from '@arcgis/core/config';
import sendJsonData from '../../apiService';
import BgLoader from '../bg_loader';
import { useGeojson } from "../../context/GeojsonProvider"; // Import Context
import moment from 'moment-timezone'; // Import moment-timezone for date manipulation

import Graphic from '@arcgis/core/Graphic';
import Circle from '@arcgis/core/geometry/Circle';
import Point from '@arcgis/core/geometry/Point';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";

import { loadModules } from 'esri-loader';

import CORSMap from '../CORSMap';

const MainLayer = ({onLayerReady, symbolType, is3D, selectedDate,setBlobUrl,blobUrl,selectedLayer,selectedLayer1,selectedDate1,isComparisonChecked,Clr,view}) => {
  const { setGeojsonLayer } = useGeojson(); // Get setter from Context
  const [bg_loader, setBgLoader] = useState(true); // Loader state
  const [fetchedData, setFetchedData] = useState(null); // Store fetched data
  const [fetchedData1, setFetchedData1] = useState(null); // Store fetched data
  const [url1,seturl1]=useState(null);
  const stateLayerRef = useRef(null);
  const collect = useRef(null);


    const [quakeCounts, setQuakeCounts] = useState([]);
  const [selectedStates, setSelectedStates] = useState(new Set());
    const handleCheckboxChange = (state) => {
    setSelectedStates(prev => {
      const updated = new Set(prev);
      if (updated.has(state)) updated.delete(state);
      else updated.add(state);
      return updated;
    });
  };

  const [showDropDown,setshowDropDown]=useState(false);
  const [showTable, setshowTable] = useState(false); // default: visible





  const stateList=[
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana",
  "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina",
  "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
  ]

   // Store blob URL

  useEffect(() => {
    const formattedDate = moment(selectedDate).tz('America/Los_Angeles').format('YYYY-MM-DD');
    console.log('Formatted Date:', formattedDate);
    console.log()

    let input_data;  // Declare input_data outside the if-else blocks



    // Determine the correct input_data based on selectedLayer
    if (selectedLayer === 'Static JSON + STACOV File') {
      const date = selectedDate ? new Date(formattedDate) : new Date("2024-04-14");
      input_data = {
        date: date,
        options: 'Static JSON + STACOV File',
      };
    } else if (selectedLayer === 'Over All Site Info') {
      const date = selectedDate ? new Date(formattedDate) : new Date("2024-04-14");
      input_data = {
        date: date,
        options: 'Over All Site Info',
      };
    }else if(selectedLayer === 'Over All Vs MYCS2'){
      const date = selectedDate ? new Date(formattedDate) : new Date("2010-01-21");
      input_data = {
        date: date,
        options: 'Over All Vs MYCS2',
      };

    }else if(selectedLayer === 'OPUSNET Data'){
      const date = selectedDate ? new Date(formattedDate) : new Date("2018-10-28");
      input_data = {
        date: date,
        options: 'OPUSNET Data',
      };
    }
    else if(selectedLayer === 'MYCS2'){
      // const date = selectedDate ? new Date(formattedDate) : new Date("2010-01-02T00:00:00");
      input_data = {
        // date: date,
        options: 'MYCS2',
      };
    }
    else if(selectedLayer === 'IGS20_SIF'){
      // const date = selectedDate ? new Date(formattedDate) : new Date("2010-01-02T00:00:00");
      input_data = {
        // date: date,
        options: 'IGS20_SIF',
      };
    }
    else if(selectedLayer === 'opusnet'){
      // const date = selectedDate ? new Date(formattedDate) : new Date("2010-01-02T00:00:00");
      input_data = {
        // date: date,
        options: 'opusnet',
      };

    }else {
      const date = selectedDate ? new Date(formattedDate) : new Date("2024-04-14");
      input_data = {
        date: date,
        options: 'Static JSON + STACOV File',}
    }
    setBgLoader(true);
  

    sendJsonData(input_data)
      .then((response) => {
        const fetchedData = response.data;
        setFetchedData(fetchedData); // Store fetched data

        // Set API Key
        esriConfig.apiKey = 'AAPTxy8BH1VEsoebNVZXo8HurAU2wRtTCz35rS0IvyV5k0_FmOjKifjQ4MXaetOWAPxQ99ta0HCHYBSsLmJ-RxrEVoyLsT6hCItuii1Wq0Ctiu8ofOMIIcBYiR8_N3HQmOSC4MrerZZW_MiUovETiVP-I6qSZhn0k8qO1SF990cDX26ydD9ug32faqQlUjvebO0WHRrwPN3h0mdKEKlKMAZE8hjWCQHcEG7BM34DXJKiL7A.AT1_B2uSZ31B';

        // Create Blob from the fetched data
        const blob = new Blob([JSON.stringify(fetchedData)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);

        setBgLoader(false);
      })
      .catch((error) => {
        console.error('There was an error fetching STACOV data!', error);
        // setBgLoader(false);
        alert("Check the date and layer");
      });
      }, [selectedDate,selectedLayer]);




      





      useEffect(() => {

      
        const formattedDate = moment(selectedDate1).tz('America/Los_Angeles').format('YYYY-MM-DD');
        console.log('Formatted Date:', formattedDate);
      
        let input_data;  // Declare input_data outside the if-else blocks
      
        // Determine the correct input_data based on selectedLayer1
        if (selectedLayer1 === 'Static JSON + STACOV File') {
          const date = selectedDate1 ? new Date(formattedDate) : new Date("2024-04-14");
          input_data = {
            date: date,
            options: 'Static JSON + STACOV File',
          };
        } else if (selectedLayer1 === 'Over All Site Info') {
          const date = selectedDate1 ? new Date(formattedDate) : new Date("2024-04-14");
          input_data = {
            date: date,
            options: 'Over All Site Info',
          };
        } else if (selectedLayer1 === 'Over All Vs MYCS2') {
          const date = selectedDate1 ? new Date(formattedDate) : new Date("2010-01-21");
          input_data = {
            date: date,
            options: 'Over All Vs MYCS2',
          };
        }else if(selectedLayer1 === 'OPUSNET Data'){
          const date = selectedDate1 ? new Date(formattedDate) : new Date("2018-10-29");
          input_data = {
            date: date,
            options: 'OPUSNET Data',
          };
        }else if (selectedLayer1 === 'No Data Selected') {
          seturl1(null);
        }else {
      const date = selectedDate1 ? new Date(formattedDate) : new Date("2024-04-14");
      input_data = {
        date: date,
        options: 'Static JSON + STACOV File',}
        }
      
        setBgLoader(true);
        console.log("Selected layer1", selectedLayer1)
      
        // Fetch the data based on the input_data
        sendJsonData(input_data)
          .then((response) => {
            const fetchedData1 = response.data;
            setFetchedData1(fetchedData1); // Store fetched data
      
            // Set API Key
            esriConfig.apiKey = 'AAPTxy8BH1VEsoebNVZXo8HurAU2wRtTCz35rS0IvyV5k0_FmOjKifjQ4MXaetOWAPxQ99ta0HCHYBSsLmJ-RxrEVoyLsT6hCItuii1Wq0Ctiu8ofOMIIcBYiR8_N3HQmOSC4MrerZZW_MiUovETiVP-I6qSZhn0k8qO1SF990cDX26ydD9ug32faqQlUjvebO0WHRrwPN3h0mdKEKlKMAZE8hjWCQHcEG7BM34DXJKiL7A.AT1_B2uSZ31B';
      
            // Create Blob from the fetched data
            const blob = new Blob([JSON.stringify(fetchedData1)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            seturl1(url); // Set the blob URL for use
      
            setBgLoader(false); // Hide the loader once data is fetched
          })
          .catch((error) => {
            console.error('There was an error fetching STACOV data!', error);
            alert("Check the date and layer");
            setBgLoader(false); // Hide the loader if an error occurs
          });
      }, [selectedDate1, selectedLayer1,isComparisonChecked]); // Depend on selectedDate and selectedLayer1
      

  useEffect(() => {
    if (!fetchedData || !blobUrl) return; // Don't proceed until data and blob URL are ready

    if(!isComparisonChecked){
      console.log("gggggggggg",isComparisonChecked)
      setFetchedData1(null);
      seturl1(null);

    }

    const template = {
      title: 'Stacov Site Info',
      content: `<b>Site ID:</b> {SITEID}<br><b>Description:</b> {Description}<br><b>DOMES:</b> {DOMES}<br>`,
    };
    

    const renderer = (selectedLayer) === 'Over All Vs MYCS2'
    ? (is3D && symbolType === 'object'
        ? {
            type: 'unique-value',
            field: 'STATUS',
            uniqueValueInfos: [
              {
                value: 'MYCS2 Prediction',
                symbol: {
                  type: 'point-3d',
                  symbolLayers: [
                    {
                      type: 'object',
                      resource: { primitive: 'cylinder' },
                      material: { color: 'orange' },
                      width: 8000,
                      height: 80000,
                    },
                  ],
                },
                label: 'MYCS2 Prediction',
              },
              {
                value: 'Observation',
                symbol: {
                  type: 'point-3d',
                  symbolLayers: [
                    {
                      type: 'object',
                      resource: { primitive: 'cylinder' },
                      material: { color: 'green' },
                      width: 8000,
                      height: 80000,
                    },
                  ],
                },
                label: 'Observation',
              },
            ],
          }
        : {
            type: 'unique-value',
            field: 'STATUS',
            uniqueValueInfos: [
              {
                value: 'MYCS2 Prediction',
                symbol: {
                  type: 'simple-marker',
                  color: 'orange',
                  size: '10px',
                  outline: {
                    color: 'white',
                    width: 1,
                  },
                },
                label: 'MYCS2 Prediction',
              },
              {
                value: 'Observation',
                symbol: {
                  type: 'simple-marker',
                  color: 'green',
                  size: '10px',
                  outline: {
                    color: 'white',
                    width: 1,
                  },
                },
                label: 'Observation',
              },
            ],
          })
    : (is3D && symbolType === 'object'
        ? {
            type: 'unique-value',
            field: 'STATUS',
            uniqueValueInfos: [
              {
                value: 'Present',
                symbol: {
                  type: 'point-3d',
                  symbolLayers: [
                    {
                      type: 'object',
                      resource: { primitive: 'cylinder' },
                      material: { color: 'blue' },
                      width: 8000,
                      height: 80000,
                    },
                  ],
                },
                label: `Present (${fetchedData.status_count} | ${fetchedData1 ? fetchedData1.status_count : 0})`,
              },
              {
                value: 'Not Present',
                symbol: {
                  type: 'point-3d',
                  symbolLayers: [
                    {
                      type: 'object',
                      resource: { primitive: 'cylinder' },
                      material: { color: 'red' },
                      width: 8000,
                      height: 80000,
                    },
                  ],
                },
                label: `Not Present (${fetchedData.features.length - fetchedData.status_count} | ${fetchedData1 ? fetchedData1.features.length - fetchedData1.status_count : 0})`,
              },
            ],
          }
        : {
            type: 'unique-value',
            field: 'STATUS',
            uniqueValueInfos: [
              {
                value: 'Present',
                symbol: {
                  type: 'simple-marker',
                  style: 'triangle',
                  color: 'blue',
                  size: '10px',
                  outline: {
                    color: 'white',
                    width: 1,
                  },
                },
                label: `Present (${fetchedData.status_count} | (${fetchedData1 ? fetchedData1.status_count : 0}))`,
              },
              {
                value: 'Not Present',
                symbol: {
                  type: 'simple-marker',
                  color: 'red',
                  size: '8px',
                  outline: {
                    color: 'white',
                    width: 1,
                  },
                },
                label: `Not Present (${fetchedData.features.length - fetchedData.status_count} | ${fetchedData1 ? fetchedData1.features.length -fetchedData1.status_count : 0})`,
              },
            ],
          });



    const renderer1 = (selectedLayer1) === 'Over All Vs MYCS2'
    ? (is3D && symbolType === 'object'
        ? {
            type: 'unique-value',
            field: 'STATUS',
            uniqueValueInfos: [
              {
                value: 'MYCS2 Prediction',
                symbol: {
                  type: 'point-3d',
                  symbolLayers: [
                    {
                      type: 'object',
                      resource: { primitive: 'cylinder' },
                      material: { color: 'purple' },
                      width: 8000,
                      height: 80000,
                    },
                  ],
                },
                label: 'MYCS2 Prediction',
              },
              {
                value: 'Observation',
                symbol: {
                  type: 'point-3d',
                  symbolLayers: [
                    {
                      type: 'object',
                      resource: { primitive: 'cylinder' },
                      material: { color: 'black' },
                      width: 8000,
                      height: 80000,
                    },
                  ],
                },
                label: 'Observation',
              },
            ],
          }
        : {
            type: 'unique-value',
            field: 'STATUS',
            uniqueValueInfos: [
              {
                value: 'MYCS2 Prediction',
                symbol: {
                  type: 'simple-marker',
                  color: 'yellow',
                  size: '10px',
                  outline: {
                    color: 'white',
                    width: 1,
                  },
                },
                label: 'MYCS2 Prediction',
              },
              {
                value: 'Observation',
                symbol: {
                  type: 'simple-marker',
                  color: 'green',
                  size: '10px',
                  outline: {
                    color: 'white',
                    width: 1,
                  },
                },
                label: 'Observation',
              },
            ],
          })
    : (is3D && symbolType === 'object'
        ? {
            type: 'unique-value',
            field: 'STATUS',
            uniqueValueInfos: [
              {
                value: 'Present',
                symbol: {
                  type: 'point-3d',
                  symbolLayers: [
                    {
                      type: 'object',
                      resource: { primitive: 'cylinder' },
                      material: { color: 'pink' },
                      width: 8000,
                      height: 80000,
                    },
                  ],
                },
                label: `Present (${fetchedData.status_count} | ${fetchedData1 ? fetchedData1.status_count : 0})`,
              },
              {
                value: 'Not Present',
                symbol: {
                  type: 'point-3d',
                  symbolLayers: [
                    {
                      type: 'object',
                      resource: { primitive: 'cylinder' },
                      material: { color: 'cyan' },
                      width: 8000,
                      height: 80000,
                    },
                  ],
                },
                label: `Not Present (${fetchedData.features.length - fetchedData.status_count} | ${fetchedData1 ? fetchedData1.features.length - fetchedData1.status_count :0})`,
              },
            ],
          }
        : {
            type: 'unique-value',
            field: 'STATUS',
            uniqueValueInfos: [
              {
                value: 'Present',
                symbol: {
                  type: 'simple-marker',
                  style: 'triangle',
                  color: 'pink',
                  size: '10px',
                  outline: {
                    color: 'white',
                    width: 1,
                  },
                },
                label: `Present (${fetchedData.status_count} | ${fetchedData1 ? fetchedData1.status_count :0})`,
              },
              {
                value: 'Not Present',
                symbol: {
                  type: 'simple-marker',
                  color: 'cyan',
                  size: '8px',
                  outline: {
                    color: 'white',
                    width: 1,
                  },
                },
                label: `Not Present (${fetchedData.features.length - fetchedData.status_count} | ${fetchedData1 ? fetchedData1.features.length - fetchedData1.status_count: 0})`,
              },
            ],
          });

        // Create GeoJSONLayer
    const stateLayer = new FeatureLayer({
      url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/2",
      outFields: ["*"]
      
    });
    stateLayerRef.current = stateLayer;
  
    // Create GeoJSONLayer
    const geojsonLayer = new GeoJSONLayer({
      url: blobUrl,
      popupTemplate: template,
      renderer: renderer,
      orderBy: {
        field: 'STATUS',
      },
      title: "GeoJSON Layer 1"
    });
        // Create GeoJSONLayer
    const geojsonLayer1 = new GeoJSONLayer({
        url: url1,
        popupTemplate: template,
        renderer: renderer1,
        orderBy: {
        field: 'STATUS',
        },
        title: "GeoJSON Layer 2" 
    });


  //   if (!window.require) {
  //     console.error("ArcGIS API not loaded. Make sure the CDN script is included in index.html.");
  //     return;
  //   }

  //  // load ShapefileLayer from the JSAPI CDN
  //   loadModules(
  //     ["esri/layers/ShapefileLayer"],
  //     { url: "https://js.arcgis.com/4.29/" }
  //   )
  //     .then(([ShapefileLayer]) => {
  //       const shpLayer = new ShapefileLayer({
  //         url: "http://127.0.0.1:9000/gadm41_USA_shp.zip", // your ZIP in public/
  //         title: "USA State Boundaries",
  //         renderer: {
  //           type: "simple",
  //           symbol: {
  //             type: "simple-fill",
  //             color: [0, 120, 200, 0.4],
  //             outline: { color: "#000", width: 1 },
  //           },
  //       }
  //     });

  //   });


    // Emit event when layer is ready
    setGeojsonLayer(geojsonLayer); // Update global geojsonLayer
    collect.current=geojsonLayer;

    const createGraphicsLayer = (fetchedData, is3D, symbolType, layerColor) => {
      const graphicsLayer = new GraphicsLayer();
    
      // Loop through fetched data and create uncertainty graphics
      fetchedData.features.forEach((feature) => {
        const point = new Point({
          latitude: feature.geometry.coordinates[1],
          longitude: feature.geometry.coordinates[0],
        });
    
        const uncertaintyRadius = Math.max(...feature.geometry.Uncertainty) * 1e6;
        const uncertaintyCircle = new Circle({
          center: point,
          radius: uncertaintyRadius,
          radiusUnit: "meters",
        });
    
        const fillSymbol = new SimpleFillSymbol({
          color: [255, 0, 0, 0.3],
          outline: { color: [255, 0, 0, 0.8], width: 1 },
        });
    
        const circleGraphic = new Graphic({ geometry: uncertaintyCircle, symbol: fillSymbol });
    
        // Create a marker symbol for the lat/lon point
        const markerSymbol = is3D && symbolType === 'object'
          ? {
              type: 'point-3d', // Use 3D point symbol
              symbolLayers: [
                {
                  type: 'object', // Use object layer for 3D symbols
                  resource: { primitive: 'cylinder' }, // 3D shape
                  material: { color: layerColor }, // Dynamic color based on layer
                  height: 30000, // Height of the cylinder
                  width: 1000, // Diameter of the cylinder
                },
              ],
            }
          : {
              type: 'simple-marker', // Style for the marker
              color: layerColor, // Marker color
              outline: {
                color: [255, 255, 255], // White outline
                width: 2,
              },
              size: '10px', // Size of the marker
            };

            
    
        const pointGraphic = new Graphic({ geometry: point, symbol: markerSymbol });
    
        // Add the uncertainty circle and point marker to the graphics layer
        graphicsLayer.add(circleGraphic);
        graphicsLayer.add(pointGraphic);
      });
    
      return graphicsLayer;
    };
    
    if ((selectedLayer === 'OPUSNET Data' && fetchedData.uncertainty)
         && 
    (selectedLayer1 === 'OPUSNET Data' && fetchedData1.uncertainty))
     {
    // alert("gotcha");
    // console.log("hgfghfghgfhffhfgh");
    // Load both layers
    const graphicsLayer1 = createGraphicsLayer(fetchedData, is3D, symbolType, [0, 110, 51]);
    const graphicsLayer2 = createGraphicsLayer(fetchedData1, is3D, symbolType, 'black');
    if (onLayerReady) {
        onLayerReady([geojsonLayer, geojsonLayer1, graphicsLayer1, graphicsLayer2,stateLayer]);
    }
}
 else if (selectedLayer1 === 'OPUSNET Data' && fetchedData1.uncertainty) {
    const graphicsLayer = createGraphicsLayer(fetchedData1, is3D, symbolType, 'black');
    if (onLayerReady) {
        onLayerReady([geojsonLayer, geojsonLayer1, graphicsLayer,stateLayer]);
    }
} 
else if (selectedLayer === 'OPUSNET Data' && fetchedData.uncertainty) {
    const graphicsLayer = createGraphicsLayer(fetchedData, is3D, symbolType, [0, 110, 51]);
    if (onLayerReady) {
        onLayerReady([geojsonLayer,geojsonLayer1, graphicsLayer,stateLayer]);
    }

} else {
    if (onLayerReady) {
        onLayerReady([geojsonLayer,geojsonLayer1,stateLayer]);
    }
}

    
    
  }, [fetchedData,fetchedData1, blobUrl,url1, is3D, symbolType, onLayerReady,isComparisonChecked,selectedLayer,selectedLayer1,Clr]);

  useEffect(() => {

 
    if (!view|| !stateLayerRef.current || !collect.current ) return;
   

    // const view = view;
    const stateLayer = stateLayerRef.current;
    const earthquakeLayer = collect.current;

    


    if (selectedStates.size === 0) {
      view.graphics.removeAll();
      setQuakeCounts([]);
      setshowTable(false);
      return;
    }

    if(selectedStates.size !=0){
      setshowTable(true);
    }

    const query = stateLayer.createQuery();
    query.where = `STATE_NAME IN (${[...selectedStates].map(s => `'${s}'`).join(", ")})`;
    query.returnGeometry = true;
    query.outFields = ["*"];


    stateLayer.queryFeatures(query).then(({ features }) => {
      view.graphics.removeAll();
      

      earthquakeLayer.queryFeatures().then(({ features: quakeFeatures }) => {
        const newCounts = features.map(stateFeature => {
          const stateGeom = stateFeature.geometry;
          const stateName = stateFeature.attributes.state_name || "Unknown" ;

          const allStateAttributes = features.map(f => f.attributes);
          console.log("🗂️ Selected State Attributes:", allStateAttributes);

          view.graphics.add(new Graphic({
            geometry: stateGeom,
            symbol: {
              type: "simple-fill",
              color: [0, 255, 245, 0.15],
              outline: { color: [0, 128, 255], width: 2 }
            }
          }));
            const matchingStations = quakeFeatures.filter(q =>
            geometryEngine.contains(stateGeom, q.geometry)
          );

                  // 🧾 Log each station's attributes
        console.log(`🧾 All Stations in ${stateName}:`);
        matchingStations.forEach((station, index) => {
          console.log(`📍 Station ${index + 1}:`, station.attributes);
        });


            const coordinates = matchingStations.map(q => {
            const { x, y } = q.geometry; // assuming Point geometry
            return { x, y }; // or use { lat, lon } depending on spatial reference
          });

          const count = quakeFeatures.filter(q =>
            geometryEngine.contains(stateGeom, q.geometry)
          ).length;

          return { stateName, count,coordinates };
        });

        setQuakeCounts(newCounts);
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",newCounts);
      });
    });

  }, [selectedStates,fetchedData]);

  return bg_loader ? <BgLoader /> : (
    <div>
      {/* Render map or other UI elements here */}
      {/* Example: */}
      {/* <h2>STACOV Layer Loaded Successfully</h2> */}
      {/* <CORSMap blobUrl={blobUrl}/> */}
      <div>
<div className='absolute -mt-10'>
  <div className="relative mb-4">
  <button
    onClick={() => setshowDropDown(prev => !prev)}
    className="text-xl bg-blue-300 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition"
  >
    Select State ▼
  </button>

  {showDropDown && (
        <div
          id="dropdownContainer"
          className="absolute bottom-full z-10 mt-2 max-h-80 overflow-y-auto border border-gray-300 rounded-md shadow-lg bg-white p-4 w-64"
        >
          {stateList.map(state => (
            <label key={state} className="block text-sm text-gray-700 mb-2">
              <input
                type="checkbox"
                value={state}
                onChange={() => handleCheckboxChange(state)}
                checked={selectedStates.has(state)}
                className="mr-2 accent-blue-600"                                          
              />
              {state}
            </label>
          ))}
        </div>
  )}
</div>
  </div>        


      {/* <div id="dropdownContainer" className="dropdown">
        {stateList.map(state => (
          <label key={state}>
            <input
              type="checkbox"
              value={state}
              onChange={() => handleCheckboxChange(state)}
              checked={selectedStates.has(state)}
            />
            {state}<br />
          </label>
        ))}
      </div> */}

      <div id="viewDiv" ></div>

      <div id="customLegend" className="legend">
        <b>Legend</b>
        <div style={{ marginTop: "5px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{
              width: "20px", height: "20px", background: "rgba(0,255,255,0.25)",
              border: "2px solid rgb(0,128,255)", marginRight: "8px"
            }}></div>
            Selected States
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: "5px" }}>
            <div style={{
              width: "12px", height: "12px", background: "red",
              border: "1px solid white", borderRadius: "50%", marginRight: "8px"
            }}></div>
            Stations
          </div>
        </div>
      </div>



      {showTable && (
        <div
        id="earthquakeCountBox"
        className="fixed bottom-20 right-6 z-20 bg-white border border-gray-300 shadow-lg rounded-lg p-4 w-80 max-h-80 overflow-y-auto"
      >
        <b className="block text-lg mb-2">Stations per Selected State</b>
      <button 
          onClick={() => {
            setSelectedStates(new Set()); // Clear all selected states
            setshowTable(false); // Hide the table
          }}
          className="text-gray-500 hover:text-gray-700 text-xl font-bold right-7"
          aria-label="Close"
        >
          &times;
      </button>
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border-b border-gray-300 pb-1">State</th>
              <th className="border-b border-gray-300 pb-1 text-right">Count</th>
            </tr>
          </thead>
          <tbody>
            {quakeCounts.map(({ stateName, count }) => (
              <tr key={stateName}>
                <td className="py-1">{stateName}</td>
                <td className="py-1 text-right">{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      )}

      


    </div>
    </div>
  );
};

export default MainLayer;