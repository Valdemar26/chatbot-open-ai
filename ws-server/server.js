// @ts-check
import { WebSocketServer } from 'ws'; // Імпортуємо WebSocketServer
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config(); // Завантаження змінних середовища

console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);

// Ініціалізація OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Створюємо сервер WebSocket
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('New client connected!');

  ws.on('message', async (data) => {
    const message = JSON.parse(data);
    console.log('Received message:', message);

    // Відправляємо всім клієнтам, окрім відправника
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === ws.OPEN) {
        client.send(JSON.stringify(message));
      }
    });

    // Обробка команд
    if (message.text.startsWith('/')) {
      let response;
      if (message.text === '/start') {
        response = 'Привіт! Це чат-бот. Напиши "/help" для отримання інформації.';
      } else if (message.text === '/help') {
        response =
          'Я можу допомогти тобі з інформацією або відповісти на твої питання. Просто напиши текст!';
      } else {
        response = `Невідома команда: ${message.text}`;
      }
      ws.send(JSON.stringify({ user: 'Bot', text: response }));
    } else {
      // Інтеграція OpenAI
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'Ти - розумний помічник.' },
            { role: 'user', content: message.text },
          ],
        });
        const botReply = completion.choices[0].message.content;
        ws.send(JSON.stringify({ user: 'Bot', text: botReply }));
      } catch (error) {
        console.error('Error with OpenAI API:', error);
        ws.send(JSON.stringify({ user: 'Bot', text: 'Сталася помилка з OpenAI.' }));
      }
    }
  });

  ws.on('close', () => console.log('Client disconnected'));
});

console.log('WebSocket server running on ws://localhost:8080');
