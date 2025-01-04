import admin from "firebase-admin";
import { StreamChat } from "stream-chat";

// Initialize Firebase Admin SDK
import serviceAccount from "@/utils/my-project-86f7e-firebase-adminsdk-12lq5-0ddf10b3b3.json";
// ensure the Firebase Admin SDK is initialized only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://my-project-86f7e-default-rtdb.firebaseio.com",
  });
}

// Validate environment variables
const apikey = process.env.NEXT_PUBLIC_STREAM_IO_API_KEY;
const apisecret = process.env.STREAM_IO_API_SECRET;

if (!apikey) throw new Error("Stream API key is not provided.");
if (!apisecret) throw new Error("Stream API secret is not provided.");

// Initialize Stream server SDK
const streamClient = new StreamChat(apikey, apisecret);

// Function to generate Stream token
const generateStreamToken = async (firebaseIdToken: string) => {
  try {
    // Verify the Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(firebaseIdToken);
    const userId = decodedToken.uid; // Firebase User ID

    // Generate Stream token for this user
    return streamClient.createToken(userId);
  } catch (error) {
    console.error("Error verifying token:", error);
    throw new Error("Invalid Firebase ID token");
  }
};

export { generateStreamToken };
