const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Проверка пользователя
  if (username === 'user' && password === 'password') {
    req.session.user = { username };
    res.json({ message: 'Login successful', user: req.session.user });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.get('/protected', (req, res) => {
  if (req.session.user) {
    res.json({ message: 'Protected data', user: req.session.user });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});