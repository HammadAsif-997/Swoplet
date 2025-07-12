// app.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// CORS configuration
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middlewares
app.use(express.json());
app.use(require("./middleware/responseformatter"));

// Route imports
const routes = [
  require("./routes/chat.routes"),
  require("./routes/auth.routes"),
  require("./routes/productlisting.routes"),
  require("./routes/productcondition.routes"),
  require("./routes/productcategory.routes"),
  require("./routes/productsearch.routes"),
  require("./routes/user.routes"),
  require('./routes/favourite.routes'),
  require('./routes/userreport.routes'),
  require('./routes/sellerreview.routes'),
];

// Apply routes under /api
routes.forEach((route) => app.use("/api", route));

// Serve static files from the UI build folder (for production)
const frontendPath = path.join(__dirname, '..', 'UI', 'dist');
app.use(express.static(frontendPath));

// Catch-all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  // Skip API routes - they should have been handled above
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // Serve the frontend index.html for all other routes
  res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
    if (err) {
      res.status(500).send('Frontend not built. Please build the UI first.');
    }
  });
});

module.exports = app;
