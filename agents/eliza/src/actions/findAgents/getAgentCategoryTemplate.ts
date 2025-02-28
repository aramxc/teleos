export const getAgentCategoryTemplate = `Extract agent search parameters from the most recent message.
Return a JSON object with:
- category: The requested agent category/type (required)
- numResults: Number of results to return (default: 10)
- tags: Any specific tags mentioned (optional)

Example valid responses:
\`\`\`json
{
    "category": "marketing",
    "numResults": 5,
    "tags": ["automation", "social media"]
}
\`\`\`
or
\`\`\`json
{
    "category": "development",
    "numResults": 10
}
\`\`\`

{{recentMessages}}

Extract search parameters and respond with a JSON markdown block.`;
