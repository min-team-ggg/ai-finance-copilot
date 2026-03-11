const db = require('../config/database');

class Transaction {
  // Get all transactions for a user
  static getAll(userId, limit = 100, callback) {
    const stmt = db.prepare(`
      SELECT * FROM transactions
      WHERE user_id = ?
      ORDER BY date DESC
      LIMIT ?
    `);
    stmt.all(userId, limit, (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  }

  // Get transaction by ID
  static getById(id, callback) {
    const stmt = db.prepare('SELECT * FROM transactions WHERE id = ?');
    stmt.get(id, (err, row) => {
      if (err) return callback(err);
      callback(null, row);
    });
  }

  // Create new transaction
  static create(transaction, callback) {
    const stmt = db.prepare(`
      INSERT INTO transactions (user_id, amount, category, date, description)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(
      transaction.user_id,
      transaction.amount,
      transaction.category,
      transaction.date,
      transaction.description || null,
      function(err) {
        if (err) return callback(err);
        Transaction.getById(this.lastID, callback);
      }
    );
  }

  // Update transaction
  static update(id, updates, callback) {
    const stmt = db.prepare(`
      UPDATE transactions
      SET amount = ?, category = ?, date = ?, description = ?
      WHERE id = ?
    `);
    stmt.run(
      updates.amount,
      updates.category,
      updates.date,
      updates.description || null,
      id,
      function(err) {
        if (err) return callback(err);
        if (this.changes === 0) {
          return callback(null, null);
        }
        Transaction.getById(id, callback);
      }
    );
  }

  // Delete transaction
  static delete(id, callback) {
    const stmt = db.prepare('DELETE FROM transactions WHERE id = ?');
    stmt.run(id, function(err) {
      if (err) return callback(err);
      callback(null, { changes: this.changes });
    });
  }

  // Get transactions by category
  static getByCategory(userId, category, callback) {
    const stmt = db.prepare(`
      SELECT * FROM transactions
      WHERE user_id = ? AND category = ?
      ORDER BY date DESC
    `);
    stmt.all(userId, category, (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  }

  // Get transactions in date range
  static getByDateRange(userId, startDate, endDate, callback) {
    const stmt = db.prepare(`
      SELECT * FROM transactions
      WHERE user_id = ? AND date BETWEEN ? AND ?
      ORDER BY date DESC
    `);
    stmt.all(userId, startDate, endDate, (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  }
}

module.exports = Transaction;
