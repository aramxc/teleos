import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabaseClient";
// import { pushToChroma } from "@/app/utils/pushToChroma";

// Define the AI Agent interface
interface AIAgent {
  name: string;
  description: string;
  websiteLink: string;
  icon: string;
  url: string;
  tags: string[];
}

/**
 * POST handler to create a new AI agent
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "name",
      "description",
      "websiteLink",
      "icon",
      "url",
      "tags",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate tags is an array
    if (!Array.isArray(body.tags)) {
      return NextResponse.json(
        { error: "Tags must be an array of strings" },
        { status: 400 }
      );
    }

    // Create the agent object
    const agent: AIAgent = {
      name: body.name,
      description: body.description,
      websiteLink: body.websiteLink,
      icon: body.icon,
      url: body.url,
      tags: body.tags,
    };

    // Get Supabase admin client to bypass RLS
    const supabase = getSupabaseClient();

    // Insert the new agent
    const { data, error } = await supabase
      .from("ai_agents")
      .insert(agent)
      .select();

    if (error) {
      console.error("Error creating agent:", error);
      return NextResponse.json(
        { error: "Failed to create agent", details: error.message },
        { status: 500 }
      );
    }

    // // Update ChromaDB with the new agent data
    // try {
    //   await pushToChroma();
    //   console.log("Successfully updated ChromaDB with new agent data");
    // } catch (chromaError) {
    //   console.error("Error updating ChromaDB:", chromaError);
    //   // We don't fail the request if ChromaDB update fails
    //   // The agent was successfully created in Supabase
    // }

    // Return the created agent
    return NextResponse.json(
      {
        message: "Agent created successfully",
        agent: data[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

/**
 * GET handler to retrieve all AI agents
 */
export async function GET() {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.from("ai_agents").select("*");

    if (error) {
      console.error("Error fetching agents:", error);
      return NextResponse.json(
        { error: "Failed to fetch agents", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ agents: data });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
