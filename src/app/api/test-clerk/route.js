import { useAuth } from "@clerk/clerk-react";

export async function GET(request) {
  // This is a simple test endpoint to verify Clerk integration
  return new Response(
    JSON.stringify({
      message: "Clerk integration test endpoint",
      timestamp: new Date().toISOString(),
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
