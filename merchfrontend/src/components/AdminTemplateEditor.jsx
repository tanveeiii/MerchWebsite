"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Palette,
  Type,
  Image as ImageIcon,
  RotateCcw,
  ZoomIn,
  Upload,
  Droplet,
  Shirt,
  Save,
  Loader2,
  MousePointer2,
  Lock,
  CheckSquare,
  Square
} from "lucide-react";
import CustomToast from "@/components/CustomToast";

// --- 1. T-Shirt Front SVG ---
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
    <svg viewBox="0 0 500 600" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
      <path fill="#e5e5e5" d="M120,100 Q250,150 380,100 L380,110 Q250,160 120,110 Z" />
      <path fill={colors.leftSleeve} stroke="#999" strokeWidth="1" d={leftSleevePath} />
      <path fill={colors.rightSleeve} stroke="#999" strokeWidth="1" d={rightSleevePath} />
      <path fill={colors.body} stroke="#999" strokeWidth="1" d={bodyPath} />
      {isPolo ? (
        <path fill={colors.collar} stroke="#999" strokeWidth="1" d="M120,100 Q250,180 380,100 L375,105 Q250,185 125,105 L120,100 Z" />
      ) : (
        <path fill={colors.collar} stroke="#999" strokeWidth="1" d="M120,100 Q250,150 380,100 L380,115 Q250,165 120,115 Z" />
      )}
    </svg>
  );
};

// --- 2. T-Shirt Back SVG ---
const TShirtBackSvg = ({ colors, config }) => {
  const isFullSleeve = config.sleeve === "full";
  const leftSleevePath = isFullSleeve
    ? "M120,100 L50,130 L10,380 L70,400 L100,220 Q110,180 120,100 Z"
    : "M120,100 L50,130 L20,200 L100,250 L100,220 Q110,180 120,100 Z";

  const rightSleevePath = isFullSleeve
    ? "M380,100 L450,130 L490,380 L430,400 L400,220 Q390,180 380,100 Z"
    : "M380,100 L450,130 L480,200 L400,250 L400,220 Q390,180 380,100 Z";

  const bodyPath = "M100,220 L100,550 L400,550 L400,220 Q390,180 380,100 Q250,90 120,100 Q110,180 100,220 Z";

  return (
    <svg viewBox="0 0 500 600" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
      <path fill={colors.leftSleeve} stroke="#999" strokeWidth="1" d={leftSleevePath} />
      <path fill={colors.rightSleeve} stroke="#999" strokeWidth="1" d={rightSleevePath} />
      <path fill={colors.body} stroke="#999" strokeWidth="1" d={bodyPath} />
      <path fill={colors.collar} stroke="#999" strokeWidth="1" d="M120,100 Q250,90 380,100 L380,110 Q250,100 120,110 Z" />
    </svg>
  );
};

// --- 3. Overlay Component ---
const CustomizationOverlay = ({ customization, activeTab, onMouseDown, activeItem }) => {
  const { text, graphic } = customization;

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      {/* GRAPHIC LAYER */}
      {graphic.content && (
        <img
          src={graphic.content}
          alt="Custom"
          onMouseDown={(e) => onMouseDown(e, 'graphic')}
          onTouchStart={(e) => onMouseDown(e, 'graphic')}
          className={`absolute object-contain pointer-events-auto transition-shadow hover:drop-shadow-lg cursor-move
            ${activeItem === 'graphic' ? 'ring-2 ring-blue-500 ring-offset-2 rounded' : ''}
          `}
          style={{
            top: `${graphic.y}%`,
            left: `${graphic.x}%`,
            width: `${graphic.scale * 20}%`,
            transform: `translate(-50%, -50%) rotate(${graphic.rotation}deg)`,
          }}
          draggable={false}
        />
      )}
      
      {/* TEXT LAYER */}
      {text.content && (
        <div
          onMouseDown={(e) => onMouseDown(e, 'text')}
          onTouchStart={(e) => onMouseDown(e, 'text')}
          className={`absolute text-4xl font-bold text-center pointer-events-auto cursor-move hover:opacity-80
            ${activeItem === 'text' ? 'ring-2 ring-blue-500 ring-offset-4 rounded' : ''}
          `}
          style={{
            top: `${text.y}%`,
            left: `${text.x}%`,
            fontFamily: text.font,
            color: text.color,
            transform: `translate(-50%, -50%) scale(${text.scale}) rotate(${text.rotation}deg)`,
            whiteSpace: "pre",
            textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
            fontSize: 'clamp(12px, 4vw, 36px)'
          }}
        >
          {text.content}
        </div>
      )}
    </div>
  );
};

// --- 4. Main Editor Logic ---
export default function AdminTemplateEditor({ onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Template Metadata
  const [templateName, setTemplateName] = useState("");
  const [templateDesc, setTemplateDesc] = useState("");
  const [previewImage, setPreviewImage] = useState("https://placehold.co/400x500/e2e8f0/1e293b?text=Shirt+Preview");

  // Design State
  const [shirtColors, setShirtColors] = useState({ body: "#ffffff", leftSleeve: "#ffffff", rightSleeve: "#ffffff", collar: "#ffffff" });
  const [shirtConfig, setShirtConfig] = useState({ sleeve: "half", neck: "polo" });
  
  const [customizations, setCustomizations] = useState({
    front: { 
        text: { content: "YOUR TEXT", x: 50, y: 40, scale: 1, font: "Arial", color: "#000000", rotation: 0 }, 
        graphic: { content: null, x: 50, y: 55, scale: 5, rotation: 0 } 
    },
    back: { 
        text: { content: "", x: 50, y: 40, scale: 1, font: "Arial", color: "#000000", rotation: 0 }, 
        graphic: { content: null, x: 50, y: 55, scale: 5, rotation: 0 } 
    }
  });

  // --- NEW: Permissions State ---
  const [permissions, setPermissions] = useState({
    canChangeStyle: true,      // User can switch Sleeve/Neck?
    canChangeShirtColor: true, // User can change shirt color?
    canEditText: true,         // User can edit text content?
    canChangeFont: true,       // User can change font family?
    canChangeTextColor: true,  // User can change text color?
    canUploadGraphic: true,    // User can upload new images?
    canTransform: true,        // User can move/scale/rotate elements?
  });

  const [activeSide, setActiveSide] = useState("front");
  const [activeTab, setActiveTab] = useState("style");
  const [activeItem, setActiveItem] = useState("text"); 

  // --- DRAG & DROP LOGIC ---
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e, itemType) => {
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

    if (!e.type.includes('touch')) e.preventDefault();
    
    setActiveItem(itemType);
    setActiveTab(itemType === 'text' ? 'text' : 'graphic'); 
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
    setInitialPos({ 
        x: customizations[activeSide][itemType].x, 
        y: customizations[activeSide][itemType].y 
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    
    if(e.type === 'touchmove') e.preventDefault();

    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

    const rect = containerRef.current.getBoundingClientRect();
    const deltaXPixels = clientX - dragStart.x;
    const deltaYPixels = clientY - dragStart.y;

    const deltaXPercent = (deltaXPixels / rect.width) * 100;
    const deltaYPercent = (deltaYPixels / rect.height) * 100;

    const newX = Math.min(100, Math.max(0, initialPos.x + deltaXPercent));
    const newY = Math.min(100, Math.max(0, initialPos.y + deltaYPercent));

    setCustomizations(prev => ({
        ...prev,
        [activeSide]: {
            ...prev[activeSide],
            [activeItem]: {
                ...prev[activeSide][activeItem],
                x: newX,
                y: newY
            }
        }
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // --- MOUSE WHEEL ZOOM ---
  const handleWheel = (e) => {
    if(!containerRef.current) return;
    const currentScale = customizations[activeSide][activeItem].scale;
    const delta = e.deltaY * -0.001;
    const newScale = Math.min(5, Math.max(0.2, currentScale + delta));

    setCustomizations(prev => ({
        ...prev,
        [activeSide]: {
            ...prev[activeSide],
            [activeItem]: {
                ...prev[activeSide][activeItem],
                scale: newScale
            }
        }
    }));
  };

  const handleColorChange = (hex) => setShirtColors({ body: hex, leftSleeve: hex, rightSleeve: hex, collar: hex });
  const handleConfigChange = (key, val) => setShirtConfig(prev => ({ ...prev, [key]: val }));

  const updateCustomization = (key, val) => {
    setCustomizations(prev => ({
        ...prev,
        [activeSide]: {
            ...prev[activeSide],
            [activeItem]: {
                ...prev[activeSide][activeItem],
                [key]: val
            }
        }
    }));
  };

  const togglePermission = (key) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    if (!templateName.trim()) return CustomToast("Template Name is required!", "error");
    if (!previewImage.trim()) return CustomToast("Preview Image URL is required!", "error");

    setIsSubmitting(true);

    // Save permissions alongside other data
    const payload = {
        name: templateName,
        description: templateDesc,
        preview_image: previewImage,
        data: {
            shirtColors,
            shirtConfig,
            customizations,
            permissions // <--- Saving the permissions
        }
    };

    try {
        const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "customization-template/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok) {
            CustomToast("Template Saved Successfully!");
            if(onSuccess) onSuccess();
        } else {
            CustomToast(data.message || "Failed to save template.", "error");
        }
    } catch (e) { 
        CustomToast("Network Error: Could not connect to server.", "error");
    } 
    finally { setIsSubmitting(false); }
  };

  const tabs = [
    { id: 'style', icon: <Shirt size={18} />, label: 'Style' },
    { id: 'text', icon: <Type size={18} />, label: 'Text' },
    { id: 'graphic', icon: <ImageIcon size={18} />, label: 'Graphic' },
    { id: 'permissions', icon: <Lock size={18} />, label: 'Rules' }, // New Tab
  ];

  return (
    <div 
      className="flex flex-col-reverse lg:flex-row h-full min-h-[80vh] bg-gray-50 text-gray-900" 
      onMouseUp={handleMouseUp}
      onTouchEnd={handleMouseUp}
    >
        
        {/* LEFT SIDEBAR: CONTROLS */}
        <div className="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-r border-gray-200 flex flex-col shadow-xl z-20">
            {/* Header */}
            <div className="p-4 md:p-6 border-b border-gray-100 bg-white">
                <h2 className="text-lg md:text-xl font-extrabold text-gray-800 flex items-center gap-2">
                    <Save className="text-blue-600" /> Save Configuration
                </h2>
                <p className="text-xs text-gray-500 mt-1 hidden md:block">Configure metadata and permissions.</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 custom-scrollbar">
                
                {/* Metadata Section */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Template Name</label>
                        <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="e.g. Summer Vibe 2024" value={templateName} onChange={e => setTemplateName(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Description</label>
                        <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Short description..." value={templateDesc} onChange={e => setTemplateDesc(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Preview Image URL</label>
                        <div className="flex gap-2">
                            <input className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xs" placeholder="https://..." value={previewImage} onChange={e => setPreviewImage(e.target.value)} />
                            <div className="w-10 h-10 rounded border bg-gray-100 overflow-hidden flex-shrink-0">
                                <img src={previewImage} className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://placehold.co/100?text=?'} alt="preview"/>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Designer Controls */}
                <div>
                    <div className="flex bg-gray-100 p-1 rounded-lg mb-6 overflow-x-auto">
                        {tabs.map(t => (
                            <button 
                                key={t.id} 
                                onClick={() => { setActiveTab(t.id); if(t.id !== 'style' && t.id !== 'permissions') setActiveItem(t.id); }}
                                className={`flex-1 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-all min-w-[80px] ${activeTab === t.id ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {t.icon} {t.label}
                            </button>
                        ))}
                    </div>

                    {/* PERMISSIONS TAB (NEW) */}
                    {activeTab === 'permissions' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-200">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                                <h3 className="font-bold text-blue-800 text-sm mb-1">User Restrictions</h3>
                                <p className="text-xs text-blue-600">Uncheck boxes to lock specific features for the end user.</p>
                            </div>
                            
                            {[
                                { k: 'canChangeStyle', label: 'Change Sleeve/Neck Style' },
                                { k: 'canChangeShirtColor', label: 'Change Shirt Color' },
                                { k: 'canEditText', label: 'Edit Text Content' },
                                { k: 'canChangeFont', label: 'Change Text Font' },
                                { k: 'canChangeTextColor', label: 'Change Text Color' },
                                { k: 'canUploadGraphic', label: 'Upload New Graphics' },
                                { k: 'canTransform', label: 'Move / Scale / Rotate Elements' },
                            ].map(({ k, label }) => (
                                <button 
                                    key={k}
                                    onClick={() => togglePermission(k)}
                                    className="flex items-center gap-3 w-full p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    {permissions[k] ? <CheckSquare className="text-green-600" /> : <Square className="text-gray-400" />}
                                    <span className={`text-sm font-medium ${permissions[k] ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* STYLE TAB */}
                    {activeTab === 'style' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-200">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Base Color</label>
                                <div className="flex flex-wrap gap-3">
                                    {["#ffffff", "#000000", "#1f2937", "#dc2626", "#2563eb", "#d97706", "#059669"].map(c => (
                                        <button key={c} onClick={() => handleColorChange(c)} className={`w-8 h-8 rounded-full border shadow-sm transition-transform hover:scale-110 ${shirtColors.body === c ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`} style={{backgroundColor: c}} />
                                    ))}
                                    <div className="relative">
                                        <Droplet className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14}/>
                                        <input type="color" className="w-8 h-8 opacity-0 cursor-pointer" onChange={e => handleColorChange(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Sleeve</label>
                                    <div className="flex rounded-md shadow-sm">
                                        <button onClick={() => handleConfigChange('sleeve', 'half')} className={`flex-1 px-3 py-2 text-xs border rounded-l-md ${shirtConfig.sleeve === 'half' ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'bg-white text-gray-600'}`}>Half</button>
                                        <button onClick={() => handleConfigChange('sleeve', 'full')} className={`flex-1 px-3 py-2 text-xs border-t border-b border-r rounded-r-md ${shirtConfig.sleeve === 'full' ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'bg-white text-gray-600'}`}>Full</button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Neck</label>
                                    <div className="flex rounded-md shadow-sm">
                                        <button onClick={() => handleConfigChange('neck', 'round')} className={`flex-1 px-3 py-2 text-xs border rounded-l-md ${shirtConfig.neck === 'round' ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'bg-white text-gray-600'}`}>Round</button>
                                        <button onClick={() => handleConfigChange('neck', 'polo')} className={`flex-1 px-3 py-2 text-xs border-t border-b border-r rounded-r-md ${shirtConfig.neck === 'polo' ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' : 'bg-white text-gray-600'}`}>Polo</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TEXT TAB */}
                    {activeTab === 'text' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-200">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Content</label>
                                <textarea 
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                    rows={3} 
                                    placeholder="Enter text..." 
                                    value={customizations[activeSide].text.content} 
                                    onChange={e => updateCustomization('content', e.target.value)} 
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Font</label>
                                    <select className="w-full p-2 border rounded-lg bg-white" value={customizations[activeSide].text.font} onChange={e => updateCustomization('font', e.target.value)}>
                                        <option value="Arial">Arial</option>
                                        <option value="Verdana">Verdana</option>
                                        <option value="Courier New">Courier</option>
                                        <option value="Impact">Impact</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Color</label>
                                    <div className="flex items-center gap-2 border p-1 rounded-lg">
                                        <input type="color" className="w-8 h-8 rounded cursor-pointer border-none" value={customizations[activeSide].text.color} onChange={e => updateCustomization('color', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* GRAPHIC TAB */}
                    {activeTab === 'graphic' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-200">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Upload Image</label>
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                        <p className="text-xs text-gray-500">Click to upload (PNG/JPG)</p>
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                        if(e.target.files[0]) {
                                            const reader = new FileReader();
                                            reader.onload = (ev) => updateCustomization('content', ev.target.result);
                                            reader.readAsDataURL(e.target.files[0]);
                                        }
                                    }}/>
                                </label>
                            </div>
                            {customizations[activeSide].graphic.content && (
                                <button onClick={() => updateCustomization('content', null)} className="w-full py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 text-sm font-bold">Remove Graphic</button>
                            )}
                        </div>
                    )}

                    {/* Common Transform Controls */}
                    {activeTab !== 'style' && activeTab !== 'permissions' && (
                        <div className="pt-6 border-t border-gray-100">
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-4">Transforms</label>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <ZoomIn size={16} className="text-gray-400" />
                                    <input type="range" min="0.2" max="5" step="0.1" className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                                        value={customizations[activeSide][activeItem].scale} 
                                        onChange={e => updateCustomization('scale', parseFloat(e.target.value))} 
                                    />
                                    <span className="text-xs w-8 text-right text-gray-500">{customizations[activeSide][activeItem].scale.toFixed(1)}x</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <RotateCcw size={16} className="text-gray-400" />
                                    <input type="range" min="0" max="360" className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                                        value={customizations[activeSide][activeItem].rotation} 
                                        onChange={e => updateCustomization('rotation', parseInt(e.target.value))} 
                                    />
                                    <span className="text-xs w-8 text-right text-gray-500">{customizations[activeSide][activeItem].rotation}°</span>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-xs rounded-lg flex gap-2">
                                <MousePointer2 size={16} />
                                <span><strong>Pro Tip:</strong> Drag elements on canvas to move. Use sliders to scale/rotate.</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 md:p-6 border-t border-gray-200 bg-gray-50">
                <button 
                    onClick={handleSave} 
                    disabled={isSubmitting} 
                    className="w-full bg-black text-white py-3 md:py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />} 
                    Save Template
                </button>
            </div>
        </div>

        {/* RIGHT SIDE: PREVIEW CANVAS */}
        <div className="flex-1 flex flex-col relative bg-gray-200 overflow-hidden min-h-[50vh] lg:h-auto">
            {/* Toolbar */}
            <div className="absolute top-4 right-4 z-10 bg-white p-1 rounded-lg shadow-md flex gap-1 border border-gray-200">
                <button onClick={() => setActiveSide("front")} className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-bold rounded-md transition-colors ${activeSide === 'front' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Front</button>
                <button onClick={() => setActiveSide("back")} className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-bold rounded-md transition-colors ${activeSide === 'back' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Back</button>
            </div>

            {/* Canvas Area - RESPONSIVE CONTAINER */}
            <div 
                className="flex-1 flex items-center justify-center p-4 md:p-10" 
                onMouseMove={handleMouseMove} 
                onTouchMove={handleMouseMove}
                onWheel={handleWheel}
            >
                <div 
                    ref={containerRef}
                    // Responsive width/height logic using Aspect Ratio
                    className="relative h-[40vh] md:h-[60vh] lg:h-[70vh] aspect-[500/600] shadow-2xl transition-all duration-300 bg-transparent"
                >
                    {activeSide === "front" ? 
                        <TShirtFrontSvg colors={shirtColors} config={shirtConfig} /> : 
                        <TShirtBackSvg colors={shirtColors} config={shirtConfig} />
                    }
                    
                    <CustomizationOverlay 
                        customization={customizations[activeSide]} 
                        activeTab={activeTab}
                        activeItem={activeItem}
                        onMouseDown={handleMouseDown}
                    />
                </div>
            </div>
            
            {/* Help Text */}
            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none px-4">
                <span className="bg-black/50 text-white px-3 py-1.5 rounded-full text-[10px] md:text-xs font-medium backdrop-blur-md">
                    {isDragging ? 'Dragging...' : 'Drag elements to position • Use sliders to Resize'}
                </span>
            </div>
        </div>
    </div>
  );
}