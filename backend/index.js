const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const routes = require('./routes/routes');

dotenv.config();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.DB_CONNECTION)

app.use('/race', routes)
app.listen(4000, () => console.log("Server is running!"));