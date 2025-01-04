"use client";
import { StreamVideoClient, Call } from "@stream-io/video-react-sdk";

// Retrieve environment variables
const apiKey = "mmhfdzb5evj2";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL0x1bWluYXJhX1VuZHVsaSIsInVzZXJfaWQiOiJMdW1pbmFyYV9VbmR1bGkiLCJ2YWxpZGl0eV9pbl9zZWNvbmRzIjo2MDQ4MDAsImlhdCI6MTczNTcyMTc2OCwiZXhwIjoxNzM2MzI2NTY4fQ.EAuQzMAjvljlPj-FsptPAl17xcBeJ3Lr2ebLlnF226c";
const userId = "Luminara_Unduli";
const callId = "GA22wjmWvW6x";
// Define the user details
const user = {
  id: userId || "default-user", // Fallback user ID if undefined
  name: "Oliver", // Default user name (can be dynamic)
  image: "https://getstream.io/random_svg/?id=oliver&name=Oliver", // Default user image
};

// Initialize Stream Video Client and Call
let client: StreamVideoClient | null = null;
let call: Call | null = null;

if (!apiKey || !token || !userId || !callId) {
  console.error(
    "Missing required environment variables. Ensure STREAM_IO_API_KEY, STREAM_IO_TOKEN, STREAM_IO_USER_ID, and STREAM_IO_CALL_ID are set."
  );
} else {
  try {
    // Initialize the Stream Video Client
    client = new StreamVideoClient({ apiKey, user, token });
    console.log("Stream Video Client initialized successfully.");

    // Create a call instance
    call = client.call("default", callId);
    // call.join({ create: true });
    call.camera.enable();
    call.microphone.enable();

    console.log(`Call initialized with ID: ${callId}`);
  } catch (error) {
    console.error("Error initializing Stream Video Client or Call:", error);
  }
}

// Export instances for further use
export { client, call };
