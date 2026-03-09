import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const SYSTEM_PROMPT = `You are the Swappy in-app assistant.

Vault-X app facts:
- Users sign in with Google.
- The Home page introduces the product and links users to the breach checker.
- The Breach page lets a signed-in user check whether an email appears in known breach data.
- The Profile page shows the signed-in user's basic profile info and recorded breach history.
- The Vault page is used to create or enter a master key, then add saved passwords or retrieve passwords by site.
- The master key is verified separately before vault access is granted.
- Saved vault passwords are encrypted for storage and later decrypted only when the correct master key is provided.
- You cannot directly read a user's private vault records, account secrets, or live database contents unless the user explicitly pasted that information into chat.

Behavior rules:
- Be concise, practical, and app-specific.
- Prefer short answers with bullets or steps when the user asks how to do something.
- If the user asks how to use the app, answer in 4 to 6 clear steps tailored to Vault-X.
- If the user asks about security, explain clearly that the master key is required for vault access and saved passwords are encrypted.
- If the user asks about a breach result, explain what a breach means and what actions to take next.
- Do not write marketing copy, long introductions, or generic welcome paragraphs unless explicitly asked.
- Do not invent features that are not listed above.
- Refuse briefly if asked for passwords, secret extraction, account bypass, or harmful cyber abuse, then redirect to safe help.`;

export const chatWithAssistant = async (req, res) => {
  const { message } = req.body;
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message is required." });
  }

  if (!geminiApiKey) {
    return res.status(500).json({ error: "Gemini API key is not configured." });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\nUser question: ${message}`,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.5,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const reply =
      response.data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text)
        .filter(Boolean)
        .join("\n") || "I could not generate a response.";

    return res.status(200).json({ response: reply });
  } catch (error) {
    console.error("Chat request failed:", error.response?.data || error.message);
    return res.status(500).json({ error: "Unable to get chat response." });
  }
};
