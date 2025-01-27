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

// Функція для виклику OpenAI API
async function getChatCompletion(messages, model = 'gpt-3.5-turbo') {
  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages,
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error with OpenAI API:', error);

    // Перевірка на помилку з квотою
    if (error.code === 'insufficient_quota') {
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
        // Основний запит до OpenAI
        let botReply = await getChatCompletion(
          [
            { role: 'system', content: 'Ти - розумний помічник.' },
            { role: 'user', content: message.text },
          ],
          'gpt-3.5-turbo' // Спочатку використовуємо менш ресурсну модель
        );
        ws.send(JSON.stringify({ user: 'Bot', text: botReply }));
      } catch (error) {
        // Якщо сталася помилка, пробуємо переключитися на іншу модель
        if (error.message.includes('Перевищено ліміт')) {
          try {
            console.log('Перемикаємося на gpt-4o-mini...');
            let botReply = await getChatCompletion(
              [
                { role: 'system', content: 'Ти - розумний помічник.' },
                { role: 'user', content: message.text },
              ],
              'gpt-4o-mini' // Використовуємо більш потужну модель
            );
            ws.send(JSON.stringify({ user: 'Bot', text: botReply }));
          } catch (innerError) {
            console.error('Не вдалося отримати відповідь від OpenAI:', innerError);
            ws.send(
              JSON.stringify({
                user: 'Bot',
                text: 'На жаль, зараз я не можу відповісти. Спробуй пізніше!',
              })
            );
          }
        } else {
          console.error('Не вдалося обробити запит:', error);
          ws.send(
            JSON.stringify({
              user: 'Bot',
              text: 'Сталася технічна помилка. Спробуй пізніше!',
            })
          );
        }
      }
    }
  });

  ws.on('close', () => console.log('Client disconnected'));
});

console.log('WebSocket server running on ws://localhost:8080');
