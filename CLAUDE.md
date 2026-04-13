# Project Rules

## Writing Style

- **Never use em dashes (`—`).** Always use regular dashes (`-`) in all text, documentation, and content across all repos in this organization.

## Brand Voice & Tone of Voice

All user-facing content (guides, blog posts, FAQ answers, UI text, meta descriptions, placeholder text, error messages, toast notifications) MUST follow these rules:

### Contractions - ALWAYS use casual contractions
- Use "don't" NOT "do not"
- Use "doesn't" NOT "does not"
- Use "isn't" NOT "is not"
- Use "can't" NOT "cannot"
- Use "won't" NOT "will not"
- Use "shouldn't" NOT "should not"
- Use "wouldn't" NOT "would not"
- Use "couldn't" NOT "could not"
- Use "it's" NOT "it is" (when it means "it is", not possessive)
- Use "that's" NOT "that is"
- Use "you'll" NOT "you will"
- Use "we've" NOT "we have"
- **Exception:** Table headers and formal labels (e.g., "What it is" in a table column) keep formal form.

### Voice & Perspective
- Write like **a helpful local friend** who's been in Istanbul a while - not a corporate guide, travel blog, or government website.
- Use **"you"** when giving advice: "You'll want a Turkcell SIM" not "One should obtain a SIM card."
- Use **"we"** when speaking as the community: "We recommend Kadikoy" not "Kadikoy is recommended."
- Blog posts can use **"I"** for personal stories and first-hand experience.
- Never use passive voice when active works: "Buy an Istanbulkart" not "An Istanbulkart should be purchased."

### Tone Rules
- **Direct and specific.** "Get a Turkcell SIM for 250 TL" not "Consider obtaining mobile connectivity."
- **Warm but not cutesy.** "Welcome" not "Hey there!" or "Hiya!"
- **Practical first, personality second.** Lead with the useful info, add flavor after.
- **No marketing fluff.** Never use: "seamless", "innovative", "cutting-edge", "world-class", "leverage", "utilize", "facilitate", "comprehensive solution."
- **No overused filler words.** Avoid repeating: "real", "fast", "amazing", "incredible", "unique."
- **Always answer "what does this do for me?"** not "what are we."
- **Use questions the reader is actually asking** as section headers when possible.

### Content Structure
- Open guides with a direct answer or recommendation, not background info.
- Use tables for comparisons and pricing (readers scan, not read).
- Include real prices in TL and USD.
- Link to other guides and blog posts whenever relevant (cross-linking builds the content web).
- End actionable sections with a concrete next step.

### Examples

**Good:** "Don't buy a SIM at the airport - it's 3x more expensive. Walk to any Turkcell store in Kadikoy and get the tourist pack for 250 TL (~$8)."

**Bad:** "It is advisable to purchase your SIM card from a city store rather than at the airport, as prices tend to be more competitive in non-airport locations."

**Good:** "We recommend starting in Kadikoy if you want a calm routine with great cafes."

**Bad:** "Kadikoy is widely considered to be an optimal neighborhood selection for digital nomads seeking a balanced lifestyle experience."

## Versioning & Changelog

- Follow [Semantic Versioning](https://semver.org/): MAJOR.MINOR.PATCH
- Always check the latest version in `CHANGELOG.md` before adding a new entry
- Increment the PATCH version for bug fixes and small improvements
- Increment the MINOR version for new features or significant changes
- Never reuse or duplicate an existing version number
- When updating the changelog, add entries under the correct existing version or create a new version section if needed
- When creating git tags, always check existing tags with `git tag -l` first
