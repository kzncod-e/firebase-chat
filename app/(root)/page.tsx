"use client";

import { useEffect, useState } from "react";

import {
  addDoc,
  collection,
  DocumentData,
  onSnapshot,
} from "firebase/firestore";
import { getDb } from "../firebase/config";

import Sidebar from "../components/Sidebar";
import AuthGuard from "../components/AuthGuard";

export default function ChatPage() {
  const [rooms, setRooms] = useState<DocumentData>();

  useEffect(() => {
    getRooms();
  }, []);

  const getRooms = async () => {
    const roomsCollectionRef = collection(getDb, "RoomChats"); // Reference to the entire collection
    const unsubscribe = onSnapshot(roomsCollectionRef, (snapshot) => {
      const rooms = snapshot.docs.map((doc) => ({
        id: doc.id, // You can also add the document ID to each room object
        ...doc.data(),
      }));
      setRooms(rooms); // Set the state with the array of rooms
    });

    // Optionally, you can return the unsubscribe function to stop listening for changes
    return unsubscribe;
  };

  return (
    <AuthGuard>
      <div className="flex h-screen bg-gray-100">
        <Sidebar rooms={rooms} />
      </div>
    </AuthGuard>
  );
}
