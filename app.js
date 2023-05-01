const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/news", require("./routes/news"));
app.use("/api/solution", require("./routes/solution"));

function createConnection() {
  try {
    mongoose.connect(process.env.DATABASE, {}, () =>
      console.log("DB connected")
    );
  } catch (err) {
    console.error(err);
  }
}

const port = process.env.PORT || 5000;

app.listen(port, (err) => {
  if (err) {
    console.log(`Server running error: `, err);
    return;
  }
  console.log(`Server is running on port ${port}`);
  createConnection();
});
