import { z } from "zod";

// Verification-request input. v1 is a 'why you want this' free-text
// submission; a real KYC vendor's session id lands later.
export const verificationApplySchema = z.object({
  requested_level: z.enum(["verified", "trusted"]),
  reason: z
    .string()
    .trim()
    .min(20, "Tell us at least a sentence or two")
    .max(1000),
});

export type VerificationApplyInput = z.infer<typeof verificationApplySchema>;
