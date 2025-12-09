"use client";
import React, { useState } from "react";
import { NavbarFinal } from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  Palette,
  Type,
  Image as ImageIcon,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Upload,
  Droplet,
  Shirt, // New icon for the Style tab
} from "lucide-react";

// --- DYNAMIC SVG COMPONENTS ---

const TShirtFrontSvg = ({ colors, config }) => {
  const isFullSleeve = config.sleeve === "full";
  const isPolo = config.neck === "polo";

  // Dynamic Paths
  const leftSleevePath = isFullSleeve
    ? "M120,100 L50,130 L10,380 L70,400 L100,220 Q110,180 120,100 Z" // Full
    : "M120,100 L50,130 L20,200 L100,250 L100,220 Q110,180 120,100 Z"; // Half

  const rightSleevePath = isFullSleeve
    ? "M380,100 L450,130 L490,380 L430,400 L400,220 Q390,180 380,100 Z" // Full
    : "M380,100 L450,130 L480,200 L400,250 L400,220 Q390,180 380,100 Z"; // Half

  // Body path needs to adjust slightly for the neck hole if it's round vs polo
  const bodyPath = isPolo
    ? "M100,220 L100,550 L400,550 L400,220 Q390,180 380,100 Q250,180 120,100 Q110,180 100,220 Z"
    : "M100,220 L100,550 L400,550 L400,220 Q390,180 380,100 Q250,150 120,100 Q110,180 100,220 Z";

  return (
    <svg
      viewBox="0 0 500 600"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full drop-shadow-lg"
    >
      {/* Back Inside (visible through neck hole) */}
      <path fill="#e5e5e5" d="M120,100 Q250,150 380,100 L380,110 Q250,160 120,110 Z" />

      {/* Sleeves */}
      <path
        fill={colors.leftSleeve}
        stroke="#777"
        strokeWidth="2"
        d={leftSleevePath}
      />
      <path
        fill={colors.rightSleeve}
        stroke="#777"
        strokeWidth="2"
        d={rightSleevePath}
      />

      {/* Body */}
      <path
        fill={colors.body}
        stroke="#777"
        strokeWidth="2"
        d={bodyPath}
      />

      {/* Neck / Collar Area */}
      {isPolo ? (
        // Polo Collar Path
        <path
          fill={colors.collar}
          stroke="#777"
          strokeWidth="2"
          d="M120,100 Q250,180 380,100 L375,105 Q250,185 125,105 L120,100 Z"
        />
      ) : (
        // Round Neck Ribbing
        <path
          fill={colors.collar}
          stroke="#777"
          strokeWidth="2"
          d="M120,100 Q250,150 380,100 L380,115 Q250,165 120,115 Z"
        />
      )}
    </svg>
  );
};

const TShirtBackSvg = ({ colors, config }) => {
  const isFullSleeve = config.sleeve === "full";
  const isPolo = config.neck === "polo";

  const leftSleevePath = isFullSleeve
    ? "M120,100 L50,130 L10,380 L70,400 L100,220 Q110,180 120,100 Z"
    : "M120,100 L50,130 L20,200 L100,250 L100,220 Q110,180 120,100 Z";

  const rightSleevePath = isFullSleeve
    ? "M380,100 L450,130 L490,380 L430,400 L400,220 Q390,180 380,100 Z"
    : "M380,100 L450,130 L480,200 L400,250 L400,220 Q390,180 380,100 Z";

  // For back view, the neck line is higher
  const bodyPath = "M100,220 L100,550 L400,550 L400,220 Q390,180 380,100 Q250,90 120,100 Q110,180 100,220 Z";

  return (
    <svg
      viewBox="0 0 500 600"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full drop-shadow-lg"
    >
      <path
        fill={colors.leftSleeve}
        stroke="#777"
        strokeWidth="2"
        d={leftSleevePath}
      />
      <path
        fill={colors.rightSleeve}
        stroke="#777"
        strokeWidth="2"
        d={rightSleevePath}
      />
      <path
        fill={colors.body}
        stroke="#777"
        strokeWidth="2"
        d={bodyPath}
      />
      {/* Back Collar Detail */}
      <path
        fill={colors.collar}
        stroke="#777"
        strokeWidth="2"
        d="M120,100 Q250,90 380,100 L380,110 Q250,100 120,110 Z"
      />
    </svg>
  );
};

// --- Customization Overlay Component ---
const CustomizationOverlay = ({ customization }) => {
  const { text, graphic } = customization;

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      {graphic.content && (
        <img
          src={graphic.content}
          alt="Custom Graphic"
          className="absolute object-contain pointer-events-auto"
          style={{
            top: `${graphic.y}%`,
            left: `${graphic.x}%`,
            width: `${graphic.scale * 20}%`,
            transform: `translate(-50%, -50%) rotate(${graphic.rotation}deg)`,
            userSelect: "none",
            cursor: "move",
          }}
        />
      )}
      {text.content && (
        <div
          className="absolute text-4xl font-bold text-center pointer-events-auto"
          style={{
            top: `${text.y}%`,
            left: `${text.x}%`,
            fontFamily: text.font,
            color: text.color,
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
  const [shirtColors, setShirtColors] = useState({
    body: "#ffffff",
    leftSleeve: "#ffffff",
    rightSleeve: "#ffffff",
    collar: "#ffffff",
  });
  
  // NEW: State for Shirt Configuration (Style)
  const [shirtConfig, setShirtConfig] = useState({
    sleeve: "half", // 'half' or 'full'
    neck: "polo",   // 'polo' or 'round'
  });

  const [activePart, setActivePart] = useState("body");
  const [activeSide, setActiveSide] = useState("front");
  const [activeTab, setActiveTab] = useState("style"); // Default to style to show off new features

  const initialCustomization = {
    text: { content: "", x: 50, y: 40, scale: 1, font: "Arial", color: "#000000", rotation: 0 },
    graphic: { content: null, x: 50, y: 55, scale: 5, rotation: 0 },
  };

  const [customizations, setCustomizations] = useState({
    front: { ...initialCustomization },
    back: { ...initialCustomization },
  });

  // --- Data for Options ---
  const colorSwatches = [
    { name: "White", hex: "#ffffff" },
    { name: "Black", hex: "#000000" },
    { name: "Navy", hex: "#0d3c59" },
    { name: "Red", hex: "#c41e3a" },
    { name: "Grey", hex: "#9ca3af" },
    { name: "Yellow", hex: "#fde047" },
    { name: "Green", hex: "#166534" },
    { name: "Blue", hex: "#2563eb" },
  ];
  
  const fonts = ["Arial", "Verdana", "Impact", "Courier New", "Georgia", "Times New Roman", "Comic Sans MS"];
  
  // Updated part names based on config
  const shirtParts = [
    { id: "body", name: "Body" },
    { id: "leftSleeve", name: "Left Sleeve" },
    { id: "rightSleeve", name: "Right Sleeve" },
    { id: "collar", name: shirtConfig.neck === "polo" ? "Collar" : "Neck Trim" },
  ];

  // --- Helper Functions ---
  const resetCustomization = () => {
    setCustomizations({
      front: { ...initialCustomization },
      back: { ...initialCustomization },
    });
    setShirtColors({
      body: "#ffffff",
      leftSleeve: "#ffffff",
      rightSleeve: "#ffffff",
      collar: "#ffffff",
    });
    setShirtConfig({
        sleeve: "half",
        neck: "polo"
    });
    setActiveSide("front");
    setActiveTab("style");
    setActivePart("body");
  };

  // Sets color ONLY for the active part
  const handleSwatchColorChange = (hex) => {
    setShirtColors(prev => ({
      ...prev,
      [activePart]: hex,
    }));
  };

  // Set individual part color via native picker
  const handlePartColorChange = (e) => {
    const newColor = e.target.value;
    setShirtColors(prev => ({
      ...prev,
      [activePart]: newColor,
    }));
  };
  
  const handleSliderChange = (property, value) => {
    if (activeTab === "color" || activeTab === "style") return;
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

  const handleTransform = (property, change) => {
    if (activeTab === "color" || activeTab === "style") return;

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

  // NEW: Style Selector Renderer
  const renderStyleSelector = () => (
    <div className="space-y-6">
        <div>
            <label className="text-sm font-medium text-gray-500 block mb-3">
                Sleeve Length
            </label>
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => setShirtConfig(prev => ({ ...prev, sleeve: 'half' }))}
                    className={`flex flex-col items-center p-4 border rounded-xl transition-all ${
                        shirtConfig.sleeve === 'half'
                            ? "bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                >
                    <span className="font-bold">Half Sleeve</span>
                </button>
                <button
                    onClick={() => setShirtConfig(prev => ({ ...prev, sleeve: 'full' }))}
                    className={`flex flex-col items-center p-4 border rounded-xl transition-all ${
                        shirtConfig.sleeve === 'full'
                            ? "bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                >
                    <span className="font-bold">Full Sleeve</span>
                </button>
            </div>
        </div>

        <div>
            <label className="text-sm font-medium text-gray-500 block mb-3">
                Neck Style
            </label>
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => setShirtConfig(prev => ({ ...prev, neck: 'polo' }))}
                    className={`flex flex-col items-center p-4 border rounded-xl transition-all ${
                        shirtConfig.neck === 'polo'
                            ? "bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                >
                    <span className="font-bold">Polo Collar</span>
                </button>
                <button
                    onClick={() => setShirtConfig(prev => ({ ...prev, neck: 'round' }))}
                    className={`flex flex-col items-center p-4 border rounded-xl transition-all ${
                        shirtConfig.neck === 'round'
                            ? "bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                >
                    <span className="font-bold">Round Neck</span>
                </button>
            </div>
        </div>
    </div>
  );

  const renderColorPicker = () => (
    <div className="space-y-6">
       <div>
        <label className="text-sm font-medium text-gray-500 block mb-3">
          Select Part to Color
        </label>
        <div className="grid grid-cols-2 gap-2">
          {shirtParts.map(part => (
            <button
              key={part.id}
              onClick={() => setActivePart(part.id)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                activePart === part.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {part.name}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Swatches */}
      <div>
        <label className="text-sm font-medium text-gray-500 block mb-3">
          Preset Colors (Applies to {shirtParts.find(p => p.id === activePart)?.name})
        </label>
        <div className="grid grid-cols-8 gap-2">
          {colorSwatches.map((color) => (
            <button
              key={color.name}
              title={color.name}
              onClick={() => handleSwatchColorChange(color.hex)}
              className="w-9 h-9 rounded-full border border-gray-200 transition-all hover:scale-110"
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>
      
      {/* Custom Color Input */}
      <div>
        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <Droplet className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-800 capitalize flex-1">
            Custom {shirtParts.find(p => p.id === activePart)?.name} Color
          </span>
          <input
            type="color"
            value={shirtColors[activePart]}
            onChange={handlePartColorChange}
            className="w-10 h-10 p-0 border-none rounded-md cursor-pointer"
          />
        </div>
      </div>
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
    if (!currentItem || (activeTab === 'text' && !currentItem.content) || (activeTab === 'graphic' && !currentItem.content)) {
      return (
        <div className="text-center text-gray-500 p-4 bg-gray-50 rounded-lg">
          {activeTab === 'text' ? 'Add some text to see controls' : 'Upload a graphic to see controls'}
        </div>
      );
    }
    
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
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Your Custom T-Shirt
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- T-Shirt Display (Left/Top) --- */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center min-h-[85vh]">
            {/* Front/Back Toggle */}
            <div className="flex mb-6 rounded-lg bg-gray-200 p-1">
              <button
                onClick={() => setActiveSide("front")}
                className={`px-8 py-2 rounded-md font-medium transition-all ${
                  activeSide === "front" ? "bg-white shadow-md" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Front
              </button>
              <button
                onClick={() => setActiveSide("back")}
                className={`px-8 py-2 rounded-md font-medium transition-all ${
                  activeSide === "back" ? "bg-white shadow-md" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Back
              </button>
            </div>
            {/* T-Shirt Display Area */}
            <div className="relative w-full max-w-lg">
              {activeSide === "front" ? (
                <TShirtFrontSvg colors={shirtColors} config={shirtConfig} />
              ) : (
                <TShirtBackSvg colors={shirtColors} config={shirtConfig} />
              )}
              <CustomizationOverlay customization={customizations[activeSide]} />
            </div>
          </div>

          {/* --- Customization Panel (Right/Bottom) --- */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-xl p-6 flex flex-col">
            {/* Tab Navigation */}
            <div className="flex border-b">
              {/* NEW TAB: Style */}
              <TabButton
                icon={<Shirt />}
                label="Style"
                isActive={activeTab === "style"}
                onClick={() => setActiveTab("style")}
              />
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
            <div className="flex-1 min-h-[300px] py-6">
              {activeTab === "style" && renderStyleSelector()}
              {activeTab === "color" && renderColorPicker()}
              {activeTab === "text" && renderTextEditor()}
              {activeTab === "graphic" && renderGraphicPicker()}
            </div>

            {/* Transform Controls */}
            {activeTab !== "color" && activeTab !== "style" && (
              <div className="border-t pt-6">
                {renderTransformControls()}
              </div>
            )}

            {/* --- Actions --- */}
            <div className="border-t pt-6 space-y-4 mt-auto">
              <button className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/50">
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
    className={`flex-1 flex flex-col items-center justify-center gap-1 px-4 py-3 font-medium transition-all ${
      isActive
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-t-lg"
    }`}
  >
    {React.cloneElement(icon, { className: 'w-5 h-5' })}
    <span className="text-sm">{label}</span>
  </button>
);

export default CustomizedPage;