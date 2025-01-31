import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors({ origin: true }));

app.get("/message", (req, res) => {
  res.json({ message: "Привіт з Firebase!" });
});

// Експортуємо API, щоб Firebase міг його використовувати
exports.api = functions.https.onRequest(app);
