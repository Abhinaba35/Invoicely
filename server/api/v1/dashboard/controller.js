const Invoice = require('../../../models/invoiceSchema');
const Expense = require('../../../models/expenseSchema');

const mongoose = require('mongoose');
exports.getDashboardAnalytics = async (req, res) => {
  try {
    // Ensure userId is an ObjectId for aggregation
    const userId = new mongoose.Types.ObjectId(req.user._id);

    // Total income (sum of paid invoices)
    const totalIncome = await Invoice.aggregate([
      { $match: { user: userId, status: 'paid' } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);

    // Total expenses
    const totalExpenses = await Expense.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const monthlyIncome = await Invoice.aggregate([
      { $match: { user: userId, status: 'paid' } },
      {
        $addFields: {
          paymentDate: { $ifNull: ["$paidAt", "$createdAt"] }
        }
      },
      {
        $group: {
          _id: { year: { $year: "$paymentDate" }, month: { $month: "$paymentDate" } },
          total: { $sum: "$total" }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthlyExpenses = await Expense.aggregate([
      { $match: { user: userId } },
      { $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        total: { $sum: "$amount" }
      } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Top clients (by invoice total)
    const topClients = await Invoice.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$client.name", total: { $sum: "$total" } } },
      { $sort: { total: -1 } },
      { $limit: 5 }
    ]);

    // Invoice status breakdown
    const statusBreakdown = await Invoice.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Total balance
    const totalBalance = (totalIncome[0]?.total || 0) - (totalExpenses[0]?.total || 0);

    // Category-wise expense aggregation
    const categoryExpenses = await Expense.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } }
    ]);

    res.json({
      totalIncome: totalIncome[0]?.total || 0,
      totalExpenses: totalExpenses[0]?.total || 0,
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      topClients,
      statusBreakdown,
      categoryExpenses
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
