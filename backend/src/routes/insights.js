const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// GET /api/insights - Get spending insights
router.get('/', (req, res) => {
  try {
    const userId = req.query.user_id || 1; // Default to user 1 for testing

    // Get all transactions
    Transaction.getAll(userId, 1000, (err, transactions) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      // Calculate insights
      const insights = {
        totalSpent: 0,
        categoryBreakdown: {},
        averageTransaction: 0,
        topSpendingCategories: [],
        monthlyTrend: {},
        budgetStatus: []
      };

      // Total spent
      insights.totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);

      // Category breakdown
      transactions.forEach(tx => {
        if (!insights.categoryBreakdown[tx.category]) {
          insights.categoryBreakdown[tx.category] = 0;
        }
        insights.categoryBreakdown[tx.category] += tx.amount;
      });

      // Average transaction
      insights.averageTransaction = transactions.length > 0
        ? insights.totalSpent / transactions.length
        : 0;

      // Top spending categories
      insights.topSpendingCategories = Object.entries(insights.categoryBreakdown)
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

      // Monthly trend (simple implementation)
      transactions.forEach(tx => {
        const month = tx.date.substring(0, 7); // YYYY-MM
        if (!insights.monthlyTrend[month]) {
          insights.monthlyTrend[month] = 0;
        }
        insights.monthlyTrend[month] += tx.amount;
      });

      // Budget status
      Budget.getWithPercentage(userId, (err, budgets) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: err.message
          });
        }

        insights.budgetStatus = budgets.map(budget => ({
          category: budget.category,
          limit: budget.limit_amount,
          spent: budget.spent,
          remaining: budget.remaining,
          percentageUsed: budget.percentage_used,
          status: budget.percentage_used >= 100 ? 'exceeded'
            : budget.percentage_used >= 80 ? 'warning'
            : 'healthy'
        }));

        res.json({
          success: true,
          data: insights
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
