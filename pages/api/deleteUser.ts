export default async function handler(req, res) {
  const headers = {
    "Content-Type": "application/json",
    "X-Appwrite-Project": process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
    "X-Appwrite-Key": process.env.APPWRITE_API_KEY, // Uncomment and use if API key is required
  };

  console.log(req.body);
  try {
    const response = await fetch(
      "https://cloud.appwrite.io/v1/functions/65734ae49c41205b0552/executions",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(req.body),
      }
    );

    console.log("woo", response);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Response data:", data);
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Error making request to Appwrite:", error);
    res.status(500).json({ error: error.message });
  }
}
