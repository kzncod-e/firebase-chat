"use client";
import { useEffect, useState } from "react";
import { Menu, MessageSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Room } from "../types/type";
import {
  addDoc,
  collection,
  DocumentData,
  onSnapshot,
} from "firebase/firestore";
import { getDb } from "../firebase/config";
import { User } from "firebase/auth";
import { getCurrentUserId } from "../actions/getUser";
import Messages from "./Message";
import ChatHeader from "./ChatHeader";

export default function Sidebar({
  rooms,
}: {
  rooms: DocumentData | undefined;
}) {
  const [currentRoom, setCurrentRoom] = useState<Room | undefined>(undefined);
  const [currentRoomName, setCurrentRoomName] = useState<string>("room");
  const [message, setMessage] = useState<DocumentData>();
  const [currentUser, setCurrentUser] = useState<User>();
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // Here you would typically send the message to your backend
      const messagesRef = collection(
        getDb,
        "RoomChats",
        currentRoomName,
        "messages"
      );
      const res = await addDoc(messagesRef, {
        senderId: currentUser?.displayName,
        text: newMessage,
        createdAt: new Date().toISOString(),
      });
      console.log("Sending message:", res);
      setNewMessage("");
    }
  };

  const getMessages = async () => {
    const messagesRef = collection(
      getDb,
      "RoomChats",
      currentRoomName,
      "messages"
    );
    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      const messages = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        // Sort messages by createdAt in descending order (latest message first)
        .sort((a, b) => {
          const aDate = new Date(a.createdAt).getTime();
          const bDate = new Date(b.createdAt).getTime();
          return aDate - bDate; // For descending order: return bDate - aDate;
        });

      setMessage(messages);
    });
    return unsubscribe;
  };

  useEffect(() => {
    const getUser = async () => {
      const user = await getCurrentUserId();
      if (user) {
        setCurrentUser(user);
      }
    };
    getUser();

    getMessages();
  }, []);
  console.log(currentRoomName, "ini di sidebar");
  console.log(message, "ini di sidebar");

  return (
    <>
      <div className="hidden md:flex md:flex-col md:w-64 bg-background border-r">
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-semibold">Chats</h1>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search contacts..."
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ul>
            {rooms?.map((room: Room, index: number) => (
              <li
                onClick={() => {
                  setCurrentRoom(room);
                  setCurrentRoomName(room.id);
                }}
                key={index}
                className={`${
                  currentRoom?.name === room.name ? "bg-slate-400" : ""
                } flex items-center p-4 hover:bg-accent cursor-pointer`}>
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
      <div className="flex flex-col flex-1">
        <ChatHeader />
        {/* Messages */}
        <Messages message={message} currentUser={currentUser} />

        {/* Message Input */}
        <div className="p-4 border-t bg-background">
          <form
            method="POST"
            onSubmit={handleSendMessage}
            className="flex items-center space-x-2">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <MessageSquare className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
