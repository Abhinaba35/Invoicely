const Invoice = require('../../../models/invoiceSchema');
const Expense = require('../../../models/expenseSchema');

exports.getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

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

    // Monthly income/expense (last 6 months)
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const monthlyIncome = await Invoice.aggregate([
      { $match: { user: userId, createdAt: { $gte: sixMonthsAgo }, status: 'paid' } },
      { $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        total: { $sum: "$total" }
      } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthlyExpenses = await Expense.aggregate([
      { $match: { user: userId, createdAt: { $gte: sixMonthsAgo } } },
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

    res.json({
      totalIncome: totalIncome[0]?.total || 0,
      totalExpenses: totalExpenses[0]?.total || 0,
      monthlyIncome,
      monthlyExpenses,
      topClients,
      statusBreakdown
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 