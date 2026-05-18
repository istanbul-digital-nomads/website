/* Coworking circle - sub-community landing page */

const CirclePage = () => {
  return (
    <div className="in-artboard tod-dusk" style={{width:1440, minHeight:4400}}>
      <AmbientBar tod="dusk"/>
      <NavBar active="Circles"/>

      {/* Breadcrumb */}
      <section style={{padding:'40px 56px 0'}}>
        <div className="in-mono" style={{color:'var(--paper-mute)', fontSize:11, display:'flex', justifyContent:'space-between'}}>
          <span>Circles / <span style={{color:'var(--paper)'}}>Coworking</span></span>
          <span style={{color:'var(--paper-faint)'}}>CIRCLE N° 01 OF 06 · /c/coworking</span>
        </div>
      </section>

      {/* Editorial masthead */}
      <section style={{padding:'48px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr auto', gap:48, alignItems:'baseline'}}>
          <h1 style={{fontSize:168, fontWeight:300, letterSpacing:'-0.045em', lineHeight:0.9}}>
            The <span style={{fontStyle:'italic', color:'var(--terracotta)'}}>Co<span style={{color:'var(--paper)'}}>-</span>working</span><br/>
            circle.
          </h1>
          <div style={{display:'flex', flexDirection:'column', gap:8, alignItems:'flex-end', paddingBottom:24}}>
            <div style={{width:48, height:48, border:'2px solid var(--terracotta)', borderRadius:'50%'}}/>
            <div className="in-mono" style={{color:'var(--paper-mute)', fontSize:10.5, marginTop:6}}>SINCE FEB 2024</div>
            <div className="in-mono" style={{color:'var(--paper-mute)', fontSize:10.5}}>184 MEMBERS</div>
            <div className="in-mono" style={{color:'var(--paper-mute)', fontSize:10.5}}>RUN BY ONUR T. + 3</div>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 0.4fr', gap:96, marginTop:48}}>
          <p style={{fontSize:24, color:'var(--paper)', fontFamily:'var(--serif)', lineHeight:1.4, letterSpacing:'-0.01em', maxWidth:920}}>
            For members who pick cafés by their power-socket density. We maintain the live laptop-ready list, run a co-work day every Tuesday, and answer the eternal question of <em>where does the Wi-Fi actually work today?</em>
          </p>
          <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-faint)', lineHeight:1.8}}>
            ↳ MEETS TUESDAYS · 10:00<br/>
            ↳ WALTER\u2019S YELDEĞIRMENI<br/>
            ↳ DROP-IN · NO RSVP<br/>
            ↳ FREE FILTER VIA PERK
          </div>
        </div>

        {/* live status block */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:0, marginTop:72, border:'1px solid var(--ink-3)'}}>
          {[
            ['Active now',  '7',    'in the room',  'var(--moss)'],
            ['Today',       '14',   'checked in',   'var(--terracotta)'],
            ['This week',   '38',   'unique laptops', 'var(--bosphorus)'],
            ['Next meet',   'TUE 12', '10:00 · Walter\u2019s', 'var(--ferry-yellow)'],
            ['Posts · 7d',  '42',   'in #coworking', 'var(--terracotta-dim)'],
          ].map(([k, v, sub, c], i) => (
            <div key={k} style={{padding:'24px 24px', borderRight: i<4 ? '1px solid var(--ink-3)' : 'none'}}>
              <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>{k.toUpperCase()}</div>
              <div className="in-num" style={{fontSize:34, color:c, marginTop:8, letterSpacing:'-0.01em'}}>{v}</div>
              <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', marginTop:6}}>↳ {sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TODAY MAP - laptop-ready places */}
      <section style={{padding:'120px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'auto 1fr auto', gap:24, alignItems:'center', marginBottom:48}}>
          <span className="in-mono" style={{color:'var(--terracotta)'}}>N° 01 · LIVE MAP</span>
          <span className="in-thinrule"/>
          <span className="in-mono" style={{color:'var(--paper-faint)'}}>UPDATED 12 MIN AGO · 14 VENUES OPEN</span>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:32}}>
          {/* custom map */}
          <div style={{border:'1px solid var(--ink-3)', background:'var(--ink-2)', padding:18}}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <span className="in-mono" style={{color:'var(--paper-mute)', fontSize:10.5}}>KADIKÖY · LAPTOP-READY MAP</span>
              <span className="in-mono" style={{color:'var(--paper-faint)', fontSize:10.5}}>CUSTOM STYLE · IN/SLATE</span>
            </div>

            <div style={{position:'relative', height:480, marginTop:14, background:`
              repeating-linear-gradient(90deg, rgba(244,234,215,0.04) 0 1px, transparent 1px 24px),
              repeating-linear-gradient(0deg,  rgba(244,234,215,0.03) 0 1px, transparent 1px 24px),
              linear-gradient(180deg, #0e1216 0%, #141a20 100%)
            `, overflow:'hidden'}}>
              {/* coast lines */}
              <svg viewBox="0 0 700 480" style={{position:'absolute', inset:0, width:'100%', height:'100%'}}>
                {/* water (top-left) */}
                <path d="M0,0 L0,140 Q120,160 220,170 T440,180 T700,200 L700,0 Z" fill="rgba(20,30,42,0.7)"/>
                {/* coast */}
                <path d="M0,140 Q120,160 220,170 T440,180 T700,200" stroke="rgba(61,107,138,0.5)" strokeWidth="1.5" fill="none"/>
                {/* ferry route */}
                <path d="M520,180 C400,120 260,80 120,60" stroke="var(--ferry-yellow)" strokeWidth="1" strokeDasharray="4 4" fill="none" opacity="0.6"/>
                {/* streets schematic */}
                <g stroke="rgba(244,234,215,0.05)" strokeWidth="1">
                  <path d="M0,260 L700,260"/>
                  <path d="M0,340 L700,340"/>
                  <path d="M0,420 L700,420"/>
                  <path d="M180,140 L180,480"/>
                  <path d="M360,180 L360,480"/>
                  <path d="M520,200 L520,480"/>
                </g>
              </svg>

              {/* WATER label */}
              <div className="in-mono" style={{position:'absolute', top:50, left:160, fontSize:10, color:'var(--bosphorus)', letterSpacing:'0.15em'}}>BOSPHORUS</div>
              <div className="in-mono" style={{position:'absolute', top:78, left:180, fontSize:9, color:'var(--paper-faint)'}}>→ EUROPE 22 MIN</div>

              {/* ferry pier */}
              <div style={{position:'absolute', left:516, top:172, width:10, height:10, borderRadius:'50%', background:'var(--ferry-yellow)', boxShadow:'0 0 8px var(--ferry-yellow)'}}/>
              <div className="in-mono" style={{position:'absolute', left:530, top:170, fontSize:9, color:'var(--paper-mute)'}}>KADIKÖY PIER</div>

              {/* venues */}
              {[
                {x:200, y:260, n:'Walter\u2019s', open:true, wifi:9.4, today:true},
                {x:280, y:300, n:'Karga Bar', open:true, wifi:8.8, today:false},
                {x:340, y:230, n:'Federal Karaköy', open:true, wifi:9.6, today:false, far:true},
                {x:450, y:300, n:'Datlı Maya', open:true, wifi:7.2, today:false},
                {x:420, y:400, n:'Walter\u2019s Moda', open:false, wifi:9.4, today:false},
                {x:160, y:380, n:'Kahve Dünyası', open:true, wifi:6.0, today:false},
                {x:560, y:380, n:'Kolektif House', open:true, wifi:9.8, today:false, paid:true},
                {x:280, y:420, n:'Petra Roasting', open:true, wifi:8.6, today:false},
              ].map((v, i) => (
                <div key={i} style={{position:'absolute', left:v.x, top:v.y, transform:'translate(-50%, -50%)'}}>
                  <div style={{
                    width: v.today ? 16 : 10,
                    height: v.today ? 16 : 10,
                    borderRadius:'50%',
                    background: v.open ? (v.today ? 'var(--terracotta)' : '#7ab880') : 'var(--ink-5)',
                    border: v.today ? '2px solid var(--paper)' : 'none',
                    boxShadow: v.open ? (v.today ? '0 0 14px var(--terracotta)' : '0 0 6px rgba(122,184,128,0.5)') : 'none',
                  }}/>
                  <div className="in-mono" style={{position:'absolute', left:18, top:-3, fontSize:9, color:'var(--paper)', whiteSpace:'nowrap', padding:'2px 6px', background:'rgba(11,14,17,0.85)', borderRadius:2}}>
                    {v.n} <span style={{color:v.open ? '#7ab880' : 'var(--paper-faint)'}}>{v.open ? 'open' : 'closed'}</span> · Wi-Fi {v.wifi}
                  </div>
                </div>
              ))}

              {/* legend */}
              <div style={{position:'absolute', bottom:14, left:14, right:14, display:'flex', gap:18, padding:'10px 14px', background:'rgba(11,14,17,0.85)', backdropFilter:'blur(8px)'}}>
                {[
                  ['Today\u2019s meet', 'var(--terracotta)', 16],
                  ['Open + laptop-ready', '#7ab880', 10],
                  ['Closed', 'var(--ink-5)', 10],
                  ['Paid · co-work space', 'var(--ferry-yellow)', 10],
                ].map(([lbl, c, sz]) => (
                  <div key={lbl} style={{display:'flex', alignItems:'center', gap:8}}>
                    <span style={{width:sz, height:sz, background:c, borderRadius:'50%'}}/>
                    <span className="in-mono" style={{fontSize:9.5, color:'var(--paper-mute)'}}>{lbl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* venue list */}
          <div style={{display:'flex', flexDirection:'column'}}>
            <div className="in-mono" style={{color:'var(--paper-mute)', fontSize:10.5, marginBottom:14}}>RANKED · MEMBER-RATED · UPDATED LIVE</div>
            <div style={{border:'1px solid var(--ink-3)', flex:1, fontFamily:'var(--mono)'}}>
              {[
                ['Walter\u2019s · Yeldeğirmeni', 9.4, '7 here', 'today\u2019s meet', 'var(--terracotta)'],
                ['Kolektif House · Moda',        9.8, '12',     'paid · ₺350/d',    'var(--ferry-yellow)'],
                ['Federal Coffee · Karaköy',     9.6, '4',      'cross-river',      'var(--bosphorus)'],
                ['Karga Bar · Kadıköy',          8.8, '3',      'upstairs only',    'var(--moss)'],
                ['Petra Roasting · Moda',        8.6, '2',      'window seats',     'var(--terracotta-dim)'],
                ['Datlı Maya · Kadıköy',         7.2, '0',      'quiet · 10–14',     'var(--paper-mute)'],
                ['Kahve Dünyası · Bahariye',     6.0, '1',      'fallback only',    'var(--paper-faint)'],
              ].map(([n, score, present, note, c], i, arr) => (
                <div key={n} style={{
                  display:'grid', gridTemplateColumns:'1fr auto auto', gap:10, alignItems:'center',
                  padding:'12px 16px', borderTop: i===0 ? 'none' : '1px solid var(--ink-3)',
                  background: i===0 ? 'rgba(196,99,58,0.06)' : 'transparent',
                }}>
                  <div>
                    <div style={{fontSize:13, color:'var(--paper)', fontFamily:'var(--sans)'}}>{n}</div>
                    <div style={{fontSize:10, color:c, marginTop:3}}>↳ {note.toUpperCase()}</div>
                  </div>
                  <div style={{fontSize:13, color:'var(--paper)'}}>{score}</div>
                  <div style={{fontSize:10, color:'var(--paper-faint)'}}>{present}</div>
                </div>
              ))}
            </div>
            <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', marginTop:14, lineHeight:1.6}}>
              ↳ MEMBERS CHECK IN VIA TELEGRAM BOT<br/>
              ↳ HOW WE SCORE → /c/coworking/scoring
            </div>
          </div>
        </div>
      </section>

      {/* DISCUSSION / RECENT */}
      <section style={{padding:'120px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:64}}>
          <div>
            <div style={{display:'grid', gridTemplateColumns:'auto 1fr', gap:18, alignItems:'center', marginBottom:24}}>
              <span className="in-mono" style={{color:'var(--terracotta)'}}>N° 02 · RECENT IN THE ROOM</span>
              <span className="in-thinrule"/>
            </div>

            <div style={{border:'1px solid var(--ink-3)'}}>
              {[
                ['Onur T.',  '17 MIN AGO', 'Window seat just opened at Walter\u2019s. First two in get tea on me.',          'var(--ferry-yellow)'],
                ['Lina M.',  '1 H AGO',    'Federal Karaköy Wi-Fi flaky this morning. Hotspot if you\u2019re here.',            'var(--moss)'],
                ['Yuki F.',  '3 H AGO',    'Anyone doing a deep-work block Friday morning? I\u2019m at Petra by 09:00.',         'var(--bosphorus)'],
                ['Eli S.',   'YESTERDAY',  'New to Cihangir - best café for a four-hour writing session?',                   'var(--terracotta-dim)'],
                ['Maya K.',  '2 D AGO',    'Note: Kolektif House Moda has a phone booth on the 3rd floor. Underrated.',     'var(--terracotta)'],
              ].map(([who, when, msg, c], i, arr) => (
                <div key={i} style={{padding:'18px 22px', borderTop: i===0 ? 'none' : '1px solid var(--ink-3)'}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                    <div style={{display:'flex', alignItems:'center', gap:10}}>
                      <span style={{width:8, height:8, borderRadius:'50%', background:c}}/>
                      <span style={{fontSize:13, color:'var(--paper)', fontFamily:'var(--serif)'}}>{who}</span>
                    </div>
                    <span className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>{when}</span>
                  </div>
                  <p style={{fontSize:14, color:'var(--paper-dim)', marginTop:10, lineHeight:1.55}}>{msg}</p>
                </div>
              ))}
            </div>
            <div style={{display:'flex', justifyContent:'space-between', marginTop:16}}>
              <span className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>↳ 184 MEMBERS · POST AS YOURSELF · NO LURKING REQUIRED</span>
              <a style={{fontSize:13, color:'var(--terracotta)'}}>Open #coworking in Telegram →</a>
            </div>
          </div>

          <div>
            <div style={{display:'grid', gridTemplateColumns:'auto 1fr', gap:18, alignItems:'center', marginBottom:24}}>
              <span className="in-mono" style={{color:'var(--terracotta)'}}>N° 03 · UPCOMING IN THIS CIRCLE</span>
              <span className="in-thinrule"/>
            </div>

            <div style={{border:'1px solid var(--ink-3)'}}>
              {[
                ['TUE 12', '10:00', 'Tuesday co-work day', 'Walter\u2019s · drop-in', '14 going · open', 'var(--terracotta)'],
                ['FRI 16', '08:00', 'Bosphorus ferry · slow office', 'Eminönü pier · ₺200', '14 / 18', 'var(--bosphorus)'],
                ['TUE 19', '10:00', 'Tuesday co-work day', 'Walter\u2019s · drop-in', '-', 'var(--terracotta)'],
                ['THU 21', '14:00', 'Focus block · cinematic', 'Kolektif Moda · members only', '5 / 8', 'var(--moss)'],
                ['SAT 23', '09:00', 'Async writing morning', 'Mephisto basement · ₺50', '6 / 10', 'var(--ferry-yellow)'],
              ].map(([d, t, title, where, seats, c], i) => (
                <div key={i} style={{display:'grid', gridTemplateColumns:'auto 1fr auto', gap:18, padding:'16px 22px', borderTop: i===0 ? 'none' : '1px solid var(--ink-3)', alignItems:'center'}}>
                  <div style={{textAlign:'left'}}>
                    <div className="in-mono" style={{fontSize:10, color:c}}>{d}</div>
                    <div className="in-num" style={{fontSize:14, color:'var(--paper)', marginTop:3}}>{t}</div>
                  </div>
                  <div>
                    <div style={{fontFamily:'var(--serif)', fontSize:17, letterSpacing:'-0.01em', lineHeight:1.1}}>{title}</div>
                    <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', marginTop:4}}>↳ {where.toUpperCase()}</div>
                  </div>
                  <div className="in-num" style={{fontSize:11.5, color:'var(--paper-mute)'}}>{seats}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PINNED RESOURCES + JOIN */}
      <section style={{padding:'120px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:64}}>
          <div>
            <div style={{display:'grid', gridTemplateColumns:'auto 1fr', gap:18, alignItems:'center', marginBottom:24}}>
              <span className="in-mono" style={{color:'var(--terracotta)'}}>N° 04 · PINNED BY THIS CIRCLE</span>
              <span className="in-thinrule"/>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:24}}>
              {[
                ['Laptop-ready cafés · the canonical list', 'Member-edited spreadsheet. 84 venues, scored, updated rolling.', 'GUIDE · 8 MIN', 'street'],
                ['Why your Wi-Fi drops at 19:00', 'A short physics explainer for the worst working hour in Istanbul.', 'FIELD NOTE · 4 MIN', 'mono'],
                ['Kolektif vs Workhaus vs Impact Hub', 'Side-by-side comparison of the three real co-work options.', 'GUIDE · 11 MIN', 'interior'],
                ['How to host a co-work day', 'For members starting their own neighborhood drop-in.', 'PLAYBOOK · 3 MIN', 'dawn'],
              ].map(([t, b, meta, ph]) => (
                <a key={t} style={{display:'flex', flexDirection:'column'}}>
                  <PhotoSlot kind={ph} corner={meta} label={t} style={{height:180, borderRadius:0}}/>
                  <h4 style={{fontSize:18, letterSpacing:'-0.015em', marginTop:14, lineHeight:1.15}}>{t}</h4>
                  <p style={{fontSize:13, color:'var(--paper-dim)', marginTop:8, lineHeight:1.5}}>{b}</p>
                </a>
              ))}
            </div>
          </div>

          <div>
            <div style={{display:'grid', gridTemplateColumns:'auto 1fr', gap:18, alignItems:'center', marginBottom:24}}>
              <span className="in-mono" style={{color:'var(--terracotta)'}}>N° 05 · JOIN THIS CIRCLE</span>
              <span className="in-thinrule"/>
            </div>
            <div style={{border:'1px solid var(--ink-3)', background:'var(--ink-2)', padding:'32px 32px 28px'}}>
              <div style={{display:'flex', alignItems:'baseline', gap:12}}>
                <div style={{width:24, height:24, border:'2px solid var(--terracotta)', borderRadius:'50%'}}/>
                <h3 style={{fontSize:32, letterSpacing:'-0.02em', lineHeight:1}}>Coworking</h3>
              </div>
              <p style={{fontSize:14, color:'var(--paper-dim)', marginTop:18, lineHeight:1.6}}>
                Free for members. Opens up the Telegram subchannel, the live laptop-ready map, the venue check-in bot, and an RSVP on the Tuesday meet.
              </p>
              <div style={{padding:'18px 0', borderTop:'1px solid var(--ink-3)', borderBottom:'1px solid var(--ink-3)', margin:'24px 0', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px 16px'}}>
                {[
                  ['Members', '184'],
                  ['Posts / wk', '~120'],
                  ['Events / mo', '6'],
                  ['Reply ~', '11 min'],
                ].map(([k, v]) => (
                  <div key={k} style={{display:'flex', justifyContent:'space-between'}}>
                    <span className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>{k}</span>
                    <span className="in-num" style={{fontSize:13, color:'var(--paper)'}}>{v}</span>
                  </div>
                ))}
              </div>
              <button style={{width:'100%', padding:'14px 22px', background:'var(--terracotta)', color:'var(--ink-0)', borderRadius:2, fontSize:13.5, fontWeight:500}}>Join the Coworking circle →</button>
              <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', marginTop:14, textAlign:'center'}}>
                FREE FOR MEMBERS · LEAVE ANY TIME · NO NOTIFICATIONS UNTIL YOU OPT IN
              </div>
            </div>

            <div style={{marginTop:24, padding:'18px 22px', border:'1px dashed var(--ink-4)'}}>
              <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>↳ OTHER CIRCLES YOU COULD JOIN</div>
              <div style={{display:'flex', flexWrap:'wrap', gap:6, marginTop:10}}>
                {[
                  ['Hiking', 'var(--moss)'],
                  ['Sailing', 'var(--bosphorus)'],
                  ['Photography', 'var(--ferry-yellow)'],
                  ['Wine', 'var(--terracotta-dim)'],
                  ['Founders', 'var(--bosphorus-dim)'],
                ].map(([n, c]) => (
                  <span key={n} style={{padding:'6px 12px', border:`1px solid ${c}`, borderRadius:999, fontSize:11.5, color:c}}>{n}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
};

window.CirclePage = CirclePage;
