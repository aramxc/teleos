import { OpenAIEmbeddings } from "@langchain/openai";
import { ChromaClient } from "chromadb";
import { CHROMA_CONFIG } from "../../frontend/chromaConfig.js";
import { identifyRelevantSources } from "./documentUtils.js";
import dotenv from "dotenv";
import path from "path";

import { fileURLToPath } from "url";
import { dirname } from "path";

// Get the equivalent of __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file (one directory up)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function queryChroma() {
  // Get the query from command line arguments
  const queryText = process.argv[2];

  if (!queryText) {
    console.error("Please provide a query as a command line argument");
    console.error(
      "Example: node scripts/rag/queryChroma.js 'AI agents for web automation'"
    );
    process.exit(1);
  }

  const embedding = new OpenAIEmbeddings({
    batchSize: 512,
    model: "text-embedding-3-large",
  });

  try {
    console.log(`Getting relevant documents for query: "${queryText}"`);
    const client = new ChromaClient({ path: CHROMA_CONFIG.url });
    const collection = await client.getCollection({
      name: CHROMA_CONFIG.collectionName,
    });

    // Get query embedding
    const queryEmbedding = await embedding.embedQuery(queryText);

    // Query for the 10 most relevant results
    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: 10,
      include: ["metadatas", "documents", "distances"],
    });

    console.log(`Retrieved ${results.documents[0].length} results`);

    // Process and display each result
    const parsedResults = results.documents[0].map((doc, index) => {
      const metadata = results.metadatas[0][index];
      const distance = results.distances[0][index];
      const relevanceScore = 1 - distance;

      // Parse the JSON content
      let parsedContent;
      try {
        parsedContent = JSON.parse(doc);
      } catch (error) {
        console.warn(
          `Failed to parse JSON for result ${index}:`,
          error.message
        );
        parsedContent = { content: doc };
      }

      return {
        source: metadata.source || "Unknown",
        relevanceScore: relevanceScore.toFixed(3),
        metadata: metadata,
        content: parsedContent,
      };
    });

    // Print the results
    console.log("\n=== SEARCH RESULTS ===\n");
    parsedResults.forEach((result, index) => {
      console.log(
        `\n[${index + 1}] Source: ${result.source} (Relevance: ${
          result.relevanceScore
        })`
      );
      console.log(JSON.stringify(result.content, null, 2));
      console.log("\n---");
    });

    return parsedResults;
  } catch (error) {
    console.error("Error querying ChromaDB:", error);
    return [];
  }
}

// Execute the query if this script is run directly
if (process.argv[1].includes("queryChroma.js")) {
  queryChroma();
}

// Keep the original function for backward compatibility
export async function getRelevantDocuments(queryText) {
  const embedding = new OpenAIEmbeddings({
    batchSize: 512,
    model: "text-embedding-3-large",
  });

  try {
    console.log(`Getting relevant documents for query: "${queryText}"`);
    const client = new ChromaClient({ path: CHROMA_CONFIG.url });
    const collection = await client.getCollection({
      name: CHROMA_CONFIG.collectionName,
    });

    // First, find the most relevant chunks to identify relevant documents
    const queryEmbedding = await embedding.embedQuery(queryText);
    let results;
    try {
      results = await collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: 25, // Start with 25 results
        include: ["metadatas", "documents", "distances"],
      });
    } catch (error) {
      console.warn(
        "Error with initial query, trying with fewer results:",
        error
      );
      // If the first query fails, try with fewer results
      results = await collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: 10, // Reduce to 10 results
        include: ["metadatas", "documents", "distances"],
      });
    }

    // Identify the most relevant sources
    const relevantSources = identifyRelevantSources(
      results.documents,
      results.metadatas,
      results.distances
    );

    console.log(
      "Relevant sources identified:",
      relevantSources.map((s) => s.source).join(", ")
    );

    // Now retrieve FULL documents for each relevant source by name
    const fullDocuments = await Promise.all(
      relevantSources.map(async ({ source, relevanceScore }) => {
        console.log(`Processing source: ${source}`);
        // First get all documents with this source
        const allSourceDocs = await collection.get({
          where: { source: source },
          include: ["metadatas", "documents"],
        });

        // Then filter for full documents
        const fullDocs = allSourceDocs.documents.filter(
          (_, idx) => allSourceDocs.metadatas[idx].is_full_document === true
        );

        // If we found a full document, use it
        if (fullDocs.length > 0) {
          console.log(`Found full document for source: ${source}`);
          return {
            source,
            content: fullDocs[0],
            relevanceScore,
          };
        }

        console.log(
          `No full document found for ${source}, reconstructing from chunks...`
        );
        // Fallback: If no full document is found, retrieve all chunks and reconstruct
        const chunksResults = await collection.get({
          where: { source: source },
          include: ["metadatas", "documents"],
        });

        console.log(
          `Found ${chunksResults.documents.length} chunks for source: ${source}`
        );

        // Sort chunks by chunk_id if available
        const sortedChunks = chunksResults.documents
          .map((content, idx) => ({
            content,
            chunkId:
              typeof chunksResults.metadatas[idx].chunk_id === "string"
                ? parseInt(chunksResults.metadatas[idx].chunk_id, 10)
                : chunksResults.metadatas[idx].chunk_id || idx,
          }))
          .sort((a, b) => a.chunkId - b.chunkId);

        // Reconstruct the full document
        const fullContent = sortedChunks
          .map((chunk) => chunk.content)
          .join("\n\n");

        return {
          source,
          content: fullContent,
          relevanceScore,
        };
      })
    );

    console.log(`Retrieved ${fullDocuments.length} documents in total`);

    // Format the full documents as a single string
    const result = fullDocuments
      .map(
        (doc) =>
          `Source: ${doc.source} (Relevance: ${doc.relevanceScore.toFixed(
            3
          )})\n\n${doc.content}`
      )
      .join("\n\n---\n\n");

    return result;
  } catch (error) {
    console.error("Error getting relevant documents:", error);
    return "";
  }
}
