import React, { useEffect, useRef, useState } from 'react';
import '@arcgis/core/assets/esri/themes/light/main.css';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import SceneView from '@arcgis/core/views/SceneView';
import Search from '@arcgis/core/widgets/Search';
import Widgets from './layers/Widgets'; // Widgets Component
import StacovFile from './layers/StacovFile';
import Overall from './layers/Overall';
import OPUSnet from './layers/OPUSnet';
import OverallVsMycs2 from './layers/OverallVsMycs2';
import BgLoader from './bg_loader';
import esriRequest from '@arcgis/core/request';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';
import MainLayer from './layers/MainLayer';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel';
import SnappingControls from "@arcgis/core/widgets/support/SnappingControls";
import Expand from "@arcgis/core/widgets/Expand";
const CORSMap = ({ selectedLayer = null, is3D = false, selectedDate, Coordinates,selectedLayer1,selectedDate1,isComparisonChecked }) => {
  const mapRef = useRef(null); // Map container reference
  const viewRef = useRef(null); // Ref for storing the map view (2D or 3D)
  const [map, setMap] = useState(null); // State to store map instance
  const [symbolType, setSymbolType] = useState('icon'); // State for symbol type
  const [isMapLoaded, setIsMapLoaded] = useState(false); // State to track map loading
  const layerUrlRef = useRef(null); // Ref to store the layer URL

  const [blobUrl, setBlobUrl] = useState(null);

  const markerLayer = useRef(null);
  const [hasMarkers, setHasMarkers] = useState(false);
  const sketchVMRef = useRef(null);


  const[Clr,setClr]=useState(true);//Newly added Layer



  // const[templayer,setTemplayer]=useState([]);//Newly added Layer

  

  useEffect(() => {
    const mapInstance = new Map({
      basemap: 'gray-vector',
    });

    const view = is3D
      ? new SceneView({
          container: mapRef.current,
          map: mapInstance,
          center: [-99.7129, 37.0902], // Default center for 3D
          zoom: 4,
        })
      : new MapView({
          container: mapRef.current,
          map: mapInstance,
          center: [-95.7129, 37.0902], // Default center for 2D
          zoom: 3,
        });
        const markerLayerInstance = new GraphicsLayer();
        mapInstance.add(markerLayerInstance);
        markerLayer.current = markerLayerInstance;

    view.when(() => {
      setIsMapLoaded(true); // Mark map as loaded
    });

    viewRef.current = view;
    setMap(mapInstance);

    return () => {
      if (view) {
        view.destroy();
      }
    };
  }, [is3D]);

  const handleLayerReady = (layers) => {
    if (map) {
      map.layers.removeAll();
      // map.add(layer);

      // Add the new layers
      layers.forEach(layer => {
        map.add(layer);
      });

      // Update the URL only if it changes
      if (layers.url !== layerUrlRef.current) {
        layerUrlRef.current = layers.url; // Update the ref
        addSearchWidget(viewRef.current, layers.url);
      }
    }
  };

  const addSearchWidget = (view, url) => {
    // Check if a Search widget already exists
    const existingSearchWidget = view.ui.find('customSearchWidget');
    if (existingSearchWidget) {
      view.ui.remove(existingSearchWidget); // Remove the existing widget
    }
  
    const customSearchSource = {
      placeholder: 'Search by SITEID',
      getSuggestions: (params) => {
        return esriRequest(url, {
          responseType: 'json',
        }).then((results) => {
          return results.data.features
            .filter((feature) => feature.properties.SITEID.includes(params.suggestTerm))
            .map((feature) => ({
              key: feature.properties.SITEID,
              text: feature.properties.SITEID,
              sourceIndex: params.sourceIndex,
            }));
        });
      },
      getResults: (params) => {
        return esriRequest(url, {
          responseType: 'json',
        }).then((results) => {
          const filteredFeatures = results.data.features.filter(
            (feature) => feature.properties.SITEID === params.suggestResult.text.trim()
          );
  
          return filteredFeatures.map((feature) => {
            const graphic = new Graphic({
              geometry: new Point({
                x: feature.geometry.coordinates[0],
                y: feature.geometry.coordinates[1],
              }),
              attributes: feature.properties,
            });
  
            const buffer = geometryEngine.geodesicBuffer(graphic.geometry, 100, 'meters');
            const propertiesString = Object.entries(feature.properties)
              .slice(0, -1)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ');
  
            return {
              extent: buffer.extent,
              feature: graphic,
              name: propertiesString,
            };
          });
        });
      },
    };
  
    const searchWidget = new Search({
      view: view,
      sources: [customSearchSource],
    });
  
    searchWidget.id = 'customSearchWidget'; // Assign an ID to the widget for future reference
    view.ui.add(searchWidget, {
      position: 'top-right',
    });
  };

  useEffect(() => {
    
    if (viewRef.current && map && blobUrl) {
      console.log("blobUrl",blobUrl)
      // Always add the search widget as soon as the map and view are available
      addSearchWidget(viewRef.current, blobUrl);
    }
    else if(viewRef.current){
      const existingSearchWidget = viewRef.current.ui.find('customSearchWidget');
      if (existingSearchWidget) {
        viewRef.current.ui.remove(existingSearchWidget); // Remove the old widget if it exists
      }
    }
console.log("kasjbhdiuhdiu",viewRef);

  }, [map, viewRef.current,blobUrl,selectedLayer]);
  
  useEffect(() => {
    if (Coordinates && viewRef.current && markerLayer.current) {
      const lat = Coordinates.lat;
      const lon = Coordinates.lon;
      const point = new Point({
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        spatialReference: { wkid: 4326 },
      });

      const markerSymbol = {
        type: 'simple-marker',
        style: 'circle',
        color: [255, 0, 0],
        size: 12,
        outline: {
          color: [255, 255, 255],
          width: 2,
        },
      };

      const marker = new Graphic({
        geometry: point,
        symbol: markerSymbol,
      });

      markerLayer.current.removeAll();
      markerLayer.current.add(marker);
      setHasMarkers(true); // Set hasMarkers to true when a marker is added

      viewRef.current.goTo({
        center: point,
        zoom: 10,
      });
    }
  }, [Coordinates]);
  useEffect(() => {
    if(!is3D){
      if (!viewRef.current || sketchVMRef.current) {
        return; // Prevent reinitialization if already created
      }
      const sketchVM = new SketchViewModel({
        view: viewRef.current,
        layer: markerLayer.current,
      });

       //       // Add SnappingControls to handle snapping
      const snappingControls = new SnappingControls({
        view: viewRef.current,
        // Sets the widget to use the SketchViewModel's SnappingOptions
        snappingOptions: sketchVM.snappingOptions
      });

//       // Add the SnappingControls to an Expand widget to hide/show the widget
      const snappingExpand = new Expand({
        view: viewRef.current,
        content: snappingControls,
        expanded: false,
        expandIcon: "configure",
        expandTooltip: "Snapping Controls"
      });
      viewRef.current.when(() => {
        // //         // Configure the UI to use the default property values from our SketchViewModel
                
              });
        
        //       viewRef.current.ui.add(stylerExpand, "top-right"); // Add the calcite panel
              viewRef.current.ui.add(snappingExpand, "bottom-left"); // Add the Expand with SnappingControls widget
                  }
  
  }, [is3D]);

  const clearMarkers = () => {
    if (markerLayer.current) {
      markerLayer.current.removeAll();
      setHasMarkers(false); // Set hasMarkers to false when markers are cleared
      
    }
  };

  const handleSymbolChange = (event) => {
    setSymbolType(event.target.value);
  };

  const toggleFullscreen = () => {
    if (mapRef.current) {
      if (!document.fullscreenElement) {
        mapRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };
  // console.log("cors..........................................................",templayer);

  // const renderLayerComponent = () => {
  //   switch (selectedLayer) {
  //     case 'Static JSON + STACOV File':
  //       return <StacovFile onLayerReady={handleLayerReady} symbolType={symbolType} is3D={is3D} />;
  //     case 'Over All Site Info':
  //       return <Overall onLayerReady={handleLayerReady} symbolType={symbolType} is3D={is3D} />;
  //     case 'OPUSNET Data':
  //       return <OPUSnet onLayerReady={handleLayerReady} symbolType={symbolType} is3D={is3D} />;
  //     case 'Over All Vs MYCS2':
  //       return <OverallVsMycs2 onLayerReady={handleLayerReady} symbolType={symbolType} is3D={is3D} />;
  //     default:
  //       if (map) {
  //         map.layers.removeAll();
  //       }
  //       return null;
  //   }
  // };
  const renderLayerComponent = () => {
    return (
      <MainLayer 
        onLayerReady={handleLayerReady} 
        selectedLayer={selectedLayer} 
        selectedDate={selectedDate} 
        symbolType={symbolType} 
        is3D={is3D} 
        setBlobUrl={setBlobUrl} 
        blobUrl={blobUrl}
        
        
        selectedLayer1={selectedLayer1}
        selectedDate1={selectedDate1}

        isComparisonChecked={isComparisonChecked}


        Clr={Clr}
        view={viewRef.current}
        map={map}
        markerLayer={markerLayer.current}
      />
    );
  };

  return (
    <div>
      <div className="cors-map" style={{ position: 'relative' }}>
        <div ref={mapRef} className="h-[88vh] w-full"></div>

        {/* Widgets */}
        {isMapLoaded && (
          <Widgets view={viewRef.current} onToggleFullscreen={toggleFullscreen} is3D={is3D} setClr={setClr} isComparisonChecked={isComparisonChecked}/>
        )}
        {hasMarkers && (
          <button onClick={clearMarkers} className="absolute bottom-16 left-1/2 bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600">
            Clear Markers
          </button>
        )}
        {/* {Clr && (
          <button
            onClick={() => {
              setClr(false);
            }}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-4 bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
          >
            Clear
          </button>
        )} */}


        {/* Render the selected layer component */}
        {renderLayerComponent()}
      </div>

      {/* Control Panel */}
      {is3D && (
        <div
          style={{
            position: 'absolute',
            top: 400,
            right: 18,
            padding: 12,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
          }}
        >
          Show points as:
          <div>
            <input
              type="radio"
              name="symbolType"
              value="icon"
              checked={symbolType === 'icon'}
              onChange={handleSymbolChange}
            />
            <label htmlFor="asIcon">2D shape</label>
          </div>
          <div>
            <input
              type="radio"
              name="symbolType"
              value="object"
              checked={symbolType === 'object'}
              onChange={handleSymbolChange}
            />
            <label htmlFor="asObject">3D shape</label>
          </div>
        </div>
      )}
    </div>
  );
};

export default CORSMap;

