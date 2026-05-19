"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { showToast } from "@/lib/toast";
import { Container } from "@/components/ui/container";
import { SERVICE_TYPES } from "@/lib/paperwork";

// Minimal Phase 2 creation form for paperwork services. Agents fill in
// service_type, title, description, comma-separated languages +
// neighborhoods, price in TL, optional duration estimate.
//
// On success the route redirects to /paperwork/[id]. The page that
// renders this is gated to is_agent members; the API revalidates the
// `paperwork_services` cacheTag so /paperwork reflects new entries
// within minutes.

export function PaperworkCreateForm() {
  const router = useRouter();
  const t = useTranslations("paperworkCreate");
  const tType = useTranslations("paperworkPage.serviceTypes");

  const [serviceType, setServiceType] = useState<string>(SERVICE_TYPES[0]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [languages, setLanguages] = useState("");
  const [neighborhoods, setNeighborhoods] = useState("");
  const [priceLira, setPriceLira] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/paperwork", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_type: serviceType,
          title: title.trim(),
          description: description.trim() || null,
          languages,
          neighborhoods,
          price_lira: priceLira,
          duration_estimate_minutes: durationMinutes,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        showToast.error(t("errorTitle"), json.error ?? t("errorBody"));
        return;
      }
      showToast.success(t("successTitle"));
      router.push(`/paperwork/${json.data.id}` as never);
    } catch {
      showToast.error(t("errorTitle"), t("errorBody"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="bg-ink-0 py-12 lg:py-16">
      <Container className="max-w-2xl">
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-mute">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 font-display text-display-lg leading-tight text-paper">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-prose text-[15px] text-paper-dim">
          {t("intro")}
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div>
            <label
              htmlFor="pw-type"
              className="block font-mono text-[10px] uppercase tracking-wider text-paper-mute"
            >
              {t("serviceTypeLabel")}
            </label>
            <select
              id="pw-type"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="mt-2 w-full rounded-md border border-ink-3 bg-ink-1 px-3 py-2 text-sm text-paper"
            >
              {SERVICE_TYPES.map((st) => (
                <option key={st} value={st}>
                  {tType(st)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="pw-title"
              className="block font-mono text-[10px] uppercase tracking-wider text-paper-mute"
            >
              {t("titleLabel")}
            </label>
            <input
              id="pw-title"
              type="text"
              required
              maxLength={120}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("titlePlaceholder")}
              className="mt-2 w-full rounded-md border border-ink-3 bg-ink-1 px-3 py-2 text-sm text-paper"
            />
          </div>

          <div>
            <label
              htmlFor="pw-desc"
              className="block font-mono text-[10px] uppercase tracking-wider text-paper-mute"
            >
              {t("descriptionLabel")}
            </label>
            <textarea
              id="pw-desc"
              rows={5}
              maxLength={1200}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("descriptionPlaceholder")}
              className="mt-2 w-full rounded-md border border-ink-3 bg-ink-1 px-3 py-2 text-sm text-paper"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="pw-langs"
                className="block font-mono text-[10px] uppercase tracking-wider text-paper-mute"
              >
                {t("languagesLabel")}
              </label>
              <input
                id="pw-langs"
                type="text"
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                placeholder={t("languagesPlaceholder")}
                className="mt-2 w-full rounded-md border border-ink-3 bg-ink-1 px-3 py-2 text-sm text-paper"
              />
              <p className="mt-1 text-[11px] text-paper-faint">
                {t("commaSeparatedHint")}
              </p>
            </div>
            <div>
              <label
                htmlFor="pw-hoods"
                className="block font-mono text-[10px] uppercase tracking-wider text-paper-mute"
              >
                {t("neighborhoodsLabel")}
              </label>
              <input
                id="pw-hoods"
                type="text"
                value={neighborhoods}
                onChange={(e) => setNeighborhoods(e.target.value)}
                placeholder={t("neighborhoodsPlaceholder")}
                className="mt-2 w-full rounded-md border border-ink-3 bg-ink-1 px-3 py-2 text-sm text-paper"
              />
              <p className="mt-1 text-[11px] text-paper-faint">
                {t("commaSeparatedHint")}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="pw-price"
                className="block font-mono text-[10px] uppercase tracking-wider text-paper-mute"
              >
                {t("priceLabel")}
              </label>
              <input
                id="pw-price"
                type="number"
                required
                min={0}
                step={10}
                value={priceLira}
                onChange={(e) => setPriceLira(e.target.value)}
                placeholder="0"
                className="mt-2 w-full rounded-md border border-ink-3 bg-ink-1 px-3 py-2 text-sm text-paper"
              />
            </div>
            <div>
              <label
                htmlFor="pw-duration"
                className="block font-mono text-[10px] uppercase tracking-wider text-paper-mute"
              >
                {t("durationLabel")}
              </label>
              <input
                id="pw-duration"
                type="number"
                min={15}
                max={480}
                step={15}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                placeholder="120"
                className="mt-2 w-full rounded-md border border-ink-3 bg-ink-1 px-3 py-2 text-sm text-paper"
              />
            </div>
          </div>

          <div className="rounded-md border border-ink-3 bg-ink-1 p-3 text-[12px] leading-[1.55] text-paper-dim">
            {t("disclaimer")}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium text-ink-0 transition-colors hover:bg-terracotta-dim disabled:opacity-60"
          >
            {submitting ? t("submitting") : t("submit")}
          </button>
        </form>
      </Container>
    </section>
  );
}
