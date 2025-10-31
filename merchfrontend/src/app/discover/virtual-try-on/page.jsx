"use client";

import React, { useState } from "react";
import { NavbarFinal } from "@/components/Navbar"; // Using path alias
import Footer from "@/components/Footer"; // Using path alias
import { Upload, WandSparkles, Loader2, AlertTriangle, Image as ImageIcon } from "lucide-react";

// Helper function to read file as Base64
const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result.split(',')[1]); // Get just the Base64 part
  reader.onerror = error => reject(error);
});

export default function VirtualTryOnPage() {
  const [userImage, setUserImage] = useState(null);
  const [designImage, setDesignImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [userImageFile, setUserImageFile] = useState(null);
  const [designImageFile, setDesignImageFile] = useState(null);

  const handleUserImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserImageFile(file); // Store the file object
      setUserImage(URL.createObjectURL(file));
      setGeneratedImage(null); // Clear previous result
    }
  };

  const handleDesignImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDesignImageFile(file); // Store the file object
      setDesignImage(URL.createObjectURL(file));
      setGeneratedImage(null); // Clear previous result
    }
  };

  const generateImage = async () => {
    if (!userImageFile || !designImageFile) {
      setError("Please upload both a photo of yourself and a design image.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      // 1. Convert images to Base64
      const userImageBase64 = await toBase64(userImageFile);
      const designImageBase64 = await toBase64(designImageFile);
      
      const apiKey = ""; // Leave as-is, Canvas will inject the key
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`;

      // 2. Construct the prompt and payload
      const payload = {
        contents: [
          {
            parts: [
              {
                text: "You are a virtual try-on assistant. The user has provided two images. The first image is a photo of themselves. The second image is a t-shirt design. Your task is to realistically place the t-shirt design from the second image onto the t-shirt the person is wearing in the first image. Make it look natural, respecting the folds, shadows, and perspective of the clothing. Do not change the person or the background. Only output the final, edited image."
              },
              {
                inlineData: {
                  mimeType: userImageFile.type,
                  data: userImageBase64
                }
              },
              {
                inlineData: {
                  mimeType: designImageFile.type,
                  data: designImageBase64
                }
              }
            ]
          }
        ],
        generationConfig: {
            responseModalities: ['IMAGE']
        },
      };

      // 3. Make the API call with retries
      let response;
      for (let i = 0; i < 3; i++) { // Retry up to 3 times
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) break; // Success!
        if (response.status === 429 || response.status >= 500) {
          await new Promise(resolve => setTimeout(resolve, (i + 1) * 1000)); // Exponential backoff
        } else {
          break; // Don't retry on client errors (e.g., 400)
        }
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Response:", errorData);
        throw new Error(`Failed to generate image. Status: ${response.status}. ${errorData?.error?.message || 'Please try again.'}`);
      }

      const result = await response.json();
      
      // 4. Extract the image data
      const base64Data = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;

      if (!base64Data) {
        console.error("No image data in response:", result);
        throw new Error("The model did not return an image. Please try a different photo or design.");
      }

      // 5. Set the generated image for display
      const imageUrl = `data:image/png;base64,${base64Data}`;
      setGeneratedImage(imageUrl);

    } catch (err) {
      console.error("Virtual Try-On Error:", err);
      setError(err.message || "An unknown error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper component for file upload boxes
  const UploadBox = ({ title, onUpload, imageSrc, icon }) => (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">{title}</label>
      <div className="aspect-square w-full rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center relative bg-gray-50 overflow-hidden">
        {imageSrc ? (
          <img src={imageSrc} alt="Upload preview" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-gray-400">
            {icon}
            <p className="mt-2 text-sm">Click to upload</p>
          </div>
        )}
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={onUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
  
  // Helper component for the result display
  const ResultBox = () => (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">Your Virtual Try-On</label>
      <div className="aspect-square w-full rounded-lg border-2 border-gray-300 flex items-center justify-center relative bg-gray-900 overflow-hidden">
        {isLoading && (
          <div className="text-center text-white">
            <Loader2 className="w-12 h-12 animate-spin mx-auto" />
            <p className="mt-4 text-lg font-medium">Generating your try-on...</p>
            <p className="text-sm text-gray-300">This can take up to 30 seconds.</p>
          </div>
        )}
        {error && !isLoading && (
          <div className="text-center text-red-400 p-4">
            <AlertTriangle className="w-12 h-12 mx-auto" />
            <p className="mt-4 font-medium">Generation Failed</p>
            <p className="text-sm text-gray-300">{error}</p>
          </div>
        )}
        {generatedImage && !isLoading && (
          <img src={generatedImage} alt="Generated virtual try-on" className="w-full h-full object-contain" />
        )}
        {!isLoading && !error && !generatedImage && (
           <div className="text-center text-gray-400">
            <ImageIcon className="w-16 h-16 mx-auto" />
            <p className="mt-2 text-sm">Your result will appear here</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavbarFinal />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-7xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Virtual Try-On
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Upload a photo of yourself and a design to see how it looks before you buy!
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Column 1: Inputs */}
          <div className="bg-white p-8 rounded-2xl shadow-xl space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <UploadBox
                title="1. Upload Your Photo"
                onUpload={handleUserImageUpload}
                imageSrc={userImage}
                icon={<ImageIcon className="w-12 h-12" />}
              />
              <UploadBox
                title="2. Upload Your Design"
                onUpload={handleDesignImageUpload}
                imageSrc={designImage}
                icon={<WandSparkles className="w-12 h-12" />}
              />
            </div>
            
            <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-600 mb-4">
                    <span className="font-bold">Pro Tip:</span> For best results, use a clear, front-facing photo and a design with a transparent background (PNG).
                </p>
              <button
                onClick={generateImage}
                disabled={isLoading || !userImage || !designImage}
                className="w-full flex items-center justify-center text-lg font-semibold px-8 py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500 text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <WandSparkles className="w-6 h-6 mr-3" />
                    Generate My Try-On
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Column 2: Output */}
          <div className="p-8 rounded-2xl">
            <ResultBox />
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}

