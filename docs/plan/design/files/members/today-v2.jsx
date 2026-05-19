/* Today's plans · full standalone implementation in the hero language.
   Self-contained — does not depend on tokens.css or shared.jsx. */

const T = {
  deepWater: '#06101f',
  water:     '#0a1a2f',
  waterHi:   '#13294a',
  waterEdge: '#1c3554',
  gold:      '#f4b860',
  goldSoft:  '#e8a647',
  goldDim:   'rgba(244,184,96,0.55)',
  goldFaint: 'rgba(244,184,96,0.28)',
  rose:      '#e87a5d',
  roseDim:   'rgba(232,122,93,0.55)',
  violet:    '#a78bfa',
  sky:       '#7dd3fc',
  butter:    '#fde68a',
  cream:     '#f6ecd9',
  textDim:   'rgba(246,236,217,0.7)',
  textMute:  'rgba(246,236,217,0.5)',
  textFaint: 'rgba(246,236,217,0.32)',
  live:      '#86efac',
  liveSoft:  'rgba(134,239,172,0.12)',
  liveEdge:  'rgba(134,239,172,0.35)',
  borderHi:  'rgba(244,184,96,0.20)',
  border:    'rgba(246,236,217,0.10)',
  borderDim: 'rgba(246,236,217,0.06)',
};

const TS = "'Instrument Serif', Georgia, serif";
const TG = "'Space Grotesk', system-ui, -apple-system, sans-serif";

/* ── atoms ───────────────────────────────────────────────────────── */

const TAvatar = ({initials, hue, size = 28, online = false}) => (
  <div style={{
    width: size, height: size, borderRadius: size/2, position: 'relative', flexShrink: 0,
    background: `linear-gradient(135deg, ${hue}, ${T.rose})`,
    boxShadow: `0 0 0 0.5px ${T.borderHi}, inset 0 0 0 0.5px rgba(255,255,255,0.12)`,
    display: 'grid', placeItems: 'center',
    fontFamily: TG, fontSize: size * 0.36, fontWeight: 600, color: T.deepWater,
    letterSpacing: '-0.01em',
  }}>
    {initials}
    {online && <span style={{
      position: 'absolute', bottom: -1, right: -1,
      width: size * 0.30, height: size * 0.30, borderRadius: '50%',
      background: T.live, boxShadow: `0 0 0 2px ${T.water}, 0 0 8px ${T.live}`,
    }}/>}
  </div>
);

const TStack = ({attendees, total, size = 26, max = 5}) => {
  const shown = attendees.slice(0, max);
  const overflow = total - shown.length;
  return (
    <div style={{display: 'inline-flex', alignItems: 'center'}}>
      {shown.map((a, i) => (
        <span key={i} style={{
          marginLeft: i === 0 ? 0 : -8,
          boxShadow: `0 0 0 2px ${T.water}`, borderRadius: '50%', zIndex: 10 - i,
        }}>
          <TAvatar initials={a.initials} hue={a.hue} size={size}/>
        </span>
      ))}
      {overflow > 0 && (
        <span style={{
          marginLeft: -8, width: size, height: size, borderRadius: size/2,
          background: T.waterHi, border: `0.5px solid ${T.border}`,
          display: 'grid', placeItems: 'center', boxShadow: `0 0 0 2px ${T.water}`,
          fontFamily: TG, fontSize: 10, fontWeight: 600, color: T.textDim,
        }}>+{overflow}</span>
      )}
    </div>
  );
};

const TEyebrow = ({label, kicker, color = T.gold}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
    <span style={{width: 24, height: 1, background: color, opacity: 0.6}}/>
    <span style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color, fontWeight: 600}}>{label}</span>
    {kicker && <span style={{fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.textFaint, fontWeight: 600}}>· {kicker}</span>}
  </div>
);

const TChip = ({children, on, color = T.gold}) => (
  <button style={{
    padding: '6px 12px', borderRadius: 999,
    border: `0.5px solid ${on ? color : T.border}`,
    background: on ? `${color}1A` : 'transparent',
    fontSize: 11, letterSpacing: '0.04em', color: on ? color : T.textDim,
    fontFamily: TG, whiteSpace: 'nowrap',
  }}>{children}</button>
);

const TPip = ({label, color = T.live}) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '5px 10px', borderRadius: 999,
    background: `${color}1A`, border: `0.5px solid ${color}59`,
    fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
    color, fontWeight: 600, whiteSpace: 'nowrap',
  }}>
    <span style={{width: 6, height: 6, borderRadius: 3, background: color, boxShadow: `0 0 8px ${color}`}}/>
    {label}
  </span>
);

/* ── data ──────────────────────────────────────────────────────────── */

const PLANS = {
  morning: [
    {
      type: 'nomad', time: '07:00', endTime: '08:00', tone: T.sky,
      kindLabel: 'walk', title: 'Moda sahil walk · sunrise',
      host: 'Rin H.', hostInitials: 'RH', hostHue: T.violet,
      duration: '1h', stops: 1, hood: 'Moda',
      agenda: [{time: '07:00', title: 'Moda promenade, north end', place: 'Moda Pier', note: '~3 km loop'}],
      filled: 2, seats: 5,
      attendees: [
        {initials: 'RH', hue: T.violet, name: 'Rin H.', role: 'HOST'},
        {initials: 'AT', hue: T.live, name: 'Aris T.', role: 'JOINED', joinedAt: '06:21'},
      ],
      budget: 0, sub: 'walking only',
    },
    {
      type: 'guide', time: '08:00', endTime: '12:00', tone: T.gold,
      kindLabel: 'ferry trip', title: 'Old Kadıköy · ferry, breakfast, coffee crawl',
      host: 'Cem K.', hostInitials: 'CK', hostHue: T.gold,
      duration: '4h', stops: 4, hood: 'Karaköy',
      verified: '★ 4.9 · 47 trips',
      expanded: true,
      agenda: [
        {time: '08:00', title: 'Meet at Kadıköy iskele · 08:00 ferry to Karaköy', place: 'Kadıköy iskele', note: 'tea on the deck', cost: '₺30'},
        {time: '08:45', title: 'Breakfast spread at Van Kahvaltı Evi', place: 'Karaköy', note: '7 plates, çay', cost: '₺280'},
        {time: '10:30', title: 'Walk back · Galata stairs + Şişhane lookout', place: 'Galata', note: 'photo stops welcome', cost: 'free'},
        {time: '11:30', title: 'Third-wave coffee tasting at Geyik', place: 'Tophane', note: '2 origins', cost: '₺140'},
      ],
      filled: 8, seats: 12,
      attendees: [
        {initials: 'CK', hue: T.gold, name: 'Cem K.', role: 'HOST'},
        {initials: 'AV', hue: T.sky, name: 'Ana V.', role: 'JOINED'},
        {initials: 'BJ', hue: T.rose, name: 'Bea J.', role: 'JOINED'},
        {initials: 'DA', hue: T.live, name: 'Deniz A.', role: 'JOINED'},
        {initials: 'LM', hue: T.butter, name: 'Lina M.', role: 'JOINED'},
        {initials: 'MK', hue: T.rose, name: 'Maya K.', role: 'JOINED'},
        {initials: 'PR', hue: T.live, name: 'Pina R.', role: 'JOINED'},
        {initials: 'YF', hue: T.violet, name: 'Yuki F.', role: 'JOINED'},
      ],
      fee: 450, usd: 13, feeSub: '4 stops · 4 hours',
      includes: ['4 stops, all transit covered', 'Breakfast + 2 coffee tastings', 'English + Turkish narration', 'Group cap at 12, never more'],
      languages: ['EN', 'TR', 'DE'],
      description: 'A morning that ends with you back in Kadıköy by lunch, knowing the route well enough to do it alone next week.',
    },
    {
      type: 'nomad', time: '09:30', endTime: '11:00', tone: T.live,
      kindLabel: 'market', title: 'Salı pazarı walk · Tuesday market',
      host: 'Lina M.', hostInitials: 'LM', hostHue: T.butter,
      duration: '1.5h', stops: 2, hood: 'Yeldeğirmeni',
      agenda: [
        {time: '09:30', title: 'Meet at the entrance', place: 'Yeldeğirmeni', note: 'grocery list welcome'},
        {time: '10:45', title: 'Coffee after, on the curb', place: 'Bahariye', note: '~₺60 each'},
      ],
      filled: 2, seats: 4,
      attendees: [
        {initials: 'LM', hue: T.butter, name: 'Lina M.', role: 'HOST'},
        {initials: 'MA', hue: T.sky, name: 'Mira A.', role: 'JOINED', joinedAt: '07:48'},
      ],
      budget: 60, sub: 'coffee after',
    },
    {
      type: 'nomad', time: '10:30', endTime: '13:00', tone: T.rose,
      kindLabel: 'co-work', title: "Walter's window seat · two calls, then ferry",
      host: 'Maya K.', hostInitials: 'MK', hostHue: T.rose,
      duration: '2.5h', stops: 2, hood: 'Bahariye → Karaköy',
      mine: true, expanded: true,
      agenda: [
        {time: '10:30', title: "Walter's, window seat · calls + writing", place: 'Bahariye 14', note: 'good wifi, quiet morning', cost: '₺80'},
        {time: '13:00', title: 'Ferry to Karaköy, tea on deck', place: 'Kadıköy iskele', note: '22 min crossing', cost: '₺37'},
      ],
      filled: 2, seats: 3,
      attendees: [
        {initials: 'MK', hue: T.rose, name: 'Maya K.', role: 'HOST'},
        {initials: 'YF', hue: T.violet, name: 'Yuki F.', role: 'JOINED', joinedAt: '08:52'},
      ],
      budget: 117, sub: 'coffee + ferry',
      description: "A normal Friday. I have two calls between 10:30 and 12:30, then I'm walking onto the 13:00 ferry. You're welcome at either or both.",
    },
    {
      type: 'nomad', time: '11:00', endTime: '11:45', tone: T.butter,
      kindLabel: 'coffee', title: 'Kahve Dünyası · third-wave tasting',
      host: 'Cem K.', hostInitials: 'CK', hostHue: T.gold,
      duration: '45min', stops: 1, hood: 'Moda',
      agenda: [{time: '11:00', title: 'Tasting flight · light-roast', place: 'Moda Cad. 47', note: '~₺120 each', cost: '₺120'}],
      filled: 1, seats: 4,
      attendees: [{initials: 'CK', hue: T.gold, name: 'Cem K.', role: 'HOST'}],
      budget: 120, sub: 'tasting only',
    },
  ],
  afternoon: [
    {
      type: 'guide', time: '13:00', endTime: '16:00', tone: T.rose,
      kindLabel: 'food walk', title: 'Çiya + market lane · taste, eat, walk',
      host: 'Sibel Ö.', hostInitials: 'SÖ', hostHue: T.rose,
      duration: '3h', stops: 5, hood: 'Kadıköy',
      verified: '★ 5.0 · 28 trips',
      agenda: [
        {time: '13:00', title: 'Meet at Çiya Sofrası', place: 'Caferağa Mah.', note: 'Anatolian regional menu', cost: 'free'},
        {time: '13:15', title: 'Three plates each · lokanta-style', place: 'Çiya Sofrası', note: 'family-style', cost: '₺240'},
        {time: '14:30', title: 'Walk down Güneşli Bahçe Sokak', place: 'Kadıköy', note: 'spice + cheese stops', cost: 'free'},
        {time: '15:00', title: 'Rare halva tasting', place: 'Hafız Mustafa', note: '4 kinds', cost: '₺60'},
        {time: '15:45', title: 'Turkish coffee at Fazıl Bey', place: 'Serasker Cad.', note: '~₺55', cost: '₺55'},
      ],
      filled: 6, seats: 10,
      attendees: [
        {initials: 'SÖ', hue: T.rose, name: 'Sibel Ö.', role: 'HOST'},
        {initials: 'AR', hue: T.sky, name: 'Ari R.', role: 'JOINED'},
        {initials: 'NK', hue: T.live, name: 'Nora K.', role: 'JOINED'},
        {initials: 'JT', hue: T.gold, name: 'Jon T.', role: 'JOINED'},
        {initials: 'EB', hue: T.violet, name: 'Esra B.', role: 'JOINED'},
        {initials: 'TM', hue: T.butter, name: 'Tom M.', role: 'JOINED'},
      ],
      fee: 380, usd: 11, feeSub: '5 stops · food + guide',
      includes: ['All food at the listed stops', 'Vegetarian options at every stop', 'Turkish narration with English notes', 'Cap at 10 · no walk-ins'],
      languages: ['TR', 'EN'],
    },
    {
      type: 'nomad', time: '14:00', endTime: '18:00', tone: T.sky,
      kindLabel: 'co-work', title: 'Library room · deep work, silent',
      host: 'Ana V.', hostInitials: 'AV', hostHue: T.sky,
      duration: '4h', stops: 1, hood: 'Kadıköy',
      agenda: [{time: '14:00', title: 'Quiet room, side entrance', place: 'Kadıköy Belediye Library', note: 'phones on silent'}],
      filled: 3, seats: 6,
      attendees: [
        {initials: 'AV', hue: T.sky, name: 'Ana V.', role: 'HOST'},
        {initials: 'PR', hue: T.live, name: 'Pina R.', role: 'JOINED'},
        {initials: 'MA', hue: T.cream, name: 'Mira A.', role: 'JOINED'},
      ],
      budget: 0, sub: 'public library',
    },
    {
      type: 'nomad', time: '15:30', endTime: '17:30', tone: T.live,
      kindLabel: 'errand', title: 'Residence permit office · go together',
      host: 'Sara L.', hostInitials: 'SL', hostHue: T.live,
      duration: '2h', stops: 1, hood: 'Üsküdar',
      agenda: [{time: '15:30', title: 'Meet at the metro exit, then walk over', place: 'Üsküdar Göç İdaresi', note: 'help with TR forms'}],
      filled: 2, seats: 3,
      attendees: [
        {initials: 'SL', hue: T.live, name: 'Sara L.', role: 'HOST'},
        {initials: 'BJ', hue: T.rose, name: 'Bea J.', role: 'JOINED', joinedAt: '12:01'},
      ],
      budget: 0, sub: 'bring TL for fees',
    },
    {
      type: 'guide', time: '16:00', endTime: '18:00', tone: T.violet,
      kindLabel: 'boat', title: 'Private Bosphorus boat · sunset, 6 seats',
      host: 'Kaptan Eren', hostInitials: 'KE', hostHue: T.sky,
      duration: '2h', stops: 3, hood: 'Bostancı',
      verified: '★ 4.95 · 112 trips',
      agenda: [
        {time: '16:00', title: 'Board at Bostancı marina', place: 'Bostancı', note: 'tea aboard, life jackets fitted', cost: 'free'},
        {time: '16:30', title: 'Cruise past Princes Islands', place: 'Adalar', note: '15 min stop near Heybeliada', cost: 'free'},
        {time: '17:30', title: 'Anchor for sunset, return', place: 'Bostancı', note: 'Marmara golden hour', cost: 'free'},
      ],
      filled: 4, seats: 6,
      attendees: [
        {initials: 'KE', hue: T.sky, name: 'Kaptan Eren', role: 'HOST'},
        {initials: 'AR', hue: T.violet, name: 'Ari R.', role: 'JOINED'},
        {initials: 'JT', hue: T.gold, name: 'Jon T.', role: 'JOINED'},
        {initials: 'NK', hue: T.live, name: 'Nora K.', role: 'JOINED'},
      ],
      fee: 1200, usd: 35, feeSub: '2 hours · 6-seat cap',
      includes: ['Life jackets, all sizes', 'Tea + water aboard', 'Captain · 18 years on these waters', 'Cancel-free for weather'],
      languages: ['TR', 'EN'],
    },
    {
      type: 'nomad', time: '17:35', endTime: '21:30', tone: T.gold,
      kindLabel: 'ferry', title: 'Karaköy ferry · golden hour + dinner',
      host: 'Mira V.', hostInitials: 'MV', hostHue: T.gold,
      duration: '4h', stops: 3, hood: 'Kadıköy → Cihangir',
      expanded: true,
      agenda: [
        {time: '17:35', title: 'Ferry to Karaköy · upstairs deck', place: 'Kadıköy iskele', note: 'cameras welcome', cost: '₺37'},
        {time: '18:30', title: 'Walk Karaköy → Cihangir', place: 'Cihangir', note: '~40 min uphill', cost: 'free'},
        {time: '19:30', title: 'Dinner at Susam, communal table', place: 'Susam Sokak', note: '~₺280 each', cost: '₺280'},
      ],
      filled: 4, seats: 8,
      attendees: [
        {initials: 'MV', hue: T.gold, name: 'Mira V.', role: 'HOST'},
        {initials: 'LM', hue: T.butter, name: 'Lina M.', role: 'JOINED'},
        {initials: 'CK', hue: T.gold, name: 'Cem K.', role: 'JOINED'},
        {initials: 'YF', hue: T.violet, name: 'Yuki F.', role: 'JOINED'},
      ],
      budget: 317, sub: 'ferry + dinner',
    },
  ],
  evening: [
    {
      type: 'nomad', time: '19:00', endTime: '21:00', tone: T.rose,
      kindLabel: 'dinner', title: 'Pide at Bambi · just opened, walk-up only',
      host: 'Cem K.', hostInitials: 'CK', hostHue: T.gold,
      duration: '2h', stops: 1, hood: 'Caferağa',
      agenda: [{time: '19:00', title: 'Pide tasting · 4 kinds, family style', place: 'Caferağa Mah.', note: '~₺180 each', cost: '₺180'}],
      filled: 3, seats: 5,
      attendees: [
        {initials: 'CK', hue: T.gold, name: 'Cem K.', role: 'HOST'},
        {initials: 'RH', hue: T.violet, name: 'Rin H.', role: 'JOINED'},
        {initials: 'AT', hue: T.live, name: 'Aris T.', role: 'JOINED'},
      ],
      budget: 180, sub: 'pide + tea',
    },
    {
      type: 'nomad', time: '20:00', endTime: '23:00', tone: T.violet,
      kindLabel: 'drinks', title: 'Roof drinks, slow conversation',
      host: 'Rin H.', hostInitials: 'RH', hostHue: T.violet,
      duration: '3h', stops: 1, hood: 'Karaköy',
      kind: 'private',
      agenda: [{time: '20:00', title: 'Private rooftop, byob welcome', place: 'Karaköy', note: 'invited list only'}],
      filled: 4, attendees: [],
      budget: 0, sub: 'byob',
    },
    {
      type: 'guide', time: '21:30', endTime: '00:30', tone: T.butter,
      kindLabel: 'music', title: 'Bar Babylon · jazz night with reserved seats',
      host: 'Ahmet S.', hostInitials: 'AS', hostHue: T.butter,
      duration: '3h', stops: 2, hood: 'Asmalımescit',
      verified: '★ 4.8 · 19 nights',
      agenda: [
        {time: '21:30', title: 'Reserved table, second set starts 22:00', place: 'Asmalımescit', note: 'cover included', cost: 'free'},
        {time: '23:30', title: 'Last drink, ferry back together', place: 'Karaköy iskele', note: 'group walks to 23:50 ferry', cost: '₺80'},
      ],
      filled: 5, seats: 8,
      attendees: [
        {initials: 'AS', hue: T.butter, name: 'Ahmet S.', role: 'HOST'},
        {initials: 'PR', hue: T.live, name: 'Pina R.', role: 'JOINED'},
        {initials: 'BJ', hue: T.rose, name: 'Bea J.', role: 'JOINED'},
        {initials: 'SL', hue: T.live, name: 'Sara L.', role: 'JOINED'},
        {initials: 'TM', hue: T.rose, name: 'Tom M.', role: 'JOINED'},
      ],
      fee: 280, usd: 8, feeSub: 'reserved table · cover + 1 drink',
      includes: ['Reserved table for 8', 'First drink', 'Group ferry back at 23:50', 'Cancel up to 6h before'],
      languages: ['EN', 'TR'],
    },
  ],
};

/* ── PlanCard ──────────────────────────────────────────────────────── */

const PlanCard = ({p}) => {
  const isGuide = p.type === 'guide';
  const isMine = p.mine;
  const cardBg = isMine
    ? `linear-gradient(135deg, rgba(244,184,96,0.05), rgba(232,122,93,0.05))`
    : T.water;
  const cardBorder = isMine
    ? `0.5px solid ${T.gold}`
    : `0.5px solid ${T.border}`;

  return (
    <div style={{
      position: 'relative',
      background: cardBg,
      border: cardBorder,
      borderRadius: 14,
      padding: '22px 24px',
      display: 'grid',
      gridTemplateColumns: '92px 1fr 280px',
      gap: 24,
    }}>
      {/* time gutter */}
      <div style={{borderRight: `0.5px solid ${T.border}`, paddingRight: 16}}>
        <div style={{fontFamily: TS, fontSize: 32, color: T.cream, letterSpacing: '-0.02em', lineHeight: 1}}>{p.time}</div>
        <div style={{fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.textFaint, fontWeight: 600, marginTop: 6}}>→ {p.endTime}</div>
        <div style={{marginTop: 14, display: 'flex', flexDirection: 'column', gap: 4}}>
          <div style={{fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: p.tone, fontWeight: 600}}>{p.duration}</div>
          <div style={{fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.textFaint, fontWeight: 600}}>{p.stops} {p.stops === 1 ? 'stop' : 'stops'}</div>
        </div>
      </div>

      {/* body */}
      <div>
        {/* kind row */}
        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12}}>
          <span style={{
            padding: '4px 10px', borderRadius: 999,
            background: `${p.tone}1A`, border: `0.5px solid ${p.tone}59`,
            fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: p.tone, fontWeight: 600,
          }}>{p.kindLabel}</span>
          {isGuide ? (
            <span style={{fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, fontWeight: 600}}>
              ★ Local guide · {p.verified}
            </span>
          ) : isMine ? (
            <span style={{fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, fontWeight: 600}}>
              ↳ You're hosting
            </span>
          ) : (
            <span style={{fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.textFaint, fontWeight: 600}}>
              Nomad plan
            </span>
          )}
          <span style={{fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.textFaint, fontWeight: 600, marginLeft: 'auto'}}>
            {p.hood}
          </span>
        </div>

        <h3 style={{
          fontFamily: TS, fontSize: 24, lineHeight: 1.15, letterSpacing: '-0.015em',
          color: T.cream, margin: 0, fontWeight: 400,
        }}>{p.title}</h3>

        {p.description && (
          <p style={{fontFamily: TS, fontSize: 15, lineHeight: 1.5, color: T.textDim, margin: '12px 0 0', letterSpacing: '-0.005em'}}>
            {p.description}
          </p>
        )}

        {/* host row */}
        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 16}}>
          <TAvatar initials={p.hostInitials} hue={p.hostHue} size={24}/>
          <span style={{fontSize: 13, color: T.cream, fontFamily: TG}}>{p.host}</span>
          {isGuide && (
            <span style={{fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.goldDim, fontWeight: 600}}>
              · {(p.languages || []).join(' / ')}
            </span>
          )}
        </div>

        {/* agenda — when expanded */}
        {p.expanded && p.agenda && (
          <div style={{marginTop: 18, paddingTop: 16, borderTop: `0.5px solid ${T.borderDim}`}}>
            <div style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.textFaint, fontWeight: 600, marginBottom: 12}}>
              Agenda
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 0}}>
              {p.agenda.map((s, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '54px 1fr auto', gap: 14, alignItems: 'start',
                  padding: '10px 0',
                  borderTop: i === 0 ? 'none' : `0.5px solid ${T.borderDim}`,
                }}>
                  <div style={{fontFamily: TG, fontSize: 12, color: T.gold, fontWeight: 600, fontVariantNumeric: 'tabular-nums'}}>{s.time}</div>
                  <div>
                    <div style={{fontSize: 13.5, color: T.cream, fontFamily: TG, lineHeight: 1.35}}>{s.title}</div>
                    <div style={{fontSize: 11, color: T.textFaint, marginTop: 3, letterSpacing: '0.04em'}}>{s.place} · {s.note}</div>
                  </div>
                  <div style={{fontSize: 11, color: s.cost === 'free' ? T.live : T.textMute, fontFamily: TG, fontWeight: 500, fontVariantNumeric: 'tabular-nums'}}>
                    {s.cost}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* expand cue */}
        {!p.expanded && p.agenda && p.agenda.length > 1 && (
          <button style={{
            marginTop: 14, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: T.gold, fontWeight: 600, fontFamily: TG, display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            Expand · {p.agenda.length} stops <span>↓</span>
          </button>
        )}

        {/* includes for guide */}
        {p.expanded && isGuide && p.includes && (
          <div style={{marginTop: 18, paddingTop: 16, borderTop: `0.5px solid ${T.borderDim}`}}>
            <div style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.textFaint, fontWeight: 600, marginBottom: 12}}>
              What's included
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px'}}>
              {p.includes.map((it, i) => (
                <div key={i} style={{fontSize: 13, color: T.textDim, fontFamily: TG, display: 'flex', alignItems: 'baseline', gap: 8}}>
                  <span style={{color: T.gold, fontSize: 10}}>✓</span>{it}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* right rail */}
      <aside style={{borderLeft: `0.5px solid ${T.border}`, paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 16}}>
        {/* seats */}
        <div>
          <div style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.textFaint, fontWeight: 600, marginBottom: 10}}>
            Seats
          </div>
          {p.kind === 'private' ? (
            <div style={{fontFamily: TS, fontSize: 22, color: T.cream, letterSpacing: '-0.01em'}}>
              Private · invited
            </div>
          ) : (
            <>
              <div style={{display: 'flex', alignItems: 'baseline', gap: 8}}>
                <span style={{fontFamily: TS, fontSize: 32, color: T.cream, letterSpacing: '-0.02em', lineHeight: 1}}>{p.filled}</span>
                <span style={{fontSize: 14, color: T.textMute, fontFamily: TG}}>/ {p.seats}</span>
                <span style={{fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.live, fontWeight: 600, marginLeft: 'auto'}}>
                  {p.seats - p.filled} open
                </span>
              </div>
              {/* progress bar */}
              <div style={{height: 3, background: T.borderDim, borderRadius: 2, marginTop: 12, overflow: 'hidden'}}>
                <div style={{
                  width: `${(p.filled / p.seats) * 100}%`, height: '100%',
                  background: `linear-gradient(90deg, ${p.tone}, ${T.gold})`,
                }}/>
              </div>
              {/* attendees */}
              {p.attendees && p.attendees.length > 0 && (
                <div style={{marginTop: 14}}>
                  <TStack attendees={p.attendees} total={p.filled}/>
                </div>
              )}
            </>
          )}
        </div>

        {/* cost */}
        <div style={{paddingTop: 14, borderTop: `0.5px solid ${T.borderDim}`}}>
          <div style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.textFaint, fontWeight: 600, marginBottom: 10}}>
            {isGuide ? 'Fee · per person' : 'Budget'}
          </div>
          {isGuide ? (
            <>
              <div style={{display: 'flex', alignItems: 'baseline', gap: 10}}>
                <span style={{fontFamily: TS, fontSize: 32, color: T.gold, letterSpacing: '-0.02em', lineHeight: 1}}>₺{p.fee}</span>
                <span style={{fontSize: 12, color: T.textMute, fontFamily: TG}}>≈ ${p.usd}</span>
              </div>
              <div style={{fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.textFaint, fontWeight: 600, marginTop: 6}}>
                {p.feeSub}
              </div>
            </>
          ) : (
            <>
              <div style={{fontFamily: TS, fontSize: 28, color: p.budget === 0 ? T.live : T.cream, letterSpacing: '-0.02em', lineHeight: 1}}>
                {p.budget === 0 ? 'Free' : `₺${p.budget}`}
              </div>
              <div style={{fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.textFaint, fontWeight: 600, marginTop: 6}}>
                ↳ {p.sub}
              </div>
            </>
          )}
        </div>

        {/* CTA */}
        <div style={{marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8}}>
          {isMine ? (
            <button style={{
              padding: '12px 18px', borderRadius: 999, background: T.gold, color: T.deepWater,
              fontSize: 13, fontWeight: 600, fontFamily: TG, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>Edit plan <span>→</span></button>
          ) : p.kind === 'private' ? (
            <button style={{
              padding: '12px 18px', borderRadius: 999, border: `0.5px solid ${T.border}`, color: T.textMute,
              fontSize: 13, fontFamily: TG, textAlign: 'left',
            }}>Invite-only</button>
          ) : (
            <>
              <button style={{
                padding: '12px 18px', borderRadius: 999, background: isGuide ? T.gold : 'transparent',
                color: isGuide ? T.deepWater : T.cream,
                border: isGuide ? 'none' : `0.5px solid ${T.gold}`,
                fontSize: 13, fontWeight: 600, fontFamily: TG,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                {isGuide ? 'Reserve a seat' : 'Join plan'} <span>→</span>
              </button>
              <button style={{
                padding: '10px 18px', borderRadius: 999, border: `0.5px solid ${T.border}`, color: T.textDim,
                fontSize: 12, fontFamily: TG,
              }}>
                Message {p.host.split(' ')[0]}
              </button>
            </>
          )}
        </div>
      </aside>
    </div>
  );
};

/* ── Section header ────────────────────────────────────────────────── */

const SectionHead = ({label, kicker, range}) => (
  <div style={{
    display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 24, alignItems: 'baseline',
    padding: '32px 0 18px',
    borderBottom: `0.5px solid ${T.border}`, marginBottom: 16,
  }}>
    <div>
      <TEyebrow label={label}/>
      <h2 style={{fontFamily: TS, fontSize: 38, letterSpacing: '-0.02em', color: T.cream, margin: '10px 0 0', fontWeight: 400, lineHeight: 1}}>
        <em style={{color: T.gold}}>{kicker.split('.')[0]}.</em>{kicker.split('.').slice(1).join('.')}
      </h2>
    </div>
    <div/>
    <div style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.textFaint, fontWeight: 600, textAlign: 'right'}}>
      {range}
    </div>
  </div>
);

/* ── Nav + Page ────────────────────────────────────────────────────── */

const TodayNav = () => (
  <div style={{
    padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    borderBottom: `0.5px solid ${T.border}`,
    background: 'rgba(6,16,31,0.7)', backdropFilter: 'blur(10px)',
    position: 'sticky', top: 0, zIndex: 5,
  }}>
    <div style={{display: 'flex', alignItems: 'center', gap: 32}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: `linear-gradient(135deg, ${T.gold}, ${T.rose})`,
          display: 'grid', placeItems: 'center',
          fontFamily: TS, fontSize: 18, fontStyle: 'italic',
          color: T.deepWater, letterSpacing: '-0.04em',
        }}>iN</div>
        <span style={{fontSize: 14, fontWeight: 500, letterSpacing: '-0.01em', color: T.cream, fontFamily: TG}}>
          istanbulnomads
        </span>
      </div>
      <nav style={{display: 'flex', gap: 24, fontSize: 13, fontFamily: TG}}>
        {[['Today', true, 13], ['Map', false], ['Events', false, 8], ['Members', false], ['Perks', false, 41]].map(([label, active, count]) => (
          <a key={label} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            color: active ? T.cream : T.textDim, position: 'relative',
          }}>
            {label}
            {count != null && (
              <span style={{
                fontSize: 10, letterSpacing: '0.04em', padding: '2px 7px', borderRadius: 999,
                background: active ? `${T.gold}1F` : T.borderDim, color: active ? T.gold : T.textMute, fontWeight: 600,
              }}>{count}</span>
            )}
            {active && <span style={{
              position: 'absolute', left: 0, right: 0, bottom: -22, height: 1, background: T.gold,
            }}/>}
          </a>
        ))}
      </nav>
    </div>
    <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
      <button style={{
        padding: '7px 12px', borderRadius: 999, border: `0.5px solid ${T.border}`,
        fontSize: 12, color: T.textMute, fontFamily: TG, display: 'flex', alignItems: 'center', gap: 10,
      }}>
        Search <span style={{padding: '1px 6px', borderRadius: 4, fontSize: 10, border: `0.5px solid ${T.borderDim}`, color: T.textMute}}>⌘K</span>
      </button>
      <TAvatar initials="MK" hue={T.rose} size={32}/>
    </div>
  </div>
);

const TodayV2Page = () => {
  const all = [...PLANS.morning, ...PLANS.afternoon, ...PLANS.evening];
  const total = all.length;
  const open = all.reduce((acc, p) => acc + (p.seats ? (p.seats - p.filled) : 0), 0);
  const guides = all.filter(p => p.type === 'guide').length;

  return (
    <div data-screen-label="Today's plans · full implementation" style={{
      width: 1440, minHeight: 5800, background: T.deepWater, color: T.cream,
      fontFamily: TG, WebkitFontSmoothing: 'antialiased', position: 'relative', overflow: 'hidden',
    }}>
      {/* background texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.55,
        backgroundImage: `
          radial-gradient(1400px 700px at 95% 0%, rgba(244,184,96,0.07), transparent 60%),
          radial-gradient(900px 600px at 0% 80%, rgba(232,122,93,0.05), transparent 60%),
          linear-gradient(180deg, ${T.deepWater}, ${T.water} 60%, ${T.deepWater})
        `,
      }}/>

      <div style={{position: 'relative'}}>
        <TodayNav/>

        {/* header */}
        <section style={{padding: '56px 40px 0'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 24, alignItems: 'center', marginBottom: 28}}>
            <TPip label="13 plans on the board · live"/>
            <span style={{height: 1, background: T.border}}/>
            <span style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.textFaint, fontWeight: 600}}>
              Mon 18 May 2026 · 09:14 local · light climbing E
            </span>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 80, alignItems: 'end'}}>
            <h1 style={{
              fontFamily: TS, fontSize: 96, lineHeight: 0.98, letterSpacing: '-0.025em',
              color: T.cream, margin: 0, fontWeight: 400, maxWidth: 820,
            }}>
              What's on the <em style={{color: T.gold}}>board</em><br/>
              today.
            </h1>
            <div style={{paddingBottom: 14}}>
              <p style={{fontSize: 16, lineHeight: 1.6, color: T.textDim, maxWidth: 460, margin: 0}}>
                Plans posted by nomads and local guides around you. Nomad plans are peer meetups with a transparent budget. Guide plans are paid little trips, capped seats, cancel-free.
              </p>
            </div>
          </div>

          {/* stats strip */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', marginTop: 56,
            border: `0.5px solid ${T.border}`, borderRadius: 14, overflow: 'hidden',
            background: 'rgba(10,26,47,0.4)',
          }}>
            {[
              {k: 'Plans on the board', v: total, sub: `${total - guides} nomads · ${guides} guides`, color: T.cream},
              {k: 'Already joined', v: 1, sub: 'the 08:00 ferry', color: T.gold},
              {k: 'Open seats', v: open, sub: `across ${total - 1} plans`, color: T.live},
              {k: 'Your plan today', v: '10:30', sub: '2/3 joined', color: T.rose},
              {k: 'Within 1.5 km', v: 11, sub: 'of Kadıköy', color: T.sky},
              {k: 'Sunset', v: '20:14', sub: '↘ light fading W', color: T.butter},
            ].map((c, i) => (
              <div key={c.k} style={{padding: '24px 24px', borderRight: i < 5 ? `0.5px solid ${T.border}` : 'none'}}>
                <div style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.goldDim, fontWeight: 600}}>{c.k}</div>
                <div style={{fontFamily: TS, fontSize: 36, color: c.color, marginTop: 12, letterSpacing: '-0.02em', lineHeight: 1}}>{c.v}</div>
                <div style={{fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.textFaint, fontWeight: 600, marginTop: 8}}>↳ {c.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* main grid */}
        <section style={{padding: '56px 40px 80px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start'}}>
          {/* BOARD */}
          <div>
            {/* filter / view bar */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
              padding: '14px 18px', borderRadius: 14, border: `0.5px solid ${T.border}`,
              background: 'rgba(10,26,47,0.4)', marginBottom: 28,
            }}>
              <div style={{display: 'flex', gap: 6, alignItems: 'center'}}>
                <span style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.textFaint, fontWeight: 600, marginRight: 4}}>View</span>
                {[['List', true], ['By time', false], ['By kind', false], ['Map', false]].map(([v, on]) => (
                  <TChip key={v} on={on}>{v}</TChip>
                ))}
              </div>
              <span style={{width: 1, height: 20, background: T.border}}/>
              <div style={{display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', flex: 1}}>
                <span style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.textFaint, fontWeight: 600, marginRight: 4}}>Host</span>
                <TChip on>All</TChip>
                <TChip>Nomads</TChip>
                <TChip color={T.gold}>★ Local guides</TChip>
                <span style={{width: 1, height: 20, background: T.border, margin: '0 4px'}}/>
                <span style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.textFaint, fontWeight: 600, marginRight: 4}}>Kind</span>
                {['Co-work', 'Food', 'Walk', 'Ferry', 'Boat', 'Music', 'Evening'].map(k => <TChip key={k}>{k}</TChip>)}
              </div>
              <span style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.gold, fontWeight: 600, whiteSpace: 'nowrap'}}>
                Sort · time ↑
              </span>
            </div>

            <SectionHead label="Morning · N° 01" kicker="Before the second coffee." range="06:00 → 12:00 · 5 plans · 1 guide trip"/>
            <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
              {PLANS.morning.map((p, i) => <PlanCard key={`m-${i}`} p={p}/>)}
            </div>

            <SectionHead label="Afternoon · N° 02" kicker="Long stretch, two ferries, a sunset cruise." range="12:00 → 18:00 · 5 plans · 2 guide trips"/>
            <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
              {PLANS.afternoon.map((p, i) => <PlanCard key={`a-${i}`} p={p}/>)}
            </div>

            <SectionHead label="Evening · N° 03" kicker="The part Istanbul does best." range="18:00 → 00:00 · 3 plans · 1 guide night"/>
            <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
              {PLANS.evening.map((p, i) => <PlanCard key={`e-${i}`} p={p}/>)}
            </div>

            <div style={{
              marginTop: 32, padding: '20px 24px', borderRadius: 14,
              border: `0.5px dashed ${T.borderHi}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.textFaint, fontWeight: 600}}>
                ↳ 13 plans · 9 nomad · 4 local guide · within 1.5 km
              </span>
              <a style={{
                fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}>See tomorrow's board <span>→</span></a>
            </div>
          </div>

          {/* SIDE RAIL */}
          <aside style={{display: 'flex', flexDirection: 'column', gap: 18, position: 'sticky', top: 96}}>
            {/* you're hosting */}
            <div style={{
              padding: '22px 22px 18px', borderRadius: 14,
              border: `0.5px solid ${T.gold}`,
              background: `linear-gradient(135deg, rgba(244,184,96,0.10), rgba(232,122,93,0.06))`,
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <TEyebrow label="You're hosting"/>
                <span style={{fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.live, fontWeight: 600}}>In 1h 16m</span>
              </div>
              <div style={{fontFamily: TS, fontSize: 22, color: T.cream, letterSpacing: '-0.015em', marginTop: 14, lineHeight: 1.2}}>
                Walter's window seat,<br/>
                <em style={{color: T.gold}}>two calls, then ferry.</em>
              </div>
              <div style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.textFaint, fontWeight: 600, marginTop: 10}}>
                2 stops · 2.5h · Kadıköy → Karaköy
              </div>

              <div style={{marginTop: 18, paddingTop: 14, borderTop: `0.5px solid ${T.borderHi}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
                <div>
                  <div style={{fontSize: 9.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.textFaint, fontWeight: 600}}>Seats</div>
                  <div style={{fontFamily: TS, fontSize: 24, color: T.cream, marginTop: 6, letterSpacing: '-0.02em'}}>2 <span style={{fontSize: 14, color: T.textMute}}>/ 3</span></div>
                </div>
                <div>
                  <div style={{fontSize: 9.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.textFaint, fontWeight: 600}}>Budget</div>
                  <div style={{fontFamily: TS, fontSize: 24, color: T.cream, marginTop: 6, letterSpacing: '-0.02em'}}>₺117 <span style={{fontSize: 12, color: T.textMute}}>· $3.5</span></div>
                </div>
              </div>

              <div style={{marginTop: 14, paddingTop: 14, borderTop: `0.5px solid ${T.borderHi}`}}>
                <div style={{fontSize: 9.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.textFaint, fontWeight: 600, marginBottom: 10}}>Attendees</div>
                <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8}}>
                  <TAvatar initials="MK" hue={T.rose} size={24}/>
                  <span style={{fontSize: 13, fontFamily: TG, color: T.cream}}>Maya K.</span>
                  <span style={{fontSize: 9.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.gold, fontWeight: 600}}>· Host</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                  <TAvatar initials="YF" hue={T.violet} size={24}/>
                  <span style={{fontSize: 13, fontFamily: TG, color: T.cream}}>Yuki F.</span>
                  <span style={{fontSize: 9.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.textFaint, fontWeight: 600}}>· Joined 08:52</span>
                </div>
              </div>

              <div style={{display: 'flex', gap: 8, marginTop: 18}}>
                <button style={{
                  flex: 1, padding: '11px 14px', borderRadius: 999, background: T.gold, color: T.deepWater,
                  fontSize: 13, fontWeight: 600, fontFamily: TG,
                }}>Edit plan</button>
                <button style={{
                  padding: '11px 14px', borderRadius: 999, border: `0.5px solid ${T.border}`,
                  fontSize: 13, color: T.cream, fontFamily: TG,
                }}>···</button>
              </div>
            </div>

            {/* composer */}
            <div style={{padding: '18px 20px', borderRadius: 14, border: `0.5px solid ${T.border}`, background: 'rgba(10,26,47,0.45)'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <TEyebrow label="+ post a plan"/>
                <span style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.textFaint, fontWeight: 600}}>⌘N</span>
              </div>
              <input
                placeholder="One line about what you're up to…"
                style={{
                  width: '100%', marginTop: 14, padding: '12px 14px',
                  background: T.water, border: `0.5px solid ${T.border}`, borderRadius: 10,
                  color: T.cream, fontSize: 14, fontFamily: TS, outline: 'none', letterSpacing: '-0.005em',
                }}
              />
              <div style={{display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap'}}>
                {['+ stop', '+ time', '+ seats', '+ budget', '+ tags'].map(t => <TChip key={t}>{t}</TChip>)}
              </div>
              <div style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.textFaint, fontWeight: 600, marginTop: 12}}>
                ↳ Posting as nomad
              </div>
            </div>

            {/* featured guides */}
            <div style={{borderRadius: 14, border: `0.5px solid ${T.border}`, overflow: 'hidden', background: 'rgba(10,26,47,0.45)'}}>
              <div style={{padding: '14px 18px', borderBottom: `0.5px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <span style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.gold, fontWeight: 600}}>★ Local guides · today</span>
                <span style={{fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.textFaint, fontWeight: 600}}>6 active</span>
              </div>
              {[
                ['Cem K.', 'CK', T.gold, '★ 4.9 · 47 trips', 'Old Kadıköy walk · 08:00', '₺450'],
                ['Sibel Ö.', 'SÖ', T.rose, '★ 5.0 · 28 trips', 'Çiya + market · 13:00', '₺380'],
                ['Kaptan Eren', 'KE', T.sky, '★ 4.95 · 112 trips', 'Bosphorus boat · 16:00', '₺1200'],
                ['Ahmet S.', 'AS', T.butter, '★ 4.8 · 19 nights', 'Bar Babylon jazz · 21:30', '₺280'],
              ].map(([name, ini, hue, rating, plan, fee], i, arr) => (
                <a key={name} style={{
                  display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 12, alignItems: 'center',
                  padding: '12px 18px', borderBottom: i < arr.length - 1 ? `0.5px solid ${T.borderDim}` : 'none',
                }}>
                  <TAvatar initials={ini} hue={hue} size={30}/>
                  <div>
                    <div style={{display: 'flex', gap: 8, alignItems: 'baseline'}}>
                      <span style={{fontFamily: TS, fontSize: 15, color: T.cream, letterSpacing: '-0.01em'}}>{name}</span>
                      <span style={{fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold, fontWeight: 600}}>{rating}</span>
                    </div>
                    <div style={{fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.textFaint, fontWeight: 600, marginTop: 4}}>↳ {plan}</div>
                  </div>
                  <span style={{fontFamily: TS, fontSize: 18, color: T.gold, letterSpacing: '-0.01em'}}>{fee}</span>
                </a>
              ))}
              <a style={{
                display: 'block', padding: '12px 18px', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase',
                color: T.gold, fontWeight: 600, borderTop: `0.5px solid ${T.border}`,
              }}>All verified guides (24) →</a>
            </div>

            <div style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.textFaint, fontWeight: 600, lineHeight: 1.9, padding: '0 4px'}}>
              ↳ Nomad plans · free, budget shown up front<br/>
              ↳ Guide plans · paid, refund up to 12h before<br/>
              ↳ ⌘K · search any day, any neighborhood
            </div>
          </aside>
        </section>

        {/* footer */}
        <div style={{padding: '64px 40px 40px', borderTop: `0.5px solid ${T.border}`, background: T.water, marginTop: 40}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
            <div>
              <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `linear-gradient(135deg, ${T.gold}, ${T.rose})`,
                  display: 'grid', placeItems: 'center',
                  fontFamily: TS, fontSize: 22, fontStyle: 'italic',
                  color: T.deepWater, letterSpacing: '-0.04em',
                }}>iN</div>
                <span style={{fontSize: 15, color: T.cream, fontFamily: TG}}>istanbulnomads</span>
              </div>
              <div style={{fontFamily: TS, fontSize: 32, lineHeight: 1.1, letterSpacing: '-0.02em', marginTop: 18, color: T.cream, maxWidth: 380}}>
                Plans, posted by the people <em style={{color: T.gold}}>making them.</em>
              </div>
            </div>
            <div style={{fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.goldDim, fontWeight: 500, textAlign: 'right'}}>
              41.0082° N · 28.9784° E<br/>
              <span style={{color: T.goldFaint}}>İstanbul · Türkiye</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

window.TodayV2Page = TodayV2Page;
