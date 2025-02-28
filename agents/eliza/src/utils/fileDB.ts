import fs from 'fs';
import path from 'path';

export async function queryAgents(
  category: string,
  numResults: number = 10
) {
  try {
    // Read the AI agents store data file
    const data = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), 'scripts', 'ai-agent-store-data.txt'),
        'utf8'
      )
    );

    // Filter agents by category/tags
    const results = data.filter((agent: any) => 
      agent.tags.some((tag: string) => 
        tag.toLowerCase().includes(category.toLowerCase())
      )
    ).slice(0, numResults);

    console.log(`Found ${results.length} agents matching category: ${category}`);
    
    return {
      query: category,
      results: results
    };
  } catch (error) {
    console.error("Error querying agents:", error);
    throw error;
  }
}