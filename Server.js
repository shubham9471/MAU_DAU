const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Routes = require("./Routes");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

const MONGODV_URI =
  "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";

app.use(express.json());

app.use(
  "/",
  (req, res, next) => {
    console.log("Received a request to server root");
    next(); // Call next middleware
  },
  Routes
);

mongoose
  .connect(MONGODV_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log("Error connecting to MongoDB:->", err));
