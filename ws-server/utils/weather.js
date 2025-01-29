import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

export async function getWeather(city) {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    return 'API ключ для погоди не знайдено.';
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${apiKey}&units=metric&lang=ua`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        return `Місто "${city}" не знайдено. Перевір правильність написання.`;
      }
      throw new Error(`Помилка: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return `Погода у місті ${data.name}: ${data.weather[0].description}, температура ${data.main.temp}°C.`;
  } catch (error) {
    console.error('Помилка при отриманні погоди:', error.message);
    return 'Не вдалося отримати дані про погоду. Спробуй ще раз пізніше.';
  }
}
