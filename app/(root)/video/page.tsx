"use client";

import { useEffect, useState } from "react";
import {
  StreamVideoClient,
  StreamVideo,
  StreamCall,
  Call,
  StreamTheme,
  useCallStateHooks,
  CallingState,
  SpeakerLayout,
  CallControls,
} from "@stream-io/video-react-sdk";
import { getCurrentUserId } from "../../actions/getUser";
import { MyParticipantList } from "../../components/Participant";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "../../styles/style.css";
import { Button } from "@/components/ui/button";

const apiKey = process.env.NEXT_PUBLIC_STREAM_IO_API_KEY ?? "";
const callId = process.env.NEXT_PUBLIC_STREAM_IO_CALL_ID ?? "";

if (!apiKey || !callId) {
  throw new Error(
    "API key or callId is missing. Please set the required environment variables."
  );
}

export default function StreamVideoProvider() {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeClient = async () => {
      try {
        const currentUser = await getCurrentUserId();
        if (!currentUser) {
          throw new Error(
            "Current user not found. Cannot initialize video client."
          );
        }

        const userId = currentUser.uid;
        const generateToken = await currentUser.getIdToken();

        const response = await fetch("http://localhost:3000/api/stream", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ firebaseIdToken: generateToken }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch Stream token");
        }

        const { streamToken } = await response.json();
        if (!streamToken) {
          throw new Error("Stream token is missing in the response");
        }

        const videoClient = new StreamVideoClient({
          apiKey,
          user: { id: userId, name: currentUser.displayName || userId },
          token: streamToken,
        });

        const videoCall = videoClient.call("default", callId);

        setClient(videoClient);
        setCall(videoCall);
        console.log("Stream Video Client initialized successfully.");
      } catch (error) {
        console.error("Error initializing Stream Video client or call:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeClient();
  }, []);

  if (loading) {
    return <div>Loading Stream Video...</div>;
  }

  if (!client || !call) {
    return (
      <div>Unable to initialize the video call. Please try again later.</div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamTheme>
        <StreamCall call={call}>
          <MyUILayout call={call} />
        </StreamCall>
      </StreamTheme>
    </StreamVideo>
  );
}

export const MyUILayout = ({ call }: { call: Call }) => {
  const { useCallCallingState, useRemoteParticipants } = useCallStateHooks();

  const callingState = useCallCallingState();
  const remoteParticipants = useRemoteParticipants();

  const handleJoinCall = async () => {
    try {
      await call.getOrCreate();
      await call.join();
      console.log("Successfully joined the call.");
    } catch (error) {
      console.error("Error joining the call:", error);
    }
  };

  if (callingState !== CallingState.JOINED) {
    return (
      <div className="flex bg-white h-[100vh]  text-black justify-center  item-center w-full">
        <div className="flex items-center justify-center gap-4 flex-col">
          Call is not active. Click the button to join.
          <Button onClick={handleJoinCall}>Join Call</Button>
        </div>
      </div>
    );
  }

  return (
    <StreamTheme>
      <MyParticipantList participants={remoteParticipants} />
      <SpeakerLayout participantsBarPosition="bottom" />
      <CallControls />
    </StreamTheme>
  );
};
