import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";
import { Activity } from "lucide-react";

export default function ConnectionStatus() {
  const [queryTime, setQueryTime] = useState<number | null>(null);

  const query = useQuery({
    queryKey: ["status"],
    queryFn: async () => {
      const start = performance.now();
      try {
        // Make a simpler health check request instead of fetching all agents
        const response = await fetch("/api/agents/health", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (!response.ok) {
          throw new Error("Health check failed");
        }
        
        const data = await response.json();
        const end = performance.now();
        setQueryTime(end - start);
        return data;
      } catch (error) {
        const end = performance.now();
        setQueryTime(end - start);
        throw error;
      }
    },
    refetchInterval: 5_000,
    retry: 1,
    refetchOnWindowFocus: "always",
  });

  const connected = query?.isSuccess && !query?.isError;
  const isLoading = query?.isRefetching || query?.isPending;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex flex-col gap-1 select-none transition-all duration-200">
          <div className="flex items-center gap-1">
            <div
              className={cn([
                "h-2.5 w-2.5 rounded-full",
                isLoading
                  ? "bg-muted-foreground"
                  : connected
                  ? "bg-green-600"
                  : "bg-red-600",
              ])}
            />
            <span
              className={cn([
                "text-xs",
                isLoading
                  ? "text-muted-foreground"
                  : connected
                  ? "text-green-600"
                  : "text-red-600",
              ])}
            >
              {isLoading
                ? "Connecting..."
                : connected
                ? "Connected"
                : "Disconnected"}
            </span>
          </div>
        </div>
      </TooltipTrigger>
      {connected ? (
        <TooltipContent side="top">
          <div className="flex items-center gap-1">
            <Activity className="size-4" />
            <span>{queryTime?.toFixed(2)} ms</span>
          </div>
        </TooltipContent>
      ) : null}
    </Tooltip>
  );
}
