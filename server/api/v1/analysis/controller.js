const Invoice = require('../../../models/invoiceSchema');
const Expense = require('../../../models/expenseSchema');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getAIAnalysis = async (req, res) => {
  try {
    const userId = req.user._id;
    const invoices = await Invoice.find({ user: userId });
    const expenses = await Expense.find({ user: userId });

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      You are a financial analyst. Analyze the following financial data and provide a detailed report.
      The report should include:
      1.  A summary of the user's financial health.
      2.  An analysis of their income and expenses.
      3.  An analysis of their invoices.
      4.  Suggestions for improvement.

      Here is the data:
      Invoices: ${JSON.stringify(invoices)}
      Expenses: ${JSON.stringify(expenses)}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ analysis: text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
