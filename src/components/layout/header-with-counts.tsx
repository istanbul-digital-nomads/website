import { Header } from "./header";
import { getNavCounts } from "@/lib/nav-counts";

// Server-component wrapper that fetches nav counts on the server and
// passes them to the client-side <Header />. Mounted inside a Suspense
// boundary by the layout so its async work doesn't trip Next 16's
// cacheComponents "uncached data outside Suspense" guard.
export async function HeaderWithCounts() {
  const counts = await getNavCounts();
  return <Header counts={counts} />;
}
