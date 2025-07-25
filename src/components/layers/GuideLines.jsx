import React, { useState } from 'react';

const GuideLines = ({ setguidelines }) => {
  const [currentStep, setCurrentStep] = useState(0); // Tracks the current step in the tutorial
  const totalSteps = 5; // You can adjust this based on the number of steps

  // Updated Step contents
  const steps = [
    {
      title: 'Welcome to the CORS Site Tutorial',
      content: 'In this tutorial, we will guide you through the key features of the CORS Dashboard and Geospatial Data.',
    },
    {
      title: 'CORS Site Overview',
      content: 'The CORS Dashboard provides information about various monitoring stations and their data, including site performance and geospatial data.',
    },
    {
      title: 'Step 1: View Site Information',
      content: 'Select a monitoring station to view detailed information about its location, operational status, and geospatial data.',
    },
    {
      title: 'Step 2: Explore Geospatial Data',
      content: 'Click on the geospatial map to explore data layers and visualize station locations, performance trends, and other site-specific details.',
    },
    {
      title: 'Step 3: Filter and Analyze Data',
      content: 'Use the filtering options to narrow down the dataset by time, region, or other parameters to analyze the monitoring station performance more effectively.',
    },
  ];

  // Handle Next button click
  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle Previous button click
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle Skip button click
  const handleSkip = () => {
    setCurrentStep(totalSteps - 1); // Skips to the last step
    setguidelines(false);
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center px-4"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/924824/pexels-photo-924824.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`, // Set the image as background
        backgroundSize: 'cover', // Ensure the image covers the entire screen
        backgroundPosition: 'center', // Center the image
      }}
    >
      {/* Overlay to darken the background and improve readability */}
      {/* <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div> */}

      {/* Container */}
      <div className="p-8 max-w-3xl w-full relative z-10">
        {/* Glowing Title */}
        <h1 className="text-white text-6xl font-bold mb-20 text-center glow-text">
          {steps[currentStep].title}
        </h1>

        {/* Glowing Content */}
        <p className="text-white mb-20 text-2xl glow-text text-center">
          {steps[currentStep].content}
        </p>

        {/* Buttons */}
        <div className="flex justify-between">
          {/* Previous Button */}
          <button
            onClick={handlePrevStep}
            className={`px-6 py-2 bg-blue-500/80 text-white rounded-lg transition-all duration-300 ${
              currentStep === 0
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-600 hover:scale-105'
            }`}
            disabled={currentStep === 0}
          >
            Previous
          </button>

          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="px-6 py-2 bg-gray-500/80 text-white rounded-lg transition-all duration-300 hover:bg-gray-600 hover:scale-105"
          >
            Skip
          </button>

          {/* Next Button */}
          <button
            onClick={handleNextStep}
            className={`px-6 py-2 bg-blue-500/80 text-white rounded-lg transition-all duration-300 ${
              currentStep === totalSteps - 1
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-600 hover:scale-105'
            }`}
            disabled={currentStep === totalSteps - 1}
          >
            Next
          </button>
        </div>
      </div>

      {/* Inject Glow Text CSS */}
      <style>
        {`
          .glow-text {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4);
          }
        `}
      </style>
    </div>
  );
};

export default GuideLines;
