/* Homepage v2 - Ambient Tech with Istanbul Soul */

const HomePageV2 = () => {
  return (
    <div className="in-artboard tod-dusk" style={{width:1440, minHeight:9500, position:'relative'}}>
      <AmbientBar tod="dusk"/>
      <NavBar active="Guides"/>

      {/* HERO - one massive Istanbul photo + masthead + 3 doors */}
      <section style={{padding:'0', position:'relative'}}>
        {/* big atmospheric image with overlay text */}
        <div className="in-photo in-photo--dawn" style={{
          height:880, width:'100%', borderRadius:0, border:'none',
          borderBottom:'1px solid var(--ink-3)',
          position:'relative',
        }}>
          {/* Bosphorus subtle map header with moving ferry - the ONE moving signal */}
          <div style={{
            position:'absolute', top:24, left:24, width:680, height:48,
            border:'1px solid rgba(244,234,215,0.18)',
            background:'rgba(11,14,17,0.50)',
            backdropFilter:'blur(8px)',
            overflow:'hidden',
            display:'flex', alignItems:'center', padding:'0 16px', gap:14,
          }}>
            <span className="in-mono" style={{fontSize:10, color:'var(--paper-mute)'}}>BOSPHORUS · 17:50 → 22:40</span>
            <div style={{flex:1, position:'relative', height:24}}>
              {/* Europe / Asia labels */}
              <span className="in-mono" style={{position:'absolute', left:0, top:6, fontSize:9, color:'var(--paper-faint)'}}>EUROPE</span>
              <span className="in-mono" style={{position:'absolute', right:0, top:6, fontSize:9, color:'var(--paper-faint)'}}>ASIA</span>
              {/* the strait */}
              <div style={{position:'absolute', left:60, right:60, top:12, height:1, background:'rgba(61,107,138,0.5)', borderTop:'1px dashed rgba(61,107,138,0.6)'}}/>
              {/* dock dots */}
              <div style={{position:'absolute', left:58, top:8, width:8, height:8, borderRadius:'50%', background:'var(--ferry-yellow)'}}/>
              <div style={{position:'absolute', right:58, top:8, width:8, height:8, borderRadius:'50%', background:'var(--terracotta)'}}/>
              {/* moving ferry */}
              <div className="ferry-cross" style={{position:'absolute', left:'-10px', top:6, color:'var(--paper)', display:'flex', alignItems:'center', gap:4}}>
                <svg width="20" height="12" viewBox="0 0 20 12">
                  <path d="M1,8 L19,8 L17,11 L3,11 Z" fill="var(--paper)"/>
                  <rect x="6" y="3" width="9" height="4" fill="var(--paper)"/>
                  <rect x="9" y="0" width="2" height="3" fill="var(--paper)"/>
                </svg>
              </div>
            </div>
            <span className="in-mono" style={{fontSize:10, color:'var(--paper)'}}>22 MIN · ₺37</span>
          </div>

          {/* masthead label */}
          <div style={{
            position:'absolute', top:24, right:24, padding:'10px 16px',
            border:'1px solid rgba(244,234,215,0.18)', background:'rgba(11,14,17,0.50)', backdropFilter:'blur(8px)',
          }}>
            <div className="in-mono" style={{fontSize:9.5, color:'var(--paper-faint)'}}>ISSUE N°48 · ESTABLISHED 2023</div>
            <div className="in-mono" style={{fontSize:9.5, color:'var(--paper)', marginTop:3}}>1,847 MEMBERS · 38 ON THE GROUND</div>
          </div>

          {/* photo credit / corner */}
          <div className="in-mono" style={{position:'absolute', bottom:24, left:24, fontSize:10, color:'var(--paper-dim)', display:'flex', gap:14, alignItems:'baseline'}}>
            <span>PHOTO · MAYA K. · KADIKÖY PIER · 06:48 LOCAL</span>
            <span style={{color:'var(--paper-faint)'}}>↳ swap in 4 weekly rotation</span>
          </div>
          <div className="in-mono" style={{position:'absolute', bottom:24, right:24, fontSize:10, color:'var(--paper-dim)'}}>
            41°00′N · 28°58′E
          </div>
        </div>

        {/* masthead + headline below the photo */}
        <div style={{padding:'72px 56px 0', position:'relative'}}>
          <div style={{display:'grid', gridTemplateColumns:'auto 1fr auto', gap:48, alignItems:'baseline'}}>
            <div className="in-mono" style={{color:'var(--paper-mute)', fontSize:11, letterSpacing:'0.08em'}}>
              N° 01 · ARRIVAL
            </div>
            <div className="in-thinrule" style={{height:1, background:'var(--ink-4)'}}/>
            <div className="in-mono" style={{color:'var(--paper-mute)', fontSize:11, letterSpacing:'0.08em', textAlign:'right'}}>
              MON 11 MAY 2026 · LIGHT FADING W
            </div>
          </div>

          <h1 style={{
            fontSize:156, fontWeight:300, letterSpacing:'-0.045em', lineHeight:0.9,
            marginTop:48, maxWidth:1320, fontFamily:'var(--serif)',
          }}>
            Istanbul,<br/>
            for people who<br/>
            work remotely <span style={{fontStyle:'italic', fontWeight:400, color:'var(--terracotta)'}}>&</span><br/>
            <span style={{fontStyle:'italic', fontWeight:400}}>want to stay a while.</span>
          </h1>

          <div style={{display:'grid', gridTemplateColumns:'1fr 320px', gap:96, marginTop:56, alignItems:'end'}}>
            <p style={{fontSize:22, color:'var(--paper-dim)', lineHeight:1.45, maxWidth:780, fontFamily:'var(--serif)'}}>
              Asia base. Ferry reset. Evening table. A publication and a community for the one-to-six-month version of Istanbul. Made in Kadıköy by people who actually live here.
            </p>
            <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-faint)', lineHeight:1.7}}>
              ↳ READ TIME · 9 SCROLLS<br/>
              ↳ LAST EDIT · 11 MAY 16:08<br/>
              ↳ NEXT REFRESH · WED 14 MAY<br/>
              ↳ THIS PAGE LOADED 81,420 TIMES
            </div>
          </div>
        </div>
      </section>

      {/* THREE DOORS - the page's whole job */}
      <section style={{padding:'128px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'auto 1fr auto', gap:24, alignItems:'center', marginBottom:48}}>
          <span className="in-mono" style={{color:'var(--terracotta)'}}>N° 02</span>
          <span className="in-thinrule"/>
          <span className="in-mono" style={{color:'var(--paper-mute)'}}>THREE DOORS · PICK ONE</span>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:1, background:'var(--ink-4)', border:'1px solid var(--ink-4)'}}>
          {[
            {
              num:'01', title:'Plan your week', italic:'in seven minutes',
              body:'Six questions in, a Mon→Sun schedule out. Addresses, ferry times, the one café open before 09:00.',
              cta:'Open the Planner', sub:'/planner · 4,210 generated', tone:'var(--terracotta)',
              ph:'interior', phLabel:'Walter\u2019s, Yeldeğirmeni · 10:30',
              data:[['Time', '7 min'], ['Questions', '6'], ['Output', '7-day .ics']],
            },
            {
              num:'02', title:'Find a neighborhood', italic:'that fits you, not the postcard',
              body:'Eight neighborhoods scored on what you actually need. Not a personality test. Mostly a spreadsheet with opinions.',
              cta:'Take the Matcher', sub:'/matcher · 8 of 8 worth a season', tone:'var(--bosphorus)',
              ph:'dusk', phLabel:'Cihangir rooftop · 19:14',
              data:[['Neighborhoods', '8'], ['Inputs', '8'], ['Output', 'ranked %']],
            },
            {
              num:'03', title:'Join the community', italic:'or just read first',
              body:'A Telegram of 1,847 humans, weekly dinners, a public directory. We banned recruiters in 2024 and got 4× more useful.',
              cta:'Open Telegram', sub:'t.me/istanbulnomads · free', tone:'var(--ferry-yellow)',
              ph:'street', phLabel:'Friday dinner · Çiya backroom',
              data:[['In #general', '1,847'], ['Here now', '38'], ['Events / wk', '4']],
            },
          ].map((d, i) => (
            <a key={d.num} style={{background:'var(--ink-1)', padding:'40px 36px 36px', display:'flex', flexDirection:'column', minHeight:580}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                <span className="in-num" style={{fontSize:64, color:d.tone, letterSpacing:'-0.02em', lineHeight:0.95}}>{d.num}</span>
                <span style={{width:10, height:10, borderRadius:'50%', background:d.tone, boxShadow:`0 0 12px ${d.tone}80`}}/>
              </div>
              <h3 style={{fontSize:40, letterSpacing:'-0.025em', lineHeight:1.0, marginTop:32}}>
                {d.title}<br/>
                <span style={{fontStyle:'italic', color:'var(--paper-mute)'}}>{d.italic}</span>
              </h3>
              <p style={{fontSize:15, color:'var(--paper-dim)', marginTop:18, lineHeight:1.55, flex:1}}>{d.body}</p>

              <PhotoSlot kind={d.ph} corner={d.num} label={d.phLabel} style={{height:140, borderRadius:0, marginTop:28, marginBottom:24}}/>

              <div style={{display:'flex', gap:24, marginBottom:24}}>
                {d.data.map(([k,v]) => (
                  <div key={k}>
                    <div className="in-mono" style={{fontSize:9.5, color:'var(--paper-faint)'}}>{k}</div>
                    <div className="in-num" style={{fontSize:18, color:'var(--paper)', marginTop:4}}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:'1px solid var(--ink-3)', paddingTop:20}}>
                <span style={{fontSize:15, color:d.tone, borderBottom:`1px solid ${d.tone}`, paddingBottom:3}}>{d.cta} →</span>
                <span className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>{d.sub}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* SECTION HEADER - the shape of a week */}
      <section style={{padding:'160px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'auto 1fr auto', gap:24, alignItems:'center', marginBottom:56}}>
          <span className="in-mono" style={{color:'var(--terracotta)'}}>N° 03</span>
          <span className="in-thinrule"/>
          <span className="in-mono" style={{color:'var(--paper-mute)'}}>THE SHAPE OF A WEEK · NOT A PRODUCTIVITY SYSTEM</span>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:96, alignItems:'start'}}>
          <h2 style={{fontSize:104, lineHeight:0.95, letterSpacing:'-0.04em', fontWeight:300}}>
            <span style={{color:'var(--terracotta)', fontStyle:'italic'}}>Asia base.</span><br/>
            <span style={{color:'var(--bosphorus)', fontStyle:'italic'}}>Ferry reset.</span><br/>
            <span style={{color:'var(--ferry-yellow)', fontStyle:'italic'}}>Evening table.</span>
          </h2>
          <div style={{paddingTop:14}}>
            <p style={{fontSize:18, color:'var(--paper)', lineHeight:1.55, marginBottom:24, fontFamily:'var(--serif)', letterSpacing:'-0.005em'}}>
              Three calls a day, two coffees, one ferry. The city is a commute and the commute is the city. Most weeks settle into a rhythm somewhere between <em>this is where I work</em> and <em>this is where I live</em>.
            </p>
            <p style={{fontSize:15, color:'var(--paper-mute)', lineHeight:1.65, marginBottom:24}}>
              We sort the site around that rhythm. Not <em style={{fontFamily:'var(--serif)'}}>discover the magic of Istanbul</em>. Just - Tuesday at 14:00, the Wi-Fi at Kahve Dünyası in Moda dropped, where else has a window seat.
            </p>

            <div style={{display:'grid', gridTemplateColumns:'auto 1fr', gap:'10px 16px', marginTop:32, paddingTop:24, borderTop:'1px solid var(--ink-3)'}}>
              <span className="in-mono" style={{color:'var(--paper-faint)', fontSize:10.5}}>06:48</span>
              <span style={{fontSize:13.5, color:'var(--paper-dim)'}}>Pier coffee. Window open. No phone.</span>
              <span className="in-mono" style={{color:'var(--paper-faint)', fontSize:10.5}}>10:00</span>
              <span style={{fontSize:13.5, color:'var(--paper-dim)'}}>Walter\u2019s, window seat. Two calls.</span>
              <span className="in-mono" style={{color:'var(--paper-faint)', fontSize:10.5}}>13:00</span>
              <span style={{fontSize:13.5, color:'var(--paper-dim)'}}>Çiya lokanta · three plates, ₺240.</span>
              <span className="in-mono" style={{color:'var(--paper-faint)', fontSize:10.5}}>17:35</span>
              <span style={{fontSize:13.5, color:'var(--paper-dim)'}}>Ferry to Karaköy. Tea on deck.</span>
              <span className="in-mono" style={{color:'var(--paper-faint)', fontSize:10.5}}>22:10</span>
              <span style={{fontSize:13.5, color:'var(--paper-dim)'}}>Last good ferry back. Lights out by midnight.</span>
            </div>
          </div>
        </div>
      </section>

      {/* SCROLL 2 - GUIDES + NEIGHBORHOODS PREVIEW + UPCOMING EVENTS */}
      <section style={{padding:'160px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'auto 1fr auto', gap:24, alignItems:'center', marginBottom:56}}>
          <span className="in-mono" style={{color:'var(--terracotta)'}}>N° 04</span>
          <span className="in-thinrule"/>
          <span className="in-mono" style={{color:'var(--paper-mute)'}}>GUIDES · ON THE SHELF · 84 PUBLISHED</span>
        </div>

        <h2 style={{fontSize:72, letterSpacing:'-0.035em', lineHeight:0.98, maxWidth:1100}}>
          The long-form parts of the site -<br/>
          <span style={{fontStyle:'italic', color:'var(--paper-mute)'}}>written, edited, dated, signed.</span>
        </h2>

        <div style={{display:'grid', gridTemplateColumns:'1.6fr 1fr 1fr', gap:32, marginTop:56, alignItems:'flex-start'}}>
          {[
            ['On the ferry as a third place', 'Notes from four months of taking the 17:35 to Karaköy with a laptop and no agenda. Why the Bosphorus is a better office than any rooftop in the city.', 'bosphorus', '14 min', 'Maya K.', 'Field Notes'],
            ['How to rent a flat for three months without a kefil', 'A short field manual on the long-stay rental loophole most agents won\u2019t mention. Costs, contracts, where it breaks.', 'street', '11 min', 'Deniz A.', 'Housing'],
            ['The Tuesday market, an Operating System', 'Salı pazarı as the only spreadsheet that actually predicts the week ahead. A short field manual for first-timers.', 'mono', '6 min', 'Lina M.', 'Food'],
          ].map(([title, blurb, ph, time, author, section], i) => (
            <article key={title} style={{display:'flex', flexDirection:'column', gap:18}}>
              <PhotoSlot kind={ph} corner={section.toUpperCase()} label={['Ferry crossing · 17:35','Yeldeğirmeni block, view from the leasing office','Salı pazarı, Tuesday 09:40'][i]} style={{height: i===0 ? 420 : 240, borderRadius:0}}/>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                <span className="in-mono" style={{color:'var(--terracotta)', fontSize:10.5}}>{section}</span>
                <span className="in-mono" style={{color:'var(--paper-faint)', fontSize:10.5}}>{time} · {author}</span>
              </div>
              <h3 style={{fontSize: i===0 ? 38 : 26, letterSpacing:'-0.02em', lineHeight:1.06}}>{title}</h3>
              <p style={{fontSize: i===0 ? 16 : 14, color:'var(--paper-dim)', lineHeight:1.55}}>{blurb}</p>
              <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', marginTop:4}}>↳ READ · {String(i+1).padStart(2,'0')} OF 84</div>
            </article>
          ))}
        </div>
      </section>

      {/* NEIGHBORHOOD MATCHER PREVIEW - interactive feel */}
      <section style={{padding:'160px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'auto 1fr auto', gap:24, alignItems:'center', marginBottom:56}}>
          <span className="in-mono" style={{color:'var(--terracotta)'}}>N° 05</span>
          <span className="in-thinrule"/>
          <span className="in-mono" style={{color:'var(--paper-mute)'}}>NEIGHBORHOOD MATCHER · DEMO STATE · LIVE</span>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1.1fr 1fr', gap:64}}>
          <div>
            <h2 style={{fontSize:64, letterSpacing:'-0.03em', lineHeight:1.0}}>
              Eight neighborhoods,<br/>
              ranked on what <span style={{fontStyle:'italic', color:'var(--terracotta)'}}>you</span> need.
            </h2>
            <p style={{fontSize:16, color:'var(--paper-dim)', marginTop:24, lineHeight:1.6, maxWidth:540}}>
              The matcher isn\u2019t a personality test. Eight inputs in (budget, work setup, language, noise, views, transit, stay length, side-of-city), eight neighborhoods out - scored on the things that actually matter.
            </p>

            <div style={{marginTop:32, border:'1px solid var(--ink-3)', padding:'24px 28px', background:'var(--ink-2)'}}>
              <div className="in-mono" style={{color:'var(--paper-mute)', fontSize:10.5, marginBottom:18}}>YOUR SIGNALS · 4 OF 8 CHOSEN</div>
              <div style={{display:'flex', flexWrap:'wrap', gap:8}}>
                {[
                  ['Ferry-first', true,  'A commute that feels like a reset.'],
                  ['Quiet routine', true, 'Calmer evenings, easier focus.'],
                  ['Seaside walks', true, 'Sunset routes, water nearby.'],
                  ['Budget aware', true,  'Rent value without losing convenience.'],
                  ['Social momentum', false, 'Easy first friends + events.'],
                  ['Business mode', false, 'Coworking density, infrastructure.'],
                  ['Nightlife nearby', false, 'Bars, dinners, spontaneous evenings.'],
                  ['Character-heavy', false, 'Historic streets, imperfect charm.'],
                ].map(([name, on, sub]) => (
                  <button key={name} style={{
                    padding:'8px 14px', borderRadius:999,
                    border:'1px solid ' + (on ? 'var(--terracotta)' : 'var(--ink-4)'),
                    background: on ? 'rgba(196,99,58,0.12)' : 'transparent',
                    fontSize:12.5, color: on ? 'var(--terracotta)' : 'var(--paper-mute)',
                    display:'inline-flex', alignItems:'center', gap:8,
                  }}>
                    {on && <span style={{width:5, height:5, borderRadius:'50%', background:'var(--terracotta)'}}/>}
                    {name}
                  </button>
                ))}
              </div>
              <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-faint)', marginTop:18, lineHeight:1.7}}>
                ↳ THE MATCHER WEIGHS WHAT YOU CHOOSE.<br/>
                ↳ NO TIE-BREAKER NEEDED · 4 SIGNALS IS PLENTY.<br/>
                ↳ STAY LENGTH · 3 MONTHS · BUDGET BAND · MID
              </div>
              <a style={{fontSize:13, color:'var(--terracotta)', borderBottom:'1px solid var(--terracotta)', paddingBottom:2, display:'inline-block', marginTop:20}}>change signals →</a>
            </div>
          </div>

          <div style={{border:'1px solid var(--ink-3)', background:'var(--ink-2)', padding:'28px 32px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', paddingBottom:18, borderBottom:'1px solid var(--ink-3)'}}>
              <span className="in-mono" style={{fontSize:10.5, color:'var(--paper-mute)'}}>RESULTS · RANKED · COMPUTED 0.04S</span>
              <span className="in-mono" style={{fontSize:10.5, color:'var(--paper-faint)'}}>vs. site average</span>
            </div>
            {[
              ['Kadıköy',  94, 'var(--terracotta)',     '$480–800',  '+18'],
              ['Moda',     91, 'var(--terracotta-dim)', '$575–960',  '+14'],
              ['Cihangir', 88, 'var(--bosphorus)',      '$640–1280', '+11'],
              ['Üsküdar',  82, 'var(--moss)',           '$480–880',  '+04'],
              ['Beşiktaş', 76, 'var(--bosphorus-dim)',  '$640–1120', '−03'],
              ['Balat',    71, 'var(--ferry-yellow)',   '$400–800',  '−06'],
              ['Karaköy',  63, 'var(--paper-mute)',     '$800–1440', '−14'],
              ['Nişantaşı',52, 'var(--paper-mute)',     '$800–1600', '−18'],
              ['Atasehir', 48, 'var(--paper-faint)',    '$560–1120', '−21'],
              ['Levent',   42, 'var(--paper-faint)',    '$720–1440', '−26'],
            ].map(([n, s, c, rent, delta], i) => (
              <div key={n} style={{display:'grid', gridTemplateColumns:'20px 110px 1fr 84px 60px 50px', gap:14, alignItems:'center', padding:'12px 0', borderBottom: i<9 ? '1px solid var(--ink-3)' : 'none'}}>
                <span className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>{String(i+1).padStart(2,'0')}</span>
                <span style={{fontFamily:'var(--serif)', fontSize:17, letterSpacing:'-0.01em'}}>{n}</span>
                <div style={{height:5, background:'var(--ink-3)', position:'relative'}}>
                  <div style={{position:'absolute', inset:0, width:`${s}%`, background:c}}/>
                </div>
                <span className="in-num" style={{fontSize:12, color:'var(--paper-mute)', textAlign:'right'}}>{rent}<span style={{color:'var(--paper-faint)', fontSize:9.5}}>/mo</span></span>
                <span className="in-num" style={{fontSize:14, color:'var(--paper)', textAlign:'right'}}>{s}<span style={{color:'var(--paper-faint)', fontSize:10}}>%</span></span>
                <span className="in-mono" style={{fontSize:10.5, color: delta.startsWith('+') ? '#7ab880' : '#d99464', textAlign:'right'}}>{delta}</span>
              </div>
            ))}
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:18, paddingTop:18, borderTop:'1px solid var(--ink-3)'}}>
              <span className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>10 NEIGHBORHOODS · USD MEDIAN · vs. SITE AVG</span>
              <button style={{padding:'10px 18px', background:'var(--terracotta)', color:'var(--ink-0)', borderRadius:2, fontSize:12.5, fontWeight:500}}>Open full matcher</button>
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS - small editorial strip */}
      <section style={{padding:'160px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'auto 1fr auto', gap:24, alignItems:'center', marginBottom:56}}>
          <span className="in-mono" style={{color:'var(--terracotta)'}}>N° 06</span>
          <span className="in-thinrule"/>
          <span className="in-mono" style={{color:'var(--paper-mute)'}}>UPCOMING · 8 IN THE NEXT FORTNIGHT</span>
        </div>

        <h2 style={{fontSize:64, letterSpacing:'-0.03em', lineHeight:0.98}}>
          What\u2019s on the calendar<br/>
          <span style={{fontStyle:'italic', color:'var(--terracotta)'}}>this fortnight.</span>
        </h2>

        <div style={{marginTop:48, border:'1px solid var(--ink-3)'}}>
          {[
            ['THU 15', '19:30', 'Wednesday dinner · Çiya backroom', 'Maya K.', 'Dinner', '23 / 24', 'free', 'var(--terracotta)', true],
            ['FRI 16', '08:00', 'Bosphorus ferry · slow office',    'Deniz A.', 'Co-work', '14 / 18', 'free', 'var(--bosphorus)', false],
            ['SAT 17', '10:00', 'Salı pazarı walk · Tuesday market', 'Lina M.', 'Walk', '11 / 15', 'free', 'var(--moss)', false],
            ['WED 21', '18:30', 'Karaköy roof drinks',               'Mira V.', 'Drinks', '18 / 20', 'free', 'var(--bosphorus-dim)', false],
            ['SAT 24', '07:00', 'Princes\u2019 Islands run + swim',  'Rin H.',  'Outdoor', '7 / 10', '₺220', 'var(--moss)', false],
            ['TUE 27', '20:00', 'Field Notes · live reading',        'Editors', 'Talk', '34 / 40', '₺150', 'var(--terracotta)', false],
          ].map(([date, time, title, host, kind, seats, price, color, featured], i, arr) => (
            <a key={i} style={{
              display:'grid', gridTemplateColumns:'120px 80px auto 1fr auto auto auto', gap:32, alignItems:'center',
              padding:'22px 28px', borderTop: i===0 ? 'none' : '1px solid var(--ink-3)',
              background: featured ? 'rgba(196,99,58,0.04)' : 'transparent',
            }}>
              <div className="in-mono" style={{color:color, fontSize:11}}>{date}</div>
              <div className="in-num" style={{fontSize:18}}>{time}</div>
              <span className="in-mono" style={{padding:'4px 10px', border:`1px solid ${color}`, borderRadius:2, fontSize:9.5, color:color}}>{kind}</span>
              <div>
                <div style={{fontFamily:'var(--serif)', fontSize:22, letterSpacing:'-0.015em'}}>{title}</div>
                <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', marginTop:4}}>HOSTED BY {host.toUpperCase()}</div>
              </div>
              <div className="in-num" style={{fontSize:13, color:'var(--paper-mute)'}}>{seats}</div>
              <div className="in-mono" style={{fontSize:11, color: price==='free' ? 'var(--paper-mute)' : 'var(--paper)', minWidth:50, textAlign:'right'}}>{price}</div>
              <span style={{fontSize:13, color:color}}>RSVP →</span>
            </a>
          ))}
        </div>
        <div style={{marginTop:24, display:'flex', justifyContent:'space-between'}}>
          <span className="in-mono" style={{fontSize:10.5, color:'var(--paper-faint)'}}>↳ AUTO-RSVP VIA TELEGRAM · WE DO NOT EMAIL YOU UNLESS YOU ASK</span>
          <a style={{fontSize:13, color:'var(--terracotta)', borderBottom:'1px solid var(--terracotta)', paddingBottom:2}}>All upcoming events (12) →</a>
        </div>
      </section>

      {/* MEMBERSHIP STRIP - Free vs Nomad+ */}
      <section style={{padding:'160px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'auto 1fr auto', gap:24, alignItems:'center', marginBottom:56}}>
          <span className="in-mono" style={{color:'var(--terracotta)'}}>N° 07</span>
          <span className="in-thinrule"/>
          <span className="in-mono" style={{color:'var(--paper-mute)'}}>MEMBERSHIP · OPEN TIER + NOMAD+</span>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1.4fr 1.4fr', gap:0, border:'1px solid var(--ink-3)'}}>
          <div style={{padding:'48px 40px', borderRight:'1px solid var(--ink-3)'}}>
            <h2 style={{fontSize:48, lineHeight:1.0, letterSpacing:'-0.03em'}}>
              Two ways<br/>
              to <span style={{fontStyle:'italic', color:'var(--terracotta)'}}>belong</span>.
            </h2>
            <p style={{fontSize:14, color:'var(--paper-dim)', marginTop:24, lineHeight:1.55}}>
              Reading is free. Joining the Telegram is free. We charge for the unromantic parts - perks, priority on small experiences, a personal home page.
            </p>
            <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-faint)', marginTop:32, lineHeight:1.7}}>
              ↳ NO PAYWALLS ON GUIDES<br/>
              ↳ NO ADS IN THE FEED<br/>
              ↳ NO RECRUITERS, EVER
            </div>
          </div>

          {/* Free */}
          <div style={{padding:'48px 40px', borderRight:'1px solid var(--ink-3)', display:'flex', flexDirection:'column'}}>
            <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between'}}>
              <h3 style={{fontSize:36, letterSpacing:'-0.025em'}}>Free</h3>
              <span className="in-mono" style={{fontSize:10.5, color:'var(--paper-faint)'}}>1,847 MEMBERS</span>
            </div>
            <div className="in-num" style={{fontSize:48, color:'var(--paper)', marginTop:14}}>₺0</div>
            <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-mute)', marginTop:4}}>FOREVER · NO CARD</div>

            <ul style={{marginTop:32, padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:12, flex:1}}>
              {[
                'All guides + neighborhoods',
                'First Week Planner + Matcher',
                'Telegram channel access',
                'Public events RSVP',
                'Member directory · read-only',
              ].map(t => (
                <li key={t} style={{display:'flex', gap:14, fontSize:14, color:'var(--paper-dim)'}}>
                  <span className="in-mono" style={{color:'var(--moss)'}}>✓</span>{t}
                </li>
              ))}
            </ul>
            <button style={{padding:'14px 22px', border:'1px solid var(--ink-4)', color:'var(--paper)', borderRadius:2, fontSize:13, marginTop:24, alignSelf:'flex-start'}}>Join Telegram →</button>
          </div>

          {/* Nomad+ */}
          <div style={{padding:'48px 40px', display:'flex', flexDirection:'column', position:'relative', background:'rgba(196,99,58,0.04)'}}>
            <div style={{position:'absolute', top:0, left:0, right:0, height:2, background:'var(--terracotta)'}}/>
            <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between'}}>
              <h3 style={{fontSize:36, letterSpacing:'-0.025em'}}>Nomad<span style={{color:'var(--terracotta)'}}>+</span></h3>
              <span className="in-mono" style={{fontSize:10.5, color:'var(--terracotta)'}}>312 MEMBERS · INVITE-LITE</span>
            </div>
            <div style={{display:'flex', alignItems:'baseline', gap:8, marginTop:14}}>
              <span className="in-num" style={{fontSize:48, color:'var(--paper)'}}>₺440</span>
              <span className="in-mono" style={{fontSize:11, color:'var(--paper-faint)'}}>/ MO · ~$13</span>
            </div>
            <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-mute)', marginTop:4}}>OR ₺4,400 / YEAR · 17% OFF</div>

            <ul style={{marginTop:32, padding:0, listStyle:'none', display:'flex', flexDirection:'column', gap:12, flex:1}}>
              {[
                'Everything in Free',
                'Perks vault · 41 partners, refreshed monthly',
                'Priority on paid experiences + discounted seats',
                'Personal dashboard + saved itineraries',
                'Listing in public directory · "open to coffee"',
                'Sunday letter, members-only edition',
                'Vote on next Field Notes commissions',
              ].map(t => (
                <li key={t} style={{display:'flex', gap:14, fontSize:14, color:'var(--paper)'}}>
                  <span className="in-mono" style={{color:'var(--terracotta)'}}>✓</span>{t}
                </li>
              ))}
            </ul>
            <div style={{display:'flex', gap:10, marginTop:24}}>
              <button style={{padding:'14px 22px', background:'var(--terracotta)', color:'var(--ink-0)', borderRadius:2, fontSize:13, fontWeight:500}}>Become a Nomad+ →</button>
              <button style={{padding:'14px 22px', border:'1px solid var(--ink-4)', color:'var(--paper)', borderRadius:2, fontSize:13}}>See perks</button>
            </div>
          </div>
        </div>
      </section>

      {/* CIRCLES STRIP */}
      <section style={{padding:'160px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'auto 1fr auto', gap:24, alignItems:'center', marginBottom:56}}>
          <span className="in-mono" style={{color:'var(--terracotta)'}}>N° 08</span>
          <span className="in-thinrule"/>
          <span className="in-mono" style={{color:'var(--paper-mute)'}}>CIRCLES · SMALL ROOMS INSIDE THE BIG ROOM</span>
        </div>

        <h2 style={{fontSize:64, letterSpacing:'-0.03em', lineHeight:0.98}}>
          Six smaller rooms<br/>
          if Telegram is <span style={{fontStyle:'italic', color:'var(--terracotta)'}}>too many people.</span>
        </h2>

        <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:18, marginTop:48}}>
          {[
            ['Coworking', '184', 'Where Wi-Fi works on a Tuesday.', 'var(--terracotta)'],
            ['Hiking', '92', 'Belgrad Forest, Mt. Aydos, Saturdays.', 'var(--moss)'],
            ['Sailing', '46', 'Bareboat days out of Bostancı.', 'var(--bosphorus)'],
            ['Photography', '128', 'Quiet walks with cameras out.', 'var(--ferry-yellow)'],
            ['Wine', '71', 'Anatolian bottles, no scoring.', 'var(--terracotta-dim)'],
            ['Founders', '64', 'Office hours every other Thursday.', 'var(--bosphorus-dim)'],
          ].map(([name, n, blurb, c], i) => (
            <a key={name} style={{border:'1px solid var(--ink-3)', background:'var(--ink-2)', padding:24, display:'flex', flexDirection:'column', minHeight:200}}>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                <span style={{width:14, height:14, border:`2px solid ${c}`, borderRadius:'50%'}}/>
                <span className="in-num" style={{fontSize:14, color:'var(--paper-mute)'}}>{n}</span>
              </div>
              <h4 style={{fontSize:24, letterSpacing:'-0.015em', marginTop:24}}>{name}</h4>
              <p style={{fontSize:12.5, color:'var(--paper-dim)', marginTop:8, lineHeight:1.5, flex:1}}>{blurb}</p>
              <span style={{fontSize:12, color:c, marginTop:14}}>open →</span>
            </a>
          ))}
        </div>
      </section>

      {/* SUNDAY LETTER + STRIP */}
      <section style={{padding:'160px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:64, alignItems:'center'}}>
          <div>
            <div style={{display:'grid', gridTemplateColumns:'auto 1fr', gap:24, alignItems:'center', marginBottom:32}}>
              <span className="in-mono" style={{color:'var(--terracotta)'}}>N° 09 · SUNDAY LETTER</span>
              <span className="in-thinrule"/>
            </div>
            <h2 style={{fontSize:80, letterSpacing:'-0.035em', lineHeight:0.98}}>
              One letter,<br/>
              <span style={{fontStyle:'italic', color:'var(--terracotta)'}}>Sundays, 09:00 local.</span>
            </h2>
            <p style={{fontSize:17, color:'var(--paper-dim)', marginTop:24, lineHeight:1.6, maxWidth:520}}>
              A short read about Istanbul this week - three things to know, one place to go, one piece of writing we liked. No tracking pixels. Easy to unsubscribe.
            </p>

            <div style={{display:'flex', gap:8, marginTop:32, maxWidth:480}}>
              <input
                placeholder="you@anywhere.com"
                style={{
                  flex:1, padding:'14px 16px', background:'var(--ink-2)',
                  border:'1px solid var(--ink-4)', borderRadius:2, color:'var(--paper)',
                  fontSize:14,
                }}
              />
              <button style={{padding:'14px 22px', background:'var(--terracotta)', color:'var(--ink-0)', borderRadius:2, fontSize:13, fontWeight:500}}>Subscribe →</button>
            </div>
            <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-faint)', marginTop:14}}>
              4,210 SUBSCRIBERS · ISSUE 048 SHIPPED SUN 10 MAY · OPEN RATE 64%
            </div>
          </div>

          {/* Letter preview */}
          <div style={{border:'1px solid var(--ink-3)', background:'var(--ink-2)', padding:'32px 32px 24px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', paddingBottom:16, borderBottom:'1px solid var(--ink-3)'}}>
              <span className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>SUNDAY LETTER · ISSUE 048</span>
              <span className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>10 MAY 2026</span>
            </div>
            <h3 style={{fontSize:30, letterSpacing:'-0.02em', lineHeight:1.05, marginTop:18, fontStyle:'italic'}}>
              "The week the meltemi arrived and we all moved one chair north."
            </h3>
            <p style={{fontSize:14, color:'var(--paper-dim)', marginTop:18, lineHeight:1.6}}>
              First proper north wind of the season. Three notes from the week: a new pide place in Yeldeğirmeni worth the walk, why the ferries were 12 minutes late on Wednesday (it was the wind, not the captains), and an interview with the bookshop owner on Bahariye who has been there since 1981…
            </p>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:24, paddingTop:18, borderTop:'1px solid var(--ink-3)'}}>
              <span className="in-mono" style={{fontSize:10.5, color:'var(--paper-faint)'}}>4 MIN READ · 6 LINKS</span>
              <a style={{fontSize:13, color:'var(--terracotta)', borderBottom:'1px solid var(--terracotta)', paddingBottom:2}}>Read issue 048 →</a>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING QUIET CTA */}
      <section style={{padding:'192px 56px 128px', textAlign:'center'}}>
        <div className="in-mono" style={{color:'var(--paper-faint)', marginBottom:32}}>↳ ONE LAST THING</div>
        <h2 style={{fontSize:120, letterSpacing:'-0.04em', lineHeight:0.92, maxWidth:1240, margin:'0 auto', fontWeight:300}}>
          The ferry leaves<br/>
          <span style={{fontStyle:'italic', color:'var(--terracotta)'}}>every twenty minutes.</span><br/>
          <span style={{color:'var(--paper-mute)'}}>You can be on it tomorrow.</span>
        </h2>
        <div style={{display:'flex', justifyContent:'center', gap:14, marginTop:64}}>
          <button style={{padding:'18px 32px', background:'var(--terracotta)', color:'var(--ink-0)', borderRadius:2, fontWeight:500, fontSize:14}}>
            Plan your first week →
          </button>
          <button style={{padding:'18px 32px', border:'1px solid var(--ink-4)', color:'var(--paper)', borderRadius:2, fontSize:14}}>
            Read first
          </button>
        </div>
        <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-faint)', marginTop:48}}>
          OR · ⌘K TO OPEN THE COMMAND MENU · TYPE A NEIGHBORHOOD
        </div>
      </section>

      <Footer/>

      {/* Command-K overlay shown for design comp */}
      <CommandK style={{top:560, left:'50%', transform:'translateX(-50%)'}}/>
    </div>
  );
};

window.HomePageV2 = HomePageV2;
