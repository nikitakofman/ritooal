import type { NextApiRequest, NextApiResponse } from "next";
import { Client, Functions } from "appwrite";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const userId = req.body.userId; // Get the userId from the request body
    console.log(userId);
    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    const client: any = new Client();
    const functions = new Functions(client);

    client
      .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID); // Your project ID

    const execution = await functions.createExecution(
      process.env.NEXT_PUBLIC_FUNCTION_ID,
      JSON.stringify({ userId })
    );

    return res.status(200).json(execution);
  } catch (error) {
    console.error(error); // Failure
    return res.status(500).json({ message: "Internal Server Error", error });
  }
}
