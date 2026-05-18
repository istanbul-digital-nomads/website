/* Homepage - long scroll, editorial-grid */

const HomePage = () => {
  return (
    <div className="in-artboard" style={{width:1440, minHeight:7820}}>
      <NavBar active="Home"/>

      {/* HERO - first scroll does the whole job */}
      <section style={{padding:'56px 56px 0', position:'relative'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:80}}>
          <div style={{display:'flex', alignItems:'center', gap:14}}>
            <span className="in-mono" style={{color:'var(--terracotta)'}}>N° 01</span>
            <span className="in-mark"/>
            <span className="in-mono" style={{color:'var(--paper-mute)'}}>Soft landing → Long stay</span>
          </div>
          <div className="in-mono" style={{color:'var(--paper-mute)', textAlign:'right', lineHeight:1.7, fontSize:10.5}}>
            41°00′44″N · 28°58′34″E<br/>
            Weather 19° / Bosphorus 17°<br/>
            1,847 in Telegram · 38 here this month
          </div>
        </div>

        <div style={{position:'relative'}}>
          <h1 style={{
            fontSize:148,
            fontWeight:300,
            letterSpacing:'-0.045em',
            lineHeight:0.92,
            maxWidth:1240,
            fontFamily:'var(--serif)',
          }}>
            Istanbul, for people<br/>
            who work remotely <span style={{fontStyle:'italic', fontWeight:400, color:'var(--terracotta)'}}>&</span><br/>
            want to <span style={{fontStyle:'italic', fontWeight:400}}>stay a while.</span>
          </h1>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:0, marginTop:72, borderTop:'1px solid var(--ink-4)'}}>
          {[
            ['01', 'Land softly', 'A 7-day plan for your first week - SIM, bank, hammam, ferry.'],
            ['02', 'Plan your week', 'Tools that know which cafés have power on Tuesdays.'],
            ['03', 'Find your people', 'A Telegram with 1,847 humans, not a Slack of strangers.'],
            ['04', 'Stay a season', 'Visa, lease, dentist, gym. The unromantic stuff, written down.'],
          ].map(([n, h, p], i) => (
            <div key={n} style={{
              padding:'28px 28px 28px 0', paddingLeft: i===0 ? 0 : 28,
              borderRight: i<3 ? '1px solid var(--ink-4)' : 'none',
            }}>
              <div className="in-mono" style={{color:'var(--terracotta)', marginBottom:14}}>{n}</div>
              <div style={{fontFamily:'var(--serif)', fontSize:24, lineHeight:1.1, marginBottom:10, letterSpacing:'-0.015em'}}>{h}</div>
              <div style={{fontSize:13.5, color:'var(--paper-dim)', lineHeight:1.55}}>{p}</div>
            </div>
          ))}
        </div>

        <div style={{display:'flex', alignItems:'center', gap:16, marginTop:48}}>
          <button style={{
            padding:'18px 28px', background:'var(--terracotta)', color:'var(--ink-0)',
            borderRadius:2, fontWeight:500, fontSize:14, display:'flex', alignItems:'center', gap:12,
          }}>
            Open the First Week Planner
            <span style={{fontFamily:'var(--mono)', fontSize:11, opacity:0.7}}>·  /planner</span>
            <span style={{marginLeft:4}}>→</span>
          </button>
          <button style={{
            padding:'18px 28px', border:'1px solid var(--ink-4)',
            borderRadius:2, fontSize:14, color:'var(--paper)', display:'flex', alignItems:'center', gap:12,
          }}>
            Take the Neighborhood Matcher
            <span className="in-mono" style={{fontSize:10.5, color:'var(--paper-mute)'}}>· 8 questions</span>
          </button>
          <div className="in-mono" style={{marginLeft:14, color:'var(--paper-faint)', fontSize:10.5, lineHeight:1.5}}>
            Or read first.<br/>
            Both are free.
          </div>
        </div>

        {/* Atmospheric photo banner */}
        <PhotoSlot
          kind="dawn"
          label="Kadıköy pier, 06:48 - ferry leaving for Karaköy"
          corner="01 / Hero"
          style={{
            marginTop:64, height:480, borderRadius:2,
          }}
        />
      </section>

      {/* ASIA BASE / FERRY RESET / EVENING TABLE  */}
      <section style={{padding:'128px 56px 0'}}>
        <SectionEyebrow num="N° 02" label="The shape of a week here" kicker="not a productivity system"/>
        <div style={{display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:96, marginTop:32}}>
          <h2 style={{fontSize:80, lineHeight:0.98, letterSpacing:'-0.035em'}}>
            <span style={{color:'var(--terracotta)', fontStyle:'italic'}}>Asia base.</span><br/>
            <span style={{color:'var(--bosphorus)', fontStyle:'italic'}}>Ferry reset.</span><br/>
            <span style={{color:'var(--ferry-yellow)', fontStyle:'italic'}}>Evening table.</span>
          </h2>
          <div style={{paddingTop:14}}>
            <p style={{fontSize:19, color:'var(--paper-dim)', lineHeight:1.5, marginBottom:24}}>
              Three calls a day, two coffees, one ferry. The city is a commute and the commute is the city. Most weeks settle into a rhythm somewhere between <em style={{fontFamily:'var(--serif)'}}>this is where I work</em> and <em style={{fontFamily:'var(--serif)'}}>this is where I live</em>.
            </p>
            <p style={{fontSize:15, color:'var(--paper-mute)', lineHeight:1.6, marginBottom:32}}>
              We sort guides, tools and people around that rhythm. Not <em>discover the magic of Istanbul</em>. Just - Tuesday at 14:00, the Wi-Fi at Kahve Dünyası in Moda dropped, where else has a window seat.
            </p>
            <div className="in-mono" style={{color:'var(--paper-faint)', fontSize:11, paddingTop:24, borderTop:'1px solid var(--ink-3)'}}>
              ↳ This is the part most "nomad city" sites get wrong.
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS - Planner + Matcher previews, asymmetric */}
      <section style={{padding:'128px 56px 0'}}>
        <SectionEyebrow num="N° 03" label="The two tools" kicker="polish, not flash"/>
        <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:24, marginTop:40, alignItems:'stretch'}}>

          {/* Planner mini */}
          <div style={{background:'var(--ink-2)', border:'1px solid var(--ink-3)', borderRadius:2, padding:'40px 40px 0', position:'relative', overflow:'hidden'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
              <div>
                <div className="in-mono" style={{color:'var(--terracotta)', marginBottom:14}}>Tool 01 · /planner</div>
                <h3 style={{fontSize:48, letterSpacing:'-0.03em', lineHeight:1}}>First Week Planner</h3>
                <p style={{fontSize:15, color:'var(--paper-dim)', marginTop:18, maxWidth:480, lineHeight:1.55}}>
                  Answer six questions about your arrival. Get back a Mon–Sun schedule with addresses, ferry times and the one café open before 09:00.
                </p>
              </div>
              <div className="in-tag">↳ 4,210 plans generated</div>
            </div>

            <div style={{marginTop:40, display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:1, background:'var(--ink-4)', border:'1px solid var(--ink-4)'}}>
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d,i) => (
                <div key={d} style={{background:'var(--ink-2)', padding:'14px 12px 18px', minHeight:178}}>
                  <div className="in-mono" style={{fontSize:10, color:'var(--paper-mute)', marginBottom:14}}>{d.toUpperCase()} · 0{i+13}</div>
                  <div style={{display:'flex', flexDirection:'column', gap:6}}>
                    {[
                      [['SIM + bank', 'var(--terracotta)']],
                      [['Co-work day', 'var(--bosphorus)'], ['Türkçe başla', 'var(--moss)']],
                      [['Doctor', 'var(--terracotta)']],
                      [['Hammam', 'var(--ferry-yellow)'], ['Dinner: Çiya', 'var(--bosphorus)']],
                      [['Ferry → Beşiktaş', 'var(--bosphorus)']],
                      [['Long walk Kuzguncuk', 'var(--moss)']],
                      [['Pazar + nap', 'var(--ferry-yellow)']],
                    ][i].map(([t, c], j) => (
                      <div key={j} style={{
                        fontSize:11, padding:'5px 6px', borderLeft:`2px solid ${c}`,
                        background:'rgba(255,255,255,0.025)', color:'var(--paper)',
                        lineHeight:1.3,
                      }}>{t}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'24px 0 32px'}}>
              <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-faint)'}}>
                Tap a day → expand to addresses, opening hours, ferry alternative.
              </div>
              <a style={{fontSize:13.5, color:'var(--terracotta)', borderBottom:'1px solid var(--terracotta)', paddingBottom:2}}>
                Open the Planner →
              </a>
            </div>
          </div>

          {/* Matcher mini */}
          <div style={{background:'var(--ink-2)', border:'1px solid var(--ink-3)', borderRadius:2, padding:'40px', display:'flex', flexDirection:'column'}}>
            <div className="in-mono" style={{color:'var(--terracotta)', marginBottom:14}}>Tool 02 · /matcher</div>
            <h3 style={{fontSize:48, letterSpacing:'-0.03em', lineHeight:1}}>Neighborhood Matcher</h3>
            <p style={{fontSize:14.5, color:'var(--paper-dim)', marginTop:18, lineHeight:1.55}}>
              Eight questions. No personality test. Eight neighborhoods scored on what you actually need.
            </p>

            <div style={{marginTop:32, flex:1, display:'flex', flexDirection:'column', gap:10}}>
              {[
                ['Kadıköy', 94, 'var(--terracotta)'],
                ['Cihangir', 88, 'var(--bosphorus)'],
                ['Beşiktaş', 76, 'var(--bosphorus-dim)'],
                ['Balat',    71, 'var(--ferry-yellow)'],
                ['Karaköy',  63, 'var(--moss)'],
                ['Üsküdar',  58, 'var(--paper-faint)'],
              ].map(([n, s, c], i) => (
                <div key={n} style={{display:'flex', alignItems:'center', gap:14}}>
                  <div className="in-mono" style={{fontSize:11, color:'var(--paper-mute)', width:18}}>0{i+1}</div>
                  <div style={{fontFamily:'var(--serif)', fontSize:19, width:130}}>{n}</div>
                  <div style={{flex:1, height:6, background:'var(--ink-3)', borderRadius:1, position:'relative'}}>
                    <div style={{position:'absolute', inset:0, width:`${s}%`, background:c, borderRadius:1}}/>
                  </div>
                  <div className="in-num" style={{fontSize:14, color:'var(--paper)', width:48, textAlign:'right'}}>{s}<span style={{color:'var(--paper-faint)', fontSize:11}}>%</span></div>
                </div>
              ))}
            </div>
            <a style={{fontSize:13.5, color:'var(--terracotta)', borderBottom:'1px solid var(--terracotta)', paddingBottom:2, alignSelf:'flex-start', marginTop:24}}>
              Take the Matcher →
            </a>
          </div>
        </div>
      </section>

      {/* NEIGHBORHOODS strip */}
      <section style={{padding:'128px 56px 0'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:40}}>
          <div>
            <SectionEyebrow num="N° 04" label="Eight neighborhoods worth a season"/>
            <h2 style={{fontSize:64, letterSpacing:'-0.03em', marginTop:24, maxWidth:900, lineHeight:1.02}}>
              We don't rank them. We tell you which one will <span style={{fontStyle:'italic', color:'var(--terracotta)'}}>annoy you least</span> on a Wednesday.
            </h2>
          </div>
          <a style={{fontSize:13.5, color:'var(--paper-mute)', borderBottom:'1px solid var(--ink-4)', paddingBottom:4}}>All eight →</a>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gridTemplateRows:'auto auto', gap:24, marginTop:32}}>
          {/* Kadikoy big */}
          <div style={{gridRow:'span 2', display:'flex', flexDirection:'column', gap:18}}>
            <PhotoSlot kind="dawn" corner="01 · Kadıköy" label="Moda pier - Tuesday, 07:12" style={{height:580, borderRadius:2}}/>
            <div>
              <div style={{display:'flex', alignItems:'baseline', gap:14}}>
                <h3 style={{fontSize:40, letterSpacing:'-0.02em'}}>Kadıköy</h3>
                <span className="in-mono" style={{color:'var(--paper-mute)'}}>· Asia side · 38 active</span>
              </div>
              <p style={{fontSize:15.5, color:'var(--paper-dim)', marginTop:10, maxWidth:540, lineHeight:1.55}}>
                The Asia-side default. Ferries every 20 minutes, a real Tuesday market, more bookshops than is sensible. Live here if you want to <em style={{fontFamily:'var(--serif)'}}>live</em> here, not visit.
              </p>
              <div style={{display:'flex', gap:8, marginTop:18, flexWrap:'wrap'}}>
                {['Ferry-first', 'Walkable', 'Long-stay rents', 'Loud at 02:00', 'Best produce'].map(t => <span key={t} className="in-tag">{t}</span>)}
              </div>
            </div>
          </div>

          {/* small cards */}
          {[
            ['Cihangir', 'bosphorus', 'Galata-side. Cats, expats, very good bookshops, slightly tired.', 'European · 22 active'],
            ['Beşiktaş', 'street',    'Where work happens. Loud, transit-connected, has every grocery.', 'European · 31 active'],
            ['Balat',    'interior', 'Painterly, slower, harder to leave. Coffee scene catching up.', 'European · 9 active'],
            ['Karaköy',  'dusk',     'Bosphorus at your feet. Better for visits than seasons.', 'European · 11 active'],
          ].map(([name, kind, blurb, meta]) => (
            <div key={name} style={{display:'flex', flexDirection:'column', gap:12}}>
              <PhotoSlot kind={kind} label={`${name} - typical morning`} corner={name} style={{height:228, borderRadius:2}}/>
              <div>
                <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between'}}>
                  <h4 style={{fontSize:22, letterSpacing:'-0.01em'}}>{name}</h4>
                  <span className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>{meta}</span>
                </div>
                <p style={{fontSize:13, color:'var(--paper-dim)', marginTop:6, lineHeight:1.5}}>{blurb}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DATA - Nomadlist-style data block, our own aesthetic */}
      <section style={{padding:'128px 56px 0'}}>
        <SectionEyebrow num="N° 05" label="The unromantic numbers" kicker="updated weekly by humans here"/>
        <h2 style={{fontSize:64, letterSpacing:'-0.03em', marginTop:24, maxWidth:900, lineHeight:1.02}}>
          What it actually costs to live here<br/>
          <span style={{fontStyle:'italic', color:'var(--paper-mute)'}}>(for a remote worker, not a tourist).</span>
        </h2>

        <div style={{marginTop:48, border:'1px solid var(--ink-3)'}}>
          {/* table header */}
          <div style={{display:'grid', gridTemplateColumns:'1.6fr 1fr 1fr 1fr 1fr 1fr', padding:'14px 20px', borderBottom:'1px solid var(--ink-3)', background:'var(--ink-2)'}}>
            {['Spend category', 'Frugal', 'Comfortable', 'Generous', 'vs Lisbon', 'vs CDMX'].map((h,i) => (
              <div key={h} className="in-mono" style={{
                color:'var(--paper-mute)', fontSize:10.5,
                textAlign: i===0 ? 'left' : 'right',
              }}>{h}</div>
            ))}
          </div>
          {[
            ['Rent · 1BR long-stay',     '₺18,000', '₺32,000', '₺55,000', '−42%', '−18%', 'var(--terracotta)'],
            ['Co-working desk · monthly','₺3,800',  '₺6,500',  '₺11,000', '−51%', '−22%', 'var(--bosphorus)'],
            ['Groceries · weekly',       '₺2,100',  '₺3,400',  '₺5,800',  '−38%', '+04%', 'var(--moss)'],
            ['Restaurant · per meal',    '₺220',    '₺520',    '₺1,200',  '−44%', '+12%', 'var(--ferry-yellow)'],
            ['Coffee · third wave',      '₺85',     '₺110',    '₺140',    '−28%', '+09%', 'var(--terracotta)'],
            ['Hammam · per visit',       '₺450',    '₺900',    '₺1,800',  '-',    '-',    'var(--paper-mute)'],
            ['Monthly transit pass',     '₺550',    '₺550',    '₺550',    '−71%', '−55%', 'var(--bosphorus)'],
            ['Total · monthly',          '₺28,500', '₺48,200', '₺82,100', '−45%', '−14%', 'var(--paper)'],
          ].map(([cat, a, b, c, l, m, accent], i, arr) => (
            <div key={cat} style={{
              display:'grid', gridTemplateColumns:'1.6fr 1fr 1fr 1fr 1fr 1fr',
              padding:'18px 20px', borderBottom: i===arr.length-1 ? 'none' : '1px solid var(--ink-3)',
              alignItems:'center',
              background: i===arr.length-1 ? 'var(--ink-2)' : 'transparent',
            }}>
              <div style={{display:'flex', alignItems:'center', gap:12}}>
                <span style={{width:8, height:8, background:accent, borderRadius:'50%'}}/>
                <span style={{fontSize:14.5, fontWeight: i===arr.length-1 ? 500 : 400}}>{cat}</span>
              </div>
              {[a,b,c].map((v,j) => (
                <div key={j} className="in-num" style={{textAlign:'right', fontSize:14.5, color: i===arr.length-1 ? 'var(--paper)' : 'var(--paper-dim)'}}>{v}</div>
              ))}
              <div className="in-num" style={{textAlign:'right', fontSize:14, color: l.startsWith('−') ? '#7ab880' : (l==='-' ? 'var(--paper-faint)' : '#d99464')}}>{l}</div>
              <div className="in-num" style={{textAlign:'right', fontSize:14, color: m.startsWith('−') ? '#7ab880' : (m==='-' ? 'var(--paper-faint)' : '#d99464')}}>{m}</div>
            </div>
          ))}
        </div>
        <div style={{display:'flex', justifyContent:'space-between', marginTop:18, color:'var(--paper-faint)'}}>
          <div className="in-mono" style={{fontSize:10.5}}>↳ Sample size: 312 members · 14-day rolling median · Last refresh 11 May 2026</div>
          <div className="in-mono" style={{fontSize:10.5}}>1 USD ≈ ₺34.20 · 1 EUR ≈ ₺37.10</div>
        </div>
      </section>

      {/* COMMUNITY / Telegram */}
      <section style={{padding:'128px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center'}}>
          <PhotoSlot kind="interior" corner="Wednesday dinner · Yeldeğirmeni" label="Çiya backroom - 23 of us, three languages" style={{height:540, borderRadius:2}}/>
          <div>
            <SectionEyebrow num="N° 06" label="The community is the product"/>
            <h2 style={{fontSize:64, letterSpacing:'-0.03em', marginTop:24, lineHeight:1.02}}>
              A Telegram of <span style={{fontStyle:'italic', color:'var(--terracotta)'}}>1,847</span> humans -<br/>not a Slack of strangers.
            </h2>
            <p style={{fontSize:16, color:'var(--paper-dim)', marginTop:24, lineHeight:1.6, maxWidth:520}}>
              One channel. Weekly dinners at someone's table. A members map you can zoom into without a sign-up wall. The kind of group where someone offers to walk you to the right Migros at 22:30 on your first night.
            </p>

            <div style={{display:'flex', flexDirection:'column', gap:0, marginTop:36, border:'1px solid var(--ink-3)'}}>
              {[
                ['1,847', 'in #general', 'Active in the last 30 days'],
                ['38',    'here this month', 'On the ground, today'],
                ['12',    'events on the calendar', 'Through end of June'],
                ['0',     'recruiters allowed', 'We banned them in 2024'],
              ].map(([n, l, sub], i, arr) => (
                <div key={l} style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px', borderBottom: i===arr.length-1 ? 'none' : '1px solid var(--ink-3)'}}>
                  <div style={{display:'flex', alignItems:'baseline', gap:18}}>
                    <span className="in-num" style={{fontSize:32, color:'var(--terracotta)', letterSpacing:'-0.01em'}}>{n}</span>
                    <span style={{fontSize:15, color:'var(--paper)'}}>{l}</span>
                  </div>
                  <span className="in-mono" style={{fontSize:10.5, color:'var(--paper-faint)'}}>{sub}</span>
                </div>
              ))}
            </div>

            <button style={{
              marginTop:32, padding:'18px 28px', background:'var(--paper)', color:'var(--ink-0)',
              borderRadius:2, fontWeight:500, fontSize:14, display:'inline-flex', alignItems:'center', gap:12,
            }}>
              Open the Telegram <span className="in-mono" style={{fontSize:10.5, opacity:0.55}}>t.me/istanbulnomads</span> <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* FIELD NOTES */}
      <section style={{padding:'128px 56px 0'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:48}}>
          <div>
            <SectionEyebrow num="N° 07" label="Field notes" kicker="written, not generated"/>
            <h2 style={{fontSize:64, letterSpacing:'-0.03em', marginTop:24, lineHeight:1.02}}>
              The long-form parts.
            </h2>
          </div>
          <a style={{fontSize:13.5, color:'var(--paper-mute)', borderBottom:'1px solid var(--ink-4)', paddingBottom:4}}>The archive (84) →</a>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr', gap:32, alignItems:'flex-start'}}>
          {[
            ['On the ferry as a third place', 'Notes from four months of taking the 17:35 to Karaköy with a laptop and no agenda. Why the Bosphorus is a better office than any rooftop in the city.', 'Maya K.', '14 min', '07 May'],
            ['The Tuesday market, an Operating System', 'Pazar as the only spreadsheet that actually predicts the week ahead. A short field manual for first-timers.', 'Deniz A.', '6 min', '02 May'],
            ['Why we banned recruiter posts', 'A short essay on what a community is for. We chose the boring answer and the group got 4× more useful.', 'IN editors', '4 min', '28 Apr'],
          ].map(([title, blurb, author, time, date], i) => (
            <article key={title} style={{display:'flex', flexDirection:'column', gap:18, borderTop:'1px solid var(--ink-3)', paddingTop:24}}>
              <PhotoSlot kind={['bosphorus','street','mono'][i]} corner={`Field note · ${String(i+1).padStart(2,'0')}`} label={['Ferry crossing','Tuesday pazar','Editorial'][i]} style={{height: i===0 ? 380 : 220, borderRadius:2}}/>
              <div>
                <div className="in-mono" style={{color:'var(--paper-faint)', fontSize:10.5, marginBottom:14}}>{date} · {time} read · {author}</div>
                <h3 style={{fontSize: i===0 ? 32 : 22, letterSpacing:'-0.015em', lineHeight:1.1}}>{title}</h3>
                <p style={{fontSize: i===0 ? 15.5 : 13.5, color:'var(--paper-dim)', marginTop:12, lineHeight:1.55}}>{blurb}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* QUIET CTA - final scroll */}
      <section style={{padding:'160px 56px 128px', textAlign:'center'}}>
        <div className="in-mono" style={{color:'var(--paper-faint)', marginBottom:32}}>↳ One last thing</div>
        <h2 style={{fontSize:104, letterSpacing:'-0.04em', lineHeight:0.95, maxWidth:1100, margin:'0 auto'}}>
          The ferry leaves<br/>
          <span style={{fontStyle:'italic', color:'var(--terracotta)'}}>every twenty minutes.</span><br/>
          <span style={{color:'var(--paper-mute)'}}>You can be on it tomorrow.</span>
        </h2>
        <div style={{display:'flex', justifyContent:'center', gap:14, marginTop:56}}>
          <button style={{padding:'18px 32px', background:'var(--terracotta)', color:'var(--ink-0)', borderRadius:2, fontWeight:500, fontSize:14}}>
            Plan your first week →
          </button>
          <button style={{padding:'18px 32px', border:'1px solid var(--ink-4)', color:'var(--paper)', borderRadius:2, fontSize:14}}>
            Read first
          </button>
        </div>
      </section>

      <Footer/>
    </div>
  );
};

window.HomePage = HomePage;
