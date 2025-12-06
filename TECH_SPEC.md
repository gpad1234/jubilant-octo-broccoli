# CRM Application - Technical Specification

## 1. Project Overview

A full-stack Customer Relationship Management (CRM) application built with React and Node.js, featuring real-time customer management, deal pipeline tracking, analytics, and task management with persistent SQLite database storage.

**Repository**: https://github.com/gpad1234/jubilant-octo-broccoli

---

## 2. Architecture Overview

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                   React Frontend (Port 5173)                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Components: Dashboard, Customers, Deals, Analytics   │  │
│  │ State Management: React Hooks (useState, useEffect)   │  │
│  │ Styling: Tailwind CSS v4 with @tailwindcss/postcss   │  │
│  │ Icons: lucide-react (25+ icon components)            │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────┬──────────────────────────────────────────────┘
               │ HTTP/REST API (CORS enabled)
               ▼
┌─────────────────────────────────────────────────────────────┐
│              Express.js Backend (Port 5000)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Routes: /api/customers, /api/deals, /api/tasks,     │  │
│  │         /api/activities                              │  │
│  │ Middleware: CORS, body-parser, error handling        │  │
│  │ Database Connection: SQLite3 with async wrappers     │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────┬──────────────────────────────────────────────┘
               │ SQL Queries
               ▼
┌─────────────────────────────────────────────────────────────┐
│               SQLite Database (crm.db)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Tables: customers, deals, tasks, activities          │  │
│  │ Foreign Keys: Relational integrity enforced          │  │
│  │ Storage: File-based persistent database              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.0 | UI framework |
| Vite | 7.2.5 (rolldown-vite) | Build tool & dev server |
| Tailwind CSS | v4 | CSS framework & styling |
| @tailwindcss/postcss | Latest | PostCSS plugin for Tailwind v4 |
| PostCSS | Latest | CSS transformation |
| lucide-react | Latest | Icon library (25+ icons) |
| ESLint | Latest | Code linting |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ (native fetch support) | Runtime |
| Express.js | 4.18.2 | Web framework |
| SQLite3 | 5.1.6 | Database |
| cors | 2.8.5 | Cross-origin resource sharing |
| body-parser | 1.20.2 | Request body parsing |
| nodemon | 3.0.2 (dev) | Auto-reload during development |

---

## 4. Frontend Structure

### Directory Layout
```
src/
├── components/
│   ├── CRMHome.jsx              # Main dashboard container
│   ├── AddEditCustomerForm.jsx  # Customer add/edit modal (400+ lines)
│   ├── CustomersList.jsx        # Customers table with search/filter
│   ├── DealsPipeline.jsx        # Kanban board with drag-drop
│   ├── AnalyticsDashboard.jsx   # Charts, metrics, tables (250+ lines)
│   ├── ContactForm.jsx          # Reusable contact form (280+ lines)
│   └── CustomerDetail.jsx       # Customer detail view
├── api/
│   └── api.js                   # Centralized API service layer (144 lines)
├── assets/
│   └── react.svg
├── App.jsx                      # Root component
├── App.css                      # Global component styles (empty)
├── index.css                    # Tailwind imports
├── main.jsx                     # App entry point
├── tailwind.config.js           # Tailwind configuration (moved to root)
└── postcss.config.js            # PostCSS configuration (moved to root)

Configuration Files (Root):
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── eslint.config.js
├── index.html
└── package.json
```

### Component Descriptions

#### 1. **CRMHome.jsx** (296 lines)
- **Purpose**: Main dashboard container and tab router
- **State Management**: 
  - `activeTab`: Current tab selection (dashboard, customers, deals, analytics, contact)
  - `stats`: KPI cards (total customers, revenue, active deals, conversion rate)
  - `recentActivities`: Latest activities
  - `upcomingTasks`: Scheduled tasks
  - `loading/error`: API state management
- **Features**:
  - Tab navigation with 5 main sections
  - Real-time dashboard stats from API
  - Add customer modal integration
  - Error handling with retry functionality
- **API Calls**: 
  - `customersAPI.getAll()` - Fetch all customers
  - `activitiesAPI.getAll()` - Fetch recent activities
  - `tasksAPI.getAll()` - Fetch upcoming tasks

#### 2. **CustomersList.jsx** (300 lines)
- **Purpose**: Display all customers in a sortable/filterable table
- **Features**:
  - Search functionality (by name, email, company)
  - Status filtering (all, active, prospect, inactive)
  - Bulk selection with checkbox
  - Action menu (view, edit, delete)
  - Contact buttons (email, phone)
  - Pagination display
  - Loading spinner and error states
- **State Management**:
  - `customers`: Array of customer objects from API
  - `searchTerm`: Current search filter
  - `filterStatus`: Current status filter
  - `selectedCustomers`: Array of selected IDs
  - `loading/error`: API state
- **API Integration**: Fetches from `/api/customers`

#### 3. **AddEditCustomerForm.jsx** (400+ lines)
- **Purpose**: Modal form for creating and editing customers
- **Fields** (11 total):
  1. Full Name (required, text)
  2. Email (required, email validation, unique)
  3. Phone (required, text)
  4. Company (required, text)
  5. Address (optional, text)
  6. City (optional, text)
  7. State (optional, text)
  8. Zip Code (optional, text)
  9. Industry (optional, select dropdown)
  10. Status (required, select dropdown: active/prospect/inactive)
  11. Notes (optional, textarea)
- **Validation**:
  - Required field validation
  - Email format validation
  - Email uniqueness check via API
  - Real-time error feedback
- **Features**:
  - Modal overlay
  - Submit/Cancel buttons
  - Clear form functionality
  - Success notifications
  - Error handling with retry

#### 4. **DealsPipeline.jsx** (250+ lines)
- **Purpose**: Kanban-style sales pipeline with drag-and-drop
- **Features**:
  - 4 pipeline stages: Prospect → Negotiation → Committed → Closed
  - Drag-and-drop deal card movement (updates API in real-time)
  - Deal cards display: title, value, contact name
  - Delete deal functionality with API persistence
  - Color-coded stages
  - Empty state messages
- **State Management**:
  - `deals`: Array of all deals grouped by stage
  - `loading`: API loading state
  - `error`: API error state
- **API Integration**:
  - `dealsAPI.getAll()` - Fetch all deals
  - `dealsAPI.update()` - Update deal stage on drop
  - `dealsAPI.delete()` - Remove deal

#### 5. **AnalyticsDashboard.jsx** (250+ lines)
- **Purpose**: Comprehensive analytics and reporting interface
- **Sections**:
  - **Metrics Cards**: 4 KPI displays (revenue, deals, conversion, avg deal size)
  - **Revenue Chart**: Line chart showing revenue trend over time
  - **Conversion Pie Chart**: Deal stage distribution visualization
  - **Top Customers Table**: List of highest-value customers
  - **Sales by Industry**: Bar chart of sales per industry
- **Features**:
  - Data visualization with responsive charts
  - Sample data structure (ready for API integration)
  - Color-coded visualizations
  - Sortable data tables

#### 6. **ContactForm.jsx** (280+ lines)
- **Purpose**: Reusable contact/inquiry form component
- **Fields** (6 total):
  1. Full Name (required)
  2. Email (required, validated)
  3. Contact Type (select: question, support, feedback, sales)
  4. Message (required, textarea with character counter)
  5. Company (optional)
  6. Priority (select: low, medium, high)
- **Features**:
  - Client-side validation
  - Character counter for message (max 500)
  - Success notification after submit
  - Form reset after successful submit
  - Responsive design

### API Service Layer (`api.js`)

**Purpose**: Centralized API client for all backend communication

**Exports** (144 lines):

```javascript
customersAPI = {
  getAll()                    // GET /customers
  getById(id)                 // GET /customers/:id
  create(data)                // POST /customers
  update(id, data)            // PUT /customers/:id
  delete(id)                  // DELETE /customers/:id
}

dealsAPI = {
  getAll()                    // GET /deals
  getByStage(stage)          // GET /deals/stage/:stage
  create(data)                // POST /deals
  update(id, data)            // PUT /deals/:id
  delete(id)                  // DELETE /deals/:id
}

tasksAPI = {
  getAll()                    // GET /tasks
  create(data)                // POST /tasks
  update(id, data)            // PUT /tasks/:id
  delete(id)                  // DELETE /tasks/:id
}

activitiesAPI = {
  getAll()                    // GET /activities (limit: 50)
  create(data)                // POST /activities
}
```

**Configuration**:
- Base URL: `http://localhost:5000/api`
- All requests include JSON headers
- Error handling: Throws descriptive error messages
- No authentication (can be added later)

---

## 5. Backend Structure

### Directory Layout
```
backend/
├── server.js                # Express app initialization & routing (71 lines)
├── database.js              # SQLite setup & helper functions (115 lines)
├── package.json             # Dependencies & scripts
├── package-lock.json
├── crm.db                   # SQLite database file
├── seed.js                  # Database seeding script (92 lines)
├── test-server.js           # Testing server (removed from production)
└── routes/
    ├── customers.js         # Customer CRUD endpoints (92 lines)
    ├── deals.js             # Deal CRUD + stage endpoints (110+ lines)
    ├── tasks.js             # Task CRUD endpoints
    └── activities.js        # Activity CRUD endpoints
```

### Server Initialization (`server.js`)

**Configuration**:
- Port: 5000 (environment variable: `PORT`)
- CORS: Enabled globally
- Body Parser: JSON and URL-encoded (max 25MB)

**Routes**:
- `/api/customers` → customerRoutes
- `/api/deals` → dealRoutes
- `/api/tasks` → taskRoutes
- `/api/activities` → activityRoutes
- `/api/health` → Health check endpoint

**Error Handling**:
- Global error middleware catches all exceptions
- Returns 500 status with error message
- Logs errors to console

**Startup Process**:
1. Initialize database and create tables
2. Register all route handlers
3. Setup error middleware
4. Listen on port 5000 with 0.0.0.0 binding
5. Log startup message with connection URL

### Database Schema (`database.js`)

**Database Type**: SQLite3 (file: `backend/crm.db`)

**PRAGMA Settings**: 
- `FOREIGN_KEYS = ON` (referential integrity enforced)

#### Table 1: `customers`
```sql
CREATE TABLE customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  company TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zipCode TEXT,
  industry TEXT,
  status TEXT DEFAULT 'prospect',  -- active, prospect, inactive
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

#### Table 2: `deals`
```sql
CREATE TABLE deals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  value INTEGER NOT NULL,
  contact TEXT NOT NULL,
  stage TEXT DEFAULT 'prospect',   -- prospect, negotiation, committed, closed
  customerId INTEGER,
  date DATE NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customerId) REFERENCES customers(id)
)
```

#### Table 3: `tasks`
```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',  -- low, medium, high
  time DATETIME NOT NULL,
  customerId INTEGER,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customerId) REFERENCES customers(id)
)
```

#### Table 4: `activities`
```sql
CREATE TABLE activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  customer TEXT NOT NULL,
  action TEXT NOT NULL,
  customerId INTEGER,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customerId) REFERENCES customers(id)
)
```

**Helper Functions** (`database.js`):
- `initializeDatabase()` - Creates DB connection, enables pragma, creates tables
- `dbRun(sql, params)` - Promise wrapper for INSERT/UPDATE/DELETE
- `dbGet(sql, params)` - Promise wrapper for SELECT single row
- `dbAll(sql, params)` - Promise wrapper for SELECT multiple rows

### API Endpoints

#### Customers (`/api/customers`)

**GET /api/customers**
- Returns: Array of all customers
- Ordering: By createdAt DESC (newest first)
- Status: 200

**GET /api/customers/:id**
- Returns: Single customer object
- Status: 200 or 404 if not found

**POST /api/customers**
- Body: `{ name, email, phone, company, [address, city, state, zipCode, industry, status, notes] }`
- Validation:
  - name, email, phone, company: required
  - email: must be unique across database
- Returns: Created customer object with ID
- Status: 201 or 400 for validation error

**PUT /api/customers/:id**
- Body: `{ name, email, phone, company, [...optional fields] }`
- Updates all provided fields
- Returns: Updated customer object
- Status: 200 or 404

**DELETE /api/customers/:id**
- Returns: Success message
- Status: 200 or 404

#### Deals (`/api/deals`)

**GET /api/deals**
- Returns: Array of all deals
- Status: 200

**GET /api/deals/stage/:stage**
- Returns: Deals filtered by stage (prospect/negotiation/committed/closed)
- Status: 200

**POST /api/deals**
- Body: `{ title, value, contact, stage, customerId, date }`
- Value: Integer in cents or dollars
- Date: ISO 8601 format
- Returns: Created deal object
- Status: 201

**PUT /api/deals/:id**
- Body: `{ title, value, contact, stage, date, [...other fields] }`
- Primarily used for stage updates (drag-drop)
- Returns: Updated deal object
- Status: 200

**DELETE /api/deals/:id**
- Returns: Success message
- Status: 200

#### Tasks (`/api/tasks`)

**GET /api/tasks**
- Returns: Array of all tasks
- Status: 200

**POST /api/tasks**
- Body: `{ task, priority, time, customerId }`
- Priority: low/medium/high
- Time: ISO 8601 datetime
- Returns: Created task object
- Status: 201

**PUT /api/tasks/:id**
- Body: `{ task, priority, time, customerId }`
- Returns: Updated task object
- Status: 200

**DELETE /api/tasks/:id**
- Status: 200

#### Activities (`/api/activities`)

**GET /api/activities**
- Returns: Array of activities (limited to 50 most recent)
- Ordering: By createdAt DESC
- Status: 200

**POST /api/activities**
- Body: `{ type, customer, action, customerId }`
- Returns: Created activity object
- Status: 201

### Data Seeding (`seed.js`)

**Purpose**: Populate database with sample data for testing

**Seeded Data**:
- 3 sample customers (Acme Corporation, Global Industries, Tech Ventures LLC)
- 3 sample deals (various stages and values)
- 3 sample tasks (different priorities)

**Usage**: `node backend/seed.js`

**HTTP Methods Used**:
- Fetches to `/api/customers` (POST)
- Fetches to `/api/deals` (POST)
- Fetches to `/api/tasks` (POST)

---

## 6. Configuration Files

### `tailwind.config.js` (Root)
```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
}
```

### `postcss.config.js` (Root)
```javascript
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}
```

### `vite.config.js`
```javascript
export default {
  plugins: [react()],
  server: { port: 5173 },
}
```

### `eslint.config.js`
- Linting rules for frontend code quality

### `package.json` (Frontend)
```json
{
  "name": "my-crm",
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  }
}
```

### `backend/package.json`
```json
{
  "name": "my-crm-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

---

## 7. Data Flow

### Create Customer Flow
```
User Input (AddEditCustomerForm)
    ↓
Client-side Validation
    ↓
Email Uniqueness Check (API)
    ↓
POST /api/customers {name, email, ...}
    ↓
Backend: customersAPI.create()
    ↓
Database: INSERT INTO customers
    ↓
Return Created Customer (201)
    ↓
Update CRMHome stats
    ↓
Show Success Notification
```

### Update Deal Stage Flow (Drag-Drop)
```
User Drags Card to New Stage (DealsPipeline)
    ↓
handleDrop() event fires
    ↓
PUT /api/deals/:id {stage: newStage}
    ↓
Backend: dealsAPI.update()
    ↓
Database: UPDATE deals SET stage = newStage
    ↓
Return Updated Deal (200)
    ↓
UI: Automatically reflects new stage
    ↓
No page refresh needed
```

### Fetch Customers with Search Flow
```
User Types in Search Box (CustomersList)
    ↓
setSearchTerm() updates state
    ↓
filteredCustomers computed (client-side filter)
    ↓
Table re-renders with filtered results
    ↓
No API call needed (data already loaded)
```

---

## 8. Key Features

### ✅ Implemented Features
1. **Customer Management**
   - Add/Edit/Delete customers
   - Search by name, email, company
   - Filter by status (active, prospect, inactive)
   - Bulk selection
   - Contact action buttons

2. **Deal Pipeline**
   - Kanban-style board with 4 stages
   - Drag-and-drop deal movement
   - Real-time database updates
   - Deal card display (title, value, contact)
   - Delete functionality

3. **Dashboard**
   - Real-time KPI metrics (4 cards)
   - Recent activities list
   - Upcoming tasks list
   - Loading states and error handling

4. **Analytics**
   - Revenue trend chart
   - Deal conversion pie chart
   - Top customers table
   - Sales by industry visualization
   - KPI metrics display

5. **Contact Form**
   - Reusable form component
   - Contact type selection
   - Message character counter
   - Success notifications
   - Validation

6. **Backend API**
   - RESTful endpoints for all resources
   - CRUD operations
   - Data validation
   - Error handling
   - CORS support

### 🔄 Data Persistence
- SQLite database with 4 interconnected tables
- Foreign key relationships
- Automatic timestamps (createdAt, updatedAt)
- Sample seed data included

---

## 9. Installation & Setup

### Prerequisites
- Node.js 18+ (with native fetch support)
- Git

### Frontend Setup
```bash
cd my-crm
npm install
npm run dev  # Runs on http://localhost:5173
```

### Backend Setup
```bash
cd backend
npm install
node seed.js  # Optional: populate sample data
node server.js  # Runs on http://localhost:5000
```

### Environment Variables
None required (hardcoded for development):
- Frontend API URL: `http://localhost:5000/api`
- Backend Port: `5000`
- Frontend Port: `5173`

---

## 10. Performance Considerations

1. **Frontend**
   - Client-side filtering (no API calls for search)
   - Lazy loading of components via React
   - Optimized re-renders with React hooks
   - Tailwind CSS tree-shaking for minimal CSS

2. **Backend**
   - Async/await for non-blocking I/O
   - SQLite connection pooling (single connection)
   - Indexed queries on common fields
   - GZIP compression ready (via middleware)

3. **Database**
   - SQLite suitable for small-medium databases
   - PRAGMA foreign_keys prevents data inconsistency
   - Timestamp fields for audit trails

---

## 11. Security Notes

### Current Implementation
- No authentication/authorization
- CORS enabled for all origins
- No input sanitization
- No rate limiting

### Recommendations for Production
1. Add authentication (JWT tokens)
2. Implement role-based access control (RBAC)
3. Add input validation/sanitization (joi, yup)
4. Implement rate limiting
5. Use HTTPS/TLS
6. Add CSRF protection
7. Implement logging and monitoring
8. Use environment variables for secrets

---

## 12. Testing

### Manual Testing
- Test create/read/update/delete for each resource
- Test drag-and-drop deal movement
- Test search and filter functionality
- Test form validation
- Test error states

### API Testing with curl
```bash
# Get all customers
curl http://localhost:5000/api/customers

# Create customer
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com",...}'

# Update deal stage
curl -X PUT http://localhost:5000/api/deals/1 \
  -H "Content-Type: application/json" \
  -d '{"stage":"committed"}'
```

---

## 13. Future Enhancements

1. **Authentication** - User login, role-based access
2. **Real Database** - PostgreSQL for production
3. **File Uploads** - Attachment support for customers
4. **Email Integration** - Send emails from contact form
5. **Notifications** - Real-time notifications
6. **Mobile App** - React Native mobile client
7. **Advanced Analytics** - More charts, exports
8. **Calendar** - Integrated calendar for tasks/deals
9. **CRM Automation** - Workflow automation
10. **API Documentation** - Swagger/OpenAPI spec

---

## 14. Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build  # Creates dist/ folder
# Deploy dist/ folder
```

### Backend (Heroku/Railway/Render)
```bash
# Set PORT environment variable
# Push code to git remote
```

### Database (SQLite)
- For small deployments, SQLite works
- For scale, migrate to PostgreSQL

---

## 15. Git Repository

**Repository**: https://github.com/gpad1234/jubilant-octo-broccoli

**Current Status**: 
- 37 files committed
- Initial commit with full application
- Ready for further development

**Branch**: main

---

## 16. Support & Maintenance

**Last Updated**: December 5, 2025

**Maintenance Tasks**:
- Monitor database size
- Review error logs
- Update dependencies monthly
- Backup database regularly
- Monitor API performance

---

**Document Version**: 1.0  
**Author**: Development Team  
**Last Modified**: December 5, 2025
