const express = require('express');
const connectDb = require('./config/mongoose');
const dotenv = require('dotenv').config();

connectDb();
const app = express();

app.use(express.json());

app.use("/", require("./routes"));
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Listening on port : ${port}`);
});