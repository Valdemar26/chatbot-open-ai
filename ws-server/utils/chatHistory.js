// Створення змінної chatHistory
const chatHistory = {};

// Експорт функції saveChatHistory
export function saveChatHistory(room, message, limit = 100) {
  if (!chatHistory[room]) {
    chatHistory[room] = [];
  }
  chatHistory[room].push(message);
  if (chatHistory[room].length > limit) {
    chatHistory[room].shift(); // Видаляємо найстаріше повідомлення
  }
}

// Експорт chatHistory для доступу з інших файлів, якщо потрібно
export { chatHistory };
