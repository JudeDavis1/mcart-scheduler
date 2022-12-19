import { app } from "./src/backend/app.js";
const PORT = 3001;
const server = app.listen(PORT, () => {
    console.log("Running on PORT: " + PORT + ".");
});
export { server };
