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

async function scrapeElizasWorld() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.goto("https://elizas.world/", { waitUntil: "networkidle2" });

    // Wait for the page to load
    await page.waitForSelector("table tbody tr");

    console.log("Clicking on the ALL button for tribute level filtering...");
    // Click the "ALL" button for tribute level filtering using evaluate
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const allButton = buttons.find((button) =>
        button.textContent.includes("ALL")
      );
      if (allButton) allButton.click();
    });
    // Use setTimeout with a promise instead of waitForTimeout
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Clicking on the Has 𝕏 button for social filtering...");
    // Click the "Has 𝕏" button for social filtering using evaluate
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const hasXButton = buttons.find((button) =>
        button.textContent.includes("Has 𝕏")
      );
      if (hasXButton) hasXButton.click();
    });
    // Use setTimeout with a promise instead of waitForTimeout
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Extract data from the table rows
    const tokens = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll("table tbody tr"));

      return rows.map((row) => {
        // Get token name and symbol
        const nameElement = row.querySelector("td:first-child .font-medium");
        const symbolElement = row.querySelector(
          "td:first-child .text-sm.text-gray-500"
        );

        // Get token links
        const linksCell = row.querySelector("td:nth-child(4)");
        const links = Array.from(linksCell?.querySelectorAll("a") || []).map(
          (a) => a.href
        );

        // Find Twitter link specifically
        const twitterLink =
          links.find(
            (link) => link.includes("twitter.com") || link.includes("x.com")
          ) || "";

        // Find website link
        const websiteLink =
          links.find(
            (link) =>
              !link.includes("twitter.com") &&
              !link.includes("x.com") &&
              !link.includes("t.me")
          ) || "";

        // Find telegram link
        const telegramLink = links.find((link) => link.includes("t.me")) || "";

        // Get tribute level
        const tributeElement = row.querySelector("td:nth-child(5) span");

        // Get creation date
        const creationDateElement = row.querySelector("td:nth-child(6)");

        // Get market cap
        const marketCapElement = row.querySelector("td:nth-child(8)");

        // Get contract address from the second column
        const contractElement = row.querySelector("td:nth-child(2) .font-mono");
        const contractText = contractElement?.textContent?.trim() || "";
        // Extract just the contract address part
        const contractAddress = contractText.split("...").join("");

        return {
          name: nameElement?.textContent?.trim() || "Unknown",
          symbol: symbolElement?.textContent?.trim() || "Unknown",
          links: links || [],
          website: websiteLink,
          twitterAccount: twitterLink,
          telegramLink: telegramLink,
          tributeLevel: tributeElement?.textContent?.trim() || "Unknown",
          creationDate: creationDateElement?.textContent?.trim() || "Unknown",
          marketCap: marketCapElement?.textContent?.trim() || "Unknown",
          contractAddress: contractAddress || "Unknown",
        };
      });
    });

    console.log(`Found ${tokens.length} tokens with Twitter accounts`);

    // Process each token to get descriptions
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      console.log(`Processing ${token.name} (${i + 1}/${tokens.length})...`);

      // Generate description based on website content or fallback to memecoin assumption
      token.description = await generateTokenDescription(token);
    }

    // Print out the results in a more readable format
    console.log("\n===== SCRAPED RESULTS WITH SUMMARIES =====\n");

    // Create a string to store the formatted results for the file
    let fileContent = "===== SCRAPED RESULTS WITH SUMMARIES =====\n\n";

    tokens.forEach((token, index) => {
      const tokenInfo = `[${index + 1}] ${token.name} (${token.symbol})
    Twitter: ${token.twitterAccount || "None"}
    Website: ${token.website || "None"}
    Telegram: ${token.telegramLink || "None"}
    Tribute Level: ${token.tributeLevel}
    Created: ${token.creationDate}
    Market Cap: ${token.marketCap}
    Contract: ${token.contractAddress}
    Summary: ${token.description}
    Links:
${token.links.map((link) => `      - ${link}`).join("\n")}

`;

      // Print to console
      console.log(tokenInfo);

      // Add to file content
      fileContent += tokenInfo;
    });

    // Write results to file
    fs.writeFileSync("scraped-agents.txt", fileContent);
    console.log("Results written to scraped-agents.txt");

    return tokens;
  } catch (error) {
    console.error("Error scraping Elizas World:", error);
    return [];
  } finally {
    await browser.close();
  }
}

// Function to scrape website content
async function scrapeWebsite(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      timeout: 10000, // 10 second timeout
    });

    const $ = cheerio.load(response.data);

    // Extract text from important elements
    const title = $("title").text();
    const metaDescription = $('meta[name="description"]').attr("content") || "";

    // Get text from main content areas
    let bodyText = "";

    // Extract text from common content containers
    [
      "main",
      "article",
      ".content",
      "#content",
      ".main",
      ".container",
      "section",
    ].forEach((selector) => {
      $(selector).each((i, el) => {
        bodyText += $(el).text() + " ";
      });
    });

    // If no content found in common containers, get text from body
    if (!bodyText.trim()) {
      bodyText = $("body").text();
    }

    // Clean up the text
    bodyText = bodyText.replace(/\s+/g, " ").trim().substring(0, 3000); // Limit to first 3000 chars

    // Combine the extracted content
    return {
      title,
      metaDescription,
      bodyText,
      url,
    };
  } catch (error) {
    console.error(`Error scraping website ${url}:`, error.message);
    return null;
  }
}

// Function to generate a description using Anthropic via LangChain
async function generateTokenDescription(token) {
  try {
    const tributeDescription = {
      "Full Tribute": "has made a full tribute (10% of token supply)",
      Half: "has made a half tribute (5-10% of token supply)",
      Smol: "has made a small tribute",
      Unknown: "has made an unknown level of tribute",
    };

    // If only Twitter exists and no website, assume it's a memecoin
    if (!token.website && token.twitterAccount) {
      return `${token.name} (${
        token.symbol
      }) appears to be a memecoin on the Solana blockchain that ${
        tributeDescription[token.tributeLevel]
      } to the ElizaOS ecosystem. It was created on ${
        token.creationDate || "an unknown date"
      } and has a market cap of ${token.marketCap || "unknown value"}.`;
    }

    // If website exists, scrape and analyze it
    if (token.website) {
      const websiteContent = await scrapeWebsite(token.website);

      if (websiteContent) {
        // Initialize Anthropic client
        const model = new ChatAnthropic({
          modelName: "claude-3-7-sonnet-20250219",
          temperature: 0.3,
        });

        // Create prompt template
        const promptTemplate = ChatPromptTemplate.fromTemplate(`
        You are an expert in cryptocurrency and blockchain projects. I need you to analyze the following information about a token and describe what it is and what it does.
        
        Token Name: {name}
        Token Symbol: {symbol}
        Website Title: {title}
        Website Description: {metaDescription}
        Website Content: {content}
        Twitter: {twitter}
        Creation Date: {creationDate}
        Market Cap: {marketCap}
        
        Based only on this information, write a concise 2-3 sentence description of what this token/project is and what it does. Focus on its purpose, functionality, and role in the ecosystem. Be factual and avoid marketing language. If it appears to be a memecoin with no clear utility, state that.
        `);

        // Invoke the model with the prompt
        const response = await promptTemplate.pipe(model).invoke({
          name: token.name,
          symbol: token.symbol,
          title: websiteContent.title,
          metaDescription: websiteContent.metaDescription,
          content: websiteContent.bodyText,
          twitter: token.twitterAccount,
          creationDate: token.creationDate || "Unknown",
          marketCap: token.marketCap || "Unknown",
        });

        let description = response.content.toString().trim();

        // Add tribute information
        description += ` It ${
          tributeDescription[token.tributeLevel]
        } to the ElizaOS ecosystem.`;

        return description;
      }
    }

    // Fallback if website scraping fails or no website exists
    return `${token.name} (${
      token.symbol
    }) is a token on the Solana blockchain that ${
      tributeDescription[token.tributeLevel]
    } to the ElizaOS ecosystem. It was created on ${
      token.creationDate || "an unknown date"
    } and has a market cap of ${token.marketCap || "unknown value"}.`;
  } catch (error) {
    console.error(
      `Error generating description for ${token.name}:`,
      error.message
    );
    return `${token.name} (${token.symbol}) is a token in the Elizaverse ecosystem. No additional information could be determined.`;
  }
}

// Run the scraper
scrapeElizasWorld();
