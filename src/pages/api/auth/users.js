let users = []; // Mock user

// Function to add a user (simulated signup)
export const addUser = (email, password) => {
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return null;
  }
  const newUser = { email, password };
  users.push(newUser);
  return newUser;
};

// Function to find a user (simulated login)
export const findUser = (email, password) => {
  return users.find(
    (user) => user.email === email && user.password === password
  );
};
