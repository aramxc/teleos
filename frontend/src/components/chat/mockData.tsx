export const mockAgentResponses = [
    {
      role: 'user',
      content: 'Show me AI development tools',
    },
    {
      role: 'assistant',
      content: JSON.stringify([
        {
          name: "Softgen",
          description: "Softgen is an AI-driven web application builder that allows users to transform their ideas into fully functional web applications by simply describing their vision in natural language.",
          websiteLink: "https://softgen.ai/?utm_source=aiagentstore.ai",
          tags: ["web development", "no-code platform", "AI code generation"],
          icon: "WebAsset"
        },
        {
          name: "CodePilot",
          description: "An advanced AI coding assistant that helps developers write better code faster with real-time suggestions and automated refactoring.",
          websiteLink: "https://codepilot.ai",
          tags: ["coding assistant", "AI", "productivity", "code generation"],
          icon: "Code"
        },
        {
          name: "AIDevTools",
          description: "A comprehensive suite of AI-powered development tools including code completion, testing assistance, and documentation generation.",
          websiteLink: "https://aidevtools.com",
          tags: ["development suite", "AI", "testing", "documentation"],
          icon: "Build"
        }
      ])
    },
    {
        role: 'assistant',
        content: 'See any you like?',
    },
];