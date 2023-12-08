const { Client, Account } = require("node-appwrite");

module.exports = async function (request, context) {
  // Use context.log for standard logs

  // Initialize the Appwrite client
  const client = new Client();
  const account = new Account(client);

  client
    .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
    .setProject(process.env.APPWRITE_PROJECT_ID) // Your project ID
    .setKey(process.env.APPWRITE_API_KEY); // Your Appwrite API key with permissions

  try {
    const userId = request.payload.userId;
    let result = await account.delete(userId);

    return {
      message: "User deleted successfully",
      result: result,
    };
  } catch (error) {
    // Use context.error for error logs

    return {
      message: "Failed to delete the user",
      error: error.message,
    };
  }
};
