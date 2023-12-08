const { Client, Account } = require("node-appwrite");

module.exports = async function (request) {
  console.log("hello");
  // Initialize the Appwrite client
  const client = new Client();
  const account = new Account(client);

  // Set your Appwrite project ID and API key
  client
    .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID) // Your project ID
    .setKey(process.env.NEXT_PUBLIC_APPWRITE_API_KEY); // Your Appwrite API key with permissions

  try {
    // Extract the user ID from the request payload
    const userId = request.payload.userId;

    // Use the Appwrite SDK to delete the user
    await account.delete(userId);

    // Return a success response
    return {
      message: "User deleted successfully",
    };
  } catch (error) {
    // Return an error response if something goes wrong
    return {
      error: error.message,
    };
  }
};
