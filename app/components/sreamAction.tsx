"use client";

import { useEffect, useState } from "react";
import {
  StreamVideoClient,
  StreamVideo,
  StreamCall,
  Call,
  StreamTheme,
  useCallStateHooks,
  useCall,
  CallingState,
} from "@stream-io/video-react-sdk";
import { getCurrentUserId } from "../actions/getUser";

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

  useEffect(() => {
    const initializeClient = async () => {
      try {
        const currentUser = await getCurrentUserId();
        if (!currentUser) {
          console.error(
            "Current user not found. Cannot initialize video client."
          );
          return;
        }

        const userId = currentUser.uid;

        // Fetch Firebase token and Stream token
        const generateToken = await currentUser.getIdToken();
        const response = await fetch("http://localhost:3000/api/stream", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ firebaseIdToken: generateToken }),
        });

        const { streamToken } = await response.json();
        if (!streamToken) {
          throw new Error("Failed to fetch Stream token");
        }

        // Initialize Stream Video Client
        const videoClient = new StreamVideoClient({
          apiKey,
          user: { id: userId, name: currentUser.displayName || userId },
          token: streamToken,
        });

        const videoCall = videoClient.call("default", callId);

        // Attempt to join the call
        try {
          await videoCall.join({ create: true });
          console.log("Successfully joined the call.");
          setClient(videoClient);
          setCall(videoCall);
        } catch (error) {
          console.error("Error joining the call:", error);
        }

        console.log("Stream Video Client and Call initialized successfully.");
      } catch (error) {
        console.error("Error initializing Stream Video client or call:", error);
      }
    };

    initializeClient();
  }, []);

  if (!client || !call) {
    return <div>Loading Stream Video...</div>;
  }

  return (
    <StreamVideo client={client}>
      <StreamTheme>
        <StreamCall call={call}>
          <MyUILayout />
        </StreamCall>
      </StreamTheme>
    </StreamVideo>
  );
}

export const MyUILayout = () => {
  const call = useCall();
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();

  useEffect(() => {
    console.log("Calling State:", callingState);
    console.log("Participant Count:", participantCount);
  }, [callingState, participantCount]);

  if (!call) {
    return <div>Call is not available</div>;
  }

  if (callingState !== CallingState.JOINED) {
    return <div>Joining call... Current state: {callingState}</div>;
  }

  return (
    <div>
      Call &quot;{call.id}&quot; is active with {participantCount}{" "}
      participant(s).
    </div>
  );
};
