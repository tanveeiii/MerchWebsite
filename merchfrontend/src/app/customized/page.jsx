"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Shirt,
  Loader2,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import CustomToast from "@/components/CustomToast";
import { checkAuth } from "@/utils/checkauth";

// --- DYNAMIC SVG COMPONENTS (Unchanged) ---
const TShirtFrontSvg = ({ colors, config }) => {
  const isFullSleeve = config.sleeve === "full";
  const isPolo = config.neck === "polo";

  const leftSleevePath = isFullSleeve
    ? "M120,100 L50,130 L10,380 L70,400 L100,220 Q110,180 120,100 Z"
    : "M120,100 L50,130 L20,200 L100,250 L100,220 Q110,180 120,100 Z";

  const rightSleevePath = isFullSleeve
    ? "M380,100 L450,130 L490,380 L430,400 L400,220 Q390,180 380,100 Z"
    : "M380,100 L450,130 L480,200 L400,250 L400,220 Q390,180 380,100 Z";

  const bodyPath = isPolo
    ? "M100,220 L100,550 L400,550 L400,220 Q390,180 380,100 Q250,180 120,100 Q110,180 100,220 Z"
    : "M100,220 L100,550 L400,550 L400,220 Q390,180 380,100 Q250,150 120,100 Q110,180 100,220 Z";

  return (
    <svg
      viewBox="0 0 500 600"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full drop-shadow-lg"
    >
      <path
        fill="#e5e5e5"
        d="M120,100 Q250,150 380,100 L380,110 Q250,160 120,110 Z"
      />
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
      <path fill={colors.body} stroke="#777" strokeWidth="2" d={bodyPath} />
      {isPolo ? (
        <path
          fill={colors.collar}
          stroke="#777"
          strokeWidth="2"
          d="M120,100 Q250,180 380,100 L375,105 Q250,185 125,105 L120,100 Z"
        />
      ) : (
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
  const leftSleevePath = isFullSleeve
    ? "M120,100 L50,130 L10,380 L70,400 L100,220 Q110,180 120,100 Z"
    : "M120,100 L50,130 L20,200 L100,250 L100,220 Q110,180 120,100 Z";

  const rightSleevePath = isFullSleeve
    ? "M380,100 L450,130 L490,380 L430,400 L400,220 Q390,180 380,100 Z"
    : "M380,100 L450,130 L480,200 L400,250 L400,220 Q390,180 380,100 Z";

  const bodyPath =
    "M100,220 L100,550 L400,550 L400,220 Q390,180 380,100 Q250,90 120,100 Q110,180 100,220 Z";

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
      <path fill={colors.body} stroke="#777" strokeWidth="2" d={bodyPath} />
      <path
        fill={colors.collar}
        stroke="#777"
        strokeWidth="2"
        d="M120,100 Q250,90 380,100 L380,110 Q250,100 120,110 Z"
      />
    </svg>
  );
};

// --- Customization Overlay Component (Unchanged) ---
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
  const router = useRouter(); // Initialize Router
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  

  // --- State Variables ---
  const [shirtColors, setShirtColors] = useState({
    body: "#ffffff",
    leftSleeve: "#ffffff",
    rightSleeve: "#ffffff",
    collar: "#ffffff",
  });

  const [shirtConfig, setShirtConfig] = useState({
    sleeve: "half",
    neck: "polo",
  });

  const [activeSide, setActiveSide] = useState("front");
  const [activeTab, setActiveTab] = useState("style");

  const initialCustomization = {
    text: {
      content: "",
      x: 50,
      y: 40,
      scale: 1,
      font: "Arial",
      color: "#000000",
      rotation: 0,
    },
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

  const fonts = [
    "Arial",
    "Verdana",
    "Impact",
    "Courier New",
    "Georgia",
    "Times New Roman",
    "Comic Sans MS",
  ];

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const check = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) router.replace("/auth/login");
      else setCheckingAuth(false);
    };
    check();
  }, [router]);

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
      neck: "polo",
    });
    setActiveSide("front");
    setActiveTab("style");
  };

  // UPDATED: Apply color to ALL parts
  const handleSwatchColorChange = (hex) => {
    setShirtColors({
      body: hex,
      leftSleeve: hex,
      rightSleeve: hex,
      collar: hex,
    });
  };

  // UPDATED: Apply color to ALL parts
  const handlePartColorChange = (e) => {
    const hex = e.target.value;
    setShirtColors({
      body: hex,
      leftSleeve: hex,
      rightSleeve: hex,
      collar: hex,
    });
  };

  const handleSliderChange = (property, value) => {
    if (activeTab === "color" || activeTab === "style") return;
    setCustomizations((prev) => ({
      ...prev,
      [activeSide]: {
        ...prev[activeSide],
        [activeTab]: {
          ...prev[activeSide][activeTab],
          [property]: parseFloat(value),
        },
      },
    }));
  };

  const handleTransform = (property, change) => {
    if (activeTab === "color" || activeTab === "style") return;
    setCustomizations((prev) => {
      const current = prev[activeSide][activeTab];
      let newValue = current[property] + change;
      if (property === "x" || property === "y")
        newValue = Math.max(0, Math.min(100, newValue));
      return {
        ...prev,
        [activeSide]: {
          ...prev[activeSide],
          [activeTab]: { ...current, [property]: newValue },
        },
      };
    });
  };

  const handleTextChange = (e) => {
    setCustomizations((prev) => ({
      ...prev,
      [activeSide]: {
        ...prev[activeSide],
        text: { ...prev[activeSide].text, content: e.target.value },
      },
    }));
  };

  const handleTextColorChange = (e) => {
    setCustomizations((prev) => ({
      ...prev,
      [activeSide]: {
        ...prev[activeSide],
        text: { ...prev[activeSide].text, color: e.target.value },
      },
    }));
  };

  const handleFontChange = (e) => {
    setCustomizations((prev) => ({
      ...prev,
      [activeSide]: {
        ...prev[activeSide],
        text: { ...prev[activeSide].text, font: e.target.value },
      },
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomizations((prev) => ({
          ...prev,
          [activeSide]: {
            ...prev[activeSide],
            graphic: {
              ...prev[activeSide].graphic,
              content: event.target.result,
            },
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setCustomizations((prev) => ({
      ...prev,
      [activeSide]: {
        ...prev[activeSide],
        graphic: {
          ...prev[activeSide].graphic,
          content: null,
          scale: 5,
          rotation: 0,
        },
      },
    }));
  };

  // --- API INTEGRATION: Add to Cart ---
  const handleAddToCart = async () => {
    setIsSubmitting(true);
    try {
      const userId = 1; // HARDCODED: Replace with actual user ID from Auth context/LocalStorage
      const product_id = 1; // HARDCODED: Base product ID for "Custom Shirt"
      const product_variant_id = 1; // HARDCODED: Variant ID

      // 1. Create Base Cart Item
      const cartResponse = await fetch(
        "http://localhost:5000/api/cart/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            product_id: product_id,
            product_variant_id: product_variant_id,
            quantity: 1,
          }),
        }
      );

      if (!cartResponse.ok) throw new Error("Failed to add base item to cart");
      const cartData = await cartResponse.json();

      const createdId =
        cartData.cart_id || cartData.order_item_id || cartData.id;

      // 2. Add Customization Details
      const customizationPayload = {
        cart_id: createdId,
        front_image_url: "https://placeholder.com/custom-shirt-front.png",
        back_image_url: "https://placeholder.com/custom-shirt-back.png",
        custom_text: customizations.front.text.content || "",
        font_style: customizations.front.text.font,
        text_color: customizations.front.text.color,
      };

      const customResponse = await fetch(
        "http://localhost:5000/api/customization/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(customizationPayload),
        }
      );

      if (!customResponse.ok) {
        const errorData = await customResponse.json();
        throw new Error(errorData.message || "Failed to save customization");
      }

      // Success
      CustomToast("Customized Shirt added to cart!");
      router.push("/cart");
    } catch (error) {
      console.error("Add to cart error:", error);
      CustomToast(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Functions ---
  const renderStyleSelector = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-gray-500 block mb-3">
          Sleeve Length
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() =>
              setShirtConfig((prev) => ({ ...prev, sleeve: "half" }))
            }
            className={`flex flex-col items-center p-4 border rounded-xl transition-all ${
              shirtConfig.sleeve === "half"
                ? "bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="font-bold">Half Sleeve</span>
          </button>
          <button
            onClick={() =>
              setShirtConfig((prev) => ({ ...prev, sleeve: "full" }))
            }
            className={`flex flex-col items-center p-4 border rounded-xl transition-all ${
              shirtConfig.sleeve === "full"
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
            onClick={() =>
              setShirtConfig((prev) => ({ ...prev, neck: "polo" }))
            }
            className={`flex flex-col items-center p-4 border rounded-xl transition-all ${
              shirtConfig.neck === "polo"
                ? "bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="font-bold">Polo Collar</span>
          </button>
          <button
            onClick={() =>
              setShirtConfig((prev) => ({ ...prev, neck: "round" }))
            }
            className={`flex flex-col items-center p-4 border rounded-xl transition-all ${
              shirtConfig.neck === "round"
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

  // UPDATED: No individual part selection, just whole shirt color
  const renderColorPicker = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-gray-500 block mb-3">
          T-Shirt Color
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
      <div>
        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <Droplet className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-800 capitalize flex-1">
            Custom Color
          </span>
          {/* Using shirtColors.body as representative value since all are same */}
          <input
            type="color"
            value={shirtColors.body}
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
        <label
          htmlFor="customText"
          className="font-medium text-gray-700 block mb-2"
        >
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
          <label
            htmlFor="fontSelect"
            className="font-medium text-gray-700 block mb-2"
          >
            Font:
          </label>
          <select
            id="fontSelect"
            value={customizations[activeSide].text.font}
            onChange={handleFontChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {fonts.map((font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="textColor"
            className="font-medium text-gray-700 block mb-2"
          >
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
    if (
      !currentItem ||
      (activeTab === "text" && !currentItem.content) ||
      (activeTab === "graphic" && !currentItem.content)
    ) {
      return (
        <div className="text-center text-gray-500 p-4 bg-gray-50 rounded-lg">
          {activeTab === "text"
            ? "Add some text to see controls"
            : "Upload a graphic to see controls"}
        </div>
      );
    }
    const isText = activeTab === "text";
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-gray-700">Position</h3>
        <div className="grid grid-cols-3 items-center justify-items-center gap-2">
          <div />
          <button
            onClick={() => handleTransform("y", -5)}
            className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            <ArrowUp />
          </button>
          <div />
          <button
            onClick={() => handleTransform("x", -5)}
            className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            <ArrowLeft />
          </button>
          <div className="text-xs text-gray-500">Move</div>
          <button
            onClick={() => handleTransform("x", 5)}
            className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            <ArrowRight />
          </button>
          <div />
          <button
            onClick={() => handleTransform("y", 5)}
            className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            <ArrowDown />
          </button>
          <div />
        </div>
        <h3 className="font-medium text-gray-700">Size</h3>
        <div className="flex items-center gap-2">
          <ZoomOut className="text-gray-500" />
          <input
            type="range"
            min={isText ? 0.5 : 1}
            max={isText ? 3 : 10}
            step={isText ? 0.1 : 0.5}
            value={currentItem.scale}
            onChange={(e) => handleSliderChange("scale", e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <ZoomIn className="text-gray-500" />
        </div>
        <h3 className="font-medium text-gray-700">Rotation</h3>
        <div className="flex items-center gap-2">
          <RotateCcw className="text-gray-500" />
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={currentItem.rotation}
            onChange={(e) => handleSliderChange("rotation", e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm text-gray-600 w-10 text-right">
            {currentItem.rotation}°
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <ToastContainer />
      <NavbarFinal />
      <div className="container mx-auto max-w-7xl p-4 lg:p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Your Custom T-Shirt
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Display */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center min-h-[85vh]">
            <div className="flex mb-6 rounded-lg bg-gray-200 p-1">
              <button
                onClick={() => setActiveSide("front")}
                className={`px-8 py-2 rounded-md font-medium transition-all ${
                  activeSide === "front"
                    ? "bg-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Front
              </button>
              <button
                onClick={() => setActiveSide("back")}
                className={`px-8 py-2 rounded-md font-medium transition-all ${
                  activeSide === "back"
                    ? "bg-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Back
              </button>
            </div>
            <div className="relative w-full max-w-lg">
              {activeSide === "front" ? (
                <TShirtFrontSvg colors={shirtColors} config={shirtConfig} />
              ) : (
                <TShirtBackSvg colors={shirtColors} config={shirtConfig} />
              )}
              <CustomizationOverlay
                customization={customizations[activeSide]}
              />
            </div>
          </div>
          {/* Controls */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-xl p-6 flex flex-col">
            <div className="flex border-b">
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
            <div className="flex-1 min-h-[300px] py-6">
              {activeTab === "style" && renderStyleSelector()}
              {activeTab === "color" && renderColorPicker()}
              {activeTab === "text" && renderTextEditor()}
              {activeTab === "graphic" && renderGraphicPicker()}
            </div>
            {activeTab !== "color" && activeTab !== "style" && (
              <div className="border-t pt-6">{renderTransformControls()}</div>
            )}

            {/* ACTIONS */}
            <div className="border-t pt-6 space-y-4 mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={isSubmitting}
                className={`w-full font-bold py-3 px-6 rounded-lg text-lg transition-colors shadow-lg flex items-center justify-center gap-2 
                    ${
                      isSubmitting
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-500/50"
                    }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" /> Adding...
                  </>
                ) : (
                  "Add to Cart"
                )}
              </button>
              <button
                onClick={resetCustomization}
                className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <RotateCcw className="w-5 h-5" /> Reset
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const TabButton = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex flex-col items-center justify-center gap-1 px-4 py-3 font-medium transition-all ${
      isActive
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-t-lg"
    }`}
  >
    {React.cloneElement(icon, { className: "w-5 h-5" })}
    <span className="text-sm">{label}</span>
  </button>
);

export default CustomizedPage;
