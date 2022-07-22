require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { readdirSync } = require('fs');
const { connectDB, closeDBConnection } = require('./config/db');
const { exit } = require('process');

const app = express();
const port = process.env.PORT || 4000;
const corsOption = require('./utils/corsOption');

//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(corsOption);

//routes
app.get('/', (req, res) => {
  res.send('Eventis API server running');
});

// all routes are immediately loaded when created
readdirSync('./routes').map((route) => {
  app.use('/api/v1', require(`./routes/${route}`));
});

// Connect to database and start server
let server;

connectDB()
  .then(() => {
    server = app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch(() => {
    console.log('Database connection failed');
  });

process.on('unhandledRejection', (error) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(error);
  console.log(error.name, error.message);

  closeDBConnection();
  server.close(() => {
    exit(1);
  });
});
