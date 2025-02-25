import { NextResponse } from 'next/server';
import { AgentKit } from '@coinbase/agentkit';
import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Initialize AgentKit with your configuration
const agentKit = await AgentKit.from({
  cdpApiKeyName: process.env.COINBASE_CDP_API_ID,
  cdpApiKeyPrivateKey: process.env.COINBASE_CDP_API_SECRET,
});

// Get LangChain-compatible tools from AgentKit
const tools = await getLangChainTools(agentKit);

// Initialize the LLM
const llm = new ChatOpenAI({
    model: "gpt-4",
    temperature: 0,
});

// Create a prompt for the agent
const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a helpful assistant that can use tools to interact with Coinbase services."],
    ["human", "{input}"]
]);

// Create the agent
const agent = await createOpenAIFunctionsAgent({
    llm,
    tools,
    prompt
});

// Create the executor
const agentExecutor = new AgentExecutor({
    agent,
    tools,
});

// API endpoints
export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    
    // Convert messages to input format expected by the agent
    const input = messages[messages.length - 1].content;
    
    // Invoke the agent with the input
    const result = await agentExecutor.invoke({ input });
    
    return NextResponse.json({ 
      success: true, 
      data: result
    });

  } catch (error) {
    console.error('Agent error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// Streaming endpoint
export async function POST_STREAM(request: Request) {
  try {
    const { messages } = await request.json();
    const input = messages[messages.length - 1].content;
    
    // Create a TransformStream for streaming
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    
    // Stream the agent's responses
    const agentStream = await agentExecutor.streamLog({ input });
    
    (async () => {
      try {
        for await (const chunk of agentStream) {
          await writer.write(
            new TextEncoder().encode(
              JSON.stringify({ chunk }) + '\n'
            )
          );
        }
      } finally {
        await writer.close();
      }
    })();

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Stream error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}