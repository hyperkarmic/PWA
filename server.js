const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
const htmlRoutes = require("./src/routes/html-routes.js");
const apiRoutes = require("./src/routes/api-routes.js");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("src/public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/budget", {
  useNewUrlParser: true,
  useFindAndModify: false,
});

// routes
app.use(htmlRoutes);
app.use(apiRoutes);

app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}`));
