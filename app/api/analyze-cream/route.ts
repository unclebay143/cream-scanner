import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = "cream-scanner";
const MONGODB_COLLECTION = "analyzed-cream";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({
  model: process.env.AI_MODEL!,
});

export async function POST(req: NextRequest) {
  try {
    let prompt = "";
    let contents: any = [];
    let isManual = false;
    let ingredientsText = "";

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      // Manual text input
      const body = await req.json();
      ingredientsText = body.ingredientsText || "";
      isManual = true;
      prompt = `You are a skincare expert analyzing a cream product. Based on the following list of ingredients, analyze the product and provide a detailed assessment.\n\nIngredients: ${ingredientsText}\n\nPlease provide your analysis in the following JSON format:\n{\n  \"grade\": \"A-F grade\",\n  \"verdict\": \"One sentence verdict about the cream\",\n  \"ingredients\": [\n    {\n      \"name\": \"ingredient name\",\n      \"description\": \"brief description of what it does\",\n      \"safety\": \"safe|caution|avoid\"\n    }\n  ],\n  \"risks\": {\n    \"allergyRisk\": 0-100,\n    \"toxicity\": 0-100,\n    \"chemicalSensitivity\": 0-100,\n    \"comedogenicity\": 0-100\n  },\n  \"recommendations\": [\n    \"recommendation 1\",\n    \"recommendation 2\"\n  ]\n}\n\nProvide only valid JSON, no additional text.`;
      contents = [prompt];
    } else {
      // Image upload
      const formData = await req.formData();
      const images = formData.getAll("images") as File[];
      if (!images || images.length === 0) {
        return NextResponse.json(
          { error: "No images provided" },
          { status: 400 }
        );
      }
      const imageParts = await Promise.all(
        images.map(async (img) => {
          const buffer = await img.arrayBuffer();
          const base64 = Buffer.from(buffer).toString("base64");
          return {
            inlineData: {
              mimeType: img.type || "image/jpeg",
              data: base64,
            },
          };
        })
      );
      prompt = `You are a skincare expert analyzing cream product images. Based on the provided images of a skincare cream, analyze the ingredients and provide a detailed assessment.\n\nPlease provide your analysis in the following JSON format:\n{\n  \"grade\": \"A-F grade\",\n  \"verdict\": \"One sentence verdict about the cream\",\n  \"ingredients\": [\n    {\n      \"name\": \"ingredient name\",\n      \"description\": \"brief description of what it does\",\n      \"safety\": \"safe|caution|avoid\"\n    }\n  ],\n  \"risks\": {\n    \"allergyRisk\": 0-100,\n    \"toxicity\": 0-100,\n    \"chemicalSensitivity\": 0-100,\n    \"comedogenicity\": 0-100\n  },\n  \"recommendations\": [\n    \"recommendation 1\",\n    \"recommendation 2\"\n  ]\n}\n\nProvide only valid JSON, no additional text.`;
      contents = [prompt, ...imageParts];
    }

    const result = await model.generateContent(contents);
    let text = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "";
    // Remove Markdown code block formatting if present
    text = text.trim();
    if (text.startsWith("```")) {
      // Remove triple backticks and optional language identifier
      text = text
        .replace(/^```[a-zA-Z]*\n?/, "")
        .replace(/```$/, "")
        .trim();
    }
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      return NextResponse.json(
        { error: "AI did not return valid JSON", raw: text },
        { status: 500 }
      );
    }

    // Store result in MongoDB
    try {
      const client = new MongoClient(MONGODB_URI);
      await client.connect();
      const db = client.db(MONGODB_DB);
      const collection = db.collection(MONGODB_COLLECTION);
      await collection.insertOne({
        ...parsed,
        createdAt: new Date(),
        source: isManual ? "manual" : "image",
      });
      await client.close();
    } catch (dbError) {
      console.error("MongoDB error:", dbError);
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze cream" },
      { status: 500 }
    );
  }
}
