import express from "express";
import prisma from "./db/prisma";

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  return res.send(users);
});

app.post("/create", async (req, res) => {
  const { name } = req.body;
  const newUser = await prisma.user.create({
    data: {
      name,
      email: name + "@email.com",
      password: "password",
    },
  });
  return res.send(newUser);
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
