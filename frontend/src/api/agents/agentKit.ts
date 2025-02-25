import { NextResponse } from 'next/server';
import { AgentKit } from '@coinbase/agentkit';

// Initialize AgentKit with your configuration
const agentKit = await AgentKit.from({
  cdpApiKeyName: process.env.COINBASE_CDP_API_ID,
  cdpApiKeyPrivateKey: process.env.COINBASE_CDP_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    const actions = agentKit.getActions();
    console.log(`Received prompt: ${prompt}`);
    // Later we'll use the prompt to select specific actions
    
    return NextResponse.json({ 
      success: true, 
      data: { actions, prompt } 
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}