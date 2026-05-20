// Scripted decision-tree for the guided assistant. No LLM: each node has
// a bot message (i18n key `assistant.nodes.<id>.message`) and a list of
// options. An option with `next` is a quick-reply chip that advances the
// conversation; an option with `href` is a link card that routes the user
// to real content (plans, paperwork, guides, docs). Option labels resolve
// from `assistant.opt.<key>`. Deep-link query params match the real
// filters (PLAN_VIBES, paperwork SERVICE_TYPES, neighborhood slugs).

export type AssistantLinkKind =
  | "plan"
  | "paperwork"
  | "doc"
  | "guide"
  | "space"
  | "page";

export interface AssistantOption {
  key: string;
  next?: string;
  href?: string;
  kind?: AssistantLinkKind;
}

export interface AssistantNode {
  id: string;
  options: AssistantOption[];
}

export const ASSISTANT_ROOT = "root";

export const assistantNodes: Record<string, AssistantNode> = {
  root: {
    id: "root",
    options: [
      { key: "new", next: "new" },
      { key: "plans", next: "plans" },
      { key: "paperwork", next: "paperwork" },
      { key: "how", next: "how" },
      { key: "work", next: "work" },
    ],
  },

  // "I'm new to Istanbul"
  new: {
    id: "new",
    options: [
      { key: "pathToIstanbul", href: "/path-to-istanbul", kind: "page" },
      {
        key: "neighborhoodsGuide",
        href: "/guides/neighborhoods",
        kind: "guide",
      },
      { key: "gettingStarted", href: "/help/getting-started", kind: "doc" },
      { key: "makeProfile", href: "/onboarding", kind: "page" },
    ],
  },

  // "Find plans today" - vibe chips link straight into the filtered feed
  plans: {
    id: "plans",
    options: [
      {
        key: "planCowork",
        href: "/plans?range=today&vibe=cowork",
        kind: "plan",
      },
      {
        key: "planSocial",
        href: "/plans?range=today&vibe=social",
        kind: "plan",
      },
      { key: "planMeal", href: "/plans?range=today&vibe=meal", kind: "plan" },
      {
        key: "planOutdoor",
        href: "/plans?range=today&vibe=outdoor",
        kind: "plan",
      },
      { key: "planAll", href: "/plans?range=today", kind: "plan" },
    ],
  },

  // "Need paperwork help" - service-type chips link into the directory
  paperwork: {
    id: "paperwork",
    options: [
      { key: "pwIkamet", href: "/paperwork?type=ikamet", kind: "paperwork" },
      { key: "pwVisa", href: "/paperwork?type=visa", kind: "paperwork" },
      {
        key: "pwBank",
        href: "/paperwork?type=bank_account",
        kind: "paperwork",
      },
      { key: "pwTax", href: "/paperwork?type=tax_office", kind: "paperwork" },
      { key: "pwAll", href: "/paperwork", kind: "paperwork" },
      { key: "pwHowItWorks", href: "/help/paperwork-help", kind: "doc" },
    ],
  },

  // "How does this work?" - straight to the platform docs
  how: {
    id: "how",
    options: [
      { key: "docPlans", href: "/help/how-plans-work", kind: "doc" },
      { key: "docVerify", href: "/help/getting-verified", kind: "doc" },
      { key: "docPayments", href: "/help/payments-and-escrow", kind: "doc" },
      { key: "docSafety", href: "/help/trust-and-safety", kind: "doc" },
      { key: "allHelp", href: "/help", kind: "page" },
    ],
  },

  // "Find a place to work"
  work: {
    id: "work",
    options: [
      {
        key: "hoodKadikoy",
        href: "/guides/neighborhoods/kadikoy",
        kind: "guide",
      },
      {
        key: "hoodCihangir",
        href: "/guides/neighborhoods/cihangir",
        kind: "guide",
      },
      {
        key: "hoodBesiktas",
        href: "/guides/neighborhoods/besiktas",
        kind: "guide",
      },
      { key: "allSpaces", href: "/spaces", kind: "space" },
      { key: "coworkingGuide", href: "/guides/coworking", kind: "guide" },
    ],
  },
};
