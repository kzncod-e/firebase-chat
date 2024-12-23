"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { collection, query, where } from "firebase/firestore";
import { getDb } from "@/app/firebase/config";
import { error } from "console";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const usersRef = collection(getDb, "Users"); // Replace "Users" with your collection name
    const user = query(usersRef, where("email", "==", email));
    if (!user) {
      console.log("user not found");
    }
    router.push("/");
  };

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
            <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {darkMode ? (
                <Sun className="h-6 w-6" />
              ) : (
                <Moon className="h-6 w-6" />
              )}
            </Button>
          </div>
          <CardDescription>
            Enter your email and password to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Remember me
                </label>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" type="submit" onClick={handleSubmit}>
            Sign in
          </Button>
          <div className="text-sm text-center">
            Don't have an account?{" "}
            <Link href="/sign-up" className="underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
