import { checkApiLimit, increaseApiLimit } from "@/lib/api-limits";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    // eslint-disable-next-line prefer-const
    let { prompt, amount = 1 } = body;

    // تأكد أن amount رقم صحيح
    amount = parseInt(amount, 10);
    if (isNaN(amount) || amount <= 0) {
      amount = 1;
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
    if (!HUGGINGFACE_API_KEY) {
      return new NextResponse("Hugging Face API key not configured", {
        status: 500,
      });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const images: string[] = [];

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();
    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired.", { status: 403 });
    }
    const variations = [
      "in a mystical forest",
      "as a futuristic robot",
      "surrounded by neon lights",
      "in ancient ruins",
      "floating in space",
      "in an abstract art style",
      "made of crystals",
      "in a cinematic scene",
      "painted by Van Gogh",
      "during sunset on a mountain",
    ];
    for (let i = 0; i < amount; i++) {
      const randomSuffix =
        variations[Math.floor(Math.random() * variations.length)];
      const customPrompt = `${prompt} ${randomSuffix}`;
      const response = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ inputs: customPrompt }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error(`Error generating image ${i + 1}:`, error);
        continue;
      }

      const arrayBuffer = await response.arrayBuffer();
      const base64Image = Buffer.from(arrayBuffer).toString("base64");
      const imageDataUrl = `data:image/png;base64,${base64Image}`;
      images.push(imageDataUrl);
    }

    if (!isPro) {
      await increaseApiLimit();
    }

    return new NextResponse(JSON.stringify({ images }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Server error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
