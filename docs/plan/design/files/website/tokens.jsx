/* Design Tokens artboard */

const TokensPage = () => {
  return (
    <div className="in-artboard" style={{width:1440, minHeight:3640, padding:'56px 56px 96px'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:64}}>
        <div>
          <SectionEyebrow num="N° 00" label="Design tokens" kicker="ferry-first, laptop-ready"/>
          <h1 style={{fontSize:104, lineHeight:0.94, letterSpacing:'-0.04em', marginTop:24, fontWeight:300}}>
            The <span style={{fontStyle:'italic', color:'var(--terracotta)'}}>system</span>, written down.
          </h1>
        </div>
        <div style={{textAlign:'right'}}>
          <div className="in-mono" style={{color:'var(--paper-mute)', fontSize:11}}>Istanbul Nomads · v2.0</div>
          <div className="in-mono" style={{color:'var(--paper-faint)', fontSize:10.5, marginTop:6}}>Generated 11 May 2026</div>
        </div>
      </div>

      {/* COLOR */}
      <section style={{marginBottom:96}}>
        <div style={{display:'grid', gridTemplateColumns:'200px 1fr', gap:48, alignItems:'start'}}>
          <div>
            <SectionEyebrow num="01" label="Color"/>
            <p style={{fontSize:13.5, color:'var(--paper-dim)', marginTop:14, lineHeight:1.55}}>
              Dark-mode native. A deep navy-black base with three warm accents borrowed from a Kadıköy morning. No teal-and-purple.
            </p>
          </div>
          <div>
            <div className="in-mono" style={{color:'var(--paper-mute)', marginBottom:14}}>Ink - surface and text</div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:0, border:'1px solid var(--ink-3)', marginBottom:32}}>
              {[
                ['Ink 0',  '#0b0e11', 'void'],
                ['Ink 1',  '#0e1216', 'canvas'],
                ['Ink 2',  '#141a20', 'surface'],
                ['Ink 3',  '#1c232b', 'raised'],
                ['Ink 4',  '#283038', 'hairline'],
                ['Ink 5',  '#3a444f', 'border'],
              ].map(([n, v, sub], i) => (
                <div key={n} style={{borderRight: i<5 ? '1px solid var(--ink-3)' : 'none'}}>
                  <div style={{height:120, background:v}}/>
                  <div style={{padding:'14px 16px', background:'var(--ink-2)'}}>
                    <div style={{fontSize:13, color:'var(--paper)'}}>{n}</div>
                    <div className="in-mono" style={{fontSize:10, color:'var(--paper-mute)', marginTop:4}}>{v}</div>
                    <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', marginTop:2}}>↳ {sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="in-mono" style={{color:'var(--paper-mute)', marginBottom:14}}>Paper - primary text</div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:0, border:'1px solid var(--ink-3)', marginBottom:32}}>
              {[
                ['Paper',       '#f4ead7', 'body, headlines'],
                ['Paper dim',   '#d9cfba', 'secondary'],
                ['Paper mute',  '#a39c8b', 'captions, mono'],
                ['Paper faint', '#6f6a5e', 'metadata'],
              ].map(([n, v, sub], i) => (
                <div key={n} style={{borderRight: i<3 ? '1px solid var(--ink-3)' : 'none'}}>
                  <div style={{height:120, background:v}}/>
                  <div style={{padding:'14px 16px', background:'var(--ink-2)'}}>
                    <div style={{fontSize:13, color:'var(--paper)'}}>{n}</div>
                    <div className="in-mono" style={{fontSize:10, color:'var(--paper-mute)', marginTop:4}}>{v}</div>
                    <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', marginTop:2}}>↳ {sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="in-mono" style={{color:'var(--paper-mute)', marginBottom:14}}>Accents - sparingly</div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:0, border:'1px solid var(--ink-3)'}}>
              {[
                ['Terracotta',    '#c4633a', 'primary accent'],
                ['Bosphorus',     '#3d6b8a', 'secondary'],
                ['Ferry yellow',  '#e7b04a', 'tertiary highlight'],
                ['Moss',          '#6b7d4e', 'success / nature'],
                ['Terracotta dim','#8e4424', 'pressed / hover'],
              ].map(([n, v, sub], i) => (
                <div key={n} style={{borderRight: i<4 ? '1px solid var(--ink-3)' : 'none'}}>
                  <div style={{height:120, background:v}}/>
                  <div style={{padding:'14px 16px', background:'var(--ink-2)'}}>
                    <div style={{fontSize:13, color:'var(--paper)'}}>{n}</div>
                    <div className="in-mono" style={{fontSize:10, color:'var(--paper-mute)', marginTop:4}}>{v}</div>
                    <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', marginTop:2}}>↳ {sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TYPE */}
      <section style={{marginBottom:96}}>
        <div style={{display:'grid', gridTemplateColumns:'200px 1fr', gap:48, alignItems:'start'}}>
          <div>
            <SectionEyebrow num="02" label="Type"/>
            <p style={{fontSize:13.5, color:'var(--paper-dim)', marginTop:14, lineHeight:1.55}}>
              Fraunces for display + body serif, Geist for UI/text, JetBrains Mono for numbers and metadata. Vazirmatn for RTL (FA, AR).
            </p>
          </div>
          <div>
            <div style={{border:'1px solid var(--ink-3)', padding:32, marginBottom:24, background:'var(--ink-2)'}}>
              <div className="in-mono" style={{color:'var(--paper-mute)', marginBottom:14}}>Fraunces · display</div>
              <div style={{fontFamily:'var(--serif)', fontSize:96, fontWeight:300, lineHeight:0.95, letterSpacing:'-0.04em'}}>
                Ferry-first, <span style={{fontStyle:'italic', color:'var(--terracotta)'}}>laptop-ready</span>.
              </div>
              <div style={{fontFamily:'var(--serif)', fontSize:32, fontWeight:400, lineHeight:1.05, letterSpacing:'-0.02em', marginTop:24, color:'var(--paper-dim)'}}>
                Asia base. Ferry reset. Evening table.
              </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:24}}>
              <div style={{border:'1px solid var(--ink-3)', padding:24, background:'var(--ink-2)'}}>
                <div className="in-mono" style={{color:'var(--paper-mute)', marginBottom:14}}>Geist · text</div>
                <p style={{fontSize:15, lineHeight:1.6, color:'var(--paper)'}}>
                  Istanbul is the answer most members give after a week of pretending to think about it. The Asia-side default: ferries every twenty minutes, a real Tuesday market, more bookshops than is sensible.
                </p>
                <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', marginTop:14}}>15px / 1.6 · 400 weight · feature ss01</div>
              </div>
              <div style={{border:'1px solid var(--ink-3)', padding:24, background:'var(--ink-2)'}}>
                <div className="in-mono" style={{color:'var(--paper-mute)', marginBottom:14}}>JetBrains Mono · meta</div>
                <div className="in-mono" style={{fontSize:13, color:'var(--paper)', lineHeight:1.7}}>
                  ISTANBUL · 41°00′N 28°58′E<br/>
                  UTC+3 · TRY ₺ · ferry 07:15 → 22:40<br/>
                  EN · TR · FA · AR · RU<br/>
                  ₺28,500 / month median rent
                </div>
                <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', marginTop:14}}>11–13px · tabular nums · uppercase eyebrows</div>
              </div>
            </div>

            {/* scale strip */}
            <div style={{border:'1px solid var(--ink-3)', padding:24, background:'var(--ink-2)'}}>
              <div className="in-mono" style={{color:'var(--paper-mute)', marginBottom:18}}>Scale · serif display → mono caption</div>
              <div style={{display:'flex', flexDirection:'column', gap:14}}>
                {[
                  ['132 / Display', 'Aa Mm', 'var(--serif)', 132, '-0.045em'],
                  ['88 / H1', 'Aa Mm Ferry', 'var(--serif)', 80, '-0.04em'],
                  ['56 / H2', 'Asia base. Ferry reset.', 'var(--serif)', 52, '-0.03em'],
                  ['38 / H3', 'Neighborhoods worth a season', 'var(--serif)', 38, '-0.025em'],
                  ['28 / H4', 'Cafés, by what they\u2019re for', 'var(--serif)', 28, '-0.02em'],
                  ['19 / Lede', 'Land softly. Plan your week. Find your people.', 'var(--sans)', 19, '0'],
                  ['16 / Body', 'Live here if you want to live here, not visit.', 'var(--sans)', 16, '0'],
                  ['12 / Mono', 'MADE IN KADIKÖY · EST. 2023 · 1,847 MEMBERS', 'var(--mono)', 12, '0.08em'],
                ].map(([lbl, sample, fam, size, ls]) => (
                  <div key={lbl} style={{display:'grid', gridTemplateColumns:'130px 1fr', gap:18, alignItems:'baseline', paddingBottom:10, borderBottom:'1px solid var(--ink-3)'}}>
                    <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>{lbl}</div>
                    <div style={{fontFamily:fam, fontSize:size, letterSpacing:ls, lineHeight:1.05, color:'var(--paper)'}}>{sample}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SPACING + RADIUS + MOTION */}
      <section style={{marginBottom:96}}>
        <div style={{display:'grid', gridTemplateColumns:'200px 1fr 1fr 1fr', gap:32, alignItems:'start'}}>
          <div style={{gridColumn:'1'}}>
            <SectionEyebrow num="03" label="Spacing · radius · motion"/>
            <p style={{fontSize:13.5, color:'var(--paper-dim)', marginTop:14, lineHeight:1.55}}>
              4px base scale, radius restrained (most things are 2px / square), motion subtle.
            </p>
          </div>

          {/* spacing */}
          <div style={{border:'1px solid var(--ink-3)', padding:24, background:'var(--ink-2)'}}>
            <div className="in-mono" style={{color:'var(--paper-mute)', marginBottom:18}}>Spacing · 4px base</div>
            {[4,8,12,16,24,32,48,64,96,128].map((s, i) => (
              <div key={s} style={{display:'flex', alignItems:'center', gap:14, padding:'4px 0'}}>
                <div className="in-mono" style={{fontSize:10, color:'var(--paper-mute)', width:56}}>s-{i+1} · {s}px</div>
                <div style={{height:8, background:'var(--terracotta)', width:s}}/>
              </div>
            ))}
          </div>

          {/* radius */}
          <div style={{border:'1px solid var(--ink-3)', padding:24, background:'var(--ink-2)'}}>
            <div className="in-mono" style={{color:'var(--paper-mute)', marginBottom:18}}>Radius · restrained</div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
              {[
                ['r-1', '2px', 'cards, photos'],
                ['r-2', '4px', 'inputs'],
                ['r-3', '8px', 'menus'],
                ['r-4', '14px', 'rare'],
                ['pill', '999px', 'tags only'],
                ['-',   '0',     'tables, rules'],
              ].map(([n, v, sub]) => (
                <div key={n} style={{display:'flex', flexDirection:'column', gap:8}}>
                  <div style={{height:48, background:'var(--ink-3)', borderRadius:v, border:'1px solid var(--ink-4)'}}/>
                  <div className="in-mono" style={{fontSize:10, color:'var(--paper-mute)'}}>{n} · {v}</div>
                  <div className="in-mono" style={{fontSize:9.5, color:'var(--paper-faint)', marginTop:-2}}>↳ {sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* motion */}
          <div style={{border:'1px solid var(--ink-3)', padding:24, background:'var(--ink-2)'}}>
            <div className="in-mono" style={{color:'var(--paper-mute)', marginBottom:18}}>Motion · quietly</div>
            <div style={{display:'flex', flexDirection:'column', gap:16}}>
              {[
                ['t-fast', '140ms', 'Hover, focus rings'],
                ['t-mid',  '280ms', 'Open / close, page transitions'],
                ['t-slow', '520ms', 'Fade-ins on first scroll'],
              ].map(([n, v, sub]) => (
                <div key={n} style={{borderTop:'1px solid var(--ink-3)', paddingTop:14}}>
                  <div style={{display:'flex', justifyContent:'space-between'}}>
                    <span style={{fontSize:14, color:'var(--paper)'}}>{n}</span>
                    <span className="in-num" style={{fontSize:14, color:'var(--paper)'}}>{v}</span>
                  </div>
                  <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', marginTop:4}}>↳ {sub}</div>
                </div>
              ))}
              <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-mute)', borderTop:'1px solid var(--ink-3)', paddingTop:14}}>
                ease · cubic-bezier(.2,.7,.3,1)<br/>
                ↳ no spring, no bounce, no parallax
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPONENTS strip */}
      <section>
        <div style={{display:'grid', gridTemplateColumns:'200px 1fr', gap:48, alignItems:'start'}}>
          <div>
            <SectionEyebrow num="04" label="Components"/>
            <p style={{fontSize:13.5, color:'var(--paper-dim)', marginTop:14, lineHeight:1.55}}>
              Built from atoms, not from a UI kit. The buttons and tags are the only things that recur - most pages are composed.
            </p>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:24}}>
            <div style={{border:'1px solid var(--ink-3)', padding:28, background:'var(--ink-2)'}}>
              <div className="in-mono" style={{color:'var(--paper-mute)', marginBottom:18}}>Buttons</div>
              <div style={{display:'flex', flexDirection:'column', gap:14, alignItems:'flex-start'}}>
                <button style={{padding:'14px 24px', background:'var(--terracotta)', color:'var(--ink-0)', borderRadius:2, fontSize:14, fontWeight:500}}>Primary · terracotta →</button>
                <button style={{padding:'14px 24px', background:'var(--paper)', color:'var(--ink-0)', borderRadius:2, fontSize:14, fontWeight:500}}>Secondary · paper →</button>
                <button style={{padding:'14px 24px', border:'1px solid var(--ink-4)', borderRadius:2, fontSize:14, color:'var(--paper)'}}>Tertiary · outline</button>
                <button style={{padding:'8px 14px', border:'1px solid var(--ink-4)', borderRadius:999, fontSize:12.5, color:'var(--paper)'}}>Pill · for filters</button>
                <a style={{fontSize:14, color:'var(--terracotta)', borderBottom:'1px solid var(--terracotta)', paddingBottom:2}}>Link · underlined →</a>
              </div>
            </div>

            <div style={{border:'1px solid var(--ink-3)', padding:28, background:'var(--ink-2)'}}>
              <div className="in-mono" style={{color:'var(--paper-mute)', marginBottom:18}}>Tags · metadata</div>
              <div style={{display:'flex', flexWrap:'wrap', gap:8}}>
                {['Ferry-first', 'Walkable', 'Long-stay', 'Loud at 02:00', 'Asia side', 'Open to coffee', 'Hiring'].map(t => <span key={t} className="in-tag">{t}</span>)}
              </div>
              <div className="in-mono" style={{color:'var(--paper-mute)', marginTop:24, marginBottom:14}}>Eyebrow + mark</div>
              <SectionEyebrow num="N° 0X" label="Section eyebrow" kicker="optional kicker"/>
            </div>

            <div style={{border:'1px solid var(--ink-3)', padding:28, background:'var(--ink-2)', gridColumn:'1 / -1'}}>
              <div className="in-mono" style={{color:'var(--paper-mute)', marginBottom:18}}>Photo placeholders - atmospheric, mono-labeled</div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:14}}>
                {[
                  ['dawn', 'Kadıköy pier, 06:48'],
                  ['dusk', 'Galata, sunset'],
                  ['bosphorus', 'Bosphorus crossing'],
                  ['interior', 'Café, Yeldeğirmeni'],
                  ['street', 'Bahariye, 18:00'],
                  ['mono', 'Editorial / fallback'],
                ].map(([k, l]) => (
                  <PhotoSlot key={k} kind={k} corner={k} label={l} style={{height:140, borderRadius:2}}/>
                ))}
              </div>
              <div className="in-mono" style={{color:'var(--paper-faint)', marginTop:14, fontSize:10.5}}>
                ↳ Placeholder slots → replaced 1:1 with real Istanbul photography. Slots show the intent, the photo carries the brand.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

window.TokensPage = TokensPage;
