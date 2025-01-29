import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import { getGeminiResponse } from './utils/gemini-api.js';

dotenv.config();

const wss = new WebSocketServer({ port: 8081 });

wss.on('connection', (ws) => {
  console.log('New AI client connected!');

  ws.on('message', async (data) => {
    let message;
    try {
      message = JSON.parse(data);
    } catch (error) {
      console.error('Invalid message format:', error);
      ws.send(JSON.stringify({ user: 'Bot', text: 'Неправильний формат повідомлення.' }));
      return;
    }

    console.log('AI Chat Received:', message);

    try {
      const botReply = await getGeminiResponse(message.text);
      ws.send(JSON.stringify({ user: 'AI', text: botReply }));
    } catch (error) {
      console.error('Не вдалося обробити AI-запит:', error);
      ws.send(JSON.stringify({ user: 'Bot', text: 'Помилка AI. Спробуй пізніше!' }));
    }
  });

  ws.on('close', () => {
    console.log('AI client disconnected');
  });
});

console.log('AI WebSocket server running on ws://localhost:8081');
