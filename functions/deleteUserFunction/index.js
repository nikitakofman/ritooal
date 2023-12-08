const { Client, Users } = require("node-appwrite");

module.exports = async function ({ req, res, log, error }) {
  log(`Raw request body: ${req.body}`);

  const client = new Client();
  client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const users = new Users(client);

  try {
    // Ensure the body is parsed correctly
    let parsedBody;
    try {
      parsedBody = JSON.parse(req.body);
    } catch (parseError) {
      error(
        `Error parsing request body: ${parseError.mesfsage}, ${req.body} ${parsedBody} ${req} "hello"`
      );
      return res.json({
        message: "Error parsing request body",
        error: parseError.message,
      });
    }

    const userId = parsedBody.userId;
    log(`Received userId: ${userId}`);

    const result = await users.delete(userId);
    log(`User deleted successfully: ${JSON.stringify(result)}`);

    return res.json({
      message: "User deleted successfully",
      result: result,
    });
  } catch (err) {
    error(`Failed to delete the user: ${err.message}`);
    return res.json({
      message: "Failed to delete the user",
      error: err.message,
    });
  }
};
