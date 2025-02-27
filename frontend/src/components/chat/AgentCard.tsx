import { Code } from "@mui/icons-material";

interface Agent {
  name: string;
  description: string;
  websiteLink: string;
  tags: string[];
  icon: string;
}

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  return (
    <div className="bg-theme-panel-bg border border-theme-border-primary rounded-lg 
    p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] h-[320px] flex flex-col
    min-w-[200px] sm:min-w-[280px] mt-4 mb-4">
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-semibold mb-2">{agent.name}</h3>
        <Code className="mb-4" />
        <p className="text-sm text-theme-text-secondary flex-1 mb-4 line-clamp-3 hover:line-clamp-none">
          {agent.description}
        </p>
        <div className="mt-auto">
          <div className="flex flex-wrap gap-2 mb-4">
            {agent.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-theme-button-primary text-white border border-theme-border-primary"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex space-x-2">
            <a
              href={agent.websiteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-theme-accent-primary hover:underline"
            >
              Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}