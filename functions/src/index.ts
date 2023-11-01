/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest, onCall, HttpsError} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {Express} from "express";
import fetch from "node-fetch";
import "dotenv/config";



// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest((request, response) => {
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "GET, POST");
  response.set("Access-Control-Allow-Headers", "Content-Type");

  // If it"s a preflight request, send the correct headers and end the function
  if (request.method === "OPTIONS") {
    response.status(204).send("");
  } else {
    logger.info("Hello logs!", {structuredData: true});
    response.send("Hello from Firebase!");
  }
});



