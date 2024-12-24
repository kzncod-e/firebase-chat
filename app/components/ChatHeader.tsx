"use client";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Avatar } from "@radix-ui/react-avatar";
import { Phone, Settings, Video, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useRouter } from "next/navigation";
import { Room } from "../types/type";
import { DocumentData } from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export default function ChatHeader({
  room,
}: {
  room: DocumentData | undefined;
}) {
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
            <AvatarImage src={room?.imgUrl} alt="Room Avatar" />
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{room?.name}</h2>
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
          <Dialog>
            <DialogTrigger>
              <LogOut className="h-5 w-5 text-red-500" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure you want to log out?</DialogTitle>
                <DialogDescription>
                  You will be signed out of your account. This action is
                  reversible, and you can log back in at any time.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-end space-x-2">
                <Button variant="ghost" onClick={() => document.body.click()}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleSignOut}>
                  Log Out
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
