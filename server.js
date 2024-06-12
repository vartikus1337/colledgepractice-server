const fs = require('fs')
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;
const USERS_FILE = './users.json';
// const COMMENTS_JSON = './comments.json';

app.use(cors()); // Фикс AxiosError ERR_NETWORK (связанное с портом)
app.use(bodyParser.json()); // обработчик json

// 
//  Функции для работы с файлами
// 

// Функция для чтения данных из файла
const readUsersFromFile = () => {
  if (fs.existsSync(USERS_FILE)) {
    const data = fs.readFileSync(USERS_FILE);
    try {
      return JSON.parse(data)
    } catch {
      return [];
    }
  } else {
    return [];
  }
};

// Функция для записи данных в файл
const writeUsersToFile = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// 
// Работа сервера
// 

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = readUsersFromFile();
  console.log(username, password)
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

  const users = readUsersFromFile()

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
  const users = readUsersFromFile();

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
  writeUsersToFile(users);

  res.status(201).json({ message: 'User registered successfully' });
  console.log("Пользователь создан")
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});