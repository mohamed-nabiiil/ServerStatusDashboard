import { useEffect } from "react";
import { useRouter } from "next/router";
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to signup page
    router.push("/auth/signupPage");
  }, [router]);

  return null;
}
