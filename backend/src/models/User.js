const db = require('../config/database');

class User {
  // Get user by ID
  static getById(id, callback) {
    const stmt = db.prepare('SELECT id, email, created_at FROM users WHERE id = ?');
    stmt.get(id, (err, row) => {
      if (err) return callback(err);
      callback(null, row);
    });
  }

  // Get user by email
  static getByEmail(email, callback) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    stmt.get(email, (err, row) => {
      if (err) return callback(err);
      callback(null, row);
    });
  }

  // Create new user
  static create(user, callback) {
    const stmt = db.prepare(`
      INSERT INTO users (email, password_hash)
      VALUES (?, ?)
    `);
    stmt.run(user.email, user.password_hash, function(err) {
      if (err) return callback(err);
      User.getById(this.lastID, callback);
    });
  }

  // Update user
  static update(id, updates, callback) {
    const stmt = db.prepare(`
      UPDATE users
      SET email = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    stmt.run(updates.email, id, function(err) {
      if (err) return callback(err);
      if (this.changes === 0) {
        return callback(null, null);
      }
      User.getById(id, callback);
    });
  }

  // Delete user
  static delete(id, callback) {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    stmt.run(id, function(err) {
      if (err) return callback(err);
      callback(null, { changes: this.changes });
    });
  }

  // Verify password (placeholder for bcrypt)
  static verifyPassword(hashedPassword, plainPassword) {
    // In production, use bcrypt.compare()
    // For now, this is a placeholder
    return hashedPassword === 'hashed_' + plainPassword;
  }

  // Hash password (placeholder for bcrypt)
  static hashPassword(password) {
    // In production, use bcrypt.hash()
    // For now, this is a placeholder
    return 'hashed_' + password;
  }
}

module.exports = User;
