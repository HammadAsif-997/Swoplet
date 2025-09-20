// server.js
const http = require("http");
const app = require("./app");
const setupSocket = require("./socket");
const db = require("./models");

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Setup WebSocket
setupSocket(server);

// Sync DB and start server
db.sequelize
  .sync({ alter: true })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database sync error:", err);
  });
