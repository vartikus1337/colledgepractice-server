const fs = require('fs')
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;
const USERS_FILE = './users.json';
const COMMENTS_FILE = './comments.json';

app.use(cors()); // Фикс AxiosError ERR_NETWORK (связанное с портом)
app.use(bodyParser.json()); // обработчик json

// 
//  Функции для работы с файлами
// 

// Функция для чтения данных из файла
const readDataFromFile = (pathToFile) => {
  if (fs.existsSync(pathToFile)) {
    const data = fs.readFileSync(pathToFile);
    try {
      return JSON.parse(data)
    } catch {
      return [];
    }
  } else {
    console.error('No file', pathToFile)
    return [];
  }
};

// Функция для записи данных в файл
const writeDataToFile = (pathFile, data) => {
  fs.writeFileSync(pathFile, JSON.stringify(data, null, 2));
};

// 
// Работа сервера
// 

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = readDataFromFile(USERS_FILE);

  const user = users.find(
    user => user.username === username && user.password === password
  );

  if (user) {
    res.status(200).json({ message: 'Login successful', value: true });
    console.log(username, "зашёл")
  } else {
    res.status(401).json({ message: 'Login failed', value: false });
    console.log(username, "Попытка входа")
  }
});

app.post('/auth', (req, res) => {
  const uuid = req.body;

  const users = readDataFromFile(USERS_FILE);

  const ids = users.map(user => user.id);

  if (ids.includes(uuid)) {
    res.status(200).json({ message: 'Login successful' });
    console.log(username, "oauth зашёл")
  } else {
    res.status(401).json({ message: 'Login failed' });
    console.log("Попытка oauth")
  }
})

app.post('/register', (req, res) => {
  const { username, password, id, mail } = req.body;
  const users = readDataFromFile(USERS_FILE);

  if (users.find(user => user.username === username)) {
    return res.status(409).json({ message: 'Username already exists' });
  }

  const newUser = {
    username,
    password,
    id,
    mail
  };

  users.push(newUser);
  writeDataToFile(USERS_FILE, users);

  res.status(201).json({ message: 'User registered successfully' });
  console.log("Пользователь создан")
});

app.get('/comments', (req, res) => {
  try {
    const comments = readDataFromFile(COMMENTS_FILE)
    comments.forEach(comment => { delete comment.mail });
    res.status(200).json(comments);
  } catch (parseErr) {
      console.error('Ошибка парсинга JSON:', parseErr);
      res.status(500).json({ message: 'Ошибка сервера' });
  }
})

app.post('/new_comment', (req, res) => {
  const { username, text, mail} = req.body;
  const newComment = {
    username,
    mail,
    text
  };

  const comments = readDataFromFile(COMMENTS_FILE);

  comments.push(newComment);
  writeDataToFile(COMMENTS_FILE, comments);

  res.status(201).json({ message: 'User registered successfully' });
  console.log(`Комментарий ${username} создан`)
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});