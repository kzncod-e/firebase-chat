"use client";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Avatar } from "@radix-ui/react-avatar";
import { Phone, Settings, Video, LogOut } from "lucide-react"; // Import LogOut icon
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useRouter } from "next/navigation";

export default function ChatHeader() {
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      router.push("/sign-up"); // Redirect to the sign-in page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <>
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src="" alt="Alice Johnson" />
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">Alice Johnson</h2>
            <p className="text-sm text-green-500">Online</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          {/* Sign-Out Button */}
          <Button variant="ghost" size="icon" onClick={() => handleSignOut()}>
            <LogOut className="h-5 w-5 text-red-500" />
          </Button>
        </div>
      </div>
    </>
  );
}
