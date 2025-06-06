import { checkApiLimit, increaseApiLimit } from "@/lib/api-limits";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    // eslint-disable-next-line prefer-const
    let { prompt, amount = 1 } = body;
    amount = parseInt(amount, 10);
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }
    if (isNaN(amount) || amount <= 0) {
      amount = 1;
    }

    const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
    if (!HUGGINGFACE_API_KEY) {
      return NextResponse.json(
        { error: "Hugging Face API key not configured" },
        { status: 500 }
      );
    }

    // تحقق من الاشتراك أو الرصيد المجاني
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();
    if (!freeTrial && !isPro) {
      return NextResponse.json(
        { error: "Free trial has expired." },
        { status: 403 }
      );
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

    const images: string[] = [];

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
        const errorText = await response.text();
        console.error(`Error generating image ${i + 1}:`, errorText);
        continue;
      }

      const data = await response.json();
      console.log(`Response for image ${i + 1}:`, data);

      // حسب شكل الرد، عشان يدعم أكثر من صيغة:
      if (Array.isArray(data) && data.length > 0) {
        // لو الرد array من نصوص (base64 أو url)
        if (typeof data[0] === "string") {
          images.push(data[0]);
        } else if (data[0].image) {
          images.push(data[0].image);
        } else {
          console.warn("Unknown array item format:", data[0]);
        }
      } else if (typeof data === "string") {
        images.push(data);
      } else if (data.image) {
        images.push(data.image);
      } else {
        console.warn("Unexpected response format:", data);
      }
    }

    if (!isPro) {
      await increaseApiLimit();
    }

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
