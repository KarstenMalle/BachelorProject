const express = require('express');
const authorizationMiddleware = require('./authorizationMiddleware');

const app = express();
const port = 3000;

app.use(authorizationMiddleware);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the protected microservice!' });
});

app.get('/test', (req, res) => {
  res.json({ message: 'This is a test route without the middleware.' });
});

app.listen(port, () => {
  console.log(`Microservice listening at http://localhost:${port}`);
});
