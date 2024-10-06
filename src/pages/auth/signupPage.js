import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        setErrorMessage("Signup successful, please login!");
        router.push("/auth/loginpage");
      } else {
        setErrorMessage("Signup failed. User may already exist.");
      }
    } catch (error) {
      setErrorMessage("An error occurred during signup.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {["email", "password", "confirmPassword"].map((field, idx) => (
            <input
              key={idx}
              type={field === "email" ? "email" : "password"}
              name={field}
              value={formData[field]}
              onChange={handleInputChange}
              placeholder={
                field === "confirmPassword"
                  ? "Confirm Password"
                  : field.charAt(0).toUpperCase() + field.slice(1)
              }
              className="block w-full p-2 border rounded"
              required
            />
          ))}
          <button
            type="submit"
            className="w-full p-2 bg-green-500 text-white rounded"
          >
            Sign Up
          </button>
        </form>

        {errorMessage && (
          <p className="mt-4 text-red-500 text-center">{errorMessage}</p>
        )}

        <div className="text-center mt-4">
          <p>
            Already have an account?{" "}
            <Link href="/auth/loginpage" className="text-blue-500">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
