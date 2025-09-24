import { type NextRequest, NextResponse } from "next/server"

interface ClassificationRequest {
  image_base64: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ClassificationRequest = await request.json()

    const API_ENDPOINT = process.env.ML_API_ENDPOINT || "http://127.0.0.1:8000/run_prediction"

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`ML API request failed: ${response.statusText}`)
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Prediction API error:", error)
    return NextResponse.json({ error: "Failed to process prediction" }, { status: 500 })
  }
}
