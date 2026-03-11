const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// GET /api/health-score - Get financial health score
router.get('/', (req, res) => {
  try {
    const userId = req.query.user_id || 1; // Default to user 1 for testing

    // Get data
    Transaction.getAll(userId, 1000, (err, transactions) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      Budget.getWithPercentage(userId, (err, budgets) => {
        if (err) {
          return res.status(500).json({
            success: false,
            error: err.message
          });
        }

        // Calculate health score (0-100)
        let score = 100;
        const factors = [];

        // Factor 1: Budget adherence (weight: 40%)
        const exceededBudgets = budgets.filter(b => b.percentage_used >= 100).length;
        const warningBudgets = budgets.filter(b => b.percentage_used >= 80 && b.percentage_used < 100).length;

        if (exceededBudgets > 0) {
          const budgetPenalty = exceededBudgets * 20;
          score -= budgetPenalty;
          factors.push({
            name: 'Budget Adherence',
            score: Math.max(0, 40 - budgetPenalty),
            maxScore: 40,
            status: exceededBudgets > 0 ? 'poor' : 'good',
            details: `${exceededBudgets} budgets exceeded, ${warningBudgets} in warning zone`
          });
        } else {
          factors.push({
            name: 'Budget Adherence',
            score: 40,
            maxScore: 40,
            status: 'excellent',
            details: 'All budgets on track'
          });
        }

        // Factor 2: Spending consistency (weight: 20%)
        if (transactions.length > 5) {
          const amounts = transactions.map(t => t.amount);
          const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
          const variance = amounts.reduce((sum, amount) => sum + Math.pow(amount - avg, 2), 0) / amounts.length;
          const stdDev = Math.sqrt(variance);
          const consistencyScore = Math.max(0, 20 - (stdDev / avg) * 10);

          factors.push({
            name: 'Spending Consistency',
            score: Math.round(consistencyScore),
            maxScore: 20,
            status: consistencyScore > 15 ? 'excellent' : consistencyScore > 10 ? 'good' : 'needs improvement',
            details: 'Based on transaction variance'
          });

          score += consistencyScore - 20; // Adjust base score
        } else {
          factors.push({
            name: 'Spending Consistency',
            score: 20,
            maxScore: 20,
            status: 'pending',
            details: 'Need more transaction data'
          });
        }

        // Factor 3: Transaction frequency (weight: 15%)
        const recentTransactions = transactions.filter(t => {
          const txDate = new Date(t.date);
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return txDate >= monthAgo;
        });

        const frequencyScore = Math.min(15, recentTransactions.length * 2);
        factors.push({
          name: 'Tracking Frequency',
          score: frequencyScore,
          maxScore: 15,
          status: frequencyScore >= 10 ? 'excellent' : frequencyScore >= 5 ? 'good' : 'needs improvement',
          details: `${recentTransactions.length} transactions in the last month`
        });

        score += frequencyScore - 15;

        // Factor 4: Category diversity (weight: 15%)
        const categories = new Set(transactions.map(t => t.category));
        const diversityScore = Math.min(15, categories.size * 3);
        factors.push({
          name: 'Category Coverage',
          score: diversityScore,
          maxScore: 15,
          status: categories.size >= 5 ? 'excellent' : categories.size >= 3 ? 'good' : 'limited',
          details: `${categories.size} spending categories tracked`
        });

        score += diversityScore - 15;

        // Factor 5: Budget coverage (weight: 10%)
        const coverageScore = Math.min(10, budgets.length * 2);
        factors.push({
          name: 'Budget Coverage',
          score: coverageScore,
          maxScore: 10,
          status: budgets.length >= 5 ? 'excellent' : budgets.length >= 3 ? 'good' : 'needs setup',
          details: `${budgets.length} budgets configured`
        });

        score += coverageScore - 10;

        // Ensure score is between 0 and 100
        score = Math.max(0, Math.min(100, Math.round(score)));

        // Overall rating
        let rating = 'Excellent';
        if (score >= 80) rating = 'Excellent';
        else if (score >= 60) rating = 'Good';
        else if (score >= 40) rating = 'Fair';
        else rating = 'Needs Improvement';

        res.json({
          success: true,
          data: {
            overallScore: score,
            rating: rating,
            factors: factors,
            recommendations: generateRecommendations(score, factors, budgets)
          }
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

// Helper function to generate recommendations
function generateRecommendations(score, factors, budgets) {
  const recommendations = [];

  if (score < 60) {
    recommendations.push({
      priority: 'high',
      category: 'General',
      message: 'Your financial health needs attention. Focus on sticking to your budgets.'
    });
  }

  const budgetFactor = factors.find(f => f.name === 'Budget Adherence');
  if (budgetFactor && budgetFactor.status === 'poor') {
    recommendations.push({
      priority: 'high',
      category: 'Budgets',
      message: 'You\'ve exceeded one or more budgets. Review your spending and adjust limits or reduce expenses.'
    });
  }

  const frequencyFactor = factors.find(f => f.name === 'Tracking Frequency');
  if (frequencyFactor && frequencyFactor.status === 'needs improvement') {
    recommendations.push({
      priority: 'medium',
      category: 'Tracking',
      message: 'Track your expenses more regularly for better insights. Aim to log all transactions.'
    });
  }

  const coverageFactor = factors.find(f => f.name === 'Budget Coverage');
  if (coverageFactor && coverageFactor.status === 'needs setup') {
    recommendations.push({
      priority: 'medium',
      category: 'Budgets',
      message: 'Set up budgets for your major spending categories to better control your finances.'
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      priority: 'low',
      category: 'General',
      message: 'Great job! Your financial health is on track. Keep monitoring your spending regularly.'
    });
  }

  return recommendations;
}

module.exports = router;
