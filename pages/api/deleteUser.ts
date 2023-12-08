export default async function handler(req, res) {
  const userId = "657390d77400749428bd";
  console.log("Deleting user with ID:", userId);

  const headers = {
    "Content-Type": "application/json",
    "X-Appwrite-Project": process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  };

  if (process.env.APPWRITE_API_KEY) {
    headers["X-Appwrite-Key"] = process.env.APPWRITE_API_KEY;
  }

  try {
    const requestBody = JSON.stringify({ userId });
    console.log(requestBody);

    const response = await fetch(
      "https://cloud.appwrite.io/v1/functions/65734ae49c41205b0552/executions",
      {
        method: "POST",
        headers: headers,
        body: '{"userId": "657390d77400749428bd"}',
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
