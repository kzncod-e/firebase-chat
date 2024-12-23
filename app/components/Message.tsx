"use client";

import { User } from "firebase/auth";
import type { Message } from "../types/type";
import { DocumentData } from "firebase/firestore";

export default function Messages({
  message,
  currentUser,
}: {
  message: DocumentData | undefined;
  currentUser: User | undefined;
}) {
  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {message &&
          message.map((msg: Message) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.senderId === currentUser?.displayName
                  ? "justify-end"
                  : "justify-start"
              }`}>
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
                  msg.senderId === currentUser?.displayName
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary"
                }`}>
                <p className="text-sm font-semibold mb-1">
                  {msg.senderId === currentUser?.displayName
                    ? "you"
                    : msg.senderId}
                </p>
                <p>{msg.text}</p>
                <p className="text-xs text-right mt-1 opacity-70"></p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
