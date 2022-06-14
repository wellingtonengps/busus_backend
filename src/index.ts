import express from "express";
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized");
  })
  .catch((error) => console.error("Error during initialization: ", error));

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (_, res) => {
  return res.send({
    message: "Server is running on port " + port,
  });
});

app.get("/users", async (_, res) => {
  const users = await AppDataSource.getRepository(User).find();
  return res.send(users);
});

app.post("/user", async (req, res) => {
  const user = await AppDataSource.getRepository(User).create(req.body);
  const result = await AppDataSource.getRepository(User).save(user);
  return res.send(result);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
