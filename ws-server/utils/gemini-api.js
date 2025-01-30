import axios from 'axios';

export async function getGeminiResponse(prompt) {
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    throw new Error("API_KEY is missing. Set it in your environment variables.");
  }

  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  const requestData = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ]
  };

  try {
    const response = await axios.post(url, requestData);

    console.log("Full API response:", JSON.stringify(response.data, null, 2));

    return response.data.candidates[0]?.content?.parts?.[0]?.text ?? "No response";
  } catch (error) {
    console.error("Gemini API error:", error.response?.data ?? error.message);
    throw new Error("Failed to fetch response from Gemini API.");
  }
}
