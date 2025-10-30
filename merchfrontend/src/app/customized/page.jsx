"use client";
import React, { useState } from "react";
import { NavbarFinal } from "../../components/Navbar"; // Adjusted path (3 levels up)
import Footer from "../../components/Footer"; // Adjusted path (3 levels up)
import {
  Palette,
  Type,
  Image as ImageIcon,
  Check,
  RotateCcw,
} from "lucide-react";

// --- SVG T-Shirt Component ---
// This is an inline SVG component for the T-shirt.
// We can change its 'fill' color directly.
const TShirtSvg = ({ color, customText, customGraphic }) => {
  return (
    <div className="relative w-full h-full">
      <svg
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-lg"
      >
        {/* T-shirt Body */}
        <path
          d="M200,100 Q150,110 100,200 L100,800 Q100,900 200,900 L800,900 Q900,900 900,800 L900,200 Q850,110 800,100 L650,100 L650,150 Q650,250 500,250 Q350,250 350,150 L350,100 L200,100 Z"
          fill={color}
          stroke="#777"
          strokeWidth="10"
        />
        {/* Sleeves */}
        <path
          d="M100,200 Q50,250 50,300 L50,400 Q50,450 100,450 L100,200 Z"
          fill={color}
          stroke="#777"
          strokeWidth="10"
        />
        <path
          d="M900,200 Q950,250 950,300 L950,400 Q950,450 900,450 L900,200 Z"
          fill={color}
          stroke="#777"
          strokeWidth="10"
        />
        {/* Neck hole */}
        <path
          d="M350,150 Q350,250 500,250 Q650,250 650,150 L650,100 Q600,50 500,50 Q400,50 350,100 L350,150 Z"
          fill="#fff"
          stroke="#777"
          strokeWidth="10"
        />
      </svg>

      {/* --- Customization Overlay --- */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <div className="w-[40%] h-[50%] relative top-10 flex flex-col items-center justify-start">
          {/* Custom Graphic */}
          {customGraphic && (
            <div className="text-8xl mb-4">{customGraphic}</div>
          )}
          {/* Custom Text */}
          {customText && (
            <div
              className="text-4xl font-bold text-center"
              style={{
                fontFamily: "Arial, sans-serif",
                color: "#000",
                textShadow: "1px 1px 2px rgba(255,255,255,0.5)",
              }}
            >
              {customText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const CustomizedPage = () => {
  // --- State Variables ---
  const [shirtColor, setShirtColor] = useState("#ffffff"); // Default white
  const [customText, setCustomText] = useState("");
  const [customGraphic, setCustomGraphic] = useState(null);
  const [activeTab, setActiveTab] = useState("color"); // 'color', 'text', 'graphic'

  // --- Data for Options ---
  const colors = [
    { name: "White", hex: "#ffffff" },
    { name: "Black", hex: "#000000" },
    { name: "Navy", hex: "#0d3c59" }, // Corrected syntax error here
    { name: "Red", hex: "#c41e3a" },
    { name: "Grey", hex: "#9ca3af" },
    { name: "Yellow", hex: "#fde047" },
  ];

  const graphics = ["🔥", "⭐", "🚀", "❤️", "🎉", "💀"];

  // --- Helper Functions ---
  const resetCustomization = () => {
    setShirtColor("#ffffff");
    setCustomText("");
    setCustomGraphic(null);
    setActiveTab("color");
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
      <label htmlFor="customText" className="font-medium text-gray-700">
        Enter your text:
      </label>
      <input
        id="customText"
        type="text"
        value={customText}
        onChange={(e) => setCustomText(e.target.value)}
        maxLength={20}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Your Text Here"
      />
      <button
        onClick={() => setCustomText("")}
        className="text-sm text-gray-500 hover:text-red-500"
      >
        Clear Text
      </button>
    </div>
  );

  const renderGraphicPicker = () => (
    <div className="grid grid-cols-6 gap-3">
      {graphics.map((graphic) => (
        <button
          key={graphic}
          onClick={() => setCustomGraphic(graphic)}
          className={`flex items-center justify-center w-12 h-12 text-3xl rounded-lg transition-all ${
            customGraphic === graphic
              ? "bg-blue-500 scale-110"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {graphic}
        </button>
      ))}
      <button
        onClick={() => setCustomGraphic(null)}
        className="text-sm text-gray-500 hover:text-red-500 col-span-6 mt-2"
      >
        Clear Graphic
      </button>
    </div>
  );

  // --- Main Component Return ---
  return (
    <div className="bg-gray-100 min-h-screen">
      <NavbarFinal />
      <div className="container mx-auto max-w-7xl p-4 lg:p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Create Your Custom T-Shirt
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- T-Shirt Display (Left/Top) --- */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-lg">
              <TShirtSvg
                color={shirtColor}
                customText={customText}
                customGraphic={customGraphic}
              />
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
                isActive={activeTab === "text"} // Corrected typo here
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
            <div className="min-h-[200px] p-2">
              {activeTab === "color" && renderColorPicker()}
              {activeTab === "text" && renderTextEditor()}
              {activeTab === "graphic" && renderGraphicPicker()}
            </div>

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


