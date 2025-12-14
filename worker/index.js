export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Let Cloudflare serve static assets from `dist/`.
    let response = await env.ASSETS.fetch(request);

    // SPA fallback: for navigation requests that don't map to a file, return `index.html`.
    // This keeps client-side routing working when a user refreshes/deep-links.
    const accept = request.headers.get("Accept") || "";
    const isHtmlNavigation = accept.includes("text/html");
    const looksLikeFile = url.pathname.split("/").pop()?.includes(".");

    if (response.status === 404 && isHtmlNavigation && !looksLikeFile) {
      url.pathname = "/index.html";
      response = await env.ASSETS.fetch(new Request(url.toString(), request));
    }

    return response;
  },
};
