const express = require("express");
const bodyParser = require("body-parser"); // This line is fine

const routes = require("./Routes");
//const cors = require("cors");

const app = express();
//app.use(cors());
app.use(bodyParser.json()); // This line is fine

app.use(express.static("public"));

// Set up routes and pass the pool to the routes module
app.use("/", routes());

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
