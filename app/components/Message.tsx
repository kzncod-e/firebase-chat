"use client";

import { User } from "firebase/auth";
import type { Message } from "../types/type";
import { DocumentData } from "firebase/firestore";
import Image from "next/image";
import "../styles/style.css";
import formatTime from "@/lib/formatTime";
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
                    ? "gradient-card"
                    : "bg-secondary"
                }`}>
                <div className="flex gap-5 justify-between">
                  <p className="text-sm font-semibold mb-1">
                    {msg.senderId === currentUser?.displayName
                      ? "you"
                      : msg.senderId}
                  </p>
                  <p className="text-[0.6rem] font-thin text-slate-300">
                    {formatTime(new Date(msg.createdAt))}
                  </p>
                </div>

                <div className="flex flex-col">
                  {msg.imgUrl && (
                    <>
                      <Image
                        className="shadow-2xl shadow-[#0F2027] rounded-lg"
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
