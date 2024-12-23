"use client";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FacebookAuthProvider } from "firebase/auth";

import { auth } from "../../firebase/config";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getDb } from "../../firebase/config";
import { collection, addDoc } from "firebase/firestore";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
const facebookProvider = new FacebookAuthProvider();
const gogleProvider = new GoogleAuthProvider();

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  const [createUserWithEmailAndPassword, , loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  // Handle user creation with email and password
  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    if (!agreeTerms) {
      console.error("You must agree to the terms and conditions");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(email, password);
      const docRef = await addDoc(collection(getDb, "User"), {
        email: email,
        password: password,
        displayName: name,
      });
      console.log("Document written with ID: ", docRef.id);

      if (res) {
        router.push("/sign-in");
      }
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, gogleProvider);
      const user = result.user;
      console.log("User signed in with Google:", user);

      router.push("/"); // Redirect to a dashboard or home page after sign-in
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };
  const handleFacebookSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      console.log("User signed in with Google:", user);

      router.push("/"); // Redirect to a dashboard or home page after sign-in
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gray-100 ${
        darkMode ? "dark" : ""
      }`}>
      <Card className="w-full max-w-md">
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
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">name</Label>
              <Input
                id="name"
                type="text"
                placeholder="m@example.com"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked)}
                required
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I agree to the{" "}
                <Link href="#" className="underline">
                  terms and conditions
                </Link>
              </label>
            </div>
            {error && (
              <p className="text-sm text-red-500">Error: {error.message}</p>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            className="w-full"
            type="submit"
            onClick={handleSubmit}
            disabled={loading || !agreeTerms}>
            {loading ? "Creating Account..." : "Create account"}
          </Button>

          <Button
            className="w-full"
            variant="outline"
            onClick={handleGoogleSignIn}>
            Sign up with Google
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={handleFacebookSignIn}>
            Sign up with facebook
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
  );
}
