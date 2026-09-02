"use client";

import { useRouter } from "next/navigation";
import Landing from "@/views/Landing";

export default function HomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/dashboard");
  };

  return <Landing onGetStarted={handleGetStarted} />;
}
