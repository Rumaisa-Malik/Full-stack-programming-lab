require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Security and utility middleware
// Configure Helmet with relaxed CSP to allow loading fonts and resources from standard external sites
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://*"],
        connectSrc: ["'self'"],
      },
    },
  })
);
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve static dashboard files from the public folder
app.use(express.static('public'));

// Supported ISO 2-letter country codes by NewsAPI
const SUPPORTED_COUNTRIES = new Set([
  'ae', 'ar', 'at', 'au', 'be', 'bg', 'br', 'ca', 'ch', 'cn', 'co', 'cu', 'cz', 
  'de', 'eg', 'fr', 'gb', 'gr', 'hk', 'hu', 'id', 'ie', 'il', 'in', 'it', 'jp', 
  'kr', 'lt', 'lv', 'ma', 'mx', 'my', 'ng', 'nl', 'no', 'nz', 'ph', 'pl', 'pt', 
  'ro', 'rs', 'ru', 'sa', 'se', 'sg', 'si', 'sk', 'th', 'tr', 'tw', 'ua', 'us', 
  've', 'za'
]);

// Helper for validating ISO 2-letter country code
const isValidCountryCode = (code) => {
  if (!code || typeof code !== 'string' || code.length !== 2) return false;
  return SUPPORTED_COUNTRIES.has(code.toLowerCase());
};

// GET /api/news/:country
// Retrieves the latest top headlines for a given country
app.get('/api/news/:country', async (req, res) => {
  try {
    const { country } = req.params;
    let { limit } = req.query;

    // 1. Validation: Validate Country Code
    if (!country) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Country code parameter is required.'
      });
    }

    if (!isValidCountryCode(country)) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: `Invalid country code '${country}'. Please provide a valid 2-letter ISO country code (e.g. 'us', 'gb', 'in', 'ca').`
      });
    }

    // 2. Validation: Validate Limit Query Parameter
    // Restrict limit to be between 5 and 10. Default to 10.
    let parsedLimit = 10;
    if (limit !== undefined) {
      const parsed = parseInt(limit, 10);
      if (isNaN(parsed) || parsed < 5 || parsed > 10) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'The limit parameter must be an integer between 5 and 10.'
        });
      }
      parsedLimit = parsed;
    }

    // 3. Environment check: Verify API Key is available
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      console.error('CRITICAL ERROR: NEWS_API_KEY is not defined in backend .env file.');
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'News service credentials are missing on the server.'
      });
    }

    // 4. Connect to third-party News API service
    // Set a custom User-Agent to avoid potential blocks by the News API server
    const targetUrl = `https://newsapi.org/v2/top-headlines?country=${country.toLowerCase()}&pageSize=${parsedLimit}&apiKey=${apiKey}`;

    console.log(`Fetching from NewsAPI: ${targetUrl.replace(apiKey, 'REDACTED')}`);

    const apiResponse = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'News Headlines REST API/1.0',
        'Accept': 'application/json'
      }
    });

    // Handle non-200 responses from external service
    if (!apiResponse.ok) {
      const errorData = await apiResponse.json().catch(() => ({}));
      console.error('NewsAPI Error Response:', errorData);

      const status = apiResponse.status;
      if (status === 401) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'Invalid news service API key.'
        });
      } else if (status === 429) {
        return res.status(429).json({
          success: false,
          error: 'Too Many Requests',
          message: 'News API rate limit has been exceeded. Please try again later.'
        });
      } else {
        return res.status(status || 502).json({
          success: false,
          error: 'Bad Gateway',
          message: errorData.message || 'Failed to fetch news from third-party service.'
        });
      }
    }

    const data = await apiResponse.json();

    if (data.status !== 'ok') {
      return res.status(502).json({
        success: false,
        error: 'Bad Gateway',
        message: data.message || 'Third-party news service reported a failed status.'
      });
    }

    // 5. Process, filter, and structure the API response
    // Map response articles into the specified format
    const formattedArticles = (data.articles || [])
      .map(article => ({
        title: article.title || 'No Title Available',
        sourceName: article.source && article.source.name ? article.source.name : 'Unknown Source',
        url: article.url || '#',
        publishedAt: article.publishedAt || new Date().toISOString()
      }))
      // Filter out empty articles or those with missing titles (e.g. removed articles)
      .filter(article => article.title !== '[Removed]')
      // Capped strictly at specified limit (double safety, newsapi pageSize takes care of it too)
      .slice(0, parsedLimit);

    // 6. Return structured JSON response
    return res.status(200).json({
      success: true,
      country: country.toLowerCase(),
      totalResults: formattedArticles.length,
      limit: parsedLimit,
      articles: formattedArticles
    });

  } catch (error) {
    console.error('Server crash error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while processing your request.'
    });
  }
});

// Fallback for API 404
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `API endpoint '${req.originalUrl}' does not exist.`
  });
});

// Server Start
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`📰 News Headlines API Service is active!`);
  console.log(`🔌 Port: ${PORT}`);
  console.log(`🌐 API Endpoint: http://localhost:${PORT}/api/news/:country`);
  console.log(`🖥️  Dashboard Client: http://localhost:${PORT}/`);
  console.log(`==================================================`);
});
