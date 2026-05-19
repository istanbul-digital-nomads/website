/* Members directory + Public profile — alternates harmonized to the hero
   (deep-navy + gold/rose, Space Grotesk + Instrument Serif). Each artboard
   is self-styled inline so it doesn't depend on tokens.css. */

const HERO = {
  deepWater: '#06101f',
  water:     '#0a1a2f',
  waterHi:   '#13294a',
  waterEdge: '#1c3554',
  gold:      '#f4b860',
  goldSoft:  '#e8a647',
  goldDim:   'rgba(244,184,96,0.55)',
  goldFaint: 'rgba(244,184,96,0.28)',
  rose:      '#e87a5d',
  cream:     '#f6ecd9',
  text:      '#f6ecd9',
  textDim:   'rgba(246,236,217,0.7)',
  textMute:  'rgba(246,236,217,0.5)',
  textFaint: 'rgba(246,236,217,0.32)',
  live:      '#86efac',
  liveSoft:  'rgba(134,239,172,0.12)',
  liveEdge:  'rgba(134,239,172,0.35)',
  borderHi:  'rgba(244,184,96,0.18)',
  border:    'rgba(246,236,217,0.10)',
  borderDim: 'rgba(246,236,217,0.06)',
};

const SERIF = "'Instrument Serif', 'GT Sectra', Georgia, serif";
const SANS  = "'Space Grotesk', system-ui, -apple-system, sans-serif";

/* ── hero-styled shared atoms ────────────────────────────────────────── */

const HeroArtboard = ({width = 1440, height, children, label}) => (
  <div data-screen-label={label} style={{
    width, minHeight: height, background: HERO.deepWater, color: HERO.cream,
    fontFamily: SANS, WebkitFontSmoothing: 'antialiased',
    position: 'relative', overflow: 'hidden',
  }}>
    {/* subtle map-grid bg, matches hero's water feel */}
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5,
      backgroundImage: `
        radial-gradient(1200px 600px at 90% 0%, rgba(244,184,96,0.06), transparent 60%),
        radial-gradient(800px 500px at 0% 100%, rgba(232,122,93,0.05), transparent 60%),
        linear-gradient(180deg, ${HERO.deepWater}, ${HERO.water} 60%, ${HERO.deepWater})
      `,
    }}/>
    <div style={{position:'relative'}}>{children}</div>
  </div>
);

const HeroBrand = () => (
  <div style={{display:'flex', alignItems:'center', gap:10}}>
    <div style={{
      width: 32, height: 32, borderRadius: 8,
      background: `linear-gradient(135deg, ${HERO.gold}, ${HERO.rose})`,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily: SERIF, fontSize: 18, color: HERO.deepWater,
      fontStyle: 'italic', letterSpacing: '-0.04em',
    }}>iN</div>
    <div style={{fontSize:14, fontWeight:500, letterSpacing:'-0.01em', color: HERO.cream}}>
      istanbulnomads
    </div>
  </div>
);

const HeroNav = ({active = 'Members'}) => {
  const items = ['Map', 'Events', 'Community', 'Members', 'About'];
  return (
    <div style={{
      position: 'relative', zIndex: 5,
      padding: '24px 40px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: `0.5px solid ${HERO.border}`,
      background: 'rgba(6,16,31,0.7)', backdropFilter: 'blur(10px)',
    }}>
      <HeroBrand/>
      <div style={{display:'flex', gap:28, alignItems:'center', fontSize:13, color: HERO.textDim}}>
        {items.map(it => (
          <a key={it} style={{
            color: it === active ? HERO.cream : HERO.textDim,
            position:'relative', display:'flex', alignItems:'center', gap:8,
          }}>
            {it}
            {it === active && <span style={{
              width: 5, height: 5, borderRadius: 3, background: HERO.gold,
              boxShadow: `0 0 8px ${HERO.gold}`,
            }}/>}
          </a>
        ))}
        <div style={{
          padding: '8px 14px', borderRadius: 999,
          border: `0.5px solid ${HERO.border}`,
          fontSize: 12, fontWeight: 500, color: HERO.cream,
        }}>Sign in</div>
      </div>
    </div>
  );
};

const HeroLivePip = ({label = '21 nomads online right now'}) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '6px 12px', borderRadius: 999,
    background: HERO.liveSoft,
    border: `0.5px solid ${HERO.liveEdge}`,
    fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
    color: HERO.live, fontWeight: 600, whiteSpace: 'nowrap',
  }}>
    <span style={{
      display: 'inline-block', width: 6, height: 6, borderRadius: 3,
      background: HERO.live, boxShadow: `0 0 8px ${HERO.live}`,
    }}/>
    {label}
  </div>
);

const HeroEyebrow = ({label, kicker}) => (
  <div style={{
    fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
    color: HERO.gold, fontWeight: 600,
    display: 'flex', alignItems: 'center', gap: 14,
  }}>
    <span style={{width: 24, height: 1, background: HERO.gold, opacity: 0.6}}/>
    <span>{label}</span>
    {kicker && <span style={{color: HERO.textFaint, fontWeight: 500}}>· {kicker}</span>}
  </div>
);

const HeroChip = ({children, on}) => (
  <button style={{
    padding: '7px 14px', borderRadius: 999,
    border: `0.5px solid ${on ? HERO.gold : HERO.border}`,
    background: on ? 'rgba(244,184,96,0.10)' : 'transparent',
    fontSize: 12, color: on ? HERO.gold : HERO.textDim, fontFamily: SANS,
  }}>{children}</button>
);

const HeroTag = ({children}) => (
  <span style={{
    fontSize: 11, letterSpacing: '0.05em',
    padding: '5px 10px', borderRadius: 999,
    border: `0.5px solid ${HERO.border}`,
    color: HERO.textDim, whiteSpace: 'nowrap',
  }}>{children}</span>
);

const HeroPrimary = ({children, style}) => (
  <button style={{
    background: HERO.gold, color: HERO.deepWater,
    padding: '14px 22px', borderRadius: 999,
    fontSize: 14, fontWeight: 600, letterSpacing: '-0.005em',
    fontFamily: SANS, display: 'inline-flex', alignItems: 'center', gap: 10,
    ...style,
  }}>{children}</button>
);

const HeroGhost = ({children, style}) => (
  <button style={{
    background: 'transparent', color: HERO.cream,
    padding: '14px 18px', borderRadius: 999,
    border: `0.5px solid ${HERO.border}`,
    fontSize: 14, fontWeight: 500, fontFamily: SANS,
    display: 'inline-flex', alignItems: 'center', gap: 10,
    ...style,
  }}>{children}</button>
);

const HeroAvatar = ({size = 40, hue = HERO.gold, online = false}) => (
  <div style={{
    width: size, height: size, borderRadius: size/2, position: 'relative',
    background: `linear-gradient(135deg, ${hue}, ${HERO.rose})`,
    boxShadow: `0 0 0 0.5px ${HERO.borderHi}, inset 0 0 0 0.5px rgba(255,255,255,0.12)`,
  }}>
    {online && <span style={{
      position: 'absolute', bottom: -1, right: -1,
      width: size * 0.30, height: size * 0.30, borderRadius: '50%',
      background: HERO.live, boxShadow: `0 0 0 2px ${HERO.water}, 0 0 8px ${HERO.live}`,
    }}/>}
  </div>
);

const HeroCoords = () => (
  <div style={{
    fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
    color: HERO.goldDim, fontWeight: 500, textAlign: 'right',
  }}>
    41.0082° N · 28.9784° E<br/>
    <span style={{color: HERO.goldFaint}}>İstanbul · Türkiye</span>
  </div>
);

const HeroFooter = () => (
  <div style={{
    padding: '64px 40px 40px', borderTop: `0.5px solid ${HERO.border}`,
    background: HERO.water, marginTop: 96,
  }}>
    <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', gap: 40, marginBottom: 56}}>
      <div>
        <HeroBrand/>
        <div style={{
          fontFamily: SERIF, fontSize: 32, lineHeight: 1.1, letterSpacing: '-0.02em',
          color: HERO.cream, marginTop: 20, maxWidth: 380,
        }}>
          Built on the Asia side. <em style={{color: HERO.gold}}>Read on every side.</em>
        </div>
        <div style={{fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: HERO.goldDim, marginTop: 24, lineHeight: 1.7}}>
          41°00′N 28°58′E<br/>UTC+3 · TRY ₺ · EN / TR / FA / AR / RU
        </div>
      </div>
      {[
        ['Get oriented', ['First Week Planner', 'Neighborhood Matcher', 'Cost of Living', 'Visa & Stay']],
        ['Neighborhoods', ['Kadıköy', 'Beşiktaş', 'Cihangir', 'Karaköy', 'Balat']],
        ['Community', ['Telegram (1,847)', 'Events', 'Members', 'Field Notes']],
        ['The site', ['Why this exists', 'Contribute', 'llms.txt', 'RSS']],
      ].map(([h, items]) => (
        <div key={h}>
          <div style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: HERO.gold, marginBottom: 16, fontWeight: 600}}>{h}</div>
          <div style={{display:'flex', flexDirection:'column', gap: 11}}>
            {items.map(i => <a key={i} style={{fontSize: 13.5, color: HERO.textDim}}>{i}</a>)}
          </div>
        </div>
      ))}
    </div>
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', paddingTop: 28, borderTop: `0.5px solid ${HERO.border}`}}>
      <div style={{fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: HERO.textFaint}}>
        © 2026 istanbulnomads · written by humans · indexed by machines
      </div>
      <HeroCoords/>
    </div>
  </div>
);

/* ── shared members fixture ─────────────────────────────────────────── */

const _membersFull = [
  { name:'Maya K.',  role:'Writer · ex-Wired',         hood:'Kadıköy',  since:'Aug 2025', mo:'9mo',   langs:['EN','TR','FR'], from:'London',    open:true,  reply:'~2h',  tags:['Field Notes','Hosts dinners','Long-form'],      hue: HERO.gold },
  { name:'Rin H.',   role:'Researcher · DeepMind',     hood:'Kadıköy',  since:'Dec 2025', mo:'5mo',   langs:['JP','EN'],      from:'Tokyo',     open:true,  reply:'~1d',  tags:['ML','Quiet ferries','Reads at lunch'],          hue: '#a78bfa' },
  { name:'Cem K.',   role:'Director · ad agency',      hood:'Kadıköy',  since:'Nov 2025', mo:'6mo',   langs:['TR','EN','DE'], from:'Istanbul',  open:false, reply:'—',    tags:['Native','Office hours','Local producers'],     hue: HERO.rose },
  { name:'Yuki F.',  role:'Engineer · indie game',     hood:'Moda',     since:'Jul 2025', mo:'10mo',  langs:['JP','EN','TR'], from:'Osaka',     open:true,  reply:'~6h',  tags:['Gamedev','Long stays','Tea over coffee'],       hue: '#7dd3fc' },
  { name:'Lina M.',  role:'Designer · independent',    hood:'Kadıköy',  since:'Feb 2026', mo:'3mo',   langs:['DE','EN','TR'], from:'Berlin',    open:true,  reply:'~4h',  tags:['Brand','Type','Available Jun'],                 hue: HERO.gold },
  { name:'Deniz A.', role:'Founder · climate SaaS',    hood:'Beşiktaş', since:'May 2024', mo:'2y',    langs:['TR','EN'],      from:'İzmir',     open:true,  reply:'~3h',  tags:['Office hours','Hiring','Climate'],              hue: '#86efac' },
  { name:'Karim B.', role:'Founder · marketplace',     hood:'Beşiktaş', since:'Sep 2025', mo:'8mo',   langs:['AR','EN','TR'], from:'Cairo',     open:true,  reply:'~1d',  tags:['Arabic-speaking','Hiring','Fintech'],           hue: HERO.rose },
  { name:'Eli S.',   role:'PM · Notion',               hood:'Cihangir', since:'Apr 2026', mo:'1mo',   langs:['EN'],           from:'NYC',       open:true,  reply:'~30m', tags:['New here','PM coffee','Looking for a flat'],    hue: '#fde68a' },
  { name:'Sara T.',  role:'Therapist · in private',    hood:'Cihangir', since:'Mar 2025', mo:'1y 2mo',langs:['EN','TR'],      from:'Boston',    open:false, reply:'—',    tags:['Mental health','Booked','Long-stay'],           hue: '#a78bfa' },
  { name:'Mira V.',  role:'Producer · documentary',    hood:'Karaköy',  since:'Jan 2026', mo:'4mo',   langs:['BG','EN'],      from:'Sofia',     open:true,  reply:'~5h',  tags:['Film','Bosphorus walks','Sourcing fixers'],     hue: HERO.gold },
  { name:'Aram P.',  role:'Ill. · Sunday Times',       hood:'Balat',    since:'Oct 2025', mo:'7mo',   langs:['EN','TR'],      from:'Yerevan',   open:true,  reply:'~12h', tags:['Drawing club host','Risograph','Daily walks'],  hue: HERO.rose },
  { name:'Onur T.',  role:'Engineer · Stripe',         hood:'Üsküdar',  since:'May 2025', mo:'1y',    langs:['TR','EN'],      from:'Ankara',    open:false, reply:'—',    tags:['Türkçe başla host','Cycling','Pasta'],          hue: '#fb923c' },
];


/* ═══════════════════════════════════════════════════════════════════════
   DIRECTORY · variant B — dense list, neighborhood-grouped
   ═══════════════════════════════════════════════════════════════════════ */
const MembersListPage = () => {
  const byHood = _membersFull.reduce((acc, m) => { (acc[m.hood] ||= []).push(m); return acc; }, {});
  const hoodOrder = ['Kadıköy', 'Beşiktaş', 'Cihangir', 'Karaköy', 'Balat', 'Moda', 'Üsküdar'];
  const orderedHoods = hoodOrder.filter(h => byHood[h]);
  const openOnly = _membersFull.filter(m => m.open).slice(0, 8);

  return (
    <HeroArtboard height={3900} label="Members · list">
      <HeroNav active="Members"/>

      <section style={{padding: '56px 44px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap: 56, alignItems:'end'}}>
          <div>
            <HeroLivePip label="38 open to coffee right now"/>
            <h1 style={{
              fontFamily: SERIF, fontSize: 92, lineHeight: 1.02, letterSpacing: '-0.02em',
              margin: '24px 0 0', color: HERO.cream, fontWeight: 400, maxWidth: 780,
            }}>
              The people <em style={{color: HERO.gold}}>here</em>,<br/>
              by the street they leave the house in.
            </h1>
          </div>
          <div style={{paddingBottom: 14}}>
            <p style={{fontSize: 15, lineHeight: 1.6, color: HERO.textDim, maxWidth: 460, margin: 0}}>
              An opt-in member directory. Public profiles only. Reach out on Telegram — we don't do DMs through the site. The other 1,704 chose to stay private; that's fine too.
            </p>
            <div style={{display:'flex', gap:32, marginTop: 24, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: HERO.goldDim, fontWeight: 600}}>
              <span><span style={{color: HERO.gold}}>143</span> public</span>
              <span><span style={{color: HERO.gold}}>38</span> open</span>
              <span><span style={{color: HERO.gold}}>7</span> hoods</span>
            </div>
          </div>
        </div>

        {/* control bar */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding: '18px 0', marginTop: 48,
          borderTop: `0.5px solid ${HERO.border}`,
          borderBottom: `0.5px solid ${HERO.border}`,
        }}>
          <div style={{display:'flex', gap:8, flexWrap:'wrap', alignItems:'center'}}>
            <span style={{fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', color: HERO.textFaint, marginRight: 8}}>Show</span>
            {[
              ['Everyone', false],
              ['Open to coffee', true],
              ['Hosts events', false],
              ['Hiring', false],
              ['New (<3mo)', false],
              ['Long-stay (>1y)', false],
            ].map(([label, on]) => <HeroChip key={label} on={on}>{label}</HeroChip>)}
          </div>
          <div style={{display:'flex', alignItems:'center', gap: 14}}>
            <span style={{fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: HERO.textFaint}}>Sort</span>
            <HeroChip on>Open · then nearest →</HeroChip>
            <span style={{fontSize: 11, color: HERO.textFaint}}>Cards</span>
            <span style={{fontSize: 11, color: HERO.gold}}>List ●</span>
          </div>
        </div>
      </section>

      {/* main split */}
      <section style={{padding: '40px 44px 0', display:'grid', gridTemplateColumns: '340px 1fr', gap: 44}}>
        {/* LEFT — open right now */}
        <aside>
          <HeroEyebrow label="Open to coffee · 38"/>
          <p style={{fontSize: 13.5, lineHeight: 1.55, color: HERO.textDim, marginTop: 14, marginBottom: 22}}>
            People who said yes to one this week. Ferry-walk distances only — for everything else, scroll right.
          </p>
          <div style={{
            background: HERO.water, border: `0.5px solid ${HERO.border}`, borderRadius: 12, overflow: 'hidden',
          }}>
            {openOnly.map((m, i) => (
              <a key={m.name} style={{
                display:'grid', gridTemplateColumns:'40px 1fr auto', alignItems:'center', gap: 12,
                padding: '14px 16px',
                borderTop: i === 0 ? 'none' : `0.5px solid ${HERO.borderDim}`,
                background: i === 0 ? 'rgba(244,184,96,0.05)' : 'transparent',
              }}>
                <HeroAvatar size={36} hue={m.hue} online/>
                <div>
                  <div style={{fontFamily: SERIF, fontSize: 17, lineHeight: 1.05, color: HERO.cream}}>{m.name}</div>
                  <div style={{fontSize: 11, color: HERO.textFaint, marginTop: 4, letterSpacing: '0.04em'}}>{m.hood} · replies {m.reply}</div>
                </div>
                <span style={{color: HERO.gold, fontSize: 14}}>→</span>
              </a>
            ))}
          </div>

          <div style={{marginTop: 18, padding: '14px 16px', borderRadius: 12, border: `0.5px dashed ${HERO.borderHi}`}}>
            <div style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: HERO.goldDim, fontWeight: 600}}>How this works</div>
            <p style={{fontSize: 12.5, color: HERO.textDim, marginTop: 8, lineHeight: 1.55}}>
              Reach out on Telegram, mention the ferry. No DMs, no read-receipts, no algorithms.
            </p>
          </div>
        </aside>

        {/* RIGHT — by neighborhood */}
        <div style={{display:'flex', flexDirection:'column', gap: 44}}>
          {orderedHoods.map((hood, hi) => (
            <div key={hood}>
              <div style={{
                display:'flex', alignItems:'baseline', justifyContent:'space-between',
                paddingBottom: 14, borderBottom: `0.5px solid ${HERO.border}`,
              }}>
                <div style={{display:'flex', alignItems:'baseline', gap: 18}}>
                  <span style={{fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: HERO.gold, fontWeight: 600}}>
                    {String(hi+1).padStart(2,'0')}
                  </span>
                  <h2 style={{fontFamily: SERIF, fontSize: 38, letterSpacing: '-0.015em', lineHeight: 1, margin: 0, color: HERO.cream, fontWeight: 400}}>
                    {hood}
                  </h2>
                  <span style={{fontSize: 11, color: HERO.textFaint, letterSpacing: '0.06em'}}>
                    {byHood[hood].length} {byHood[hood].length === 1 ? 'person' : 'people'}
                  </span>
                </div>
                <a style={{fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: HERO.goldDim, fontWeight: 600}}>
                  open neighborhood →
                </a>
              </div>

              <div>
                {byHood[hood].map((m) => (
                  <a key={m.name} style={{
                    display:'grid',
                    gridTemplateColumns: '48px 1.4fr 1.2fr 1fr 0.7fr 24px',
                    alignItems:'center', gap: 18,
                    padding: '18px 4px',
                    borderBottom: `0.5px solid ${HERO.borderDim}`,
                  }}>
                    <HeroAvatar size={40} hue={m.hue} online={m.open}/>
                    <div>
                      <div style={{fontFamily: SERIF, fontSize: 19, letterSpacing: '-0.01em', color: HERO.cream, display: 'flex', alignItems: 'center', gap: 10}}>
                        {m.name}
                      </div>
                      <div style={{fontSize: 12, color: HERO.textMute, marginTop: 5}}>{m.role}</div>
                    </div>
                    <div style={{display:'flex', gap: 6, flexWrap:'wrap'}}>
                      {m.tags.slice(0, 2).map(t => <HeroTag key={t}>{t}</HeroTag>)}
                    </div>
                    <div style={{fontSize: 11, color: HERO.textFaint, letterSpacing: '0.04em'}}>
                      <div>From {m.from}</div>
                      <div style={{marginTop: 4}}>{m.langs.join(' · ')}</div>
                    </div>
                    <div style={{
                      fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
                      color: m.open ? HERO.live : HERO.textFaint, fontWeight: 600, textAlign: 'right',
                    }}>
                      {m.open ? `open · ${m.reply}` : 'private'}
                    </div>
                    <span style={{fontSize: 14, color: HERO.gold, textAlign: 'right'}}>→</span>
                  </a>
                ))}
              </div>
            </div>
          ))}

          <div style={{textAlign:'center', paddingTop: 16}}>
            <HeroGhost>Show 131 more →</HeroGhost>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding: '96px 44px 0'}}>
        <div style={{
          borderTop: `0.5px solid ${HERO.border}`, borderBottom: `0.5px solid ${HERO.border}`,
          padding: '64px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48,
        }}>
          <div>
            <HeroEyebrow label="Member · you"/>
            <h2 style={{fontFamily: SERIF, fontSize: 56, letterSpacing: '-0.02em', lineHeight: 1.02, color: HERO.cream, margin: '20px 0 0', fontWeight: 400}}>
              Add yourself.<br/><em style={{color: HERO.gold}}>Or don't.</em>
            </h2>
          </div>
          <div>
            <p style={{fontSize: 15.5, lineHeight: 1.6, color: HERO.textDim, maxWidth: 520, margin: 0}}>
              The list above is opt-in. Three tags, a sentence, a Telegram handle, and whether you're open to coffee this month. Edit any time. Quit any time.
            </p>
            <div style={{display:'flex', gap: 12, marginTop: 28}}>
              <HeroPrimary>
                Create my profile
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7H12 M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </HeroPrimary>
              <HeroGhost>What's public, what isn't</HeroGhost>
            </div>
          </div>
        </div>
      </section>

      <HeroFooter/>
    </HeroArtboard>
  );
};


/* ═══════════════════════════════════════════════════════════════════════
   DIRECTORY · variant C — pinned to neighborhoods on the Bosphorus
   ═══════════════════════════════════════════════════════════════════════ */
const HOOD_POS = {
  'Beşiktaş':  { x: 240, y: 360, side: 'EU' },
  'Cihangir':  { x: 290, y: 480, side: 'EU' },
  'Karaköy':   { x: 340, y: 540, side: 'EU' },
  'Balat':     { x: 200, y: 260, side: 'EU' },
  'Kadıköy':   { x: 540, y: 600, side: 'AS' },
  'Moda':      { x: 560, y: 680, side: 'AS' },
  'Üsküdar':   { x: 490, y: 460, side: 'AS' },
};

const MembersMapPage = () => {
  const byHood = _membersFull.reduce((acc, m) => { (acc[m.hood] ||= []).push(m); return acc; }, {});
  const active = 'Kadıköy';

  return (
    <HeroArtboard height={3500} label="Members · map">
      <HeroNav active="Members"/>

      <section style={{padding: '56px 44px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap: 56, alignItems:'end'}}>
          <div>
            <HeroLivePip label="map view · live since 19:04"/>
            <h1 style={{
              fontFamily: SERIF, fontSize: 92, lineHeight: 1.02, letterSpacing: '-0.02em',
              margin: '24px 0 0', color: HERO.cream, fontWeight: 400, maxWidth: 760,
            }}>
              The city, <em style={{color: HERO.gold}}>full of people</em><br/>
              you can ask.
            </h1>
          </div>
          <div style={{paddingBottom: 14}}>
            <p style={{fontSize: 15, lineHeight: 1.6, color: HERO.textDim, maxWidth: 460, margin: 0}}>
              Pinned, not pinned-down. Where members chose to be findable — by the neighborhood they actually leave the house in. Tap a hood to thin the list to it.
            </p>
            <div style={{display:'flex', gap:32, marginTop: 24, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: HERO.goldDim, fontWeight: 600}}>
              <span><span style={{color: HERO.gold}}>143</span> pinned</span>
              <span><span style={{color: HERO.live}}>38</span> open · now</span>
              <span><span style={{color: HERO.gold}}>7</span> hoods</span>
            </div>
          </div>
        </div>
      </section>

      <section style={{padding: '40px 44px 0', display:'grid', gridTemplateColumns: '1fr 480px', gap: 32}}>
        {/* MAP */}
        <div style={{
          position: 'relative', borderRadius: 16, overflow: 'hidden',
          border: `0.5px solid ${HERO.borderHi}`, background: HERO.water,
          aspectRatio: '1 / 1.05',
        }}>
          <svg viewBox="0 0 800 900" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
            <defs>
              <pattern id="hgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0H0V40" fill="none" stroke="rgba(246,236,217,0.04)" strokeWidth="1"/>
              </pattern>
              <linearGradient id="bos2" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0e1a26"/>
                <stop offset="50%" stopColor="#1a3045"/>
                <stop offset="100%" stopColor="#0e1a26"/>
              </linearGradient>
              <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={HERO.gold} stopOpacity="0.35"/>
                <stop offset="100%" stopColor={HERO.gold} stopOpacity="0"/>
              </radialGradient>
            </defs>
            <rect width="800" height="900" fill="url(#hgrid)"/>

            {/* European side */}
            <path d="M 0 80 Q 120 100 200 140 Q 280 200 320 320 Q 380 480 360 600 Q 340 720 260 820 L 0 880 Z"
                  fill="rgba(244,184,96,0.04)" stroke="rgba(244,184,96,0.22)" strokeWidth="0.8"/>
            {/* Asian side */}
            <path d="M 800 60 Q 720 100 660 180 Q 600 280 560 420 Q 520 560 540 700 Q 560 800 640 880 L 800 880 Z"
                  fill="rgba(232,122,93,0.04)" stroke="rgba(232,122,93,0.22)" strokeWidth="0.8"/>
            {/* Bosphorus */}
            <path d="M 380 0 Q 400 200 420 380 Q 440 540 460 700 Q 470 820 480 900"
                  fill="none" stroke="url(#bos2)" strokeWidth="80" strokeLinecap="round" opacity="0.6"/>

            <text x="80" y="60" fontFamily="Space Grotesk" fontSize="11" letterSpacing="3" fill={HERO.textFaint} fontWeight="600">EUROPEAN SIDE</text>
            <text x="620" y="60" fontFamily="Space Grotesk" fontSize="11" letterSpacing="3" fill={HERO.textFaint} fontWeight="600">ASIAN SIDE</text>
            <text x="420" y="450" fontFamily="Space Grotesk" fontSize="10" letterSpacing="4" fill={HERO.goldDim} fontWeight="600" transform="rotate(85 420 450)">BOSPHORUS</text>

            {/* ferry route */}
            <path d="M 340 540 Q 440 580 540 600" fill="none" stroke={HERO.gold} strokeWidth="1" strokeDasharray="3 5" opacity="0.6"/>
            <circle cx="440" cy="580" r="3" fill={HERO.gold}>
              <animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite"/>
            </circle>

            {/* hood pins */}
            {Object.entries(HOOD_POS).map(([hood, p]) => {
              const list = byHood[hood] || [];
              const isActive = hood === active;
              const r = 18 + Math.min(list.length, 6) * 4;
              return (
                <g key={hood}>
                  {isActive && (
                    <>
                      <circle cx={p.x} cy={p.y} r={r + 50} fill="url(#goldGlow)"/>
                      <circle cx={p.x} cy={p.y} r={r + 18} fill="none" stroke={HERO.gold} strokeWidth="0.5" opacity="0.5"/>
                    </>
                  )}
                  <circle cx={p.x} cy={p.y} r={r}
                          fill={isActive ? 'rgba(244,184,96,0.18)' : 'rgba(246,236,217,0.04)'}
                          stroke={isActive ? HERO.gold : 'rgba(246,236,217,0.4)'}
                          strokeWidth={isActive ? 1.2 : 0.8}/>
                  <text x={p.x} y={p.y + 5} textAnchor="middle"
                        fontFamily="Space Grotesk" fontSize="15"
                        fill={isActive ? HERO.cream : HERO.textDim}
                        fontWeight="600">
                    {list.length}
                  </text>
                  <text x={p.x} y={p.y + r + 20} textAnchor="middle"
                        fontFamily="Instrument Serif" fontSize="20" letterSpacing="-0.5"
                        fill={isActive ? HERO.cream : HERO.textDim}>
                    {hood}
                  </text>
                  {isActive && list.slice(0, 4).map((m, i) => (
                    <circle key={i}
                            cx={p.x + Math.cos(i * 1.6 - 0.5) * (r + 36)}
                            cy={p.y + Math.sin(i * 1.6 - 0.5) * (r + 36)}
                            r="5.5"
                            fill={m.hue}
                            stroke={HERO.water} strokeWidth="2"/>
                  ))}
                </g>
              );
            })}
          </svg>

          {/* HUDs */}
          <div style={{
            position: 'absolute', top: 20, left: 20,
            padding: '12px 16px', borderRadius: 10,
            background: 'rgba(6,16,31,0.78)', backdropFilter: 'blur(12px)',
            border: `0.5px solid ${HERO.borderHi}`,
          }}>
            <div style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: HERO.goldDim, fontWeight: 600, marginBottom: 6}}>Viewing</div>
            <div style={{fontFamily: SERIF, fontSize: 22, letterSpacing: '-0.01em'}}>{active}</div>
            <div style={{fontSize: 11, color: HERO.live, marginTop: 6, letterSpacing: '0.06em'}}>
              {byHood[active]?.length || 0} members · 3 open
            </div>
          </div>

          <div style={{position: 'absolute', bottom: 20, left: 20, display: 'flex', gap: 8}}>
            {['− zoom', '+ zoom', '↻ reset'].map(t => (
              <button key={t} style={{
                padding: '7px 12px', borderRadius: 999,
                border: `0.5px solid ${HERO.border}`, background: 'rgba(6,16,31,0.6)',
                fontSize: 11, color: HERO.textDim, fontFamily: SANS,
              }}>{t}</button>
            ))}
          </div>

          <div style={{
            position: 'absolute', bottom: 20, right: 20, padding: '12px 14px',
            background: 'rgba(6,16,31,0.78)', backdropFilter: 'blur(12px)',
            border: `0.5px solid ${HERO.borderHi}`, borderRadius: 10,
          }}>
            <div style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: HERO.goldDim, fontWeight: 600, marginBottom: 8}}>Legend</div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, color: HERO.textDim}}>
              <div style={{display:'flex', alignItems:'center', gap: 8}}>
                <span style={{width: 8, height: 8, borderRadius: 4, background: 'rgba(246,236,217,0.06)', border: `0.5px solid ${HERO.textDim}`}}/> Neighborhood
              </div>
              <div style={{display:'flex', alignItems:'center', gap: 8}}>
                <span style={{width: 8, height: 8, borderRadius: 4, background: HERO.gold, boxShadow: `0 0 6px ${HERO.gold}`}}/> Active hood
              </div>
              <div style={{display:'flex', alignItems:'center', gap: 8}}>
                <span style={{width: 14, height: 0, borderTop: `1px dashed ${HERO.gold}`}}/> Ferry route
              </div>
            </div>
          </div>
        </div>

        {/* LIST */}
        <aside>
          <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between'}}>
            <div>
              <HeroEyebrow label="Filtered"/>
              <h2 style={{fontFamily: SERIF, fontSize: 52, letterSpacing: '-0.02em', margin: '8px 0 0', color: HERO.cream, fontWeight: 400}}>
                {active}
              </h2>
            </div>
            <HeroGhost style={{padding: '8px 14px', fontSize: 12}}>show all 143</HeroGhost>
          </div>
          <p style={{fontSize: 14, color: HERO.textDim, lineHeight: 1.55, marginTop: 14}}>
            The big village on the Asian side. Slow ferry, fast wi-fi, the most cooks-per-square-meter in the directory.
          </p>

          <div style={{marginTop: 24, display:'flex', flexDirection:'column', gap: 10}}>
            {byHood[active].map((m) => (
              <a key={m.name} style={{
                display: 'grid', gridTemplateColumns: '52px 1fr auto', gap: 14,
                padding: '14px 16px', alignItems: 'center',
                borderRadius: 12,
                border: `0.5px solid ${HERO.border}`, background: HERO.water,
              }}>
                <HeroAvatar size={44} hue={m.hue} online={m.open}/>
                <div>
                  <div style={{fontFamily: SERIF, fontSize: 18, letterSpacing: '-0.01em', color: HERO.cream}}>{m.name}</div>
                  <div style={{fontSize: 12, color: HERO.textMute, marginTop: 4}}>{m.role}</div>
                  <div style={{display:'flex', gap: 6, marginTop: 8, flexWrap:'wrap'}}>
                    {m.tags.slice(0, 2).map(t => <HeroTag key={t}>{t}</HeroTag>)}
                  </div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: HERO.textFaint, fontWeight: 600}}>{m.mo}</div>
                  <div style={{fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: m.open ? HERO.live : HERO.textFaint, fontWeight: 600, marginTop: 6}}>
                    {m.open ? `↳ ${m.reply}` : 'private'}
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div style={{marginTop: 32, paddingTop: 20, borderTop: `0.5px solid ${HERO.border}`}}>
            <HeroEyebrow label="Hop neighborhoods"/>
            <div style={{display:'flex', flexWrap:'wrap', gap: 8, marginTop: 14}}>
              {Object.keys(HOOD_POS).filter(h => h !== active).map(h => (
                <HeroChip key={h}>{h} · {byHood[h]?.length || 0}</HeroChip>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section style={{padding: '96px 44px 0'}}>
        <div style={{
          borderTop: `0.5px solid ${HERO.border}`, borderBottom: `0.5px solid ${HERO.border}`,
          padding: '64px 0', display:'grid', gridTemplateColumns: '1fr 1fr', gap: 48,
        }}>
          <div>
            <HeroEyebrow label="Be findable"/>
            <h2 style={{fontFamily: SERIF, fontSize: 56, letterSpacing: '-0.02em', lineHeight: 1.02, color: HERO.cream, margin: '20px 0 0', fontWeight: 400}}>
              Pin yourself<br/><em style={{color: HERO.gold}}>to a street.</em>
            </h2>
          </div>
          <div>
            <p style={{fontSize: 15.5, lineHeight: 1.6, color: HERO.textDim, maxWidth: 520, margin: 0}}>
              You pick one neighborhood (the one you'd buy bread in), three tags, a sentence. The dot moves with you, or comes off the map when you do.
            </p>
            <div style={{display:'flex', gap: 12, marginTop: 28}}>
              <HeroPrimary>
                Place my pin
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7H12 M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </HeroPrimary>
              <HeroGhost>Privacy & visibility</HeroGhost>
            </div>
          </div>
        </div>
      </section>

      <HeroFooter/>
    </HeroArtboard>
  );
};


/* ═══════════════════════════════════════════════════════════════════════
   PROFILE · variant B — editorial / magazine
   ═══════════════════════════════════════════════════════════════════════ */
const ProfileEditorialPage = () => {
  return (
    <HeroArtboard height={3600} label="Profile · editorial">
      <HeroNav active="Members"/>

      {/* Cover */}
      <section style={{position: 'relative'}}>
        <div style={{
          height: 720, position: 'relative',
          background: `
            radial-gradient(80% 80% at 70% 40%, ${HERO.rose} 0%, ${HERO.gold} 40%, transparent 70%),
            linear-gradient(135deg, ${HERO.water} 0%, ${HERO.deepWater} 100%)
          `,
          overflow: 'hidden',
        }}>
          {/* grid texture */}
          <div style={{position: 'absolute', inset: 0, opacity: 0.4, backgroundImage: `
            repeating-linear-gradient(90deg, rgba(246,236,217,0.05) 0 1px, transparent 1px 18px),
            repeating-linear-gradient(0deg,  rgba(246,236,217,0.04) 0 1px, transparent 1px 18px)
          `}}/>
          <div style={{position: 'absolute', top: 24, left: 44, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(6,16,31,0.7)', fontWeight: 600}}>
            ↳ COVER PORTRAIT · 16:9 · Maya at Mephisto, Apr 26 · shot by Aram P.
          </div>
          <div style={{position: 'absolute', top: 24, right: 44, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(6,16,31,0.7)', fontWeight: 600}}>
            Member profile · N° 04 of 143
          </div>

          <div style={{
            position: 'absolute', left: 44, right: 44, bottom: 56,
            display: 'grid', gridTemplateColumns: '2fr 1fr', alignItems: 'end', gap: 56,
          }}>
            <h1 style={{
              fontFamily: SERIF, fontSize: 192, lineHeight: 0.86, letterSpacing: '-0.03em',
              color: HERO.cream, fontWeight: 400, margin: 0, mixBlendMode: 'screen',
            }}>
              Maya<br/><em>Karadağ</em>
            </h1>
            <div>
              <div style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(6,16,31,0.85)', fontWeight: 700}}>
                Subject · Writer · Kadıköy
              </div>
              <p style={{fontFamily: SERIF, fontSize: 19, lineHeight: 1.35, letterSpacing: '-0.005em', color: HERO.cream, margin: '14px 0 0', maxWidth: 380}}>
                Long-form features writer working on a book about how cities decide what they sound like at 03:00.
              </p>
            </div>
          </div>

          <div style={{position: 'absolute', bottom: 14, left: 44, right: 44, display:'flex', justifyContent:'space-between', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(6,16,31,0.65)', fontWeight: 600}}>
            <span>Members / <span style={{color: HERO.deepWater}}>Maya K.</span></span>
            <span>maya-k · public · last edit 14 May</span>
          </div>
        </div>
      </section>

      {/* Deck */}
      <section style={{padding: '64px 44px 0', display:'grid', gridTemplateColumns: '180px 1fr 300px', gap: 40}}>
        <div>
          <div style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: HERO.goldDim, fontWeight: 600}}>Byline</div>
          <div style={{marginTop: 10, fontSize: 13, color: HERO.textDim, lineHeight: 1.5}}>
            Profile by<br/>
            <span style={{fontFamily: SERIF, fontSize: 19, color: HERO.cream}}>Maya Karadağ</span>
          </div>
          <div style={{marginTop: 22, display:'flex', flexDirection:'column', gap: 6, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: HERO.textFaint, fontWeight: 600}}>
            <div>14 min read</div>
            <div>9mo in Kadıköy</div>
            <div>From London</div>
            <div>EN · TR · FR</div>
          </div>
        </div>
        <div>
          <HeroEyebrow label="Field notes · member profile"/>
          <p style={{fontFamily: SERIF, fontSize: 32, lineHeight: 1.25, letterSpacing: '-0.01em', color: HERO.cream, margin: '22px 0 0'}}>
            Came for a month, stayed because the ferry kept saving the writing. Now runs Wednesday dinners at Çiya and a quiet reading series at Mephisto. Slow to reply on Mondays; <em style={{color: HERO.gold}}>fast on the ferry.</em>
          </p>
          <div style={{display:'flex', gap: 8, flexWrap: 'wrap', marginTop: 28}}>
            {['Field Notes', 'Hosts dinners', 'Long-form', 'EN / TR / FR', 'Open to coffee', 'Walks at sunset', 'Reads on the ferry'].map(t => <HeroTag key={t}>{t}</HeroTag>)}
          </div>
        </div>
        <aside style={{borderLeft: `0.5px solid ${HERO.border}`, paddingLeft: 32}}>
          <div style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: HERO.goldDim, fontWeight: 600}}>How to reach</div>
          <div style={{marginTop: 14}}>
            <HeroLivePip label="open · replies ~2h"/>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap: 10, marginTop: 18}}>
            <button style={{
              padding: '13px 16px', borderRadius: 999, background: HERO.gold, color: HERO.deepWater,
              fontSize: 13, fontWeight: 600, fontFamily: SANS, textAlign: 'left',
              display: 'flex', justifyContent: 'space-between',
            }}>
              <span>Telegram · @maya-k</span><span>↗</span>
            </button>
            <button style={{
              padding: '13px 16px', borderRadius: 999, border: `0.5px solid ${HERO.border}`,
              color: HERO.cream, fontSize: 13, fontFamily: SANS, textAlign: 'left',
              display:'flex', justifyContent:'space-between',
            }}>
              <span>Wednesday dinner waitlist</span><span>+</span>
            </button>
            <button style={{
              padding: '13px 16px', borderRadius: 999, border: `0.5px solid ${HERO.border}`,
              color: HERO.textMute, fontSize: 13, fontFamily: SANS, textAlign: 'left',
              display:'flex', justifyContent:'space-between',
            }}>
              <span>Share this profile</span><span>⌗</span>
            </button>
          </div>
          <div style={{marginTop: 26, paddingTop: 18, borderTop: `0.5px solid ${HERO.border}`, display:'grid', gridTemplateColumns: '1fr 1fr', gap: 18}}>
            {[['Field notes','4'],['Events hosted','11'],['Member since',"Aug '25"],['Languages','3']].map(([k, v]) => (
              <div key={k}>
                <div style={{fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: HERO.textFaint, fontWeight: 600}}>{k}</div>
                <div style={{fontFamily: SERIF, fontSize: 26, color: HERO.cream, marginTop: 4}}>{v}</div>
              </div>
            ))}
          </div>
        </aside>
      </section>

      {/* Drop-cap body */}
      <section style={{padding: '88px 44px 0'}}>
        <div style={{display:'grid', gridTemplateColumns: '180px 1fr 1fr 300px', gap: 40}}>
          <div/>
          <div style={{gridColumn: '2 / span 2'}}>
            <p style={{fontSize: 17, lineHeight: 1.75, color: HERO.textDim, columnCount: 2, columnGap: 48, margin: 0}}>
              <span style={{
                fontFamily: SERIF, fontSize: 96, lineHeight: 0.82, float: 'left',
                marginRight: 14, marginTop: 6, marginBottom: -8, color: HERO.gold, fontStyle: 'italic',
              }}>I</span>
              run the Wednesday dinners and the occasional Field Notes live reading. Happy to read a draft, walk you to the simit man, or tell you why the Kadıköy library is the best free workspace in the city. The book is on chapter four. The ferry remains free advice. Mondays, I unplug — Tuesdays I'm at the market by 06:30 with a notebook and no plan; come find me if you like that kind of thing.
              <br/><br/>
              I don't take coffee meetings I can't bring something to. I do take them when you can tell me how a city you've lived in handles its dawn shift. We trade. Then we both go back to work.
            </p>
          </div>
          <div/>
        </div>
      </section>

      {/* Pull quote */}
      <section style={{padding: '72px 44px 0'}}>
        <div style={{display:'grid', gridTemplateColumns: '180px 1fr 180px', gap: 40}}>
          <div style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: HERO.textFaint, fontWeight: 600, textAlign: 'right'}}>PULL ·<br/>QUOTE</div>
          <blockquote style={{
            margin: 0, padding: '40px 0',
            borderTop: `0.5px solid ${HERO.border}`, borderBottom: `0.5px solid ${HERO.border}`,
            fontFamily: SERIF, fontSize: 56, lineHeight: 1.06, letterSpacing: '-0.015em', color: HERO.cream,
          }}>
            <span style={{color: HERO.gold}}>"</span>The ferry isn't a commute. It's the <em style={{color: HERO.gold}}>only part of the day</em> no one can take from you<span style={{color: HERO.gold}}>"</span>
            <div style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: HERO.goldDim, fontWeight: 600, marginTop: 26}}>
              — From "On the ferry as a third place", Field Notes 04
            </div>
          </blockquote>
          <div/>
        </div>
      </section>

      {/* Writing */}
      <section style={{padding: '96px 44px 0'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', borderBottom: `0.5px solid ${HERO.border}`, paddingBottom: 18}}>
          <HeroEyebrow label="Selected writing" kicker="14 total"/>
          <a style={{fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: HERO.goldDim, fontWeight: 600}}>all 14 pieces →</a>
        </div>
        <div style={{display:'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 28, marginTop: 28}}>
          {[
            ['01', 'On the ferry as a third place', 'Four months of taking the 17:35 with a laptop and no agenda. Why the Bosphorus is a better office than any rooftop.', `radial-gradient(70% 70% at 60% 40%, ${HERO.gold} 0%, transparent 50%), linear-gradient(180deg, ${HERO.waterHi}, ${HERO.deepWater})`, '14 min', '07 May 26', 380],
            ['02', 'The library and the dentist', 'Two soft-landing pieces of infrastructure that quietly decide whether you stay or leave.', `linear-gradient(160deg, ${HERO.water} 0%, ${HERO.waterEdge} 100%)`, '8 min', '22 Apr 26', 240],
            ['03', 'Tuesday, written down', 'A diary of a market day from 06:00 to 22:00 in Yeldeğirmeni.', `radial-gradient(80% 60% at 80% 100%, ${HERO.rose} 0%, transparent 60%), linear-gradient(170deg, ${HERO.water}, ${HERO.deepWater})`, '11 min', '03 Apr 26', 240],
          ].map(([n, title, blurb, bg, time, date, h], i) => (
            <article key={title} style={{display:'flex', flexDirection:'column', gap: 16}}>
              <div style={{
                height: h, borderRadius: 12, position: 'relative', overflow: 'hidden',
                border: `0.5px solid ${HERO.border}`, background: bg,
              }}>
                <div style={{position: 'absolute', inset: 0, opacity: 0.35, backgroundImage: `repeating-linear-gradient(90deg, rgba(246,236,217,0.05) 0 1px, transparent 1px 14px), repeating-linear-gradient(0deg, rgba(246,236,217,0.04) 0 1px, transparent 1px 14px)`}}/>
                <div style={{position: 'absolute', top: 12, left: 14, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: HERO.cream, fontWeight: 600, opacity: 0.7}}>N° {n}</div>
                <div style={{position: 'absolute', bottom: 12, left: 14, right: 14, display:'flex', justifyContent:'space-between', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: HERO.cream, fontWeight: 600, opacity: 0.65}}>
                  <span>{['Ferry crossing', 'Library / dentist', 'Tuesday pazar'][i]}</span>
                  <span>↳ photo slot</span>
                </div>
              </div>
              <div style={{display:'flex', gap: 14, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: HERO.textFaint, fontWeight: 600}}>
                <span style={{color: HERO.gold}}>{date}</span>
                <span>·</span>
                <span>{time}</span>
              </div>
              <h3 style={{fontFamily: SERIF, fontSize: i === 0 ? 36 : 24, letterSpacing: '-0.015em', lineHeight: 1.08, margin: 0, color: HERO.cream, fontWeight: 400}}>{title}</h3>
              <p style={{fontSize: 14, color: HERO.textDim, lineHeight: 1.55, margin: 0}}>{blurb}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Words + Hosting */}
      <section style={{padding: '96px 44px 0'}}>
        <div style={{display:'grid', gridTemplateColumns: '1fr 1fr', gap: 56}}>
          <div>
            <HeroEyebrow label="In other members' words"/>
            <div style={{marginTop: 28, borderTop: `0.5px solid ${HERO.border}`}}>
              {[
                ['Took me to the right hammam on day 3 of my stay. The whole city felt easier after that.', 'Eli S.', 'Cihangir · 1mo'],
                ['Her edit notes are surgical. The book will be good because of her.', 'Cem K.', 'Kadıköy · 6mo'],
                ['Wednesday dinners are the most reliably good evenings of my month.', 'Rin H.', 'Kadıköy · 5mo'],
                ['Read a chapter of mine on a Sunday. It came back kinder than I deserved.', 'Mira V.', 'Karaköy · 4mo'],
              ].map(([q, a, sub], i) => (
                <div key={i} style={{padding: '22px 0', borderBottom: `0.5px solid ${HERO.border}`}}>
                  <p style={{fontFamily: SERIF, fontSize: 17, lineHeight: 1.42, letterSpacing: '-0.005em', color: HERO.cream, margin: 0}}>
                    <span style={{color: HERO.gold}}>"</span>{q}<span style={{color: HERO.gold}}>"</span>
                  </p>
                  <div style={{fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: HERO.textFaint, fontWeight: 600, marginTop: 10, display:'flex', gap: 12}}>
                    <span style={{color: HERO.goldDim}}>— {a}</span><span>·</span><span>{sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <HeroEyebrow label="Hosting next" kicker="2 upcoming"/>
            <div style={{marginTop: 28, display:'flex', flexDirection:'column', gap: 14}}>
              {[
                ['THU 15 MAY', '19:30', 'Wednesday dinner · Çiya', 'Kadıköy · long table for 24', '23/24 · waitlist'],
                ['TUE 27 MAY', '20:00', 'Field Notes · live reading', 'Mephisto · 4 readers, 40 seats', '34/40 · open'],
              ].map((r, i) => (
                <div key={i} style={{
                  borderRadius: 14, border: `0.5px solid ${HERO.border}`, background: HERO.water,
                  padding: '22px 24px', display:'grid', gridTemplateColumns: 'auto 1fr', gap: 24,
                }}>
                  <div style={{borderRight: `0.5px solid ${HERO.border}`, paddingRight: 24}}>
                    <div style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: HERO.gold, fontWeight: 600}}>{r[0]}</div>
                    <div style={{fontFamily: SERIF, fontSize: 36, color: HERO.cream, marginTop: 8, letterSpacing: '-0.02em'}}>{r[1]}</div>
                  </div>
                  <div>
                    <div style={{fontFamily: SERIF, fontSize: 21, letterSpacing: '-0.01em', color: HERO.cream}}>{r[2]}</div>
                    <div style={{fontSize: 11, color: HERO.textMute, marginTop: 8, letterSpacing: '0.04em'}}>{r[3]}</div>
                    <div style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: HERO.live, fontWeight: 600, marginTop: 10}}>{r[4]}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{marginTop: 26, padding: '18px 22px', border: `0.5px dashed ${HERO.borderHi}`, borderRadius: 12}}>
              <div style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: HERO.goldDim, fontWeight: 600}}>Next month</div>
              <p style={{fontSize: 13, color: HERO.textDim, marginTop: 8, lineHeight: 1.5, margin: '8px 0 0'}}>
                Planning a Tuesday market walk-and-write in June. Want in? Tell her on Telegram.
              </p>
            </div>
          </div>
        </div>
      </section>

      <HeroFooter/>
    </HeroArtboard>
  );
};


/* ═══════════════════════════════════════════════════════════════════════
   PROFILE · variant C — utility / quiet
   ═══════════════════════════════════════════════════════════════════════ */
const ProfileQuietPage = () => {
  return (
    <HeroArtboard height={2700} label="Profile · quiet">
      <HeroNav active="Members"/>

      <section style={{padding: '40px 80px 0'}}>
        <div style={{fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: HERO.textFaint, display:'flex', justifyContent:'space-between', fontWeight: 600}}>
          <span>Members / <span style={{color: HERO.cream}}>Maya K.</span></span>
          <span>maya-k · public · last edit 14 May</span>
        </div>

        <div style={{marginTop: 48, display:'grid', gridTemplateColumns: '80px 1fr 340px', gap: 28, alignItems: 'start'}}>
          <HeroAvatar size={76} hue={HERO.gold} online/>
          <div>
            <h1 style={{fontFamily: SERIF, fontSize: 64, lineHeight: 1, letterSpacing: '-0.02em', margin: 0, color: HERO.cream, fontWeight: 400}}>
              Maya Karadağ
            </h1>
            <div style={{fontSize: 12, color: HERO.textDim, marginTop: 16, display:'flex', gap: 14, flexWrap: 'wrap', letterSpacing: '0.04em'}}>
              <span style={{color: HERO.cream}}>Writer</span>
              <span style={{color: HERO.textFaint}}>·</span>
              <span>Kadıköy · 9mo</span>
              <span style={{color: HERO.textFaint}}>·</span>
              <span>From London</span>
              <span style={{color: HERO.textFaint}}>·</span>
              <span>EN / TR / FR</span>
              <span style={{color: HERO.textFaint}}>·</span>
              <span style={{color: HERO.live, display:'inline-flex', alignItems:'center', gap: 6}}>
                <span style={{width: 6, height: 6, borderRadius: 3, background: HERO.live, boxShadow: `0 0 6px ${HERO.live}`}}/> open · replies ~2h
              </span>
            </div>
            <p style={{fontFamily: SERIF, fontSize: 19, lineHeight: 1.45, letterSpacing: '-0.005em', color: HERO.cream, margin: '20px 0 0', maxWidth: 680}}>
              Long-form features writer. Working on a book about how cities decide what they sound like at 03:00. Came for a month; the ferry kept saving the writing.
            </p>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap: 10}}>
            <button style={{padding: '14px 18px', borderRadius: 999, background: HERO.gold, color: HERO.deepWater, fontSize: 14, fontWeight: 600, fontFamily: SANS, textAlign: 'left', display:'flex', justifyContent:'space-between'}}>
              <span>Telegram · @maya-k</span><span>↗</span>
            </button>
            <button style={{padding: '14px 18px', borderRadius: 999, border: `0.5px solid ${HERO.border}`, color: HERO.cream, fontSize: 14, fontFamily: SANS, textAlign: 'left', display:'flex', justifyContent:'space-between'}}>
              <span>Read field notes · 4</span><span>→</span>
            </button>
            <button style={{padding: '14px 18px', borderRadius: 999, border: `0.5px solid ${HERO.border}`, color: HERO.textMute, fontSize: 14, fontFamily: SANS, textAlign: 'left', display:'flex', justifyContent:'space-between'}}>
              <span>Wednesday dinner · waitlist</span><span>+</span>
            </button>
          </div>
        </div>
      </section>

      {/* structured fields */}
      <section style={{padding: '72px 80px 0'}}>
        <div style={{borderTop: `0.5px solid ${HERO.border}`}}>
          {[
            ['Working on', 'A book — How cities sound at 03:00. Roughly chapter 4 of 9. Reading drafts welcome.'],
            ['Will happily', 'Read your draft. Walk you to the simit man. Tell you why the library is the best free workspace in the city. Co-host a Tuesday market walk.'],
            ['Will not', "Take a coffee meeting on Mondays. Be on Zoom before 11:00. Recommend a digital-nomad-friendly café (they're all fine)."],
            ['Trade you for', 'How your city handles dawn. A good rec for Tokyo, NYC, Berlin, or Marseille.'],
            ['Hosts', 'Wednesday dinners at Çiya · monthly. Field Notes live readings · seasonal.'],
            ['Tags', null],
            ['Background', 'Ex-Wired, ex-Wired UK. Long-form features. Edits when invited. Walks before writing.'],
          ].map(([k, v], i) => (
            <div key={k} style={{
              display:'grid', gridTemplateColumns: '180px 1fr 60px', gap: 40, alignItems: 'start',
              padding: '22px 0', borderBottom: `0.5px solid ${HERO.border}`,
            }}>
              <div style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: HERO.gold, fontWeight: 600}}>{k}</div>
              {k === 'Tags' ? (
                <div style={{display:'flex', gap: 8, flexWrap: 'wrap'}}>
                  {['Field Notes', 'Hosts dinners', 'Long-form', 'EN / TR / FR', 'Open to coffee', 'Walks at sunset', 'Reads on the ferry'].map(t => <HeroTag key={t}>{t}</HeroTag>)}
                </div>
              ) : (
                <p style={{fontFamily: SERIF, fontSize: 17, color: HERO.cream, lineHeight: 1.55, margin: 0, letterSpacing: '-0.005em'}}>{v}</p>
              )}
              <div style={{fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: HERO.textFaint, fontWeight: 600, textAlign: 'right'}}>{String(i+1).padStart(2,'0')}</div>
            </div>
          ))}
        </div>
      </section>

      {/* stats strip */}
      <section style={{padding: '64px 80px 0'}}>
        <div style={{display:'grid', gridTemplateColumns: 'repeat(5, 1fr)', border: `0.5px solid ${HERO.border}`, borderRadius: 14, overflow: 'hidden', background: HERO.water}}>
          {[
            ['Field notes', '4', 'longest: 14 min'],
            ['Events hosted', '11', '· 8 dinners · 3 readings'],
            ['Member since', "Aug '25", '9 months'],
            ['Languages', '3', 'EN · TR · FR'],
            ['Reply time', '~2h', 'fastest 11:00–18:00'],
          ].map(([k, v, sub], i) => (
            <div key={k} style={{padding: '24px 22px', borderRight: i < 4 ? `0.5px solid ${HERO.border}` : 'none'}}>
              <div style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: HERO.goldDim, fontWeight: 600}}>{k}</div>
              <div style={{fontFamily: SERIF, fontSize: 36, color: HERO.cream, marginTop: 12, letterSpacing: '-0.02em'}}>{v}</div>
              <div style={{fontSize: 11, color: HERO.textMute, marginTop: 6, letterSpacing: '0.04em'}}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{padding: '64px 80px 0', display:'grid', gridTemplateColumns: '1fr 1fr', gap: 56}}>
        <div>
          <HeroEyebrow label="Hosting next · 2"/>
          <div style={{marginTop: 18, borderRadius: 14, border: `0.5px solid ${HERO.border}`, overflow: 'hidden'}}>
            {[
              ['THU 15', '19:30', 'Wednesday dinner', 'Çiya · Kadıköy', '23/24'],
              ['TUE 27', '20:00', 'Field Notes · reading', 'Mephisto', '34/40'],
            ].map((r, i) => (
              <div key={i} style={{
                display:'grid', gridTemplateColumns: '88px 70px 1fr auto', gap: 18, alignItems: 'center',
                padding: '18px 22px', borderTop: i === 0 ? 'none' : `0.5px solid ${HERO.border}`,
              }}>
                <div style={{fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: HERO.gold, fontWeight: 600}}>{r[0]}</div>
                <div style={{fontFamily: SERIF, fontSize: 18, color: HERO.cream}}>{r[1]}</div>
                <div>
                  <div style={{fontFamily: SERIF, fontSize: 16, color: HERO.cream}}>{r[2]}</div>
                  <div style={{fontSize: 11, color: HERO.textFaint, marginTop: 4, letterSpacing: '0.04em'}}>{r[3]}</div>
                </div>
                <div style={{fontSize: 12, color: HERO.textMute, letterSpacing: '0.04em'}}>{r[4]}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <HeroEyebrow label="In other members' words · 3"/>
          <div style={{marginTop: 18, borderTop: `0.5px solid ${HERO.border}`}}>
            {[
              ['Took me to the right hammam on day 3.', 'Eli S. · Cihangir'],
              ['Edit notes are surgical.', 'Cem K. · Kadıköy'],
              ['Wednesdays are the most reliably good evenings of my month.', 'Rin H. · Kadıköy'],
            ].map(([q, a], i) => (
              <div key={i} style={{padding: '16px 0', borderBottom: `0.5px solid ${HERO.border}`}}>
                <p style={{fontFamily: SERIF, fontSize: 15, lineHeight: 1.45, letterSpacing: '-0.005em', color: HERO.cream, margin: 0}}>"{q}"</p>
                <div style={{fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: HERO.goldDim, fontWeight: 600, marginTop: 6}}>— {a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{padding: '64px 80px 0', display: 'flex', justifyContent: 'space-between', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: HERO.textFaint, fontWeight: 600}}>
        <span>↳ this profile is opt-in · istanbulnomads.com/m/maya-k</span>
        <span>report · edit · download as plaintext</span>
      </div>

      <HeroFooter/>
    </HeroArtboard>
  );
};

window.MembersListPage = MembersListPage;
window.MembersMapPage = MembersMapPage;
window.ProfileEditorialPage = ProfileEditorialPage;
window.ProfileQuietPage = ProfileQuietPage;
