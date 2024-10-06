import { addUser } from "./users";

export default (req, res) => {
  if (req.method === "POST") {
    const { email, password } = req.body;
    const user = addUser(email, password);
    if (user) {
      res.status(200).json({ message: "User created successfully" });
    } else {
      res.status(400).json({ message: "User already exists" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};
