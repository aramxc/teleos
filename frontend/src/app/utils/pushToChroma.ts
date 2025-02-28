import { OpenAIEmbeddings } from "@langchain/openai";
import { ChromaClient } from "chromadb";
import { CHROMA_CONFIG } from "../../../chromaConfig.js";
import { Agent } from "@/types/agents";

// Define types for our data structures
interface Document {
  pageContent: string;
  metadata: {
    source: string;
    [key: string]: unknown;
  };
}

// Source name constant
const DATA_SOURCE_NAME = "ai-agent-store-data";

// Create a shared embedding instance
const embedding = new OpenAIEmbeddings({
  batchSize: 512,
  model: "text-embedding-3-large",
});

/**
 * Creates a document from an AI agent for ChromaDB storage
 */
function createAgentDocument(agent: Agent): Document {
  return {
    pageContent: JSON.stringify(agent, null, 2),
    metadata: {
      source: DATA_SOURCE_NAME,
      type: "ai_agent",
    },
  };
}

/**
 * Pushes a single AI agent to ChromaDB without deleting existing embeddings
 */
export async function pushToChroma(agent: Agent): Promise<boolean> {
  try {
    console.log("Pushing single agent to Chroma:", agent.name);

    // Create document from agent using the shared function
    const document = createAgentDocument(agent);

    const client = new ChromaClient({ path: CHROMA_CONFIG.url });
    let collection;

    try {
      // Get existing collection
      collection = await client.getCollection({
        name: CHROMA_CONFIG.collectionName,
        // @ts-expect-error dunno
        embeddingFunction: embedding,
      });
      console.log("Found existing collection");
    } catch (e) {
      // Collection doesn't exist, create it
      console.log("Creating new collection");
      collection = await client.createCollection({
        name: CHROMA_CONFIG.collectionName,
        metadata: CHROMA_CONFIG.collectionMetadata,
        // @ts-expect-error dunno
        embeddingFunction: embedding,
        hnsw: {
          ef_construction: 200,
          M: 16,
        },
      });
    }

    // Generate embedding for the document
    const documentEmbedding = await embedding.embedQuery(document.pageContent);

    // Create a unique ID for this agent
    const agentId = `${DATA_SOURCE_NAME}_chunk_${agent.name
      .replace(/\s+/g, "_")
      .toLowerCase()}_${Date.now()}`;

    // Add the agent to the collection
    await collection.add({
      ids: [agentId],
      embeddings: [documentEmbedding],
      metadatas: [
        {
          ...document.metadata,
          id: agentId,
          source: document.metadata.source,
          timestamp: new Date().toISOString(),
        },
      ],
      documents: [document.pageContent],
    });

    console.log(`Successfully added agent: ${agent.name} with ID: ${agentId}`);

    return true;
  } catch (error) {
    console.error("Error in pushToChroma:", error);
    throw error;
  }
}
