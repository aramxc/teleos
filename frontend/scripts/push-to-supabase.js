import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
import { getSupabaseAdmin } from "../lib/supabase.js";

// Get the equivalent of __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

// Read data from the ai-agent-store-data.txt file
async function readAgentsData() {
  try {
    const filePath = path.resolve(__dirname, "./ai-agent-store-data.txt");
    console.log(`Reading file from: ${filePath}`);
    const fileContent = await fs.readFile(filePath, "utf8");

    // Log a sample of the file content to debug
    console.log(
      "File content sample (first 1000 chars):",
      fileContent.substring(0, 1000)
    );

    // Try to clean the content before parsing
    let cleanedContent = fileContent;

    // Remove any potential line numbers or prefixes (like "123|")
    cleanedContent = cleanedContent.replace(/^\d+\|/gm, "");

    // Ensure property names are properly quoted
    cleanedContent = cleanedContent.replace(
      /([{,]\s*)(\w+)(\s*:)/g,
      '$1"$2"$3'
    );

    // Try to parse with a more forgiving approach
    try {
      // First attempt: direct JSON parse
      return JSON.parse(cleanedContent);
    } catch (firstError) {
      console.warn("First parse attempt failed:", firstError.message);

      try {
        // Second attempt: Try to extract array content if it's wrapped in something
        const arrayMatch = cleanedContent.match(/\[\s*\{.*\}\s*\]/s);
        if (arrayMatch) {
          console.log(
            "Found array pattern, attempting to parse extracted content"
          );
          return JSON.parse(arrayMatch[0]);
        }

        // If we get here, both attempts failed
        console.error("Could not parse JSON content after cleanup attempts");
        return [];
      } catch (secondError) {
        console.error("Second parse attempt failed:", secondError.message);

        // As a last resort, try to manually parse each object
        try {
          console.log("Attempting to manually parse objects...");
          // Look for objects in the format { ... }
          const objectRegex = /\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g;
          const matches = cleanedContent.match(objectRegex) || [];

          const parsedObjects = [];
          for (const match of matches) {
            try {
              const obj = JSON.parse(match);
              parsedObjects.push(obj);
            } catch (e) {
              console.warn(
                `Skipping invalid object: ${match.substring(0, 50)}...`
              );
            }
          }

          console.log(`Manually parsed ${parsedObjects.length} objects`);
          return parsedObjects;
        } catch (finalError) {
          console.error("All parsing attempts failed:", finalError.message);
          return [];
        }
      }
    }
  } catch (err) {
    console.error("Error reading the data file:", err);
    return [];
  }
}

// Upload data to Supabase
async function uploadData() {
  try {
    const agentsData = await readAgentsData();

    if (!agentsData || !agentsData.length) {
      console.error("No data to upload");
      return;
    }

    console.log(`Uploading ${agentsData.length} agents to Supabase...`);

    // Get admin client to bypass RLS
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("ai_agents")
      .insert(agentsData)
      .select();

    if (error) {
      console.error("Error uploading data:", error);
    } else {
      console.log(`Data uploaded successfully: ${data.length} rows inserted`);
    }
  } catch (err) {
    console.error("Exception:", err);
  }
}

uploadData();
