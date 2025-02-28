interface TagBubbleProps {
  tag: string;
  className?: string;
}

export default function TagBubble({ tag, className = '' }: TagBubbleProps) {
  return (
    <span
      className={`px-2 py-1 text-xs rounded-full bg-gradient-to-r from-theme-button-primary to-theme-button-hover text-white border border-theme-border-primary ${className}`}
    >
      {tag}
    </span>
  );
}
