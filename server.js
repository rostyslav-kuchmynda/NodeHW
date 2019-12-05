const app = require('./app');


const PORT = 3000;
app.listen(PORT, (req, res) => {
    console.log('Server started');
});