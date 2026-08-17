import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// We use the service role key here to bypass RLS because webhooks are unauthenticated requests from external services.
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(
  request: Request,
  { params }: { params: { processId: string } }
) {
  try {
    const processId = params.processId
    
    // Parse the query params to see if an entity type or workspace ID was provided
    const url = new URL(request.url)
    const entityType = url.searchParams.get("type") || "sale"
    const workspaceId = url.searchParams.get("workspaceId")
    
    const body = await request.json()
    
    // Attempt to extract a name for the entity from the payload
    const name = body.name || body.email || body.title || `Entity ${Date.now()}`

    // Construct the entity record
    const entityRecord = {
      workspace_id: workspaceId || null, // Will be null if not provided, might fail if column is NOT NULL, but it's not marked NOT NULL in migration
      process_id: processId,
      type: entityType,
      name: name,
      properties: body,
      status: "active"
    }

    const { data, error } = await supabase
      .from("entities")
      .insert(entityRecord)
      .select()
      .single()

    if (error) {
      console.error("Supabase Error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      message: `Ingested successfully as ${entityType}`,
      entity: data 
    })
    
  } catch (error: any) {
    console.error("Webhook Ingest Error:", error)
    return NextResponse.json({ error: "Invalid JSON payload or internal error" }, { status: 500 })
  }
}
