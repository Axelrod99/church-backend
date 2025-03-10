const express = require("express");
const dbConnection = require("./config/db");
const authRoutes = require("./routes/authRoute");
const commentRoutes = require("./routes/commentRoute");

const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 2008;
app.use(cors());
app.use(express.json());

dbConnection();

app.get("/", (req, res) => {
  return res.json({ msg: `App running on PORT ${PORT}...` });
});
  
app.use("/auth", authRoutes);
app.use("/comment", commentRoutes);

app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

app.listen(PORT);
