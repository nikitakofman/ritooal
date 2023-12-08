const { Client, Users } = require("node-appwrite");

module.exports = async function ({ req, res, log, error }) {
  log(`Raw request body: ${req.body}`);

  const client = new Client();
  client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(
      "7ee6413de7c9224361723dc689753a5152b5e33895526042ced810a574e0452ba8c757839a54ab5a65d28a0c92854b7432a4615ef65a03b10d707f9fcfcaa50cca9b799fd65aa20105c14b5a1bcce0a2679442cc48cc70cdc9bbcc15b8a1933e849cc06646ffda33f2a51e56f87b052fd6abd1e936d2bde6f9d59f6083c0e115"
    )
    .setKey(process.env.APPWRITE_API_KEY);

  const users = new Users(client);

  try {
    // Ensure the body is parsed correctly
    let parsedBody;
    try {
      parsedBody = JSON.parse(req.body);
    } catch (parseError) {
      error(
        `Error parsing request body: ${parseError.message}, ${
          req.body
        } ${parsedBody} ${req} Jsonstringify req result:  ${JSON.stringify(
          req
        )} "hello"`
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
