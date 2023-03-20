const express = require('express');
const app = express();

app.get('/hello', (req, res) => {
  const username = req.headers['x-forwarded-user'];
  if (username) {
    res.send(`Hello, ${username}! You are authenticated via GitLab.`);
  } else {
    res.send('Hello, world!');
  }
});

app.listen(8090, () => {
  console.log('Server started on port 8090');
});
