// @ts-check
import { WebSocketServer } from 'ws'; // Імпортуємо WebSocketServer
import dotenv from 'dotenv';
import { saveChatHistory } from './utils/chatHistory.js';
import { handleCommand } from './utils/commands.js';
import { getChatCompletion } from './utils/openai.js';

dotenv.config(); // Завантаження змінних середовища

const users = new Map(); // Зберігаємо клієнтів із їхніми іменами чи ID

// Створюємо сервер WebSocket
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('New client connected!');

  // Генеруємо унікальний ID для клієнта
  const userId = `user-${Date.now()}`;
  users.set(userId, ws);
  ws.send(
    JSON.stringify({ user: 'Bot', text: `Твій ID: ${userId}` })
  );

  ws.on('message', async (data) => {
    let message;
    try {
      message = JSON.parse(data);
    } catch (error) {
      console.error('Invalid message format:', error);
      ws.send(
        JSON.stringify({ user: 'Bot', text: 'Неправильний формат повідомлення.' })
      );
      return;
    }

    console.log('Received message:', message);

    const room = message.room || 'global';
    saveChatHistory(room, message); // Використовуємо модуль для збереження історії

    // Обробка команд через handleCommand
    if (message.text.startsWith('/')) {
      const response = await handleCommand(message, ws, users);
      if (response) {
        ws.send(JSON.stringify({ user: 'Bot', text: response }));
      }
      return;
    }

    // Інтеграція OpenAI
    try {
      const botReply = await getChatCompletion(
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

  ws.on('close', () => {
    console.log('Client disconnected');
    users.delete(userId); // Видаляємо клієнта після відключення
  });
});

console.log('WebSocket server running on ws://localhost:8080');
