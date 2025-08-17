const express = require('express');
const dotenv = require('dotenv');
//const connectdb = require('mongodb');

dotenv.config()

const app = express();
app.use(express.json());


const PORT = process.env.PORT
app.listen(PORT, console.log(`server is listening on port: ${PORT}`))

