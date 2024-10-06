import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signIn } from "next-auth/react";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for email validation
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Validate email before submission
    if (!validateEmail(credentials.email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsLoading(true); // Set loading state

    const result = await signIn("credentials", {
      redirect: false,
      ...credentials,
    });

    setIsLoading(false); // Reset loading state

    if (result?.ok) {
      router.push("/dashboard");
    } else {
      setErrorMessage(result.error || "Login failed!");
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {["email", "password"].map((field, idx) => (
            <input
              key={idx}
              type={field === "email" ? "email" : "password"}
              name={field}
              value={credentials[field]}
              onChange={handleInputChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="block w-full p-2 border rounded"
              required
            />
          ))}
          <button
            type="submit"
            className={`w-full p-2 ${
              isLoading ? "bg-gray-500" : "bg-green-500"
            } text-white rounded`}
            disabled={isLoading} // Disable button during loading
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {errorMessage && (
          <p className="mt-4 text-red-500 text-center" aria-live="assertive">
            {errorMessage}
          </p>
        )}

        <p className="mt-4 text-center">Or login with:</p>
        <button
          onClick={handleGoogleLogin}
          className="w-full p-2 bg-red-500 text-white rounded mt-2"
        >
          Login with Google
        </button>

        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link href="/auth/signupPage" className="text-blue-500">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
