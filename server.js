const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

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
