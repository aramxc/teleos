// Use dynamic import to avoid bundling issues
export async function getChromaClient(config: { path: string }) {
  try {
    // Only import on the server side
    if (typeof window === "undefined") {
      const { ChromaClient } = await import("chromadb");
      return new ChromaClient(config);
    } else {
      throw new Error("ChromaDB can only be used on the server side");
    }
  } catch (error) {
    console.error("Error importing ChromaDB:", error);
    throw error;
  }
}
