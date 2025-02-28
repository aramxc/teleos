import { OpenAIEmbeddings } from "@langchain/openai";
import { getChromaClient } from "../../lib/chromaClient.ts";
import { CHROMA_CONFIG } from "../../chromaConfig.js";

// Function to query ChromaDB
export async function queryChromaDB(
  queryText: string,
  numResults: number = 10
) {
  const embedding = new OpenAIEmbeddings({
    batchSize: 512,
    model: "text-embedding-3-large",
  });

  try {
    console.log(`Getting relevant documents for query: "${queryText}"`);
    const client = await getChromaClient({
      path: CHROMA_CONFIG.url || "http://localhost:8000",
    });
    // @ts-expect-error - ChromaDB types may not be fully compatible
    const collection = await client.getCollection({
      name: CHROMA_CONFIG.collectionName || "embeddings-collection",
    });

    // Get query embedding
    const queryEmbedding = await embedding.embedQuery(queryText);

    // Query for the specified number of most relevant results
    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: numResults,
      // @ts-expect-error - ChromaDB types need updating
      include: ["metadatas", "documents", "distances"],
    });

    console.log(`Retrieved ${results.documents[0].length} results`);

    // Process each result
    const parsedResults = results.documents[0].map(
      (doc: string | null, index: number) => {
        // Parse the JSON content
        let parsedContent;
        try {
          parsedContent = JSON.parse(doc || "{}");
        } catch (error: unknown) {
          console.warn(
            `Failed to parse JSON for result ${index}:`,
            (error as Error).message
          );
          parsedContent = { content: doc };
        }

        // Just return the content directly
        return parsedContent;
      }
    );

    return {
      query: queryText,
      results: parsedResults,
    };
  } catch (error: unknown) {
    console.error("Error querying ChromaDB:", error);
    throw error;
  }
}
