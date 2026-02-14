const CAT_API_BASE_URL = "https://api.thecatapi.com/v1";

function getApiKey() {
  return (
    process.env.CAT_API_KEY ||
    process.env.THECATAPI_API_KEY ||
    process.env.VITE_CAT_API_KEY ||
    ""
  );
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

export async function handler(event) {
  const endpoint = event.queryStringParameters?.endpoint;

  if (!endpoint || typeof endpoint !== "string") {
    return json(400, { error: "Missing endpoint query parameter." });
  }

  if (!endpoint.startsWith("/") || endpoint.includes("://") || endpoint.startsWith("//")) {
    return json(400, { error: "Invalid endpoint query parameter." });
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return json(500, { error: "CAT_API_KEY is not configured on the server." });
  }

  try {
    const upstreamResponse = await fetch(`${CAT_API_BASE_URL}${endpoint}`, {
      headers: { "x-api-key": apiKey },
    });

    const responseBody = await upstreamResponse.text();
    return {
      statusCode: upstreamResponse.status,
      headers: {
        "Content-Type": upstreamResponse.headers.get("content-type") || "application/json",
        "Cache-Control": "no-store",
      },
      body: responseBody,
    };
  } catch {
    return json(502, { error: "Failed to reach The Cat API." });
  }
}
