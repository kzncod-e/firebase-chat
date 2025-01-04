import { generateStreamToken } from "@/app/actions/getToken";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const body = await req.json();
  const { firebaseIdToken } = body;
  console.log("Firebase ID Token:", body);

  if (!firebaseIdToken) {
    return NextResponse.json({ error: "Firebase ID token is required" });
  }
  try {
    const streamToken = await generateStreamToken(firebaseIdToken);
    return NextResponse.json(
      { streamToken, message: "Stream token generated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error generating Stream token:", error);
    return NextResponse.json({ error: "Error generating Stream token" });
  }
};
