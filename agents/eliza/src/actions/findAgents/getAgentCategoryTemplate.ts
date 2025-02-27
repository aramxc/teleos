export const getAgentCategoryTemplate = `Respond with a json containing the agent category and the requested number of results.
Extract the agent category from the most recent message. If no specific category is provided, respond with an error.
Extract the requested number of results from the most recent message. If no specific number of results is provided, default to 10 results.
The response must include:
- category: The agent category name
- numResults: The requested number of results
Example response:
\`\`\`json
{
    "category": "marketing",
    "numResults": 10
}
\`\`\`
{{recentMessages}}
Extract the agent category and the requested number of results from the most recent message.
Respond with a JSON markdown block containing the agent category and the requested number of results.`;
