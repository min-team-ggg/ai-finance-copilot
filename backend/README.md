# Finance Copilot Backend API

RESTful API backend for the AI-Powered Finance Copilot application.

## Tech Stack

- **Node.js** (18+) - JavaScript runtime
- **Express.js** - Web framework
- **SQLite** (better-sqlite3) - Database for development
- **JWT** - Authentication (placeholder)
- **express-validator** - Request validation
- **dotenv** - Environment configuration

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Initialize database:
```bash
npm run init-db
```

4. Start server:
```bash
# Production
npm start

# Development (with hot reload)
npm run dev
```

## API Endpoints

### Health Check
- `GET /api/health` - API health status

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get transaction by ID
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Insights
- `GET /api/insights` - Get spending insights

### Health Score
- `GET /api/health-score` - Get financial health score

### Predictions
- `GET /api/predictions` - Get expense predictions

### Chat
- `POST /api/chat` - AI chat endpoint (placeholder)

## Database Schema

### Users
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Transactions
```sql
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
```

### Budgets
```sql
CREATE TABLE budgets (
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
```

## Example Requests

### Get Transactions
```bash
curl http://localhost:3000/api/transactions?user_id=1
```

### Create Transaction
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "amount": 50.00,
    "category": "Food",
    "date": "2024-03-11",
    "description": "Grocery shopping"
  }'
```

### Get Health Score
```bash
curl http://localhost:3000/api/health-score?user_id=1
```

### Get Predictions
```bash
curl http://localhost:3000/api/predictions?user_id=1&months=3
```

### Chat
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How much did I spend this month?",
    "user_id": 1
  }'
```

## Next Steps

1. **Authentication**: Implement bcrypt for secure password hashing
2. **Auth Middleware**: Protect routes with `authenticateToken` middleware
3. **OpenAI Integration**: Connect chat endpoint to OpenAI API
4. **PostgreSQL**: Switch to PostgreSQL for production
5. **Testing**: Add unit and integration tests
6. **Documentation**: Generate API documentation with Swagger/OpenAPI
7. **Rate Limiting**: Add rate limiting for API endpoints
8. **Caching**: Implement caching for frequently accessed data

## Development Notes

- Default user ID for testing: 1
- Database file location: `./data/finance.db`
- Sample data is inserted on initialization
- CORS is enabled for development (configure in production)

## License

MIT
