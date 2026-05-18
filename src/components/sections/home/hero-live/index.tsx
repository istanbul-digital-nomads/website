import { HeroLiveClient } from "./hero-live.client";

type Props = { locale: string };

export function HeroLive({ locale }: Props) {
  return <HeroLiveClient locale={locale} />;
}
