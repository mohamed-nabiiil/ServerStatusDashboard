import { findUser } from "./users";

export default (req, res) => {
  if (req.method === "POST") {
    const { email, password } = req.body;
    const user = findUser(email, password);
    if (user) {
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};
