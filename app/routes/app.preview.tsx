import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

export async function loader({ request }) {
  // ensure authenticated (so you have shop, session etc)
  await shopify.authenticate.admin(request);

  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const themeId = url.searchParams.get("theme_id");
  // generate preview link (you may need to call Shopify API to get preview token)
  const previewUrl = `https://${shop}/?preview=true`;

  return json({ previewUrl });
}

export default function PreviewPage() {
  const { previewUrl } = useLoaderData<typeof loader>();
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        src={previewUrl}
        style={{ width: "100%", height: "100%", border: 0 }}
        sandbox="allow-same-origin allow-scripts allow-popups"
      />
    </div>
  );
}