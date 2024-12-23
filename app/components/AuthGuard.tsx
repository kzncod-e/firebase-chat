"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../firebase/config"; // Import your Firebase auth config
import { onAuthStateChanged } from "firebase/auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Redirect to sign-in page if no user is logged in
        router.push("/sign-up");
      } else {
        setLoading(false); // User is authenticated, stop loading
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, [router]);

  if (loading) {
    // Optionally, show a loading spinner while checking auth
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
