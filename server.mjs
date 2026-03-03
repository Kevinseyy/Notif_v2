import express from "express";
import { contentRouter } from "./routes/contentAPI.mjs";
import { usersRouter } from "./routes/usersAPI.mjs";

const app = express();
const PORT = 8080;

app.use(express.json());

app.use(express.static("public"));
app.use(express.static("src"));

app.use("/api/v1", contentRouter);
app.use("/api/v1", usersRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
