import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { OpenAIEmbeddings } from "@langchain/openai";
import { getChromaClient } from "@/lib/chromaClient";
import { CHROMA_CONFIG } from "@/chromaConfig";

// Function to query ChromaDB
async function queryChromaDB(queryText: string, numResults: number = 10) {
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

// POST handler for the API route
export async function POST(request: NextRequest) {
  try {
    let query: string;
    let numResults: number = 10;

    // Check content type and parse accordingly
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      // Parse JSON body
      const body = await request.json();
      query = body.query;
      numResults = body.numResults || 10;
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      // Parse form data
      const formData = await request.formData();
      query = formData.get("query") as string;
      numResults = Number(formData.get("numResults") || 10);
    } else {
      // Try to parse URL parameters
      const url = new URL(request.url);
      query = url.searchParams.get("query") || "";
      numResults = Number(url.searchParams.get("numResults") || 10);
    }

    // Log the received query for debugging
    console.log("Received query:", query, "numResults:", numResults);

    if (!query) {
      return NextResponse.json(
        { error: "Missing required parameter: query" },
        { status: 400 }
      );
    }

    const results = await queryChromaDB(query, numResults);
    return NextResponse.json(results);
  } catch (error: unknown) {
    console.error("Error processing query:", error);
    return NextResponse.json(
      { error: "Internal server error", message: (error as Error).message },
      { status: 500 }
    );
  }
}
