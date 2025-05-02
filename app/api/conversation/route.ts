// app/api/conversation/route.ts
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limits";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";
import Groq from "groq-sdk";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    const body = await req.json();
    const { messages } = body;

    // Check user auth
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    // Check if groq api key exist
    if (!GROQ_API_KEY) {
      return new NextResponse("Groq AI API key not configured", {
        status: 500,
      });
    }
    const groq = new Groq({ apiKey: GROQ_API_KEY });

    // Check if there is no message sent
    if (!messages || messages.length === 0) {
      return new NextResponse("Messages is required", { status: 400 });
    }

    // Check user free trial limition
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();
    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired.", { status: 403 });
    }
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
    });
    // Increase free trial limition
    if (!isPro) {
      await increaseApiLimit();
    }

    return new NextResponse(JSON.stringify(response.choices[0].message), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
