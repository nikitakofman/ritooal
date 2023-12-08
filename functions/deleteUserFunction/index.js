import { Client, Account } from "node-appwrite";

module.exports = async function (request, response) {
  console.log("Function is invoked");

  // Initialize the Appwrite client
  const client = new Client();
  const account = new Account(client);

  // Set your Appwrite project ID and API key
  client
    .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
    .setProject(process.env.APPWRITE_PROJECT_ID) // Your project ID from the environment variable
    .setKey(process.env.APPWRITE_API_KEY); // Your Appwrite API key from the environment variable

  try {
    // Extract the user ID from the request payload
    const userId = request.payload.userId;

    // Use the Appwrite SDK to delete the user
    let result = await account.delete(userId);

    // Return a success response
    return response.json({
      message: "User deleted successfully",
      result: result,
    });
  } catch (error) {
    // Return an error response if something goes wrong
    return response.json({
      message: "Failed to delete the user",
      error: error.message,
    });
  }
};
