const { GoogleGenAI } = require("@google/genai");
const Expense = require("../../../models/expenseSchema");
const Invoice = require("../../../models/invoiceSchema");

// Use gemini-1.5-flash for free tier, or gemini-1.5-pro if available
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-1.5-flash";
const API_KEY = process.env.GEMINI_API_KEY;

async function run(req, res) {
  try {
    if (!API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not set" });
    }

    // Check if MongoDB is connected
    const mongoose = require("mongoose");
    const connectionState = mongoose.connection.readyState;
    
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    if (connectionState === 2) {
      // Connection in progress, wait up to 5 seconds
      let attempts = 0;
      while (mongoose.connection.readyState !== 1 && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
      }
    }
    
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        error: "Database connection not ready. Please try again.",
        state: connectionState 
      });
    }

    const ai = new GoogleGenAI({
      apiKey: API_KEY,
    });

    const userId = req.user._id || req.user.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const invoices = await Invoice.find({ user: userId }).lean();
    const expenses = await Expense.find({ user: userId }).lean();

    const prompt = `You are a financial assistant. Analyze the following financial data and provide insights.

Invoices: ${JSON.stringify(invoices)}
Expenses: ${JSON.stringify(expenses)}

Please provide a comprehensive financial analysis including:
1. Total income from invoices
2. Total expenses
3. Net profit/loss
4. Spending patterns and categories
5. Recommendations for financial improvement`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    res.json({ analysis: response.text });
  } catch (error) {
    console.error("Error in Gemini RAG:", error);
    
    // Handle specific error types
    const statusCode = error.status || error.error?.code || 500;
    
    if (statusCode === 429) {
      // Rate limit or quota exceeded
      const errorMessage = error.error?.message || error.message || "API quota exceeded";
      const retryInfo = error.error?.details?.find(d => d['@type'] === 'type.googleapis.com/google.rpc.RetryInfo');
      const retryAfter = retryInfo?.retryDelay || '30';
      
      return res.status(429).json({ 
        error: "API quota exceeded. Please try again later or upgrade your plan.",
        message: errorMessage,
        retryAfter: retryAfter,
        details: "You've reached the free tier limit. Please wait a moment before trying again."
      });
    }
    
    if (statusCode === 404) {
      // Model not found
      return res.status(404).json({ 
        error: "The selected AI model is not available. Please check your GEMINI_MODEL environment variable.",
        suggestion: "Try using 'gemini-1.5-flash' or 'gemini-1.5-pro'"
      });
    }
    
    // Generic error
    res.status(statusCode).json({ 
      error: error.error?.message || error.message || "Internal Server Error",
      details: error.error?.details || "An unexpected error occurred"
    });
  }
}

module.exports = { run };
