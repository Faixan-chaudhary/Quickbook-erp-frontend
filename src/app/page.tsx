"use client";

import { useRouter } from "next/navigation";
import Landing from "@/views/Landing";

export default function HomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/signup");
  };

  const handleSignIn = () => {
    router.push("/signin");
  };

  return <Landing onGetStarted={handleGetStarted} onSignIn={handleSignIn} />;
}
