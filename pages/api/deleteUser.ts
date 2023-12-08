export default async function handler(req, res) {
  console.log("hello");
  const response = await fetch(
    "https://cloud.appwrite.io/v1/functions/65734ae49c41205b0552/executions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
        // Include your Appwrite API key here if necessary
      },
      body: JSON.stringify(req.body),
    }
  );

  const data = await response.json();
  res.status(response.status).json(data);
  console.log(data);
}
