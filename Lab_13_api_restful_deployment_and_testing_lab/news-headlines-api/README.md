# 📰 NewsPulse: Premium RESTful News Headlines API

NewsPulse is a secure, high-performance RESTful API built with Node.js and Express.js. It interfaces with the external third-party **NewsAPI** service to fetch real-time top headlines for selected countries using dynamic route parameters, input validation, clean response filtering, and robust error management.

Additionally, NewsPulse includes a **beautiful, glassmorphic visual developer dashboard** served at the root domain (`/`), allowing developers to test endpoints interactively, adjust article counts, switch countries, and preview structural JSON responses in a pretty-printed virtual console.

---

## ✨ Features

- **Backend Proxy & Security**: Keeps the third-party API key safely hidden on the Node.js backend to prevent exposures on the client side.
- **Dynamic Route Routing**: Dynamic routing allows fetching headlines using standard ISO country parameters: `/api/news/:country`.
- **Intelligent Validation**: Validates dynamic parameters against supported NewsAPI countries on request; returns formatted `400 Bad Request` responses on invalid strings.
- **Custom Response Structure**: Processes and strips extraneous fields from the third-party response, returning only:
  - `title`: News Title
  - `sourceName`: Source Name (e.g. "BBC News", "Reuters")
  - `url`: Official Article Web Link
  - `publishedAt`: Publication Date-Time (ISO format)
- **Range Control (5–10)**: Filters and limits returning results dynamically via an optional URL query param: `?limit=X` (Strictly validated between `5` and `10`).
- **Interactive Developer Console**: An elegant, responsive dark-mode front-end showcasing live news feeds alongside a live JSON payload visualizer with click-to-copy mechanics.

---

## 🚀 Setup & Installation

### 1. Prerequisites
Make sure you have Node.js (version 18+ recommended) and npm installed.

### 2. Install Dependencies
Navigate to the directory and install required dependencies:
```bash
npm install
```

### 3. Environment Configuration
The application relies on an environment file `.env` located at the root of the project. It has already been pre-configured for this lab with the following settings:
```env
PORT=3000
NEWS_API_KEY=d7f37414a65d41d98454eaeeda746dee
NODE_ENV=development
```

---

## 🛠️ Running the Application

### Start in Production Mode
Runs the API server standardly:
```bash
npm start
```

### Start in Development Mode (Recommended for testing)
Starts the API server with auto-reloading (`nodemon`):
```bash
npm run dev
```

The active logs will output to the console:
```text
==================================================
📰 News Headlines API Service is active!
🔌 Port: 3000
🌐 API Endpoint: http://localhost:3000/api/news/:country
🖥️  Dashboard Client: http://localhost:3000/
==================================================
```

---

## 📡 API Reference & Telemetry

### Get Top Headlines
Retrieves a filtered list of the latest top headlines for the specified country.

```http
GET /api/news/:country
```

#### Path Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `country` | `string` | **Yes** | A valid 2-letter ISO 3166-1 country code (e.g. `us`, `gb`, `in`, `ca`, `jp`). Case-insensitive. |

#### Query Parameters
| Parameter | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `limit` | `integer` | No | `10` | Capped article results length. Must be an integer between `5` and `10` inclusive. |

---

### 🟢 Success Response Example (`200 OK`)

Request: `GET http://localhost:3000/api/news/us?limit=5`

```json
{
  "success": true,
  "country": "us",
  "totalResults": 5,
  "limit": 5,
  "articles": [
    {
      "title": "Nvidia shares hit record high as AI boom shows no signs of slowing - Reuters",
      "sourceName": "Reuters",
      "url": "https://www.reuters.com/technology/nvidia-shares-hit-record-high...",
      "publishedAt": "2026-05-20T20:15:30Z"
    },
    {
      "title": "SpaceX launches next-generation Starlink constellation from California coast - Space.com",
      "sourceName": "Space.com",
      "url": "https://www.space.com/spacex-starlink-launch...",
      "publishedAt": "2026-05-20T19:40:00Z"
    }
  ]
}
```

---

### 🔴 Error Response Examples

#### 1. Invalid Country Code (`400 Bad Request`)
Request: `GET http://localhost:3000/api/news/xx`
```json
{
  "success": false,
  "error": "Bad Request",
  "message": "Invalid country code 'xx'. Please provide a valid 2-letter ISO country code (e.g. 'us', 'gb', 'in', 'ca')."
}
```

#### 2. Invalid Limit Constraint (`400 Bad Request`)
Request: `GET http://localhost:3000/api/news/in?limit=3`
```json
{
  "success": false,
  "error": "Bad Request",
  "message": "The limit parameter must be an integer between 5 and 10."
}
```

#### 3. Endpoint Not Found (`404 Not Found`)
Request: `GET http://localhost:3000/api/invalid-route`
```json
{
  "success": false,
  "error": "Not Found",
  "message": "API endpoint '/api/invalid-route' does not exist."
}
```

---

## 🧪 Testing Guidelines

### Method 1: Interactive Browser Testing (Recommended)
1. Ensure the Node application is active on port `3000`.
2. Open your preferred browser and visit: `http://localhost:3000/`
3. Select any country from the dropdown or click a quick-filter chip.
4. Drag the limit slider to adjust the number of results (`5–10`).
5. Click **Fetch Latest Headlines** to load headlines inside the responsive grid and view raw, pretty-printed JSON payloads on the adjacent developer console.

### Method 2: Command Line (cURL)
Test endpoints directly from your shell:
```bash
# Test valid US headlines (Limit 8)
curl "http://localhost:3000/api/news/us?limit=8"

# Test validation handler with an invalid ISO parameter
curl "http://localhost:3000/api/news/invalidcode"
```

### Method 3: Postman Desktop Client
1. Launch Postman.
2. Select `GET` request method.
3. Supply request URL: `http://localhost:3000/api/news/gb?limit=5`
4. Click **Send** to verify the filtered, structured JSON payload.
