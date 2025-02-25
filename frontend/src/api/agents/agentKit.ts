import { NextResponse } from 'next/server';
import { AgentKit } from '../../../../agentkit/dist'; // Import from root level

const agent = await AgentKit.from({
  // Your config here
});


export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    
    const actions = agent.getActions();
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