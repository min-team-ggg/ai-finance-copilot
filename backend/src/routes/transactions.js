const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { transactionValidation } = require('../middleware/validation');

// GET /api/transactions - Get all transactions for a user
router.get('/', (req, res) => {
  try {
    const userId = req.query.user_id || 1; // Default to user 1 for testing
    const limit = parseInt(req.query.limit) || 100;

    Transaction.getAll(userId, limit, (err, transactions) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      res.json({
        success: true,
        count: transactions.length,
        data: transactions
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/transactions/:id - Get transaction by ID
router.get('/:id', (req, res) => {
  try {
    Transaction.getById(req.params.id, (err, transaction) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: 'Transaction not found'
        });
      }

      res.json({
        success: true,
        data: transaction
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/transactions - Create new transaction
router.post('/', transactionValidation, (req, res) => {
  try {
    Transaction.create(req.body, (err, transaction) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      res.status(201).json({
        success: true,
        data: transaction,
        message: 'Transaction created successfully'
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/transactions/:id - Update transaction
router.put('/:id', (req, res) => {
  try {
    Transaction.update(req.params.id, req.body, (err, transaction) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: 'Transaction not found'
        });
      }

      res.json({
        success: true,
        data: transaction,
        message: 'Transaction updated successfully'
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/transactions/:id - Delete transaction
router.delete('/:id', (req, res) => {
  try {
    Transaction.delete(req.params.id, (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      if (result.changes === 0) {
        return res.status(404).json({
          success: false,
          error: 'Transaction not found'
        });
      }

      res.json({
        success: true,
        message: 'Transaction deleted successfully'
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
