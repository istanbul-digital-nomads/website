/* Event detail page - public, indexable, RSVP/ticketing UI */

const EventDetailPage = () => {
  return (
    <div className="in-artboard tod-dusk" style={{width:1440, minHeight:4720}}>
      <AmbientBar tod="dusk"/>
      <NavBar active="Events"/>

      {/* Breadcrumb */}
      <section style={{padding:'40px 56px 0'}}>
        <div className="in-mono" style={{color:'var(--paper-mute)', fontSize:11, display:'flex', justifyContent:'space-between'}}>
          <span>Events / Sailing / <span style={{color:'var(--paper)'}}>Sunset sail · Bostancı → Maiden\u2019s Tower</span></span>
          <span style={{color:'var(--paper-faint)'}}>EVENT N° 132 · /e/sunset-sail-may-23</span>
        </div>
      </section>

      {/* Editorial hero */}
      <section style={{padding:'48px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'auto 1fr auto', gap:24, alignItems:'center', marginBottom:32}}>
          <span className="in-mono" style={{padding:'5px 12px', border:'1px solid var(--bosphorus)', borderRadius:2, color:'var(--bosphorus)', fontSize:10}}>SAILING · CIRCLE</span>
          <span className="in-thinrule"/>
          <span className="in-mono" style={{color:'#7ab880', display:'flex', alignItems:'center', gap:8}}>
            <span style={{width:6, height:6, borderRadius:'50%', background:'#7ab880', boxShadow:'0 0 8px #7ab880'}}/>
            RSVP OPEN · 3 SPOTS LEFT
          </span>
        </div>

        <h1 style={{fontSize:108, fontWeight:300, letterSpacing:'-0.04em', lineHeight:0.92, maxWidth:1200}}>
          Sunset sail<br/>
          <span style={{fontStyle:'italic', color:'var(--terracotta)'}}>Bostancı → Maiden\u2019s Tower</span><br/>
          <span style={{color:'var(--paper-mute)'}}>and back, before the wind drops.</span>
        </h1>

        <div style={{display:'grid', gridTemplateColumns:'1fr 320px', gap:96, marginTop:48, alignItems:'end'}}>
          <p style={{fontSize:20, color:'var(--paper-dim)', lineHeight:1.45, maxWidth:780, fontFamily:'var(--serif)'}}>
            A small charter, eight of us, no captain training required. We push off at 17:40, motor out to the open Marmara, hoist a jib if the wind cooperates, drift past Maiden\u2019s Tower at sunset, and tie up by 21:00. Bring a jumper.
          </p>
          <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-faint)', lineHeight:1.7}}>
            ↳ FIRST EDITION · MAY 2026<br/>
            ↳ NOMAD+ PRIORITY · 24H WINDOW<br/>
            ↳ COMPLIES WITH IDO STATUTES<br/>
            ↳ FREE PEN-SKETCH BY ARAM P.
          </div>
        </div>
      </section>

      {/* Hero photo + sticky booking */}
      <section style={{padding:'80px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:32, alignItems:'flex-start'}}>
          <PhotoSlot kind="bosphorus" corner="Cover" label="Marmara open water · 18:58 · last week\u2019s trip" style={{height:620, borderRadius:0}}/>

          {/* sticky booking panel */}
          <div style={{border:'1px solid var(--ink-3)', background:'var(--ink-2)', padding:'32px 32px 28px', position:'sticky', top:80}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', paddingBottom:24, borderBottom:'1px solid var(--ink-3)'}}>
              <div>
                <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>SAT 23 MAY 2026 · 17:40 → 21:00</div>
                <div style={{fontFamily:'var(--serif)', fontSize:28, letterSpacing:'-0.02em', marginTop:8}}>From <span style={{color:'var(--paper)'}}>₺1,200</span></div>
                <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', marginTop:6}}>≈ $35 · INCLUDES BOAT + CAPTAIN + TEA</div>
              </div>
            </div>

            {/* attendees */}
            <div style={{padding:'20px 0', borderBottom:'1px solid var(--ink-3)'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                <span className="in-mono" style={{fontSize:10.5, color:'var(--paper-mute)'}}>SEATS</span>
                <span className="in-num" style={{fontSize:18, color:'var(--paper)'}}>5 <span style={{color:'var(--paper-faint)', fontSize:13}}>/ 8</span></span>
              </div>
              <div style={{display:'flex', gap:3, marginTop:12}}>
                {Array.from({length:8}).map((_, i) => (
                  <div key={i} style={{flex:1, height:6, background: i<5 ? 'var(--terracotta)' : 'var(--ink-3)'}}/>
                ))}
              </div>
              <div className="in-mono" style={{fontSize:10, color:'#d99464', marginTop:10}}>
                3 SPOTS LEFT · 6 ON WAITLIST
              </div>

              {/* tiny attendee avatars */}
              <div style={{display:'flex', marginTop:18, gap:-6, alignItems:'center'}}>
                {['var(--terracotta)','var(--bosphorus)','var(--moss)','var(--ferry-yellow)','var(--terracotta-dim)'].map((c, i) => (
                  <div key={i} style={{
                    width:28, height:28, borderRadius:'50%',
                    background:`linear-gradient(135deg, ${c}, var(--ink-3))`,
                    border:'2px solid var(--ink-2)',
                    marginLeft: i===0 ? 0 : -8,
                  }}/>
                ))}
                <span className="in-mono" style={{fontSize:10, color:'var(--paper-mute)', marginLeft:14}}>Maya, Onur, Lina, Yuki, Cem</span>
              </div>
            </div>

            {/* price tiers */}
            <div style={{padding:'20px 0', borderBottom:'1px solid var(--ink-3)'}}>
              {[
                ['Nomad+ seat', '₺1,000', 'Members get 17% off · 1 left', true],
                ['Standard seat', '₺1,200', 'Open to all · 2 left', false],
                ['Join the waitlist', 'free', 'We move you up if someone drops', false],
              ].map(([label, price, sub, selected], i) => (
                <label key={label} style={{display:'flex', alignItems:'center', gap:14, padding:'12px 0', cursor:'pointer'}}>
                  <span style={{
                    width:16, height:16, borderRadius:'50%',
                    border: selected ? '5px solid var(--terracotta)' : '1.5px solid var(--ink-5)',
                    background: selected ? 'var(--ink-1)' : 'transparent',
                  }}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14, color:'var(--paper)'}}>{label}</div>
                    <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', marginTop:2}}>{sub}</div>
                  </div>
                  <span className="in-num" style={{fontSize:14, color:'var(--paper)'}}>{price}</span>
                </label>
              ))}
            </div>

            <button style={{
              marginTop:20, padding:'16px 22px', background:'var(--terracotta)', color:'var(--ink-0)',
              borderRadius:2, fontWeight:500, fontSize:14, width:'100%',
              display:'flex', justifyContent:'space-between', alignItems:'center',
            }}>
              <span>Reserve · ₺1,000</span>
              <span className="in-mono" style={{fontSize:10, opacity:0.75}}>↵ ENTER</span>
            </button>

            <div style={{display:'flex', gap:8, marginTop:10}}>
              <button style={{flex:1, padding:'12px', border:'1px solid var(--ink-4)', borderRadius:2, fontSize:12, color:'var(--paper)'}}>↓ Add to calendar</button>
              <button style={{flex:1, padding:'12px', border:'1px solid var(--ink-4)', borderRadius:2, fontSize:12, color:'var(--paper)'}}>↗ Share</button>
            </div>

            <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', marginTop:18, lineHeight:1.6}}>
              ↳ Cancel free until 21 May 17:00<br/>
              ↳ We refund in full if the wind drops below 4 knots
            </div>
          </div>
        </div>
      </section>

      {/* AT A GLANCE */}
      <section style={{padding:'120px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'auto 1fr auto', gap:24, alignItems:'center', marginBottom:48}}>
          <span className="in-mono" style={{color:'var(--terracotta)'}}>N° 01 · AT A GLANCE</span>
          <span className="in-thinrule"/>
          <span className="in-mono" style={{color:'var(--paper-faint)'}}>OPERATIONAL DETAIL · 8 ROWS</span>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:0, border:'1px solid var(--ink-3)'}}>
          {[
            ['When', 'Sat 23 May · 17:40 → 21:00', '3 hr 20 min on the water', 'var(--terracotta)'],
            ['Where', 'Bostancı marina · D-12', 'Asia side · 14 min from Kadıköy', 'var(--bosphorus)'],
            ['Boat', 'Beneteau Oceanis 35', 'Sleeps 8 · captain · jib + main', 'var(--ferry-yellow)'],
            ['Difficulty', 'No experience needed', 'Wear soft soles · bring a layer', 'var(--moss)'],
            ['Group', '8 max · 5 confirmed', '6 waitlisted as of 18:32', 'var(--terracotta-dim)'],
            ['Language', 'English + Turkish', 'Captain speaks both fluently', 'var(--bosphorus-dim)'],
            ['Weather call', 'Go / no-go by Fri 17:00', 'Full refund if no-go', 'var(--paper-mute)'],
            ['Photos', 'Yes, by Aram P.', 'You may decline · free print', 'var(--paper-faint)'],
          ].map(([k, v, sub, c], i) => (
            <div key={k} style={{
              padding:'24px 24px',
              borderRight: (i%4)!==3 ? '1px solid var(--ink-3)' : 'none',
              borderBottom: i<4 ? '1px solid var(--ink-3)' : 'none',
            }}>
              <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>{k.toUpperCase()}</div>
              <div style={{display:'flex', alignItems:'center', gap:8, marginTop:8}}>
                <span style={{width:6, height:6, borderRadius:'50%', background:c}}/>
                <span style={{fontSize:14, color:'var(--paper)'}}>{v}</span>
              </div>
              <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', marginTop:6}}>↳ {sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section style={{padding:'120px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 2fr', gap:96}}>
          <div>
            <span className="in-mono" style={{color:'var(--terracotta)'}}>N° 02 · TIMELINE</span>
            <h2 style={{fontSize:56, lineHeight:0.98, letterSpacing:'-0.03em', marginTop:24}}>
              Three hours twenty,<br/>
              <span style={{fontStyle:'italic', color:'var(--terracotta)'}}>told as a plan.</span>
            </h2>
          </div>

          <div style={{position:'relative', paddingLeft:48}}>
            <div style={{position:'absolute', left:18, top:8, bottom:8, width:1, background:'var(--ink-3)'}}/>
            {[
              ['17:00', 'Arrive · Bostancı marina', 'D-pier, dock 12. Captain Selim will be in a yellow jacket.', 'var(--ferry-yellow)'],
              ['17:20', 'Boarding · safety brief', '15-minute safety brief in EN + TR. Life jackets fitted.', 'var(--bosphorus)'],
              ['17:40', 'Push off', 'Motor out past the breakwater. Tea served on deck.', 'var(--terracotta)'],
              ['18:30', 'Hoist sail (if wind permits)', 'We aim for a 6–10 knot tack south. Otherwise quiet motor.', 'var(--moss)'],
              ['19:35', 'Sunset · Maiden\u2019s Tower abeam', 'Drift, photos, the captain plays one ezan recording, and quietness.', 'var(--terracotta)'],
              ['20:30', 'Run back · lights of Kadıköy', 'Under engine. Members usually share dinner orders on the way.', 'var(--bosphorus-dim)'],
              ['21:00', 'Tie up · disembark', 'Cabs called from the marina. Optional Çiya dinner 21:30.', 'var(--ferry-yellow)'],
            ].map(([t, h, b, c], i) => (
              <div key={i} style={{display:'grid', gridTemplateColumns:'auto 1fr', gap:32, paddingBottom:24, position:'relative'}}>
                <div style={{position:'absolute', left:-30, top:6, width:13, height:13, borderRadius:'50%', background:c, boxShadow:'0 0 0 3px var(--ink-1)'}}/>
                <div className="in-num" style={{fontSize:15, color:'var(--paper-mute)', width:54}}>{t}</div>
                <div>
                  <div style={{fontSize:18, fontFamily:'var(--serif)', letterSpacing:'-0.01em'}}>{h}</div>
                  <div style={{fontSize:13.5, color:'var(--paper-dim)', marginTop:4, lineHeight:1.55}}>{b}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOST / WHO'S GOING */}
      <section style={{padding:'120px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:64}}>
          <div>
            <span className="in-mono" style={{color:'var(--terracotta)'}}>N° 03 · HOST</span>
            <div style={{display:'grid', gridTemplateColumns:'auto 1fr', gap:24, marginTop:24}}>
              <div style={{width:120, height:120, borderRadius:'50%', background:'linear-gradient(135deg, var(--bosphorus), var(--ink-3))', display:'grid', placeItems:'center'}}>
                <span className="in-mono" style={{fontSize:10, color:'rgba(11,14,17,0.6)'}}>↳ photo</span>
              </div>
              <div>
                <h3 style={{fontSize:32, letterSpacing:'-0.02em', lineHeight:1.05}}>Mira Vasileva</h3>
                <div className="in-mono" style={{fontSize:11, color:'var(--paper-mute)', marginTop:8}}>PRODUCER · KARAKÖY · 4 MO HERE · BG / EN</div>
                <p style={{fontSize:14, color:'var(--paper-dim)', marginTop:14, lineHeight:1.6}}>
                  Mira has chartered this same captain twice before and runs the Sailing circle. If the wind doesn\u2019t cooperate she will tell you straight, refund you, and reschedule.
                </p>
                <div style={{display:'flex', gap:8, marginTop:18}}>
                  <span className="in-tag">Sailing circle</span>
                  <span className="in-tag">Hosted 11 trips</span>
                  <span className="in-tag">Reply ~3h</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <span className="in-mono" style={{color:'var(--terracotta)'}}>N° 04 · WHO\u2019S GOING</span>
            <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14, marginTop:24}}>
              {[
                ['Maya K.', 'Writer', 'var(--terracotta)'],
                ['Onur T.', 'Engineer', 'var(--ferry-yellow)'],
                ['Lina M.', 'Designer', 'var(--moss)'],
                ['Yuki F.', 'Engineer', 'var(--bosphorus)'],
                ['Cem K.',  'Director', 'var(--terracotta-dim)'],
              ].map(([n, r, c]) => (
                <div key={n} style={{border:'1px solid var(--ink-3)', background:'var(--ink-2)', padding:14}}>
                  <div style={{width:'100%', aspectRatio:'1', background:`linear-gradient(135deg, ${c}, var(--ink-3))`, marginBottom:10}}/>
                  <div style={{fontSize:13, fontFamily:'var(--serif)'}}>{n}</div>
                  <div className="in-mono" style={{fontSize:9.5, color:'var(--paper-faint)', marginTop:3}}>{r}</div>
                </div>
              ))}
              <div style={{border:'1px dashed var(--ink-4)', padding:14, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column'}}>
                <div className="in-num" style={{fontSize:24, color:'var(--paper-mute)'}}>+3</div>
                <div className="in-mono" style={{fontSize:9.5, color:'var(--paper-faint)', marginTop:6}}>SEATS<br/>LEFT</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOGISTICS - map  + FAQ */}
      <section style={{padding:'120px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'start'}}>
          <div>
            <span className="in-mono" style={{color:'var(--terracotta)'}}>N° 05 · GETTING THERE</span>
            <div style={{marginTop:24, border:'1px solid var(--ink-3)', padding:'18px 18px 14px', background:'var(--ink-2)'}}>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <span className="in-mono" style={{color:'var(--paper-mute)', fontSize:10.5}}>BOSTANCI MARINA · D-12</span>
                <span className="in-mono" style={{color:'var(--paper-faint)', fontSize:10.5}}>40.95°N · 29.10°E</span>
              </div>
              <div style={{position:'relative', height:320, marginTop:14, background:`
                repeating-linear-gradient(90deg, rgba(244,234,215,0.04) 0 1px, transparent 1px 20px),
                repeating-linear-gradient(0deg,  rgba(244,234,215,0.03) 0 1px, transparent 1px 20px),
                linear-gradient(180deg, #0e1620 0%, #1a3550 100%)
              `}}>
                {/* coastline */}
                <svg viewBox="0 0 400 320" style={{position:'absolute', inset:0, width:'100%', height:'100%'}}>
                  <path d="M0,180 Q60,170 130,160 T260,150 T400,140" stroke="rgba(244,234,215,0.3)" strokeWidth="1.5" fill="none"/>
                  <path d="M0,180 Q60,170 130,160 T260,150 T400,140 L400,320 L0,320 Z" fill="rgba(28,35,43,0.6)"/>
                  {/* route */}
                  <path d="M180,170 C220,160 250,120 280,80" stroke="var(--terracotta)" strokeWidth="1.5" strokeDasharray="4 3" fill="none"/>
                </svg>
                {/* marker */}
                <div style={{position:'absolute', left:172, top:158, display:'flex', alignItems:'center', gap:8}}>
                  <span style={{width:12, height:12, borderRadius:'50%', background:'var(--ferry-yellow)', boxShadow:'0 0 0 3px rgba(11,14,17,0.8), 0 0 14px var(--ferry-yellow)'}}/>
                  <span className="in-mono" style={{fontSize:9.5, color:'var(--paper)', padding:'3px 8px', background:'rgba(11,14,17,0.8)', borderRadius:2}}>D-12 · MEET 17:00</span>
                </div>
                <div style={{position:'absolute', left:270, top:72, display:'flex', alignItems:'center', gap:8}}>
                  <span style={{width:8, height:8, borderRadius:'50%', background:'var(--terracotta)'}}/>
                  <span className="in-mono" style={{fontSize:9.5, color:'var(--paper)', padding:'3px 8px', background:'rgba(11,14,17,0.8)', borderRadius:2}}>MAIDEN\u2019S TOWER · 19:35</span>
                </div>
                <div className="in-mono" style={{position:'absolute', bottom:10, right:10, fontSize:9, color:'var(--paper-faint)'}}>↳ CUSTOM MAP STYLE · IN/BOSPHORUS</div>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', marginTop:12}}>
                <span className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>METRO · KADIKÖY → BOSTANCI · 14 MIN</span>
                <span className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>BIKE · 22 MIN COAST PATH</span>
              </div>
            </div>
          </div>

          <div>
            <span className="in-mono" style={{color:'var(--terracotta)'}}>N° 06 · FAQ</span>
            <div style={{marginTop:24, border:'1px solid var(--ink-3)'}}>
              {[
                ['What if I\u2019ve never sailed?', 'You\u2019ll be fine. The captain runs the boat; you can sit, watch and drink tea. We\u2019ll let you help only if you want to.'],
                ['Sea-sickness?', 'The Marmara is usually flat. Bring a pill if you\u2019re unsure. We\u2019ve had it on board for two seasons, used twice.'],
                ['What do I bring?', 'Layers (it gets cold after sundown), soft-soled shoes, water bottle. Tea is on the boat. Snacks welcome.'],
                ['Refund policy', 'Full refund if we cancel for weather. 100% refund on your end until 21 May, 17:00. Nothing after.'],
                ['Photos?', 'A photographer from the Photography circle joins for free. You can opt out and we\u2019ll keep you out of frames.'],
              ].map(([q, a], i) => (
                <div key={q} style={{padding:'20px 24px', borderTop: i===0 ? 'none' : '1px solid var(--ink-3)'}}>
                  <div style={{fontSize:15, fontFamily:'var(--serif)', letterSpacing:'-0.005em'}}>{q}</div>
                  <div style={{fontSize:13.5, color:'var(--paper-dim)', marginTop:8, lineHeight:1.55}}>{a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section style={{padding:'120px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'auto 1fr auto', gap:24, alignItems:'center', marginBottom:32}}>
          <span className="in-mono" style={{color:'var(--terracotta)'}}>N° 07 · IF YOU LIKE THIS</span>
          <span className="in-thinrule"/>
          <a style={{fontSize:13, color:'var(--paper-mute)', borderBottom:'1px solid var(--ink-4)', paddingBottom:2}}>All Sailing circle events →</a>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:18}}>
          {[
            ['Princes\u2019 Islands day-sail', 'Sat 06 Jun', '₺2,400', 'bosphorus'],
            ['Bareboat skills · Sunday', 'Sun 14 Jun', '₺1,800', 'mono'],
            ['Sunset paddle · Moda', 'Wed 17 Jun', '₺350', 'street'],
            ['Karaköy fishing morning', 'Sat 27 Jun', '₺900', 'dawn'],
          ].map(([t, d, p, ph], i) => (
            <a key={t} style={{display:'flex', flexDirection:'column'}}>
              <PhotoSlot kind={ph} corner={d.toUpperCase()} label={t} style={{height:200, borderRadius:0}}/>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginTop:12}}>
                <h4 style={{fontSize:18, letterSpacing:'-0.015em', lineHeight:1.1}}>{t}</h4>
                <span className="in-num" style={{fontSize:14, color:'var(--paper-mute)'}}>{p}</span>
              </div>
              <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', marginTop:6}}>{d}</div>
            </a>
          ))}
        </div>
      </section>

      <Footer/>
    </div>
  );
};

window.EventDetailPage = EventDetailPage;
