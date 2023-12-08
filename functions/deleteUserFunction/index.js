const { Client, Account, Users } = require("node-appwrite");

module.exports = async function (request, context) {
  // Use context.log for standard logs

  // Initialize the Appwrite client
  const client = new Client();

  client
    .setEndpoint("https://cloud.appwrite.io/v1")

    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY); // Your Appwrite API key with permissions

  const users = new Users(client);

  try {
    const userId = request.payload.userId;
    let result = await users.delete(userId);

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
