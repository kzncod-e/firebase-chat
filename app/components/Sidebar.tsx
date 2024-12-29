"use client";
import React, { useEffect, useState, useRef } from "react";
import { Camera, Menu, MessageSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Room } from "../types/type";
import { UploadButton } from "@/utils/uploadthing";
import "../styles/style.css";
import {
  addDoc,
  collection,
  DocumentData,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { getDb } from "../firebase/config";
import { User } from "firebase/auth";
import { getCurrentUserId } from "../actions/getUser";
import Messages from "./Message";
import ChatHeader from "./ChatHeader";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { LoaderImage } from "./Loader2";
export default function Sidebar({
  rooms,
}: {
  rooms: DocumentData | undefined;
}) {
  const [loading, setLoading] = useState(false);
  const [currentRoomName, setCurrentRoomName] = useState<string>("global");
  const [message, setMessage] = useState<DocumentData>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>();
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [newMessage, setNewMessage] = useState("");
  const [roomHeader, setRoomHeader] = useState<DocumentData>();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !newMessage) return null;
    try {
      const messagesRef = collection(
        getDb,
        "RoomChats",
        currentRoomName,
        "messages"
      );
      console.log(selectedFile);

      // Create the message object
      const messageData = {
        senderId: currentUser?.displayName,
        text: newMessage ? newMessage : null,
        imgUrl: selectedFile ? selectedFile : null,
        createdAt: new Date().toISOString(),
      };

      // Add the message to Firestore
      const res = await addDoc(messagesRef, messageData);
      console.log("Message sent:", res);

      setNewMessage(""); // Clear input after sending
      setSelectedFile(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const getMessages = () => {
    if (!currentRoomName) {
      console.warn("No room selected for fetching messages.");
      return;
    }

    const messagesRef = collection(
      getDb,
      "RoomChats",
      currentRoomName,
      "messages"
    );

    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const messages = snapshot.docs
        .map((doc) => ({
          ...doc.data(),
        }))
        .sort((a, b) => {
          const aDate = new Date(a.createdAt).getTime();
          const bDate = new Date(b.createdAt).getTime();
          return aDate - bDate; // Ascending order
        });

      setMessage(messages);
    });

    return unsubscribe;
  };

  const getRoom = () => {
    if (!currentRoomName) {
      console.warn("No room selected for fetching room details.");
      return;
    }

    const roomRef = doc(getDb, "RoomChats", currentRoomName);

    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        setRoomHeader(snapshot.data());
      } else {
        console.warn("Room data not found for:", currentRoomName);
      }
    });

    return unsubscribe;
  };

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUserId();
      if (user) setCurrentUser(user);
    };

    fetchUser();

    const unsubscribeRoom = getRoom();
    const unsubscribeMessages = getMessages();

    return () => {
      if (unsubscribeRoom) unsubscribeRoom();
      if (unsubscribeMessages) unsubscribeMessages();
    };
  }, [currentRoomName]);
  console.log(loading);

  return (
    <>
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 bg-black z-50">
          <div className="  w-16 h-16 ">
            <LoaderImage />
          </div>
        </div>
      )}
      <div className="hidden relative md:flex md:flex-col md:w-64 shadow-2xl border-none gradient-background text-[#eaafc8] border-r">
        <div className="flex items-center justify-between p-4 shadow-2xl">
          <h1 className="text-xl font-semibold">Chats</h1>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-4 shadow-2xl border-none">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search contacts..."
              className="pl-10 shadow-2xl border-none inline-block"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ul>
            {rooms?.map((room: Room, index: number) => (
              <li
                key={index}
                onClick={() => {
                  setCurrentRoomName(room.id);
                }}
                className={`${
                  currentRoomName === room.id ? "bg-slate-400" : ""
                } flex items-center p-4 cursor-pointer`}>
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={room.imgUrl} alt={room.name} />
                </Avatar>
                <div>
                  <h2 className="font-semibold">{room.name}</h2>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex flex-col gradient-background text-[#FDC830] flex-1">
        <ChatHeader room={roomHeader} />
        {/* Messages */}
        <div className={`flex-1 overflow-y-auto bg-cover bg-center`}>
          <Messages message={message} currentUser={currentUser} />
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 shadow-2xl border-none gradient-background">
          <div className="flex items-center space-x-2">
            <div className="border-none relative flex shadow-inner items-center rounded-xl gradient-background w-full">
              <Label htmlFor="dropzone-file" className="cursor-pointer">
                <Camera className="absolute left-8 top-5" />
                <UploadButton
                  className="ut-button:opacity-0 ut-button:w-8"
                  appearance={{
                    allowedContent: "opacity-0",
                  }}
                  endpoint="imageUploader"
                  onBeforeUploadBegin={(files) => {
                    setLoading(true);
                    // Preprocess files before uploading (e.g. rename them)
                    return files.map(
                      (f) =>
                        new File([f], "renamed-" + f.name, { type: f.type })
                    );
                  }}
                  onClientUploadComplete={(res) => {
                    console.log("Files: ", res);
                    setSelectedFile(res[0].url); // Set the uploaded file URL
                    setLoading(false); // Set loading to false once upload completes
                  }}
                  onUploadError={(error: Error) => {
                    setLoading(false); // Set loading to false in case of error
                    alert(`ERROR! ${error.message}`);
                  }}
                />
              </Label>

              <Input
                type="text"
                value={`${newMessage}`}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 shadow-current border-none shadow-2xl"
              />
              {selectedFile && (
                <div className="flex items-center gap-2">
                  <Image
                    src={selectedFile}
                    alt="Selected"
                    width={100}
                    height={100}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-red-500 hover:underline">
                    Remove
                  </button>
                </div>
              )}
            </div>
            <Button
              onClick={handleSendMessage}
              className="gradient-background"
              size="icon">
              <MessageSquare className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
