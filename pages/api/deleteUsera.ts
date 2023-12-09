import { Client, Functions } from "appwrite";

const client: any = new Client();

const functions = new Functions(client);

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID); // Your project ID

const promise = functions.createExecution("65734ae49c41205b0552");

console.log(promise);

promise.then(
  function (response) {
    console.log(response); // Success
  },
  function (error) {
    console.log(error); // Failure
  }
);
