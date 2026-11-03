
/**
 * FX QUEST — GEMINI MODEL AVAILABILITY TEST
 *
 * Tests alternative Gemini models using your existing
 * API key without changing your Pip AI backend.
 *
 * Each model is tested only once.
 */

import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

// Read the existing private Gemini API key.
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error(
    "GEMINI_API_KEY is missing from your .env file."
  );
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

// These models appeared in your account's model list.
const modelsToTest = [
  "gemini-3.5-flash-lite",
  "gemini-flash-lite-latest",
  "gemini-3.5-flash",
];

async function testModels() {
  console.log("\nFX QUEST — GEMINI MODEL TEST");
  console.log("============================\n");

  let foundWorkingModel = false;

  for (const model of modelsToTest) {
    console.log(`Testing: ${model}`);

    try {
      const response = await ai.models.generateContent({
        model,

        contents: "Reply with just the word Hello.",

        config: {
          maxOutputTokens: 256,
          temperature: 0.2,
        },
      });

      const reply = response.text?.trim();

      if (reply) {
        console.log("SUCCESS!");
        console.log(`Response: ${reply}`);

        console.log("\nRecommended .env setting:");
        console.log(`GEMINI_MODEL=${model}`);

        foundWorkingModel = true;
        break;
      }

      console.log("No text response returned.\n");
    } catch (error: unknown) {
      const status =
        typeof error === "object" &&
        error !== null &&
        "status" in error
          ? Number(error.status)
          : undefined;

      console.log(`Failed: HTTP ${status ?? "unknown"}`);

      if (status === 503) {
        console.log("Model currently unavailable.\n");
      } else if (status === 429) {
        console.log(
          "Quota or rate limit reached. Stopping tests."
        );
        break;
      } else if (status === 403) {
        console.log(
          "Permission denied. Check API access."
        );
        break;
      } else {
        console.log("Model could not complete the request.\n");
      }
    }
  }

  if (!foundWorkingModel) {
    console.log("\nNo working model found in this test.");

    console.log(
      "Check Google AI Studio access, quotas, " +
      "or consider another AI provider."
    );
  }

  console.log("\nTest completed.");
}

testModels().catch((error) => {
  console.error("Unexpected test error:", error);
  process.exitCode = 1;
});
