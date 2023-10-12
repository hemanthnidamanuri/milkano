require('dotenv').config();
require('express-async-errors');

const os = require('os');
const cluster = require('cluster');
const http = require('http');

const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');

const { PORT } = require('./config/config');
const notFoundRouteMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const authenticationMiddleware = require('./middleware/auth');

const dbConnection = require('./db/connect');
const products = require('./routes/products');

const express = require('express');
const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

dbConnection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + dbConnection.threadId);
});

app.use('/api/v1/products', authenticationMiddleware, products);
app.use(notFoundRouteMiddleware);
app.use(errorHandlerMiddleware);

const port = PORT || 8000;
const server = http.createServer(app);

if (cluster.isMaster) {
    const numWorkers = os.cpus().length;
    console.log(`Master cluster setting up ${numWorkers} workers ...`);

    for (let i = 0; i < numWorkers; i++) {
        cluster.fork();
    }
    cluster.on('online', (worker) => {
        console.log(`Worker ${worker.process.pid} is online`);
    })

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
        console.log('Starting a new worker...');
        cluster.fork();
    });
} else {  
    server.listen(port, () => {
        console.log(`Server is listening at port ${port}...`);
    }).on('error', (error) => {
        console.log(`error occured on server ${error}`);
    });
}