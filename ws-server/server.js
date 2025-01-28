// @ts-check
import { WebSocketServer } from 'ws'; // Імпортуємо WebSocketServer
import OpenAI from 'openai';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config(); // Завантаження змінних середовища

// Ініціалізація OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Структура для збереження історії чату та списку кімнат
const chatHistory = {};
const users = new Map(); // Зберігаємо клієнтів із їхніми іменами чи ID

// Функція для отримання погоди
async function getWeather(city) {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    return 'API ключ для погоди не знайдено.';
  }
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ua`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Помилка: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return `Погода у місті ${data.name}: ${data.weather[0].description}, температура ${data.main.temp}°C.`;
  } catch (error) {
    console.error('Помилка при отриманні погоди:', error.message);
    return 'Не вдалося отримати дані про погоду. Спробуй ще раз пізніше.';
  }
}

// Обробка повідомлень
function handleCommand(message, ws) {
  if (message.text === '/help') {
    return 'Список доступних команд: \n/help - допомога\n/weather [місто] - погода у вказаному місті\n/private [ID] [повідомлення] - приватне повідомлення.';
  }
  if (message.text.startsWith('/weather')) {
    const city = message.text.split(' ')[1];
    if (!city) {
      return 'Вкажи місто після команди /weather.';
    }
    return getWeather(city); // Викликаємо функцію для погоди
  }
  if (message.text.startsWith('/private')) {
    const parts = message.text.split(' ');
    const recipientId = parts[1];
    const privateMessage = parts.slice(2).join(' ');
    if (!recipientId || !privateMessage) {
      return 'Формат команди: /private [ID користувача] [повідомлення].';
    }
    const recipient = users.get(recipientId);
    if (recipient) {
      recipient.send(JSON.stringify({ user: 'Bot', text: privateMessage }));
      return `Приватне повідомлення відправлено користувачу ${recipientId}.`;
    } else {
      return 'Користувач з таким ID не знайдений.';
    }
  }
  return 'Невідома команда. Напиши /help для списку доступних команд.';
}

// Зберігаємо історію
function saveChatHistory(room, message) {
  if (!chatHistory[room]) {
    chatHistory[room] = [];
  }
  chatHistory[room].push(message);
}

// Функція для виклику OpenAI API
async function getChatCompletion(messages, model = 'gpt-3.5-turbo') {
  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages,
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error response from OpenAI:', error.response?.data || error.message);

    // Перевірка на помилку з квотою
    if (error?.code === 'insufficient_quota') {
      return 'Ваша квота закінчилася. Перевірте тарифний план.';
    } else if (error.code === 'model_not_found') {
      return 'Модель GPT-4o-mini недоступна. Використовуйте іншу модель.';
    } else if (error.code === 429) {
      return 'Перевищено ліміт запитів. Спробуйте пізніше.';
    } else {
      return 'Сталася помилка з OpenAI API.';
    }
  }
}

// Створюємо сервер WebSocket
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('New client connected!');

  // Генеруємо унікальний ID для клієнта
  const userId = `user-${Date.now()}`;
  users.set(userId, ws);
  ws.send(JSON.stringify({ user: 'Bot', text: `Твій ID: ${userId}` }));

  ws.on('message', async (data) => {
    let message;
    try {
      message = JSON.parse(data);
    } catch (error) {
      console.error('Invalid message format:', error);
      ws.send(JSON.stringify({ user: 'Bot', text: 'Неправильний формат повідомлення.' }));
      return;
    }

    console.log('Received message:', message);

    // Визначаємо кімнату (глобальна чи приватна)
    const room = message.room || 'global';

    // Зберігаємо повідомлення в історію
    saveChatHistory(room, message);

    // Обробка команд через handleCommand
    if (message.text.startsWith('/')) {
      const response = await handleCommand(message, ws); // Викликаємо handleCommand
      if (response) {
        ws.send(JSON.stringify({ user: 'Bot', text: response }));
      }
      return;
    }

    // Інтеграція OpenAI
    try {
      let botReply = await getChatCompletion(
        [
          { role: 'system', content: 'Ти - розумний помічник.' },
          { role: 'user', content: message.text },
        ],
        'gpt-3.5-turbo'
      );
      ws.send(JSON.stringify({ user: 'Bot', text: botReply }));
    } catch (error) {
      console.error('Не вдалося обробити запит:', error);
      ws.send(
        JSON.stringify({
          user: 'Bot',
          text: 'Сталася технічна помилка. Спробуй пізніше!',
        })
      );
    }
  });

  ws.on('close', () => console.log('Client disconnected'));
});

console.log('WebSocket server running on ws://localhost:8080');
