const db = require('../config/database');

db.serialize(() => {
  // Create Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create Transactions table
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      date DATE NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create Budgets table
  db.run(`
    CREATE TABLE IF NOT EXISTS budgets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      category TEXT NOT NULL,
      limit_amount REAL NOT NULL,
      spent REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, category)
    )
  `);

  // Insert sample user
  db.run(`
    INSERT OR IGNORE INTO users (email, password_hash)
    VALUES ('test@example.com', 'hashed_password_placeholder')
  `);

  // Insert sample transactions
  const transactions = [
    [1, 50.00, 'Food', '2024-03-10', 'Grocery shopping'],
    [1, 25.50, 'Transport', '2024-03-10', 'Gas station'],
    [1, 120.00, 'Entertainment', '2024-03-09', 'Concert tickets'],
    [1, 35.00, 'Food', '2024-03-09', 'Restaurant dinner'],
    [1, 80.00, 'Shopping', '2024-03-08', 'New shoes'],
  ];

  const insertTransaction = db.prepare(`
    INSERT INTO transactions (user_id, amount, category, date, description)
    VALUES (?, ?, ?, ?, ?)
  `);

  transactions.forEach(tx => {
    insertTransaction.run(...tx);
  });

  insertTransaction.finalize();

  // Insert sample budgets
  const budgets = [
    [1, 'Food', 500, 105],
    [1, 'Transport', 200, 25.50],
    [1, 'Entertainment', 150, 120],
    [1, 'Shopping', 300, 80],
  ];

  const insertBudget = db.prepare(`
    INSERT OR IGNORE INTO budgets (user_id, category, limit_amount, spent)
    VALUES (?, ?, ?, ?)
  `);

  budgets.forEach(budget => {
    insertBudget.run(...budget);
  });

  insertBudget.finalize();

  console.log('Database initialized successfully!');
  console.log('Sample data inserted.');
  db.close();
});
