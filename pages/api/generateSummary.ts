// frontend/pages/api/generateSummary.ts
import OpenAI from "openai";
import type { NextApiRequest, NextApiResponse } from "next";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { todos } = req.body; // Extracting the todos from the request body

    try {
      // Call the OpenAI API with the provided todos
      const response = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
            role: "user",
            content: `Based on the numbers of done, in progress, and todo in the following data: ${JSON.stringify(
              todos
            )} tell the user the appropriate things and encourage/motivate them, aswell as give productivity tip. make it max 2 or 3 sentences. If there is 0 tasks done, do not talk about done tasks.`,
          },
        ],
        model: "gpt-3.5-turbo",
        temperature: 0.8,
        n: 1,
        stream: false,
      });

      // Send the response from OpenAI back to the client
      res.status(200).json(response);
    } catch (error) {
      console.error("Error with OpenAI API:", error);
      // Send an error response back to the client
      res.status(500).json({ error: "Error processing your request" });
    }
  } else {
    // Send a 405 Method Not Allowed response if the request is not a POST
    res.status(405).end();
  }
}
