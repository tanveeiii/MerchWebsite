"use client";
import React, { useState } from "react";
import { NavbarFinal } from "@/components/Navbar"; // Using path alias
import Footer from "@/components/Footer"; // Using path alias
import {
  Palette,
  Type,
  Image as ImageIcon,
  Check,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Upload, // Added for image upload
} from "lucide-react";

// --- SVG T-Shirt Components ---
// Updated "half-sleeve" and "longer" T-Shirt SVGs
const TShirtFrontSvg = ({ color }) => (
  <svg
    viewBox="0 0 500 600" // Made viewBox taller
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full drop-shadow-lg"
  >
    <path
      fill={color}
      stroke="#777"
      strokeWidth="3"
      // New path for a more realistic half-sleeve shirt
      d="M120,100 L50,130 L20,200 L100,250 L100,550 L400,550 L400,250 L480,200 L450,130 L380,100 Q250,180 120,100 Z"
    />
    {/* Collar stitch */}
    <path
      fill="none"
      stroke="#777"
      strokeWidth="2"
      opacity="0.6"
      d="M120,100 Q250,180 380,100"
    />
  </svg>
);

const TShirtBackSvg = ({ color }) => (
  <svg
    viewBox="0 0 500 600" // Made viewBox taller
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full drop-shadow-lg"
  >
    <path
      fill={color}
      stroke="#777"
      strokeWidth="3"
      // New path for the back (higher neckline)
      d="M120,100 L50,130 L20,200 L100,250 L100,550 L400,550 L400,250 L480,200 L450,130 L380,100 Q250,120 120,100 Z"
    />
  </svg>
);

// --- Customization Overlay Component ---
const CustomizationOverlay = ({ customization }) => {
  const { text, graphic } = customization;

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
      {/* Custom Graphic - Now an <img> tag */}
      {graphic.content && (
        <img
          src={graphic.content}
          alt="Custom Graphic"
          className="absolute object-contain"
          style={{
            top: `${graphic.y}%`,
            left: `${graphic.x}%`,
            width: `${graphic.scale * 20}%`, // Scale a bit differently for images
            transform: `translate(-50%, -50%) rotate(${graphic.rotation}deg)`,
            userSelect: "none",
            cursor: "move",
          }}
        />
      )}
      {/* Custom Text */}
      {text.content && (
        <div
          className="absolute text-4xl font-bold text-center"
          style={{
            top: `${text.y}%`,
            left: `${text.x}%`,
            fontFamily: text.font,
            color: text.color, // Use dynamic text color
            textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
            transform: `translate(-50%, -50%) scale(${text.scale}) rotate(${text.rotation}deg)`,
            userSelect: "none",
            cursor: "move",
            whiteSpace: "pre",
          }}
        >
          {text.content}
        </div>
      )}
    </div>
  );
};

// --- Main Page Component ---
const CustomizedPage = () => {
  // --- State Variables ---
  const [shirtColor, setShirtColor] = useState("#ffffff");
  const [activeSide, setActiveSide] = useState("front");
  const [activeTab, setActiveTab] = useState("color");

  const initialCustomization = {
    text: { content: "", x: 50, y: 40, scale: 1, font: "Arial", color: "#000000", rotation: 0 },
    graphic: { content: null, x: 50, y: 55, scale: 5, rotation: 0 }, // Default scale for images
  };

  const [customizations, setCustomizations] = useState({
    front: { ...initialCustomization },
    back: { ...initialCustomization },
  });

  // --- Data for Options ---
  const colors = [
    { name: "White", hex: "#ffffff" },
    { name: "Black", hex: "#000000" },
    { name: "Navy", hex: "#0d3c59" },
    { name: "Red", hex: "#c41e3a" },
    { name: "Grey", hex: "#9ca3af" },
    { name: "Yellow", hex: "#fde047" },
    { name: "Green", hex: "#166534" },
    { name: "Blue", hex: "#2563eb" },
    { name: "Purple", hex: "#7e22ce" },
    { name: "Orange", hex: "#f97316" },
    { name: "Pink", hex: "#ec4899" },
    { name: "Brown", hex: "#78350f" },
  ];
  
  const fonts = ["Arial", "Verdana", "Impact", "Courier New", "Georgia", "Times New Roman", "Comic Sans MS"];

  // --- Helper Functions ---
  const resetCustomization = () => {
    setCustomizations({
      front: {
        text: { content: "", x: 50, y: 40, scale: 1, font: "Arial", color: "#000000", rotation: 0 },
        graphic: { content: null, x: 50, y: 55, scale: 5, rotation: 0 },
      },
      back: {
        text: { content: "", x: 50, y: 40, scale: 1, font: "Arial", color: "#000000", rotation: 0 },
        graphic: { content: null, x: 50, y: 55, scale: 5, rotation: 0 },
      },
    });
    setShirtColor("#ffffff");
    setActiveSide("front");
    setActiveTab("color");
  };

  // Generic handler for sliders (scale, rotation)
  const handleSliderChange = (property, value) => {
    if (activeTab === "color") return;
    const newValue = parseFloat(value);
    
    setCustomizations(prev => ({
      ...prev,
      [activeSide]: {
        ...prev[activeSide],
        [activeTab]: {
          ...prev[activeSide][activeTab],
          [property]: newValue,
        },
      },
    }));
  };

  // Generic handler for position buttons
  const handleTransform = (property, change) => {
    if (activeTab === "color") return;

    setCustomizations((prev) => {
      const current = prev[activeSide][activeTab];
      let newValue = current[property] + change;
      if (property === 'x' || property === 'y') {
        newValue = Math.max(0, Math.min(100, newValue));
      }
      return {
        ...prev,
        [activeSide]: {
          ...prev[activeSide],
          [activeTab]: {
            ...current,
            [property]: newValue,
          },
        },
      };
    });
  };

  const handleTextChange = (e) => {
    const newContent = e.target.value;
    setCustomizations(prev => ({
      ...prev,
      [activeSide]: {
        ...prev[activeSide],
        text: { ...prev[activeSide].text, content: newContent }
      }
    }));
  };

  const handleTextColorChange = (e) => {
    const newColor = e.target.value;
    setCustomizations(prev => ({
      ...prev,
      [activeSide]: {
        ...prev[activeSide],
        text: { ...prev[activeSide].text, color: newColor }
      }
    }));
  };
  
  const handleFontChange = (e) => {
    const newFont = e.target.value;
    setCustomizations(prev => ({
      ...prev,
      [activeSide]: {
        ...prev[activeSide],
        text: { ...prev[activeSide].text, font: newFont }
      }
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        setCustomizations(prev => ({
          ...prev,
          [activeSide]: {
            ...prev[activeSide],
            graphic: { ...prev[activeSide].graphic, content: imageUrl }
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setCustomizations(prev => ({
      ...prev,
      [activeSide]: {
        ...prev[activeSide],
        graphic: { ...prev[activeSide].graphic, content: null, scale: 5, rotation: 0 }
      }
    }));
  };

  // --- Render Functions for Tabs ---
  const renderColorPicker = () => (
    <div className="grid grid-cols-6 gap-3">
      {colors.map((color) => (
        <button
          key={color.name}
          title={color.name}
          onClick={() => setShirtColor(color.hex)}
          className={`w-12 h-12 rounded-full border-2 transition-all ${
            shirtColor === color.hex ? "border-blue-500 scale-110" : "border-gray-200"
          }`}
          style={{ backgroundColor: color.hex }}
        >
          {shirtColor === color.hex && (
            <Check className="w-6 h-6 m-auto" style={{ color: color.hex === '#000000' || color.hex === '#0d3c59' ? '#fff' : '#000' }} />
          )}
        </button>
      ))}
    </div>
  );

  const renderTextEditor = () => (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="customText" className="font-medium text-gray-700 block mb-2">
          Enter your text:
        </label>
        <textarea
          id="customText"
          value={customizations[activeSide].text.content}
          onChange={handleTextChange}
          maxLength={50}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Your Text Here"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="fontSelect" className="font-medium text-gray-700 block mb-2">
            Font:
          </label>
          <select
            id="fontSelect"
            value={customizations[activeSide].text.font}
            onChange={handleFontChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {fonts.map(font => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="textColor" className="font-medium text-gray-700 block mb-2">
            Color:
          </label>
          <input
            id="textColor"
            type="color"
            value={customizations[activeSide].text.color}
            onChange={handleTextColorChange}
            className="w-full h-10 px-1 py-1 border border-gray-300 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );

  const renderGraphicPicker = () => (
    <div className="flex flex-col gap-4 items-center">
      <label
        htmlFor="imageUpload"
        className="w-full flex flex-col items-center justify-center px-6 py-10 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
      >
        <Upload className="w-10 h-10 text-gray-400 mb-2" />
        <span className="font-medium text-blue-600">Click to upload</span>
        <span className="text-sm text-gray-500">(PNG, JPG, SVG)</span>
      </label>
      <input
        id="imageUpload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
      {customizations[activeSide].graphic.content && (
        <button
          onClick={clearImage}
          className="text-sm text-gray-500 hover:text-red-500"
        >
          Clear Image
        </button>
      )}
    </div>
  );

  const renderTransformControls = () => {
    const currentItem = customizations[activeSide][activeTab];
    if (!currentItem) return null;
    
    // Use different min/max/step for text vs graphic scale
    const isText = activeTab === 'text';
    const scaleMin = isText ? 0.5 : 1;
    const scaleMax = isText ? 3 : 10;
    const scaleStep = isText ? 0.1 : 0.5;

    return (
      <div className="space-y-4">
        {/* Position */}
        <h3 className="font-medium text-gray-700">Position</h3>
        <div className="grid grid-cols-3 items-center justify-items-center gap-2">
          <div /> {/* Spacer */}
          <button onClick={() => handleTransform('y', -5)} className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"><ArrowUp /></button>
          <div /> {/* Spacer */}
          <button onClick={() => handleTransform('x', -5)} className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"><ArrowLeft /></button>
          <div className="text-xs text-gray-500">Move</div>
          <button onClick={() => handleTransform('x', 5)} className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"><ArrowRight /></button>
          <div /> {/* Spacer */}
          <button onClick={() => handleTransform('y', 5)} className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"><ArrowDown /></button>
          <div /> {/* Spacer */}
        </div>
        {/* Scale */}
        <h3 className="font-medium text-gray-700">Size</h3>
        <div className="flex items-center gap-2">
          <ZoomOut className="text-gray-500" />
          <input
            type="range"
            min={scaleMin}
            max={scaleMax}
            step={scaleStep}
            value={currentItem.scale}
            onChange={(e) => handleSliderChange('scale', e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <ZoomIn className="text-gray-500" />
        </div>
        {/* Rotation */}
        <h3 className="font-medium text-gray-700">Rotation</h3>
        <div className="flex items-center gap-2">
          <RotateCcw className="text-gray-500" />
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={currentItem.rotation}
            onChange={(e) => handleSliderChange('rotation', e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm text-gray-600 w-10 text-right">{currentItem.rotation}°</span>
        </div>
      </div>
    )
  };

  // --- Main Component Return ---
  return (
    <div className="bg-gray-100 min-h-screen">
      <NavbarFinal />
      <div className="container mx-auto max-w-7xl p-4 lg:p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Create Your Custom T-Shirt
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- T-Shirt Display (Left/Top) --- */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center min-h-[80vh]">
            {/* Front/Back Toggle */}
            <div className="flex mb-4 rounded-lg bg-gray-200 p-1">
              <button
                onClick={() => setActiveSide("front")}
                className={`px-6 py-2 rounded-md font-medium ${
                  activeSide === "front" ? "bg-white shadow" : "text-gray-600"
                }`}
              >
                Front
              </button>
              <button
                onClick={() => setActiveSide("back")}
                className={`px-6 py-2 rounded-md font-medium ${
                  activeSide === "back" ? "bg-white shadow" : "text-gray-600"
                }`}
              >
                Back
              </button>
            </div>
            {/* T-Shirt Display Area */}
            <div className="relative w-full max-w-lg">
              {activeSide === "front" ? (
                <TShirtFrontSvg color={shirtColor} />
              ) : (
                <TShirtBackSvg color={shirtColor} />
              )}
              <CustomizationOverlay customization={customizations[activeSide]} />
            </div>
          </div>

          {/* --- Customization Panel (Right/Bottom) --- */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6 space-y-6">
            {/* Tab Navigation */}
            <div className="flex border-b">
              <TabButton
                icon={<Palette />}
                label="Color"
                isActive={activeTab === "color"}
                onClick={() => setActiveTab("color")}
              />
              <TabButton
                icon={<Type />}
                label="Text"
                isActive={activeTab === "text"}
                onClick={() => setActiveTab("text")}
              />
              <TabButton
                icon={<ImageIcon />}
                label="Graphics"
                isActive={activeTab === "graphic"}
                onClick={() => setActiveTab("graphic")}
              />
            </div>

            {/* Tab Content */}
            <div className="min-h-[250px] p-2">
              {activeTab === "color" && renderColorPicker()}
              {activeTab === "text" && renderTextEditor()}
              {activeTab === "graphic" && renderGraphicPicker()}
            </div>

            {/* Transform Controls */}
            {activeTab !== "color" && (
              <div className="border-t pt-6">
                {renderTransformControls()}
              </div>
            )}

            {/* --- Actions --- */}
            <div className="border-t pt-6 space-y-4">
              <button className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-blue-700 transition-colors">
                Add to Cart
              </button>
              <button
                onClick={resetCustomization}
                className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// --- Helper TabButton Component ---
const TabButton = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium transition-colors ${
      isActive
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-gray-500 hover:text-gray-800"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default CustomizedPage;

