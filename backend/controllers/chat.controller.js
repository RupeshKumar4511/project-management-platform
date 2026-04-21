import { config } from "dotenv";
import OpenAI from 'openai'
import {  explainPrompt } from '../middleware/prompt.middleware.js'
config();


const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://api.chatanywhere.tech/v1"
});

export const queryResponse = async (req, res) => {
    try {
        const { query } = req.body;
        const prompt = explainPrompt(query);

        const response = await client.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(response.choices[0].message.content);
        return res.json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
