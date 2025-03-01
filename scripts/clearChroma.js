import { ChromaClient } from "chromadb";
import { CHROMA_CONFIG } from "../chromaConfig.js";

/**
 * Script to clear all data from ChromaDB collection
 */
async function clearChroma() {
  console.log("Starting ChromaDB clearing process...");

  try {
    // Connect to ChromaDB
    const client = new ChromaClient({ path: CHROMA_CONFIG.url });
    console.log(`Connected to ChromaDB at ${CHROMA_CONFIG.url}`);

    try {
      // Check if collection exists
      const collection = await client.getCollection({
        name: CHROMA_CONFIG.collectionName,
      });

      console.log(`Found collection: ${CHROMA_CONFIG.collectionName}`);

      // Get all items in the collection including their IDs
      const existingItems = await collection.get({
        include: ["metadatas", "documents"],
      });

      const count = existingItems.ids.length;
      console.log(`Collection contains ${count} items`);

      if (count > 0) {
        // Delete all items by their IDs
        console.log(`Deleting ${count} items from collection...`);
        await collection.delete({
          ids: existingItems.ids,
        });

        // Verify deletion
        const newCount = await collection.count();
        console.log(`Collection now contains ${newCount} items`);

        if (newCount > 0) {
          console.log("Some items remain. Taking alternative approach...");

          // Try deleting the collection entirely
          try {
            await client.deleteCollection({
              name: CHROMA_CONFIG.collectionName,
            });
            console.log(
              `✅ Successfully deleted collection: ${CHROMA_CONFIG.collectionName}`
            );
          } catch (deleteError) {
            console.error("Error deleting collection:", deleteError);
          }

          // Create a fresh collection
          console.log("Creating fresh collection...");
          await client.createCollection({
            name: CHROMA_CONFIG.collectionName,
            metadata: CHROMA_CONFIG.collectionMetadata,
          });
          console.log(
            `✅ Successfully created fresh collection: ${CHROMA_CONFIG.collectionName}`
          );
        } else {
          console.log("✅ Successfully deleted all items from collection");
        }
      } else {
        console.log("Collection is already empty");
      }
    } catch (e) {
      console.log(
        `Collection ${CHROMA_CONFIG.collectionName} does not exist or could not be accessed`
      );
      console.log("Creating fresh collection...");
      try {
        await client.createCollection({
          name: CHROMA_CONFIG.collectionName,
          metadata: CHROMA_CONFIG.collectionMetadata,
        });
        console.log(
          `✅ Successfully created fresh collection: ${CHROMA_CONFIG.collectionName}`
        );
      } catch (createError) {
        console.error("Error creating collection:", createError);
      }
    }

    console.log("ChromaDB clearing process completed");
  } catch (error) {
    console.error("Error clearing ChromaDB:", error);
    process.exit(1);
  }
}

// Run the script
clearChroma()
  .then(() => {
    console.log("Script execution completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script execution failed:", error);
    process.exit(1);
  });
