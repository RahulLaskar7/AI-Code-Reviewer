const express = require("express");
const aiRoutes = require("./routes/ai.routes");
const cors=require('cors')
const app = express(); // Initialize 'app' before using it
app.use(express.json());
app.use(cors())
app.get("/", (req, res) => {
    res.send("hello");
});

app.use("/ai", aiRoutes);

module.exports = app;
