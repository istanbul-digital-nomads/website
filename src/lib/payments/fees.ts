// Fee model: "stack on platform take" (user decision, Phase 5).
//
// The attendee pays the sticker entry fee the guide set (gross). The
// platform fee (10%) and the processor fee (~2.9%) come out of the
// gross before the guide's net. Guide keeps ~87%.
//
// All amounts in minor units (kuruş for TRY). Integer math only - we
// round each fee to the nearest kuruş, then derive net as the
// remainder so the three components always sum exactly to gross (no
// rounding drift that leaves a stray kuruş unaccounted for).

export const PLATFORM_FEE_BPS = 1000; // 10.0%
export const PROCESSOR_FEE_BPS = 290; // 2.9% (iyzico-typical, tune to contract)

export type FeeBreakdown = {
  grossCents: number;
  platformFeeCents: number;
  processorFeeCents: number;
  netToHostCents: number;
};

function bps(amount: number, rate: number): number {
  return Math.round((amount * rate) / 10000);
}

export function computeFeeBreakdown(grossCents: number): FeeBreakdown {
  if (!Number.isInteger(grossCents) || grossCents < 0) {
    throw new Error("grossCents must be a non-negative integer");
  }
  const platformFeeCents = bps(grossCents, PLATFORM_FEE_BPS);
  const processorFeeCents = bps(grossCents, PROCESSOR_FEE_BPS);
  // Net is the remainder so the parts always reconcile to gross.
  const netToHostCents = grossCents - platformFeeCents - processorFeeCents;
  return {
    grossCents,
    platformFeeCents,
    processorFeeCents,
    netToHostCents: Math.max(0, netToHostCents),
  };
}

// Lira (display) <-> kuruş (storage) helpers. 1 TRY = 100 kuruş.
export function liraToCents(lira: number): number {
  return Math.round(lira * 100);
}
export function centsToLira(cents: number): number {
  return cents / 100;
}
