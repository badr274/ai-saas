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
      amount = 1; // fallback لو مش رقم أو رقم غلط
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
    if (!STABILITY_API_KEY) {
      return new NextResponse("Stability AI API key not configured", {
        status: 500,
      });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const images: string[] = [];
    // Check user free trial limition
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();
    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired.", { status: 403 });
    }
    for (let i = 0; i < amount; i++) {
      // إعداد FormData
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("output_format", "png"); // تحديد تنسيق الصورة كـ PNG

      // إرسال البيانات إلى Stability AI باستخدام multipart/form-data
      const response = await fetch(
        "https://api.stability.ai/v2beta/stable-image/generate/core",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${STABILITY_API_KEY}`,
            Accept: "image/*", // Accept الصورة في أي نوع
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error(`Error generating image ${i + 1}:`, error);
        continue; // لو في مشكلة في صورة معينة، نكمل لباقي الصور
      }

      const data = await response.blob(); // استخدم blob لتحميل الصورة

      // تحويل blob إلى Base64 باستخدام Buffer
      const buffer = await data.arrayBuffer(); // تحويل blob إلى ArrayBuffer
      const base64Image = Buffer.from(buffer).toString("base64"); // تحويل ArrayBuffer إلى Base64

      const imageDataUrl = `data:image/png;base64,${base64Image}`; // صيغة Data URL
      images.push(imageDataUrl);
    }
    // Increase free trial limition
    if (!isPro) {
      await increaseApiLimit();
    }

    return new NextResponse(JSON.stringify({ images }), {
      status: 200,
      headers: {
        "Content-Type": "application/json", // الرد سيكون JSON
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
