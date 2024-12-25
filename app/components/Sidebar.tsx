"use client";

import { useEffect, useState, useRef } from "react";
import { Menu, MessageSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Message, Room } from "../types/type";
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
import background from "../img/bg.jpg";

export default function Sidebar({
  rooms,
}: {
  rooms: DocumentData | undefined;
}) {
  const [currentRoom, setCurrentRoom] = useState<Room | undefined>(undefined);
  const [currentRoomName, setCurrentRoomName] = useState<string>("global");
  const [message, setMessage] = useState<DocumentData>([]);
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [newMessage, setNewMessage] = useState("");
  const [roomHeader, setRoomHeader] = useState<DocumentData>();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      try {
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
        console.log("Message sent:", res);
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
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

  return (
    <>
      <div className="hidden md:flex md:flex-col md:w-64 shadow-2xl border-none gradient-background border-r">
        <div className="flex items-center justify-between p-4 border-b">
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
                  setCurrentRoom(room);
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
      <div className="flex flex-col gradient-background  flex-1">
        <ChatHeader room={roomHeader} />
        {/* Messages */}
        <div className={`flex-1 overflow-y-auto bg-cover bg-center `}>
          <Messages message={message} currentUser={currentUser} />
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 shadow-2xl border-none gradient-background">
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
