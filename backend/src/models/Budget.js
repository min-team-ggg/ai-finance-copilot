const db = require('../config/database');

class Budget {
  // Get all budgets for a user
  static getAll(userId, callback) {
    const stmt = db.prepare('SELECT * FROM budgets WHERE user_id = ?');
    stmt.all(userId, (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  }

  // Get budget by ID
  static getById(id, callback) {
    const stmt = db.prepare('SELECT * FROM budgets WHERE id = ?');
    stmt.get(id, (err, row) => {
      if (err) return callback(err);
      callback(null, row);
    });
  }

  // Get budget by category for a user
  static getByCategory(userId, category, callback) {
    const stmt = db.prepare(`
      SELECT * FROM budgets
      WHERE user_id = ? AND category = ?
    `);
    stmt.get(userId, category, (err, row) => {
      if (err) return callback(err);
      callback(null, row);
    });
  }

  // Create new budget
  static create(budget, callback) {
    const stmt = db.prepare(`
      INSERT INTO budgets (user_id, category, limit_amount, spent)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(
      budget.user_id,
      budget.category,
      budget.limit_amount,
      budget.spent || 0,
      function(err) {
        if (err) return callback(err);
        Budget.getById(this.lastID, callback);
      }
    );
  }

  // Update budget
  static update(id, updates, callback) {
    const stmt = db.prepare(`
      UPDATE budgets
      SET category = ?, limit_amount = ?, spent = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(
      updates.category,
      updates.limit_amount,
      updates.spent || 0,
      id,
      function(err) {
        if (err) return callback(err);
        if (this.changes === 0) {
          return callback(null, null);
        }
        Budget.getById(id, callback);
      }
    );
  }

  // Update spent amount
  static updateSpent(id, amount, callback) {
    const stmt = db.prepare(`
      UPDATE budgets
      SET spent = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(amount, id, function(err) {
      if (err) return callback(err);
      if (this.changes === 0) {
        return callback(null, null);
      }
      Budget.getById(id, callback);
    });
  }

  // Delete budget
  static delete(id, callback) {
    const stmt = db.prepare('DELETE FROM budgets WHERE id = ?');
    stmt.run(id, function(err) {
      if (err) return callback(err);
      callback(null, { changes: this.changes });
    });
  }

  // Get budgets with spending percentage
  static getWithPercentage(userId, callback) {
    const stmt = db.prepare(`
      SELECT
        *,
        ROUND((spent / limit_amount) * 100, 2) as percentage_used,
        (limit_amount - spent) as remaining
      FROM budgets
      WHERE user_id = ?
    `);
    stmt.all(userId, (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  }
}

module.exports = Budget;
