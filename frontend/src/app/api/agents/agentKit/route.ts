import { NextResponse } from 'next/server';
import { AgentKit } from '@coinbase/agentkit';
import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";

/**
 * Initializes the AgentKit executor with LangChain tools and OpenAI integration
 * @returns AgentExecutor instance
 * @throws Error if environment variables are missing
 */
async function initializeAgent() {
  try {
    // Verify required environment variables
    if (!process.env.CDP_API_KEY_NAME || !process.env.CDP_API_KEY_PRIVATE_KEY || !process.env.OPENAI_API_KEY) {
      throw new Error('Missing required environment variables');
    }

    // Initialize AgentKit with Coinbase credentials
    const agentKit = await AgentKit.from({
      cdpApiKeyName: process.env.CDP_API_KEY_NAME,
      cdpApiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY,
    });

    // Get LangChain tools from AgentKit
    const tools = await getLangChainTools(agentKit);
    
    // Initialize OpenAI chat model
    const llm = new ChatOpenAI({
      modelName: "gpt-4",
      temperature: 0,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // Create prompt template for the agent
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a helpful assistant that can use tools to interact with Coinbase services."],
      ["human", "{input}"],
      ["human", "{agent_scratchpad}"]
    ]);

    // Create and return the agent executor
    const agent = await createOpenAIFunctionsAgent({ llm, tools, prompt });
    return new AgentExecutor({ agent, tools, verbose: true });
  } catch (error) {
    console.error('Error in initializeAgent:', error);
    throw error;
  }
}

// Cache the executor instance for reuse across requests
let agentExecutor: AgentExecutor | null = null;

/**
 * POST handler for agent interactions
 * Implements streaming response for real-time agent feedback
 */
export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json().catch(error => {
      console.error('Failed to parse request body:', error);
      throw new Error('Invalid JSON in request body');
    });

    // Initialize agent if not already done
    if (!agentExecutor) {
      console.log('Initializing new agent executor...');
      agentExecutor = await initializeAgent();
    }

    // Validate messages array
    if (!body.messages?.length) {
      throw new Error('Invalid messages format');
    }

    // Get the latest message content
    const input = body.messages[body.messages.length - 1].content;
    console.log('Processing input:', input);
    
    // Set up streaming response
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    
    // Process agent stream
    const agentStream = await agentExecutor.streamLog({ input });
    
    // Handle streaming response
    (async () => {
      try {
        for await (const chunk of agentStream) {
          if ('ops' in chunk) {
            for (const op of chunk.ops) {
              // Handle streamed output
              if (op.path.includes('streamed_output_str') && 'value' in op) {
                await writer.write(
                  new TextEncoder().encode(
                    JSON.stringify({
                      type: 'agent_log',
                      content: (op as { value: string }).value
                    }) + '\n'
                  )
                );
              } 
              // Handle final output
              else if (op.path === '/final_output' && 'value' in op) {
                await writer.write(
                  new TextEncoder().encode(
                    JSON.stringify({
                      type: 'final_answer',
                      content: (op as { value: { output: string } }).value.output
                    }) + '\n'
                  )
                );
              }
            }
          }
        }
      } catch (error) {
        console.error('Streaming error:', error);
        await writer.write(
          new TextEncoder().encode(
            JSON.stringify({
              type: 'error',
              content: 'An error occurred while processing your request'
            }) + '\n'
          )
        );
      } finally {
        await writer.close();
      }
    })();

    // Return streaming response
    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Unhandled error in route handler:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}