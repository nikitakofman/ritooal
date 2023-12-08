const { Client, Account, Users } = require("node-appwrite");

module.exports = async function (request, log, error) {
  // Initialize the Appwrite client
  const client = new Client();

  client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY); // Your Appwrite API key with permissions

  const users = new Users(client);

  try {
    const userId = request.payload.userId;
    log(`Attempting to delete user with ID: ${userId}`);

    let result = await users.delete(userId);
    log(`Deletion result: ${JSON.stringify(result)}`);

    return {
      message: "User deleted successfully",
      result: result,
    };
  } catch (err) {
    error(`Failed to delete the user: ${err.message}`);
    return {
      message: "Failed to delete the user",
      error: err.message,
    };
  }
};
