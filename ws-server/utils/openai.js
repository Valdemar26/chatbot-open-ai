import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getChatCompletion(messages, model = 'gpt-3.5-turbo') {
  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages,
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error response from OpenAI:', error.response?.data || error.message);
    if (error?.code === 'insufficient_quota') {
      return 'Ваша квота закінчилася. Перевірте тарифний план.';
    }
    if (error.code === 'model_not_found') {
      return 'Модель GPT-4o-mini недоступна. Використовуйте іншу модель.';
    }
    if (error.code === 429) {
      return 'Перевищено ліміт запитів. Спробуйте пізніше.';
    }
    return 'Сталася помилка з OpenAI API.';
  }
}
