import { getWeather } from './weather.js';

const commands = {
  '/help': () =>
    'Список доступних команд: \n/help - допомога\n/weather [місто] - погода у вказаному місті\n/private [ID] [повідомлення] - приватне повідомлення.',
  '/weather': async (args) => {
    if (!args[0]) return 'Вкажи місто після команди /weather.';
    return await getWeather(args[0]); // Викликаємо функцію з weather.js
  },
  '/private': (args, ws, users) => {
    const recipientId = args[0];
    const privateMessage = args.slice(1).join(' ');
    if (!recipientId || !privateMessage) {
      return 'Формат команди: /private [ID користувача] [повідомлення].';
    }
    const recipient = users.get(recipientId);
    if (recipient) {
      recipient.send(
        JSON.stringify({ user: 'Bot', text: privateMessage })
      );
      return `Приватне повідомлення відправлено користувачу ${recipientId}.`;
    }
    return 'Користувач з таким ID не знайдений.';
  },
};

export function handleCommand(message, ws, users) {
  const [command, ...args] = message.text.split(' ');
  const handler = commands[command];
  if (handler) {
    return handler(args, ws, users);
  }
  return 'Невідома команда. Напиши /help для списку доступних команд.';
}
