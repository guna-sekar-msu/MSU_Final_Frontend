import React, { useState, useEffect } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import  Tour from "reactour"; // Import React Tour

const SiteStats = ({
  setSelectedLayer,
  setCoordinates,
  setSelectedDateInParent,
  setguidelines,
  setSelectedLayer1,
  setSelectedDate1InParent,
  setIsComparisonChecked,
  isComparisonChecked
}) => {
  const [selectedOption, setSelectedOption] = useState("Select data");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [comparisonOption, setComparisonOption] = useState("Select comparison data");
  const [selectedDate1, setSelectedDate1] = useState(new Date());
  const [isTourOpen, setIsTourOpen] = useState(true); // State to control the tour visibility

  const defaultDates = {
    "Static JSON + STACOV File": new Date("2024-04-15"),
    "Over All Site Info": null,
    "Over All Vs MYCS2": new Date("2010-01-02"),
    "OPUSNET Data": new Date("2018-10-28"),
    "MYCS2":null,
    "IGS20_SIF":null,
    "opusnet":null
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    setSelectedLayer(option);
    if (defaultDates[option]) {
      setSelectedDate(defaultDates[option]);
      setSelectedDateInParent(defaultDates[option]);
    }
  };

  const handleComparisonSelect = (option) => {
    setComparisonOption(option);
    setSelectedLayer1(option);
    if (defaultDates[option]) {
      setSelectedDate1(defaultDates[option]);
      setSelectedDate1InParent(defaultDates[option]);
    }
  };

  const handleCoordinateSearch = () => {
    if (lat && lon && !isNaN(lat) && !isNaN(lon)) {
      setCoordinates({ lat: parseFloat(lat), lon: parseFloat(lon) });
    } else {
      alert("Please enter valid numeric values for latitude and longitude.");
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedDateInParent(date);
  };

  const handleDateChange1 = (date) => {
    setSelectedDate1(date);
    setSelectedDate1InParent(date);
  };

  const showDateFilter = selectedOption !== "Select data" && selectedOption !== "Over All Site Info";
  const showDateFilter1 = comparisonOption !== "Select comparison data" && comparisonOption !== "Over All Site Info";

  // const handleCompare = () => {};

  useEffect(() => {
    if (!isComparisonChecked) {
      setComparisonOption("Select comparison data");
      setSelectedLayer1("Select data");
      setSelectedDate1(new Date());
    }
  }, [isComparisonChecked]);
  const handleguidelines = () => {
    setguidelines(true);
    setIsTourOpen(true);
  };

  // Define steps for the React Tour
  const steps = [
    {
      selector: ".choose-dataset", // Target the 'Choose Dataset' header
      content: "Here you can choose a dataset for analysis."
    },
    {
      selector: ".dropdown-menu", // Target the dataset dropdown
      content: "Select your desired dataset from this dropdown."
    },
    {
      selector: ".comparison-checkbox", // Target the comparison checkbox
      content: "Enable comparison to select an additional dataset for comparison."
    },
    {
      selector: ".date-picker", // Target the date picker
      content: "Select a date to filter the dataset."
    },
   
    {
      selector: ".coordinate-search", // Target the coordinate search section
      content: "Enter latitude and longitude to search for a location."
    }
  ];


  return (
    <div className="site-stats p-4 space-y-6">
      <Tour steps={steps} isOpen={isTourOpen} onRequestClose={() => setIsTourOpen(false)} />
      <h3 className="text-lg font-bold choose-dataset">Choose Dataset</h3>
      <div className="flex items-center space-x-2 dropdown-menu">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              {selectedOption}
              <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" />
            </MenuButton>
          </div>
          <MenuItems className="absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            {["Static JSON + STACOV File", "Over All Site Info", "Over All Vs MYCS2", "OPUSNET Data","MYCS2","IGS20_SIF","opusnet"]
              .filter((option) => !(comparisonOption === "Over All Site Info" && option === "Over All Site Info"))
              .map((option) => (
                <MenuItem key={option}>
                  {({ active }) => (
                    <a
                      href="#"
                      onClick={() => handleSelect(option)}
                      className={`block px-4 py-2 text-sm ${active ? "bg-gray-100 text-gray-900" : "text-gray-700"}`}
                    >
                      {option}
                    </a>
                  )}
                </MenuItem>
              ))}
          </MenuItems>
        </Menu>

        <div className="flex items-center comparison-checkbox">
          <input
            type="checkbox"
            id="comparison"
            checked={isComparisonChecked}
            onChange={() => setIsComparisonChecked(!isComparisonChecked)}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
          />
          <label htmlFor="comparison" className="ml-2 text-sm text-gray-700">
            Comparison
          </label>
        </div>
      </div>

      {showDateFilter && (
        <div className="date-picker">
          <label className="block text-gray-700 text-sm font-bold mb-2">Select Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            className="block w-full p-2 border rounded"
            dateFormat="yyyy/MM/dd"
          />
        </div>
      )}

      {isComparisonChecked && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Choose Comparison Dataset</h3>
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                {comparisonOption}
                <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" />
              </MenuButton>
            </div>
            <MenuItems className="absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              {["No Data Selected", "Static JSON + STACOV File", "Over All Site Info", "Over All Vs MYCS2", "OPUSNET Data","opusnet"]
                .filter((option) => !(selectedOption === "Over All Site Info" && option === "Over All Site Info"))
                .map((option) => (
                  <MenuItem key={option}>
                    {({ active }) => (
                      <a
                        href="#"
                        onClick={() => handleComparisonSelect(option)}
                        className={`block px-4 py-2 text-sm ${active ? "bg-gray-100 text-gray-900" : "text-gray-700"}`}
                      >
                        {option}
                      </a>
                    )}
                  </MenuItem>
                ))}
            </MenuItems>
          </Menu>
        </div>
      )}

      {showDateFilter1 && isComparisonChecked && (
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Select Date:</label>
          <DatePicker
            selected={selectedDate1}
            onChange={handleDateChange1}
            className="block w-full p-2 border rounded"
            dateFormat="yyyy/MM/dd"
          />
        </div>
      )}

      <div className="coordinate-search">
        <h3 className="text-lg font-bold">Coordinate Search</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Latitude:</label>
            <input
              type="number"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="Enter Latitude"
              className="block w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700">Longitude:</label>
            <input
              type="number"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              placeholder="Enter Longitude"
              className="block w-full p-2 border rounded"
            />
          </div>
          <button
            type="button"
            onClick={handleCoordinateSearch}
            className="w-full p-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-white rounded-md"
          >
            Search
          </button>
        </div>
      </div>

      {setguidelines && (
        <div className="fixed bottom-5 right-5 z-50">
          <button
            onClick={handleguidelines}
            className="p-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-white font-bold rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
          >
            Tutorial
          </button>
        </div>
      )}
    </div>
  );
};

export default SiteStats;

