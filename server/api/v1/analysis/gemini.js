const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const Expense = require("../../../models/expenseSchema");
const Invoice = require("../../../models/invoiceSchema");

const MODEL_NAME = "gemini-1.5-pro-latest";
const API_KEY = process.env.GEMINI_API_KEY;

async function run(req, res) {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 1,
      topK: 0,
      topP: 0.95,
      maxOutputTokens: 8192,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const userId = req.user._id || req.user.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const invoices = await Invoice.find({ userId });
    const expenses = await Expense.find({ userId });

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: "user",
          parts: [{ text: "You are a financial assistant. Analyze the following financial data and provide insights." }],
        },
        {
          role: "model",
          parts: [{ text: "Okay, I am ready to help. Please provide the data." }],
        },
      ],
    });

    const result = await chat.sendMessage(`Invoices: ${JSON.stringify(invoices)}, Expenses: ${JSON.stringify(expenses)}`);
    const response = result.response;
    res.json({ analysis: response.text() });
  } catch (error) {
    console.error("Error in Gemini RAG:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { run };
