const express = require('express');
const router = express.Router();
const { chatValidation } = require('../middleware/validation');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// POST /api/chat - AI chat endpoint (placeholder for OpenAI integration)
router.post('/', chatValidation, async (req, res) => {
  try {
    const { message, user_id } = req.body;
    const userId = user_id || 1; // Default to user 1 for testing

    // Placeholder responses (will be replaced with OpenAI API calls)
    const responses = {
      'help': 'I can help you with:\n- Checking your transactions\n- Analyzing your spending\n- Getting financial insights\n- Budget recommendations\n- Predicting future expenses\n\nJust ask me anything about your finances!',
      'spending': 'Let me check your spending patterns...',
      'budget': 'Here\'s your budget status...',
      'default': 'I\'m still learning! For now, I can provide basic financial insights. Full AI capabilities coming soon with OpenAI integration.'
    };

    // Simple keyword matching for placeholder responses
    let response = responses.default;
    const lowerMessage = message.toLowerCase();

    // Get user data for context
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

        // Enhanced placeholder responses with real data
        if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
          response = responses.help;
        } else if (lowerMessage.includes('spent') || lowerMessage.includes('spending')) {
          const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);
          const topCategory = Object.entries(
            transactions.reduce((acc, tx) => {
              acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
              return acc;
            }, {})
          ).sort((a, b) => b[1] - a[1])[0];

          response = `💰 **Your Spending Summary**\n\n` +
            `Total spent: $${totalSpent.toFixed(2)}\n` +
            `Number of transactions: ${transactions.length}\n` +
            `Top spending category: ${topCategory ? topCategory[0] : 'N/A'} ($${topCategory ? topCategory[1].toFixed(2) : '0'})\n\n` +
            `Would you like more detailed insights?`;
        } else if (lowerMessage.includes('budget')) {
          const exceededBudgets = budgets.filter(b => b.percentage_used >= 100);
          const warningBudgets = budgets.filter(b => b.percentage_used >= 80 && b.percentage_used < 100);

          response = `📊 **Budget Status**\n\n`;

          if (exceededBudgets.length > 0) {
            response += `⚠️ Exceeded budgets:\n`;
            exceededBudgets.forEach(b => {
              response += `  - ${b.category}: $${b.spent.toFixed(2)} / $${b.limit.toFixed(2)}\n`;
            });
            response += '\n';
          }

          if (warningBudgets.length > 0) {
            response += `⚡ Warning budgets:\n`;
            warningBudgets.forEach(b => {
              response += `  - ${b.category}: $${b.spent.toFixed(2)} / $${b.limit.toFixed(2)} (${b.percentage_used}%)\n`;
            });
            response += '\n';
          }

          if (exceededBudgets.length === 0 && warningBudgets.length === 0) {
            response += `✅ All budgets are on track!\n\n`;
          }

          response += `You have ${budgets.length} budgets set up.`;
        } else if (lowerMessage.includes('insight') || lowerMessage.includes('analysis')) {
          const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);
          const avgTransaction = transactions.length > 0 ? totalSpent / transactions.length : 0;

          response = `📈 **Spending Insights**\n\n` +
            `Total spent: $${totalSpent.toFixed(2)}\n` +
            `Average per transaction: $${avgTransaction.toFixed(2)}\n` +
            `Transaction count: ${transactions.length}\n\n` +
            `💡 Tip: ${getSpendingTip(transactions, budgets)}`;
        } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
          response = `👋 Hello! I'm your Finance Copilot. I'm here to help you understand and manage your finances better.\n\n` +
            `You can ask me about:\n` +
            `- Your spending\n` +
            `- Budgets\n` +
            `- Financial insights\n` +
            `- Predictions\n\n` +
            `What would you like to know?`;
        } else {
          response = `🤔 I understood: "${message}"\n\n` +
            `I'm currently in demo mode with limited capabilities. Full AI integration with OpenAI is coming soon!\n\n` +
            `For now, you can ask me about:\n` +
            `- Spending summary\n` +
            `- Budget status\n` +
            `- Financial insights\n` +
            `- General help`;
        }

        res.json({
          success: true,
          data: {
            message: response,
            timestamp: new Date().toISOString(),
            aiEnabled: false,
            note: 'This is a placeholder response. Full OpenAI integration coming soon.'
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

// Helper function for spending tips
function getSpendingTip(transactions, budgets) {
  const exceededBudgets = budgets.filter(b => b.percentage_used >= 100);
  if (exceededBudgets.length > 0) {
    return `You've exceeded your budget for ${exceededBudgets[0].category}. Consider reducing expenses in this category.`;
  }

  const topCategory = Object.entries(
    transactions.reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1])[0];

  if (topCategory) {
    return `Your highest spending category is ${topCategory[0]}. Make sure you have a budget set for it!`;
  }

  return 'Keep tracking your expenses regularly for better insights.';
}

module.exports = router;
