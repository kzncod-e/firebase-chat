"use client";

import { User } from "firebase/auth";
import type { Message } from "../types/type";
import { DocumentData } from "firebase/firestore";
import Image from "next/image";

export default function Messages({
  message,
  currentUser,
}: {
  message: DocumentData | undefined;
  currentUser: User | undefined;
}) {
  return (
    <>
      <div className="flex-1  p-4 space-y-4">
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
                <div className="flex flex-col">
                  {msg.imgUrl && (
                    <>
                      <Image
                        src={msg.imgUrl}
                        alt="image"
                        height={200}
                        width={200}></Image>
                    </>
                  )}
                  <p className="">{msg.text}</p>
                </div>

                <p className="text-xs text-right mt-1 opacity-70"></p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
