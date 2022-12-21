import path from "path";
import { app } from "./app.js";
import express from "express";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.resolve(__dirname, "../../../build")));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../../build", "index.html"));
});
app.listen(80, () => {
    console.log("Listening");
});
