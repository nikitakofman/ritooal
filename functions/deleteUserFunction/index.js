const { Client, Account, Users } = require("node-appwrite");

module.exports = async function ({ req, res, log, error }) {
  const client = new Client();
  client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const users = new Users(client);

  try {
    const payload = JSON.parse(req.body);
    const userId = payload.userId;

    log(`Received request to delete user ID: ${userId}`);

    const result = await users.delete(userId);
    log(`User deleted successfully: ${JSON.stringify(result)}`);

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
