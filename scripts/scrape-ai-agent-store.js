import puppeteer from "puppeteer";
import axios from "axios";
import * as cheerio from "cheerio";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get the equivalent of __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file (one directory up)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Maximum number of consecutive connection errors before terminating
const MAX_CONSECUTIVE_ERRORS = 3;

async function scrapeAIAgentStore() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    console.log("Scraping AI Agent Store...");

    // Define the output path
    const outputPath = path.join(
      __dirname,
      "../scripts/scraped-ai-agent-store.txt"
    );

    // Check if the output file exists and load existing data
    let existingAgents = [];
    if (fs.existsSync(outputPath)) {
      try {
        const existingData = fs.readFileSync(outputPath, "utf8");
        existingAgents = JSON.parse(existingData);
        console.log(
          `Loaded ${existingAgents.length} existing agents from ${outputPath}`
        );
      } catch (error) {
        console.error(`Error loading existing data: ${error.message}`);
        existingAgents = [];
      }
    }

    // Create a set of existing agent URLs for faster lookup
    const existingAgentUrls = new Set(existingAgents.map((agent) => agent.url));
    console.log(`Found ${existingAgentUrls.size} unique existing agent URLs`);

    // Get the total number of pages first
    const totalPages = await getTotalPages(browser);
    console.log(`Found ${totalPages} pages of agents to scrape`);

    // Array to store all agents from all pages
    let allAgents = [];

    // Scrape each page
    for (let page = 1; page <= totalPages; page++) {
      console.log(`Scraping page ${page} of ${totalPages}`);
      const agents = await scrapeAgentDirectory(browser, page);
      console.log(`Found ${agents.length} agents on page ${page}`);
      allAgents = [...allAgents, ...agents];
    }

    console.log(`Found a total of ${allAgents.length} agents.`);

    // Filter out agents that have already been scraped
    const newAgents = allAgents.filter(
      (agent) => !existingAgentUrls.has(agent.url)
    );
    console.log(`Found ${newAgents.length} new agents to scrape.`);

    // Create a working copy of existing agents that we'll update as we go
    let updatedAgents = [...existingAgents];
    let newAgentsCount = 0;

    // Track consecutive connection errors
    let consecutiveConnectionErrors = 0;

    // Add index tracking and printing
    for (let i = 0; i < newAgents.length; i++) {
      const agent = newAgents[i];
      console.log(
        `[${i + 1}/${newAgents.length}] Scraping details for agent: ${
          agent.name
        }`
      );

      try {
        const agentDetails = await scrapeAgentDetails(agent.url, browser);
        if (agentDetails) {
          // Reset consecutive error counter on success
          consecutiveConnectionErrors = 0;

          // Add the new agent to our working copy
          updatedAgents.push(agentDetails);
          newAgentsCount++;

          // Write the updated list to the file after each successful scrape
          fs.writeFileSync(outputPath, JSON.stringify(updatedAgents, null, 2));

          console.log(
            `[${i + 1}/${newAgents.length}] Successfully scraped details for: ${
              agent.name
            }. Updated file with ${updatedAgents.length} total agents.`
          );
        } else {
          console.error(
            `[${i + 1}/${newAgents.length}] Failed to scrape details for: ${
              agent.name
            }`
          );
        }
      } catch (error) {
        console.error(
          `[${i + 1}/${newAgents.length}] Error scraping details for ${
            agent.name
          }:`,
          error.message
        );

        // Check if this is a connection error
        if (
          error.message.includes("Protocol error: Connection closed") ||
          error.message.includes("net::ERR_") ||
          error.message.includes("Navigation timeout") ||
          error.message.includes("Target closed") ||
          error.message.includes("Connection terminated")
        ) {
          consecutiveConnectionErrors++;
          console.warn(
            `Connection error detected. Consecutive errors: ${consecutiveConnectionErrors}/${MAX_CONSECUTIVE_ERRORS}`
          );

          if (consecutiveConnectionErrors >= MAX_CONSECUTIVE_ERRORS) {
            console.error(
              `Too many consecutive connection errors (${consecutiveConnectionErrors}). Terminating script.`
            );

            // Save current progress before exiting
            fs.writeFileSync(
              outputPath,
              JSON.stringify(updatedAgents, null, 2)
            );
            console.log(
              `Saved current progress with ${updatedAgents.length} agents before terminating.`
            );

            // Exit the script with an error code
            process.exit(1);
          }

          // Add a longer delay after connection errors to allow recovery
          console.log(
            "Adding a longer delay (10 seconds) to recover from connection error..."
          );
          await new Promise((resolve) => setTimeout(resolve, 10000));
        } else {
          // Reset counter for non-connection errors
          consecutiveConnectionErrors = 0;
        }
      }

      // Optional: Add a small delay between requests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log(
      `Scraping complete. Added ${newAgentsCount} new agents. Total of ${updatedAgents.length} agents saved to ${outputPath}`
    );
  } catch (error) {
    console.error("Error scraping AI Agent Store:", error.message);
  } finally {
    await browser.close();
  }
}

async function getTotalPages(browser) {
  try {
    const page = await browser.newPage();
    await page.goto("https://aiagentstore.ai/ai-agents-directory", {
      waitUntil: "networkidle2",
    });

    // Extract the last page number from pagination
    const totalPages = await page.evaluate(() => {
      // Find all pagination buttons
      const paginationButtons = Array.from(
        document.querySelectorAll(
          ".flex.justify-center.items-center.gap-2 button"
        )
      );

      // Filter out non-numeric buttons and find the highest number
      const pageNumbers = paginationButtons
        .map((button) => {
          const pageNum = parseInt(button.textContent.trim());
          return isNaN(pageNum) ? 0 : pageNum;
        })
        .filter((num) => num > 0);

      // Return the highest page number or default to 1
      return Math.max(...pageNumbers, 1);
    });

    await page.close();
    return totalPages;
  } catch (error) {
    console.error("Error getting total pages:", error.message);
    return 1; // Default to 1 page if there's an error
  }
}

async function scrapeAgentDirectory(browser, pageNum = 1) {
  try {
    const page = await browser.newPage();
    const url = `https://aiagentstore.ai/ai-agents-directory?page=${pageNum}`;
    await page.goto(url, { waitUntil: "networkidle2" });

    // Extract agent cards
    const agents = await page.evaluate(() => {
      const agentCards = Array.from(
        document.querySelectorAll(".grid.grid-cols-1 > div")
      );

      return agentCards
        .map((card) => {
          // Get agent name
          const nameElement = card.querySelector("h3");
          const name = nameElement ? nameElement.textContent.trim() : "Unknown";

          // Get agent URL
          const linkElement = card.querySelector('a[href*="/ai-agent/"]');
          const url = linkElement ? linkElement.href : null;

          return { name, url };
        })
        .filter((agent) => agent.url); // Filter out agents without URLs
    });

    await page.close();
    return agents;
  } catch (error) {
    console.error(
      `Error scraping agent directory page ${pageNum}:`,
      error.message
    );
    return [];
  }
}

async function scrapeAgentDetails(url, browser) {
  try {
    console.log(`Scraping agent details from ${url}`);
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    // Extract agent details
    const agentDetails = await page.evaluate(() => {
      // Get name
      const name =
        document
          .querySelector("h1.text-3xl, h1.text-4xl")
          ?.textContent?.trim() || "Unknown";

      // Get website link using the aria-label attribute
      let websiteLink = null;

      // First try to find the "Visit website" button by its aria-label
      const visitWebsiteButtons = Array.from(
        document.querySelectorAll(`a[aria-label^="Link to ${name}"]`)
      );

      // Log all found buttons for debugging
      console.log(
        `Found ${visitWebsiteButtons.length} buttons with aria-label starting with "Link to"`
      );

      if (visitWebsiteButtons.length > 0) {
        // Find the button that contains "Visit website" text or has the primary styling
        const visitButton = visitWebsiteButtons.find(
          (btn) =>
            btn.textContent.trim().toLowerCase().includes("visit website") ||
            (btn.className &&
              btn.className.includes("bg-primary-dark") &&
              btn.className.includes("text-white"))
        );

        if (visitButton) {
          websiteLink = visitButton.getAttribute("href");
          console.log(
            `Found visit website button with text: "${visitButton.textContent.trim()}"`
          );
          console.log(`Button href: ${websiteLink}`);
        } else {
          // If we can't find a specific "Visit website" button, use the first external link
          const externalButton = visitWebsiteButtons.find(
            (btn) =>
              btn.getAttribute("href") &&
              btn.getAttribute("href").startsWith("http") &&
              !btn.getAttribute("href").includes("aiagentstore.ai")
          );

          if (externalButton) {
            websiteLink = externalButton.getAttribute("href");
            console.log(
              `Found external link button with text: "${externalButton.textContent.trim()}"`
            );
            console.log(`Button href: ${websiteLink}`);
          }
        }
      }

      // Fallback: try to find any button with "Visit website" text
      if (!websiteLink) {
        const textBasedButton = Array.from(document.querySelectorAll("a")).find(
          (a) => a.textContent.trim().toLowerCase().includes("visit website")
        );

        if (textBasedButton) {
          websiteLink = textBasedButton.getAttribute("href");
          console.log(
            `Found visit website button by text with href: ${websiteLink}`
          );
        }
      }

      // Last resort fallback to any external link
      if (!websiteLink) {
        const anyExternalLink = document.querySelector(
          'a[href^="http"]:not([href*="aiagentstore.ai"])'
        );
        if (anyExternalLink) {
          websiteLink = anyExternalLink.getAttribute("href");
          console.log(
            `Fallback: found external link with href: ${websiteLink}`
          );
        }
      }

      // Get description
      const description =
        document.querySelector("p.text-gray-600")?.textContent?.trim() || "";

      // Get detailed description from markdown preview if available
      const detailedDescription =
        document.querySelector(".markdown-preview p")?.textContent?.trim() ||
        "";

      // Use detailed description if available, otherwise use the short description
      const finalDescription = detailedDescription || description;

      // Extract the logo image URL
      const altText = `${name} logo`;
      const logoImg = document.querySelector(`img[alt="${altText}"]`);
      const logoUrl = logoImg ? logoImg.src : "";

      return {
        name,
        description: finalDescription,
        websiteLink,
        icon: logoUrl,
      };
    });

    // Add the URL to the agent details
    agentDetails.url = url;

    // Log the extracted website link
    console.log(
      `Extracted website link for ${agentDetails.name}: ${agentDetails.websiteLink}`
    );

    // Log the extracted icon URL
    console.log(
      `Extracted icon URL for ${agentDetails.name}: ${agentDetails.icon}`
    );

    // If description exists, extract tags using Claude
    if (agentDetails.description) {
      try {
        const extractedTags = await extractTagsFromDescription(
          agentDetails.description
        );
        agentDetails.tags = extractedTags;
      } catch (error) {
        console.error(
          `Error extracting tags for ${agentDetails.name}:`,
          error.message
        );
        agentDetails.tags = [];
      }
    } else {
      agentDetails.tags = [];
    }

    // If description is too short, try to enhance it
    if (agentDetails.description.length < 100 && agentDetails.websiteLink) {
      try {
        const enhancedDescription = await generateAgentDescription(
          agentDetails
        );
        agentDetails.description = enhancedDescription;
      } catch (error) {
        console.error(
          `Error generating enhanced description for ${agentDetails.name}:`,
          error.message
        );
      }
    }

    await page.close();
    return agentDetails;
  } catch (error) {
    console.error(`Error scraping agent details from ${url}:`, error.message);
    return null;
  }
}

async function extractTagsFromDescription(description) {
  try {
    console.log(
      `Extracting tags from description: "${description.substring(0, 100)}..."`
    );

    // Check if ANTHROPIC_API_KEY is set
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY is not set in environment variables");
      return [];
    }

    // Use Claude to extract tags from the description
    const model = new ChatAnthropic({
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      modelName: "claude-3-7-sonnet-20250219",
      temperature: 0.2,
    });

    const promptText = `
      You are an AI expert who can identify relevant tags for AI agents based on their descriptions.
      
      Please analyze the following AI agent description and extract 3-7 relevant tags that describe its functionality, 
      use cases, or technology. Return ONLY the tags as a comma-separated list with no additional text.
      
      Description: ${description}
      
      Example output format: "natural language processing, content generation, summarization"
    `;

    console.log("Sending request to Claude API...");
    const response = await model.invoke(promptText);
    console.log("Received response from Claude API");

    const tagsText = response.content.toString().trim();
    console.log(`Raw tags response: "${tagsText}"`);

    // Split by commas and trim each tag
    const tags = tagsText
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    console.log(`Extracted ${tags.length} tags: ${JSON.stringify(tags)}`);

    return tags;
  } catch (error) {
    console.error(`Error extracting tags:`, error);
    console.error(`Error details: ${error.message}`);
    // If there's a response object in the error, log it
    if (error.response) {
      console.error(`Response status: ${error.response.status}`);
      console.error(`Response data: ${JSON.stringify(error.response.data)}`);
    }
    return [];
  }
}

async function generateAgentDescription(agent) {
  // If the agent already has a good description, use it
  if (agent.description && agent.description.length > 100) {
    return agent.description;
  }

  try {
    // Try to scrape the agent's website for more information
    let websiteContent = null;
    if (agent.websiteLink) {
      websiteContent = await scrapeWebsite(agent.websiteLink);
    }

    if (!websiteContent) {
      return agent.description || `${agent.name} is an AI agent.`;
    }

    // Use Claude to generate a better description
    const model = new ChatAnthropic({
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      modelName: "claude-3-7-sonnet-20250219",
      temperature: 0.3,
    });

    const promptText = `
      You are an AI expert who writes concise, informative descriptions of AI agents.
      
      Please write a 2-3 sentence description for an AI agent with the following information:
      
      Name: ${agent.name}
      Current Description: ${agent.description || "No description available"}
      Category: ${agent.category || "Unknown"}
      Website Title: ${websiteContent.title || "Unknown"}
      Website Content: ${websiteContent.bodyText || "No content available"}
      Best For: ${agent.bestFor?.join(", ") || "Unknown"}
      Industries: ${agent.industries?.join(", ") || "Unknown"}
      Tags: ${agent.tags?.join(", ") || "Unknown"}
      
      Your description should be factual, informative, and highlight the agent's key features and use cases.
      Do not make up information that isn't supported by the provided details.
    `;

    const response = await model.invoke(promptText);
    return response.content.toString().trim();
  } catch (error) {
    console.error(
      `Error generating description for ${agent.name}:`,
      error.message
    );
    return `${agent.name} is an AI agent. No additional information could be determined.`;
  }
}

async function scrapeWebsite(url) {
  try {
    // Skip longsummary.com
    if (url.includes("longsummary.com")) {
      console.log(`Skipping website: ${url}`);
      return {
        title: "Long Summary",
        metaDescription: "AI text summarization tool",
        bodyText: "Long Summary is an AI-powered text summarization tool.",
      };
    }

    console.log(`Scraping website content from ${url}`);
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    // Extract title
    const title = $("title").text().trim();

    // Extract meta description
    const metaDescription = $('meta[name="description"]').attr("content") || "";

    // Extract main content text
    let bodyText = "";

    // Target main content areas
    $(".prose p, .prose-lg p, h1, h2, h3, h4, .markdown-preview p").each(
      (i, el) => {
        bodyText += $(el).text().trim() + " ";
      }
    );

    // If we couldn't find specific content areas, get all paragraph text
    if (!bodyText.trim()) {
      $("p").each((i, el) => {
        bodyText += $(el).text().trim() + " ";
      });
    }

    // Limit the body text length to avoid overwhelming the AI
    bodyText = bodyText.trim().substring(0, 2000);

    return {
      title,
      metaDescription,
      bodyText,
    };
  } catch (error) {
    console.error(`Error scraping website ${url}:`, error.message);
    return null;
  }
}

// Run the scraper
scrapeAIAgentStore();
