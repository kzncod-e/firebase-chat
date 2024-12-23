"use client";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "../firebase/config";

export const getCurrentUserId = async (): Promise<User | ""> => {
  const auth = getAuth(app);

  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user); // Return the user ID
      } else {
        console.log("No user is logged in.");
        resolve(""); // No user is logged in
      }
    });
  });
};
