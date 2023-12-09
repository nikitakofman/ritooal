const { Client, Account, Users } = require("node-appwrite");

module.exports = async function ({ req, res, log, error }) {
  log(`Raw request body: ${req.body}`);
  log(`Request Body: ${JSON.stringify(req.body)}`);

  // Initialize the Appwrite client
  const client = new Client();
  const account = new Account(client);
  const users = new Users(client);

  client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  try {
    // Parse the JSON string in req.body
    const parsedBody = JSON.parse(req.body);
    const userId = parsedBody.userId;
    // log(`Received userId: ${userId}`);

    const result = await users.delete(userId);
    log(`User deleted successfully: ${JSON.stringify(result)}`);

    return res.json({
      message: "User deleted successfully",
      result: result,
    });
  } catch (err) {
    error(
      `Failed to delete the user: ${err.message} ${req.body} ${parsedBody} ${userId}`
    );
    return res.json({
      message: "Failed to delete the user",
      error: err.message,
    });
  }
};
