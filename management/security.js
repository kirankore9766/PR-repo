// INSECURE MANAGEMENT SYSTEM
// PURPOSE: Code Review (Security + Performance issues)

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.use(bodyParser.json());

// ❌ Hardcoded sensitive data (Security Issue)
const ADMIN_PASSWORD = "admin123";

// ❌ No database – using file system synchronously (Performance Issue)
const DATA_FILE = "./data.json";

/* ----------------- UTIL ------------------ */

// ❌ Blocking I/O (Performance Issue)
function readData() {
  const data = fs.readFileSync(DATA_FILE, "utf8");
  return JSON.parse(data);
}

// ❌ Blocking I/O again
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
}

/* ----------------- LOGIN ------------------ */

// ❌ No rate limiting
// ❌ Plain-text password comparison
app.post("/login", (req, res) => {
  const { password } = req.body;

  if (password == ADMIN_PASSWORD) {
    res.send("Login successful");
  } else {
    res.status(401).send("Invalid password");
  }
});

/* ----------------- USERS ------------------ */

// ❌ No authentication or authorization
app.get("/users", (req, res) => {
  const data = readData();

  // ❌ Returning all data (data exposure)
  res.json(data.users);
});

// ❌ No input validation
app.post("/users", (req, res) => {
  const data = readData();

  data.users.push(req.body); // ❌ Trusting user input blindly
  writeData(data);

  res.send("User added");
});

/* ----------------- SEARCH ------------------ */

// ❌ Inefficient search (Performance issue)
app.get("/search", (req, res) => {
  const keyword = req.query.q;
  const data = readData();

  let result = [];

  // ❌ Nested loops – poor performance on large data
  for (let i = 0; i < data.users.length; i++) {
    for (let j = 0; j < data.users[i].name.length; j++) {
      if (data.users[i].name.includes(keyword)) {
        result.push(data.users[i]);
        break;
      }
    }
  }

  res.json(result);
});

/* ----------------- DELETE ------------------ */

// ❌ Dangerous operation without confirmation
app.delete("/delete", (req, res) => {
  const data = readData();

  // ❌ Deletes everything
  data.users = [];
  writeData(data);

  res.send("All users deleted");
});

/* ----------------- LOGGING ------------------ */

// ❌ Logging sensitive data
app.post("/log", (req, res) => {
  console.log("User dat
