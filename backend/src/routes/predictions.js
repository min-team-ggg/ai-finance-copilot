const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// GET /api/predictions - Get expense predictions
router.get('/', (req, res) => {
  try {
    const userId = req.query.user_id || 1; // Default to user 1 for testing
    const months = parseInt(req.query.months) || 3; // Predict next N months

    // Get all transactions
    Transaction.getAll(userId, 1000, (err, transactions) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      if (transactions.length < 3) {
        return res.json({
          success: true,
          data: {
            message: 'Not enough data for accurate predictions. Continue tracking your expenses.',
            predictions: [],
            confidence: 'low'
          }
        });
      }

      // Calculate monthly averages by category
      const monthlyData = {};

      transactions.forEach(tx => {
        const month = tx.date.substring(0, 7); // YYYY-MM
        if (!monthlyData[month]) {
          monthlyData[month] = { total: 0, categories: {} };
        }
        monthlyData[month].total += tx.amount;

        if (!monthlyData[month].categories[tx.category]) {
          monthlyData[month].categories[tx.category] = 0;
        }
        monthlyData[month].categories[tx.category] += tx.amount;
      });

      // Calculate averages across all months
      const monthsCount = Object.keys(monthlyData).length;
      let totalAverage = 0;
      const categoryAverages = {};

      Object.values(monthlyData).forEach(month => {
        totalAverage += month.total;

        Object.entries(month.categories).forEach(([category, amount]) => {
          if (!categoryAverages[category]) {
            categoryAverages[category] = 0;
          }
          categoryAverages[category] += amount;
        });
      });

      totalAverage = totalAverage / monthsCount;

      Object.keys(categoryAverages).forEach(category => {
        categoryAverages[category] = categoryAverages[category] / monthsCount;
      });

      // Sort months chronologically
      const sortedMonths = Object.keys(monthlyData).sort();
      const recentMonths = sortedMonths.slice(-3); // Last 3 months

      // Calculate trend (simple linear regression)
      let trend = 'stable';
      let trendPercent = 0;

      if (recentMonths.length >= 2) {
        const lastMonth = monthlyData[recentMonths[recentMonths.length - 1]].total;
        const prevMonth = monthlyData[recentMonths[recentMonths.length - 2]].total;
        const diff = lastMonth - prevMonth;
        trendPercent = ((diff / prevMonth) * 100).toFixed(1);

        if (diff > totalAverage * 0.1) {
          trend = 'increasing';
        } else if (diff < -totalAverage * 0.1) {
          trend = 'decreasing';
        }
      }

      // Generate predictions for next N months
      const predictions = [];
      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() + 1); // Start from next month

      for (let i = 0; i < months; i++) {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

        // Apply trend adjustment
        let predictedTotal = totalAverage;
        if (trend === 'increasing') {
          predictedTotal *= 1.05; // 5% increase
        } else if (trend === 'decreasing') {
          predictedTotal *= 0.95; // 5% decrease
        }

        // Predict by category
        const categoryPredictions = Object.entries(categoryAverages).map(([category, avg]) => {
          let categoryPredicted = avg;
          if (trend === 'increasing') {
            categoryPredicted *= 1.05;
          } else if (trend === 'decreasing') {
            categoryPredicted *= 0.95;
          }

          return {
            category,
            predicted: Math.round(categoryPredicted * 100) / 100,
            confidence: monthsCount >= 6 ? 'high' : 'medium'
          };
        });

        // Sort by predicted amount
        categoryPredictions.sort((a, b) => b.predicted - a.predicted);

        predictions.push({
          period: `${year}-${month}`,
          monthName,
          totalPredicted: Math.round(predictedTotal * 100) / 100,
          categories: categoryPredictions,
          confidence: monthsCount >= 6 ? 'high' : monthsCount >= 3 ? 'medium' : 'low'
        });

        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      // Identify high-risk categories (increasing spending)
      const highRiskCategories = [];
      if (recentMonths.length >= 2) {
        Object.entries(categoryAverages).forEach(([category, avg]) => {
          const lastMonth = monthlyData[recentMonths[recentMonths.length - 1]].categories[category] || 0;
          const prevMonth = monthlyData[recentMonths[recentMonths.length - 2]].categories[category] || 0;

          if (lastMonth > prevMonth * 1.2) { // More than 20% increase
            highRiskCategories.push({
              category,
              increase: ((lastMonth - prevMonth) / prevMonth * 100).toFixed(1)
            });
          }
        });
      }

      res.json({
        success: true,
        data: {
          monthlyAverage: Math.round(totalAverage * 100) / 100,
          trend,
          trendPercent,
          predictions,
          highRiskCategories,
          dataPoints: monthsCount,
          confidence: monthsCount >= 6 ? 'high' : monthsCount >= 3 ? 'medium' : 'low',
          disclaimer: 'Predictions are based on historical spending patterns and may not account for future changes.'
        }
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
