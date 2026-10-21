let cachedApp = null;

export default async function handler(req, res) {
  try {
    if (!cachedApp) {
      const { createApp } = await import("../src/app.js");
      cachedApp = createApp();
    }
    return cachedApp(req, res);
  } catch (err) {
    console.error("[vercel-api] Error handling request:", err);
    return res.status(500).json({
      status: "error",
      message: "API invocation failed",
      detail: err.message,
    });
  }
}
