import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChromaClient } from "chromadb";
import { CHROMA_CONFIG } from "../../chromaConfig.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs/promises";

// Get the equivalent of __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file (one directory up)
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

// Define the UTILS array with a single utility for reading the scraped file
const UTILS = [
  {
    name: "ai-agent-store-data",
    util: {
      get: async () => {
        try {
          const filePath = path.resolve(
            __dirname,
            "../ai-agent-store-data.txt"
          );
          console.log(`Reading file from: ${filePath}`);
          const content = await fs.readFile(filePath, "utf8");
          return content;
        } catch (error) {
          console.error(`Error reading scraped-ai-agent-store.txt:`, error);
          return null;
        }
      },
    },
  },
];

async function loadContent() {
  console.log("Loading content from utils...");
  const documents = [];

  for (const { name, util } of UTILS) {
    try {
      console.log(`Fetching content from ${name}...`);
      const content = await util.get();
      if (content) {
        documents.push({
          pageContent: content,
          metadata: {
            source: name,
          },
        });
        console.log(`✓ Loaded content from ${name}`);
      } else {
        console.warn(`No content returned from ${name}`);
      }
    } catch (error) {
      console.error(`Error loading content from ${name}:`, error);
    }
  }

  console.log(`Loaded content from ${documents.length} utils`);
  return documents;
}

async function splitDocuments(documents) {
  console.log("Splitting documents...");

  const allChunks = [];

  for (const document of documents) {
    try {
      console.log(
        `Splitting document from source: ${document.metadata.source}`
      );

      // Try to parse the content as JSON
      let jsonContent;
      try {
        jsonContent = JSON.parse(document.pageContent);

        // Check if it's an array
        if (!Array.isArray(jsonContent)) {
          console.log(
            "JSON content is not an array, treating as a single object"
          );
          jsonContent = [jsonContent];
        }
      } catch (error) {
        console.warn(
          `Content is not valid JSON, falling back to text splitter: ${error.message}`
        );
        // Fall back to the text splitter for non-JSON content
        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1000,
          chunkOverlap: 0,
        });

        const textChunks = await textSplitter.splitDocuments([document]);
        allChunks.push(...textChunks);
        continue;
      }

      // Process each object in the JSON array as a separate chunk
      jsonContent.forEach((item, index) => {
        allChunks.push({
          pageContent: JSON.stringify(item, null, 2),
          metadata: {
            ...document.metadata,
            chunk_id: index,
            total_chunks: jsonContent.length,
          },
        });
      });

      console.log(
        `Split JSON array into ${jsonContent.length} individual object chunks`
      );
    } catch (error) {
      console.error(
        `Error splitting document from ${document.metadata.source}:`,
        error
      );
    }
  }

  console.log(`Split into ${allChunks.length} total chunks`);
  return allChunks;
}

/**
 * Reconstructs original content from document chunks grouped by source
 * @param {Object} allDocuments - Documents retrieved from ChromaDB
 * @returns {Object} - Map of source names to reconstructed content
 */
async function reconstructContentBySource(allDocuments) {
  console.log("Reconstructing content by source...");
  const contentBySource = {};

  // Group documents by source
  for (let i = 0; i < allDocuments.documents.length; i++) {
    const source = allDocuments.metadatas[i].source;
    const content = allDocuments.documents[i];

    if (!contentBySource[source]) {
      contentBySource[source] = [];
    }

    contentBySource[source].push(content);
  }

  // Join chunks for each source
  Object.keys(contentBySource).forEach((source) => {
    contentBySource[source] = contentBySource[source].join(" ");
  });

  console.log(
    `Reconstructed content for ${Object.keys(contentBySource).length} sources`
  );
  return contentBySource;
}

async function addToChroma(chunks) {
  const embedding = new OpenAIEmbeddings({
    batchSize: 512,
    model: "text-embedding-3-large",
  });

  try {
    console.log("Testing embedding creation...");
    const testEmbedding = await embedding.embedQuery("test");
    console.log(`✓ Created test embedding of length ${testEmbedding.length}`);

    const client = new ChromaClient({ path: CHROMA_CONFIG.url });
    let collection;

    try {
      // Try to get existing collection
      collection = await client.getCollection({
        name: CHROMA_CONFIG.collectionName,
      });
      console.log("Found existing collection");

      // Get existing IDs
      const existingIds = await collection.get({
        include: ["metadatas"],
      });

      // Create a map of source -> ids for quick lookup
      const sourceIdMap = new Map();
      existingIds.metadatas.forEach((metadata, index) => {
        if (!sourceIdMap.has(metadata.source)) {
          sourceIdMap.set(metadata.source, new Set());
        }
        sourceIdMap.get(metadata.source).add(existingIds.ids[index]);
      });

      // Delete old chunks for sources we're updating
      const sourcesToUpdate = new Set(
        chunks.map((chunk) => chunk.metadata.source)
      );
      for (const source of sourcesToUpdate) {
        const idsToDelete = sourceIdMap.get(source);
        if (idsToDelete && idsToDelete.size > 0) {
          console.log(
            `Deleting ${idsToDelete.size} existing chunks for source: ${source}`
          );
          await collection.delete({
            ids: Array.from(idsToDelete),
          });
        }
      }
    } catch (e) {
      // Collection doesn't exist, create it
      console.log("Creating new collection");
      collection = await client.createCollection({
        name: CHROMA_CONFIG.collectionName,
        metadata: CHROMA_CONFIG.collectionMetadata,
        embeddingFunction: {
          dimensionality: testEmbedding.length,
        },
        hnsw: {
          ef_construction: 200,
          M: 16,
        },
      });
    }

    // Add new chunks in batches
    const batchSize = 50;
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batchChunks = chunks.slice(i, i + batchSize);

      console.log(
        `Processing batch ${i / batchSize + 1} of ${Math.ceil(
          chunks.length / batchSize
        )}`
      );

      const batchEmbeddings = await embedding.embedDocuments(
        batchChunks.map((chunk) => chunk.pageContent)
      );

      const batchIds = batchChunks.map(
        (chunk, idx) => `${chunk.metadata.source}_chunk_${i + idx}`
      );

      await collection.add({
        ids: batchIds,
        embeddings: batchEmbeddings,
        metadatas: batchChunks.map((chunk, idx) => ({
          ...chunk.metadata,
          id: batchIds[idx],
          source: chunk.metadata.source || "unknown",
          timestamp: new Date().toISOString(),
        })),
        documents: batchChunks.map((chunk) => chunk.pageContent),
      });

      console.log(`Added batch ${i / batchSize + 1}`);
    }

    // Add improved verification step
    console.log("Verifying all content was properly added...");

    // Get all documents from the collection
    const allDocuments = await collection.get({
      include: ["metadatas", "documents"],
    });

    // Check if we have the expected number of documents
    if (allDocuments.ids.length !== chunks.length) {
      console.warn(
        `Document count mismatch: Expected ${chunks.length} documents but found ${allDocuments.ids.length} in ChromaDB`
      );
    }

    // Reconstruct content by source
    const reconstructedContentBySource = await reconstructContentBySource(
      allDocuments
    );

    // Verify content by source
    for (const { name, util } of UTILS) {
      try {
        // Get original content from util
        const originalContent = await util.get();
        if (!originalContent) {
          console.warn(`No content to verify for source: ${name}`);
          continue;
        }

        // Get reconstructed content for this source
        const reconstructedContent = reconstructedContentBySource[name] || "";
        if (!reconstructedContent) {
          console.warn(`No reconstructed content found for source: ${name}`);
          continue;
        }

        // Check if all key parts of the original content are in the reconstructed content
        // We're checking for inclusion rather than exact match because of chunking
        const contentVerified = originalContent
          .split("\n")
          .filter((line) => line.trim().length > 20) // Only check substantial lines
          .slice(0, 10) // Check a sample of lines for efficiency
          .every((line) => reconstructedContent.includes(line.trim()));

        if (contentVerified) {
          console.log(`✓ Verified content for source: ${name}`);
        } else {
          console.warn(`⚠️ Content verification failed for source: ${name}`);
        }
      } catch (error) {
        console.error(`Error verifying content for ${name}:`, error);
      }
    }

    console.log("Content verification completed");

    console.log("All documents added. Testing query...");
    const testQuery = "Show me some agents";
    const queryEmbedding = await embedding.embedQuery(testQuery);

    try {
      // First try a simple get operation to confirm documents are accessible
      console.log("Testing direct document retrieval...");
      const allDocs = await collection.get({
        include: ["documents"],
      });
      console.log(`Collection contains ${allDocs.ids.length} documents`);

      // Try a query with minimal parameters first
      console.log("Testing basic query...");
      const basicResults = await collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: 1,
        include: ["documents"],
      });
      console.log("Basic query successful");

      // Now try the full query
      console.log("Testing full query...");
      const results = await collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: 2,
        include: ["documents", "metadatas", "distances"],
        parameters: {
          ef: 100,
        },
      });

      console.log("Test query results:", {
        query: testQuery,
        numResults: results.documents[0].length,
        results: results.documents[0],
      });
    } catch (error) {
      console.error("Error during query testing:", error);
      console.log("Attempting fallback query with different parameters...");

      try {
        // Try an alternative query approach with embeddings
        const fallbackResults = await collection.query({
          queryEmbeddings: [queryEmbedding],
          nResults: 1,
          include: ["documents"],
        });
        console.log("Fallback query successful:", {
          numResults: fallbackResults.documents[0].length,
        });
      } catch (fallbackError) {
        console.error("Fallback query also failed:", fallbackError);
      }
    }

    return true;
  } catch (error) {
    console.error("Error in addToChroma:", error);
    if (error.response?.data) {
      console.error("Response data:", error.response.data);
    }
    throw error;
  }
}

async function main() {
  try {
    const documents = await loadContent();
    if (!documents || documents.length === 0) {
      throw new Error("No content loaded from utils");
    }
    console.log(`Loaded ${documents.length} documents`);

    const chunks = await splitDocuments(documents);
    if (!chunks || chunks.length === 0) {
      throw new Error("No chunks created from documents");
    }
    console.log(`Created ${chunks.length} chunks`);

    await addToChroma(chunks);
    console.log("✅ Successfully added all content to ChromaDB");
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

main().catch(console.error);

export { loadContent, splitDocuments, addToChroma, reconstructContentBySource };
