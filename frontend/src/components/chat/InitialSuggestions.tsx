export interface SuggestionBubble {
    text: string;
    onClick: () => void;
  }
  
  export default function SuggestionBubbles({ suggestions, onSelect }: { 
    suggestions: string[];
    onSelect: (suggestion: string) => void;
  }) {
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-6">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => {
              console.log('Button clicked:', suggestion); // Debug log
              onSelect(suggestion);
            }}
            className="px-4 py-2 text-sm bg-theme-bg-secondary/20 hover:bg-theme-bg-secondary/40 
                       text-theme-text-primary rounded-full border border-theme-border-secondary 
                       transition-all duration-200 hover:scale-105 cursor-pointer"
          >
            {suggestion} →
          </button>
        ))}
      </div>
    );
  }