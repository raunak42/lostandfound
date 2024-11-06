const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = 4000;

// Set security headers
app.use((req, res, next) => {
  // Content Security Policy (CSP)
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;"
  );

  // X-XSS-Protection
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // X-Frame-Options
  res.setHeader("X-Frame-Options", "SAMEORIGIN");

  // Strict-Transport-Security
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

  // Referrer-Policy
  res.setHeader("Referrer-Policy", "origin-when-cross-origin");

  next();
});

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Route to get data.json contents on page load
app.get("/data", (req, res) => {
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Error reading file.");
    }
    const jsonData = data ? JSON.parse(data) : [];
    res.json(jsonData);
  });
});

// Route to handle form submissions
app.post("/submit", (req, res) => {
  const newEntry = req.body;

  // Read the existing JSON file
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Error reading file.");
    }

    let jsonData = [];
    if (data) {
      jsonData = JSON.parse(data); // Parse existing data if available
    }

    // Append the new data
    jsonData.push(newEntry);

    // Write updated data back to the file
    fs.writeFile("data.json", JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return res.status(500).send("Error writing file.");
      }

      // Send the updated JSON data back to the client
      res.json(jsonData);
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;