let users = []; // Mock user

// Function to add a user
export const addUser = (email) => {
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return null;
  }
  const newUser = { email };
  users.push(newUser);
  return newUser;
};

// Function to find a user
export const findUser = (email, password) => {
  return users.find((user) => user.email === email);
};
