"use client";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FacebookAuthProvider } from "firebase/auth";

import { auth } from "../../firebase/config";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import "../../styles/style.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { FaGoogle, FaFacebook } from "react-icons/fa"; // Import Google and Facebook logos from react-icons

const facebookProvider = new FacebookAuthProvider();
const googleProvider = new GoogleAuthProvider();

export default function SignUp() {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("User signed in with Google:", user);

      router.push("/"); // Redirect to a dashboard or home page after sign-in
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  // Handle Facebook sign-in
  const handleFacebookSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      console.log("User signed in with Facebook:", user);

      router.push("/"); // Redirect to a dashboard or home page after sign-in
    } catch (error) {
      console.error("Error signing in with Facebook:", error);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <>
      <div
        className={`min-h-screen flex items-center justify-center gradient-background ${
          darkMode ? "dark" : ""
        }`}>
        <Card className="w-full border-none shadow-2xl max-w-md card gradient-card">
          <CardHeader className="space-y-1">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">
                Create an account
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode">
                {darkMode ? (
                  <Sun className="h-6 w-6" />
                ) : (
                  <Moon className="h-6 w-6" />
                )}
              </Button>
            </div>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent></CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              className="w-full sign-in-btn gradient-btn flex items-center justify-center gap-2"
              variant="outline"
              onClick={handleGoogleSignIn}>
              <FaGoogle className="h-5 w-5" />
              Sign up with Google
            </Button>
            <Button
              className="w-full sign-in-btn gradient-btn flex items-center justify-center gap-2"
              variant="outline"
              onClick={handleFacebookSignIn}>
              <FaFacebook className="h-5 w-5" />
              Sign up with Facebook
            </Button>

            <div className="text-sm text-center">
              Already have an account?{" "}
              <Link href="/sign-in" className="underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
