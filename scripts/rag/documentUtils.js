/**
 * Groups document chunks by source and identifies documents that need full retrieval
 * @param documents Array of document chunks
 * @param metadatas Array of metadata objects corresponding to each chunk
 * @param distances Array of distance scores corresponding to each chunk
 * @returns Array of source names and their relevance scores
 */
export function identifyRelevantSources(documents, metadatas, distances) {
  // Group chunks by source
  const sourceMap = new Map();

  documents[0].forEach((doc, i) => {
    const metadata = metadatas[0][i];
    const distance = distances[0][i];
    const source = metadata.source;
    const chunkId = metadata.chunk_id || 0;

    if (!sourceMap.has(source)) {
      sourceMap.set(source, {
        chunks: [],
        metadata: metadata,
        minDistance: distance,
      });
    }

    const sourceData = sourceMap.get(source);
    sourceData.chunks.push({ content: doc, chunkId });
    sourceData.minDistance = Math.min(sourceData.minDistance, distance);
  });

  // Get top 5 most relevant sources
  return Array.from(sourceMap.entries())
    .sort((a, b) => a[1].minDistance - b[1].minDistance)
    .slice(0, 2)
    .map(([source, data]) => ({
      source,
      relevanceScore: 1 - data.minDistance,
    }));
}

function reconstructContentBySource(allDocuments) {
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
