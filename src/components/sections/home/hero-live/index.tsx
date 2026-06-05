import { getVisibleMemberCount } from "@/lib/supabase/queries";
import { HeroLiveClient } from "./hero-live.client";

type Props = { locale: string };

export async function HeroLive({ locale }: Props) {
  // Real, live member count for the hero pip. Never blocks render: if the
  // count can't be fetched we fall back to 0 and the pip shows its empty
  // copy rather than a fabricated number.
  const { count } = await getVisibleMemberCount().catch(() => ({ count: 0 }));
  return <HeroLiveClient locale={locale} nomadCount={count} />;
}
