const express = require('express');
const app = express();
const todoRouter = require('./routes/todoRoutes');

const helmet = require('helmet');
const bodyParser = require('body-parser');




// Middleware stack
app.use(helmet());
app.use(bodyParser.json());

app.use('/todos', (req, res, next) => {
    if (req.headers.authorization === 'qwerty') {
        console.log('Auth Successful');
        next();
    } else {
        console.log('Auth Failed');
        next({ status: 403, error: 'Auth Failed' });
    }
});


app.use('/todos', todoRouter);

// Server listening
const PORT = 3000;

app.listen(PORT, (req, res) => {
    console.log('Server started');
})