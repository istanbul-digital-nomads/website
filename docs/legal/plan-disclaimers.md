# Plan Disclaimers - Per-Vibe Copy

> **Status:** Working draft, ready for review. Each plan in `/today`,
> `/plans`, and `/plans/[id]` shows the disclaimer for its primary `vibe`
> on the plan card. Attendees must check "I've read and accept the
> disclaimer" before joining a paid plan; for budget plans, the disclaimer
> is shown but acceptance is implicit. Last revised: 2026-05-19.
>
> Companion docs: [Terms & Conditions](terms.md) ·
> [Community Guidelines](community-guidelines.md)

---

## How these are used

Every `plan_stop` has a `vibe`. The plan's primary vibe is the vibe of its
first stop. The disclaimer below for that vibe is shown:

1. **On the plan card** in `/today` and `/plans` - as a small italic note
   under the plan summary.
2. **On `/plans/[id]`** - as a checkbox attendees must tick before they
   can RSVP (free plans) or buy a ticket (paid plans).
3. **In the post-RSVP confirmation email** - the disclaimer is repeated
   alongside the date, time, location, and host's Telegram handle.

Hosts can add **additional plan-specific disclaimer text** when creating
the plan (e.g. "this hike has a 200m elevation gain, bring 2L of water").
This appears alongside, not in place of, the vibe disclaimer.

All disclaimers must be translated to all 5 locales (en/tr/fa/ar/ru)
before launch.

---

## `focus` - Solo deep work, same space

> This is a quiet coworking plan. The host has booked a spot at a venue
> they trust for wifi and outlets. Bring your laptop, your headphones,
> and your own focus. The host isn't running the session - they're just
> the reason you're all there.
>
> The venue may charge for coffee, food, or seating - that's between you
> and the venue, not part of any ticket price.

## `cowork` - Group coworking, conversational

> A coworking plan with some chat. The host has picked a venue that
> tolerates a small group talking quietly. Expect to work for stretches
> and break for coffee.
>
> The venue may charge for coffee, food, or seating. The host doesn't
> control wifi quality or noise level - if it's bad on the day, that's
> Istanbul.

## `social` - Hanging out, no agenda

> A social meetup. The host's job is to be there and make introductions.
> Your job is to show up at the time listed and be a decent person.
>
> Whatever you spend at the venue is yours. The host is not running a
> tab.

## `meal` - Food-centered plan

> The host has picked a place to eat. The plan listing tells you
> approximately what a meal there costs - read the budget field before
> joining if cost matters to you.
>
> Dietary restrictions: tell the host **before** the plan starts, not at
> the table. Allergies that require an EpiPen are your responsibility -
> ask about ingredients yourself; the host can't guarantee what's in
> someone else's kitchen.

## `after-work` - Drinks, evening, often involves alcohol

> This plan happens at a bar or a venue where alcohol is served. **Drink
> responsibly.** The host is not responsible for what you drink or for
> getting you home.
>
> No one under 18 may attend an `after-work` plan, even though the legal
> drinking age in Turkey is 18 - we apply 18+ as a hard floor for our own
> liability. Hosts must check ID if unsure.
>
> Don't drive after the plan. Use a taxi (BiTaksi, Uber, iTaksi) or the
> Metro / ferry. Istanbul drunk driving enforcement is real and
> consequences are severe (license suspension, fines, potential jail).

## `outdoor` - Walks, hikes, bike rides, ferry trips, anything outside

> An outdoor plan. **Read the host's description carefully** for
> difficulty, distance, pace, terrain, and required gear. If the host
> says 12km and 200m elevation, that's what you're committing to - if
> that's not for you, don't join.
>
> Weather: if the host cancels for weather, you get a full refund (for
> ticketed plans). If the host keeps the plan but you decide not to
> attend because of weather, the 24h refund policy applies.
>
> Health: don't join an `outdoor` plan if you have a medical condition
> that means moderate physical activity is risky. Ask your doctor, not
> the host.
>
> **Risk:** outdoor plans carry real risk - twisted ankles, sunstroke,
> dehydration, falls, water. The host is not a certified guide unless
> their badge says so (Gold guides include a certification field). You
> attend at your own risk. Istanbul Nomads is not responsible for
> injuries, illness, or property loss during outdoor plans.

## `culture` - Concerts, gigs, museum visits, neighborhood walking tours

> A culture plan. The host is taking you to (or meeting you at) a venue,
> exhibition, performance, or organized walk. The host's fee covers the
> host's time and guidance.
>
> **Venue tickets** (concert ticket, museum entry, walking-tour group
> entry) are usually **not included** in the host's fee unless the plan
> listing explicitly says so. Read the budget and entry-fee description
> carefully.
>
> Photography rules vary by venue. Don't assume.

## `admin` - Visa office, govt office, ikamet, residency permit, bank account opening

> An admin / paperwork plan. The host (a verified agent or local guide
> with admin experience) accompanies you to a Turkish government office,
> bank, notary, or similar institution to help you navigate the process.
>
> **What this is:** translation help, queue navigation, knowing which
> window to go to, knowing what documents you need, knowing the unwritten
> rules.
>
> **What this is not:** legal advice. Your host is not a Turkish lawyer
> unless their profile says so (and even then their advice is informal,
> not formal legal counsel). For binding legal issues - visa rejection
> appeals, deportation defense, residency permit denials, criminal
> matters - hire an actual immigration lawyer.
>
> The host **cannot guarantee** that your application will be approved,
> that the office will be open, that the official on duty will be in a
> good mood, or that the queue won't be three hours. Turkish bureaucracy
> has its own logic.
>
> Bring your own documents. Bring photocopies. Bring cash for fees.
> Wear something modest if you're going to a government office.

---

## Common to every plan (shown alongside the vibe-specific text)

> **Real-life meetup disclaimer.** Istanbul Nomads connects you with other
> members; we are not present at the plan and we don't supervise it. The
> host is not our employee or representative. Verification badges signal
> identity verification, not safety vetting. Use your judgment, trust your
> gut, and tell us afterward if anything goes wrong:
> report@istanbulnomads.com.
>
> **In an emergency, call 112** (Turkish ambulance / fire / police). For
> non-emergency safety issues at a plan in progress, the fastest way to
> reach us is via the community Telegram - any organizer can help.

---

## Drafting checklist (remove before publication)

- [ ] Lawyer review of the `outdoor` risk language - is "attend at your
      own risk" enforceable under Turkish consumer protection law, or
      do we need a stronger affirmative-consent flow?
- [ ] Lawyer review of the `after-work` 18+ floor - confirm this matches
      Turkish alcohol service law (it does at the venue level, but our
      enforcement burden may need clarification).
- [ ] Lawyer review of the `admin` "not legal advice" language - confirm
      this is enough to protect both us and the agent from giving advice
      that turns out to be wrong.
- [ ] Translation into all 5 locales. Cultural sensitivity pass on the
      `after-work` (alcohol) and `admin` (bureaucracy) texts for Persian,
      Arabic, and Russian audiences.
- [ ] Test the checkbox UX on `/plans/[id]` - the disclaimer should be
      readable on mobile without scrolling, or the join button should be
      blocked until the user scrolls past it.
