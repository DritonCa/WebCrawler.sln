// index.js
// Your main Node.js application file

// Your application logic goes here

// start.js
// Additional JavaScript file to start or check the status of index.js

// Logic to start or check the status of index.js
// This file could execute index.js or perform other operations

// server.js
// File that sets up an Express.js server and defines routes

const express = require('express');
const app = express();
const { exec } = require('child_process');

// Route to start the crawler
app.get('/startcrawler', (req, res) => {
  // Execute start.js
  exec('node start.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });

  res.send('Crawler started');
});

// Other routes and middleware definitions...

// Start the Express.js server
const port = 3000; // Define the port number as per your requirement
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
