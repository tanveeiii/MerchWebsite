// Run this file with: node test-gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config(); // Load .env file

async function checkModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("❌ No GEMINI_API_KEY found in .env file");
    return;
  }

  console.log("🔑 Using API Key:", apiKey.substring(0, 8) + "...");

  try {
    // We will use the raw API to list models because the SDK helper sometimes hides this
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();

    if (data.error) {
      console.error("❌ API Error:", data.error.message);
      return;
    }

    console.log("\n✅ AVAILABLE MODELS FOR YOUR KEY:");
    console.log("---------------------------------");
    
    const models = data.models || [];
    const chatModels = models.filter(m => m.supportedGenerationMethods.includes("generateContent"));

    chatModels.forEach(m => {
      console.log(`- ${m.name.replace('models/', '')}`);
    });

    console.log("---------------------------------");
    console.log("👉 Please pick one of the names above and put it in your chat.service.ts");

  } catch (error) {
    console.error("❌ Network/Script Error:", error);
  }
}

checkModels();