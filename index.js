const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan  = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

//db
mongoose.connect('mongodb://localhost:auth/auth');

const app= express();
const router = require('./router');
//App setup
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*'}));
router(app);

//Server setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server is listening to ', port);
