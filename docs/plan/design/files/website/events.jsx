/* Events Page - populated */

const EventsPage = () => {
  const events = [
    { d:'15', m:'MAY', dow:'Thu', t:'19:30', dur:'3 hrs', title:'Wednesday dinner · Çiya backroom', kind:'Dinner', host:'Maya K.', loc:'Kadıköy · Çiya Sofrası', attend:23, max:24, blurb:'Long table, Anatolian plates, three languages on average. New arrivals welcome, sit at the head.', accent:'var(--terracotta)', photo:'interior' },
    { d:'16', m:'MAY', dow:'Fri', t:'08:00', dur:'1.5 hrs', title:'Bosphorus ferry · slow office', kind:'Co-work', host:'Deniz A.', loc:'Eminönü → Anadolu Kavağı', attend:14, max:18, blurb:'Three hours each way. Bring a laptop, a jumper, and at most one call. Tea is included by the boat.', accent:'var(--bosphorus)', photo:'bosphorus' },
    { d:'17', m:'MAY', dow:'Sat', t:'10:00', dur:'2 hrs', title:'Salı pazarı walk · Tuesday market', kind:'Walk', host:'Lina M.', loc:'Kadıköy, meet at Moda Pier', attend:11, max:15, blurb:'Crash-course in the Tuesday market with someone who knows the vendors. Bring cash and a tote.', accent:'var(--moss)', photo:'street' },
    { d:'19', m:'MAY', dow:'Mon', t:'19:00', dur:'2 hrs', title:'Türkçe başla · beginner circle', kind:'Class', host:'Onur T.', loc:'Karga Bar, upstairs', attend:9,  max:12, blurb:'Free. No grammar. Just speak. We rotate four partners. If you can order a coffee, you\u2019re past hour one.', accent:'var(--ferry-yellow)', photo:'mono' },
    { d:'21', m:'MAY', dow:'Wed', t:'18:30', dur:'2.5 hrs', title:'Karaköy roof drinks', kind:'Drinks', host:'Mira V.', loc:'Mürver, Karaköy', attend:18, max:20, blurb:'Bosphorus view, terrible acoustics, good people. Reserved under "IN". Members get the corner.', accent:'var(--bosphorus-dim)', photo:'dusk' },
    { d:'22', m:'MAY', dow:'Thu', t:'15:00', dur:'2 hrs', title:'Founder office hours', kind:'Talk', host:'Cem K.', loc:'Kolektif House Moda', attend:6,  max:8,  blurb:'Three founders, no slides, no recording. Bring a thing that\u2019s actually broken, leave with a draft of the fix.', accent:'var(--terracotta-dim)', photo:'interior' },
    { d:'24', m:'MAY', dow:'Sat', t:'07:00', dur:'4 hrs', title:'Princes\u2019 Islands run + swim', kind:'Outdoor', host:'Rin H.', loc:'Bostancı pier → Heybeliada', attend:7,  max:10, blurb:'5K easy on Heybeli, swim at the south end, breakfast on the ferry back. Bring shoes and a towel.', accent:'var(--moss)', photo:'bosphorus' },
    { d:'27', m:'MAY', dow:'Tue', t:'20:00', dur:'3 hrs', title:'Field Notes · live reading', kind:'Talk', host:'IN editors', loc:'Mephisto Kitabevi, Kadıköy', attend:34, max:40, blurb:'Three members read their drafts out loud. We discuss. Wine and water. New writers very welcome.', accent:'var(--terracotta)', photo:'interior' },
  ];

  return (
    <div className="in-artboard tod-dusk" style={{width:1440, minHeight:3600}}>
      <AmbientBar tod="dusk"/>
      <NavBar active="Events"/>

      {/* header */}
      <section style={{padding:'56px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'end'}}>
          <div>
            <SectionEyebrow num="N° 05" label="Events · the next two weeks"/>
            <h1 style={{fontSize:120, lineHeight:0.94, letterSpacing:'-0.04em', marginTop:32, fontWeight:300}}>
              Twelve <span style={{fontStyle:'italic', color:'var(--terracotta)'}}>things</span>,<br/>
              eight of them<br/>
              worth showing up.
            </h1>
          </div>
          <div style={{paddingBottom:28}}>
            <p style={{fontSize:18, color:'var(--paper-dim)', lineHeight:1.55, maxWidth:480}}>
              Hosted by members, for members. No tickets. RSVP via Telegram, show up on time, leave on time. Most events are free; some cost what the food costs.
            </p>
            <div style={{display:'flex', gap:24, marginTop:32}}>
              <div>
                <div className="in-num" style={{fontSize:36, color:'var(--paper)'}}>8</div>
                <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-mute)', marginTop:4}}>This fortnight</div>
              </div>
              <div>
                <div className="in-num" style={{fontSize:36, color:'var(--paper)'}}>4</div>
                <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-mute)', marginTop:4}}>This week</div>
              </div>
              <div>
                <div className="in-num" style={{fontSize:36, color:'var(--terracotta)'}}>122</div>
                <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-mute)', marginTop:4}}>RSVPs total</div>
              </div>
              <div>
                <div className="in-num" style={{fontSize:36, color:'var(--paper)'}}>3</div>
                <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-mute)', marginTop:4}}>Waitlisted</div>
              </div>
            </div>
          </div>
        </div>

        {/* filter row */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'24px 0', marginTop:64, borderTop:'1px solid var(--ink-4)', borderBottom:'1px solid var(--ink-4)'}}>
          <div style={{display:'flex', gap:10, alignItems:'center'}}>
            <span className="in-mono" style={{color:'var(--paper-mute)', marginRight:8}}>Filter</span>
            {[
              ['All', 8],
              ['Dinner', 2],
              ['Co-work', 1],
              ['Walks', 1],
              ['Drinks', 1],
              ['Talks', 2],
              ['Outdoor', 1],
            ].map(([f, n], i) => (
              <button key={f} style={{
                padding:'7px 14px', borderRadius:999,
                border:'1px solid ' + (i===0 ? 'var(--paper)' : 'var(--ink-4)'),
                fontSize:12.5, color: i===0 ? 'var(--paper)' : 'var(--paper-mute)',
                background: i===0 ? 'rgba(244,234,215,0.08)' : 'transparent',
                display:'inline-flex', alignItems:'center', gap:6,
              }}>{f}<span className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>{n}</span></button>
            ))}
          </div>
          <div style={{display:'flex', alignItems:'center', gap:18}}>
            <span className="in-mono" style={{color:'var(--paper-mute)'}}>View</span>
            <button style={{padding:'7px 14px', border:'1px solid var(--paper)', borderRadius:2, fontSize:12.5, color:'var(--paper)'}}>List</button>
            <button style={{padding:'7px 14px', border:'1px solid var(--ink-4)', borderRadius:2, fontSize:12.5, color:'var(--paper-mute)'}}>Calendar</button>
            <button style={{padding:'7px 14px', border:'1px solid var(--ink-4)', borderRadius:2, fontSize:12.5, color:'var(--paper-mute)'}}>Map</button>
          </div>
        </div>
      </section>

      {/* FEATURED first event - huge */}
      <section style={{padding:'48px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:48, alignItems:'stretch'}}>
          <PhotoSlot kind={events[0].photo} corner="01 · Featured" label={events[0].loc} style={{height:540, borderRadius:2}}/>
          <div style={{display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
            <div>
              <div style={{display:'flex', alignItems:'baseline', gap:14}}>
                <span className="in-mono" style={{color:'var(--terracotta)'}}>Featured · {events[0].kind}</span>
                <span style={{width:6, height:6, background:events[0].accent, borderRadius:'50%'}}/>
                <span className="in-mono" style={{color:'var(--paper-mute)'}}>Hosted by {events[0].host}</span>
              </div>
              <h2 style={{fontSize:56, letterSpacing:'-0.03em', lineHeight:1.02, marginTop:24}}>{events[0].title}</h2>
              <p style={{fontSize:16, color:'var(--paper-dim)', marginTop:18, lineHeight:1.6, maxWidth:460}}>{events[0].blurb}</p>
            </div>
            <div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:0, border:'1px solid var(--ink-3)', marginBottom:24}}>
                {[
                  ['When', `${events[0].dow} ${events[0].d} ${events[0].m} · ${events[0].t}`, events[0].dur],
                  ['Where', events[0].loc, '7 min walk from Moda pier'],
                  ['Seats', `${events[0].attend} / ${events[0].max}`, `${events[0].max - events[0].attend} left`],
                ].map(([k,v,sub], i) => (
                  <div key={k} style={{padding:'18px 20px', borderRight: i<2 ? '1px solid var(--ink-3)' : 'none'}}>
                    <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', marginBottom:8}}>{k}</div>
                    <div style={{fontSize:14, fontFamily:'var(--serif)', letterSpacing:'-0.005em'}}>{v}</div>
                    <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', marginTop:4}}>{sub}</div>
                  </div>
                ))}
              </div>
              <div style={{display:'flex', gap:10}}>
                <button style={{padding:'14px 22px', background:'var(--terracotta)', color:'var(--ink-0)', borderRadius:2, fontSize:13, fontWeight:500}}>RSVP via Telegram →</button>
                <button style={{padding:'14px 22px', border:'1px solid var(--ink-4)', color:'var(--paper)', borderRadius:2, fontSize:13}}>↓ Add to calendar</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* event list */}
      <section style={{padding:'80px 56px 0'}}>
        {events.slice(1).map((e, i) => (
          <a key={i} style={{
            display:'grid',
            gridTemplateColumns:'auto auto 1fr auto auto',
            gap:36,
            padding:'32px 0',
            borderBottom:'1px solid var(--ink-3)',
            borderTop: i===0 ? '1px solid var(--ink-3)' : 'none',
            alignItems:'center',
          }}>
            {/* date block */}
            <div style={{width:80, textAlign:'left', borderLeft:`2px solid ${e.accent}`, paddingLeft:14}}>
              <div className="in-mono" style={{fontSize:10, color:'var(--paper-mute)'}}>{e.dow.toUpperCase()}</div>
              <div className="in-num" style={{fontSize:40, color:'var(--paper)', lineHeight:1, marginTop:4}}>{e.d}</div>
              <div className="in-mono" style={{fontSize:10, color:'var(--paper-mute)', marginTop:4}}>{e.m}</div>
            </div>
            {/* time */}
            <div style={{width:90}}>
              <div className="in-num" style={{fontSize:18, color:'var(--paper)'}}>{e.t}</div>
              <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', marginTop:4}}>{e.dur}</div>
            </div>
            {/* title block */}
            <div>
              <div style={{display:'flex', alignItems:'baseline', gap:14}}>
                <span className="in-mono" style={{color:e.accent}}>{e.kind}</span>
                <span className="in-mono" style={{color:'var(--paper-faint)'}}>· Host {e.host}</span>
              </div>
              <h3 style={{fontSize:30, letterSpacing:'-0.02em', lineHeight:1.05, marginTop:10}}>{e.title}</h3>
              <p style={{fontSize:14, color:'var(--paper-dim)', marginTop:8, lineHeight:1.5, maxWidth:640}}>{e.blurb}</p>
              <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-faint)', marginTop:12}}>↳ {e.loc}</div>
            </div>
            {/* seats */}
            <div style={{width:140, textAlign:'right'}}>
              <div className="in-num" style={{fontSize:20, color:'var(--paper)'}}>{e.attend}<span style={{color:'var(--paper-faint)', fontSize:14}}> / {e.max}</span></div>
              <div className="in-mono" style={{fontSize:10, color:e.max - e.attend < 3 ? '#d99464' : 'var(--paper-faint)', marginTop:4}}>
                {e.max - e.attend} seat{e.max - e.attend !== 1 ? 's' : ''} left
              </div>
              <div style={{display:'flex', gap:3, marginTop:10, justifyContent:'flex-end'}}>
                {Array.from({length:Math.min(e.max, 24)}).map((_, j) => (
                  <span key={j} style={{
                    width:5, height:14,
                    background: j < e.attend ? e.accent : 'var(--ink-3)',
                  }}/>
                ))}
              </div>
            </div>
            {/* RSVP */}
            <button style={{
              padding:'12px 18px', border:`1px solid ${e.accent}`,
              borderRadius:2, fontSize:12.5, color:e.accent,
              whiteSpace:'nowrap',
            }}>RSVP →</button>
          </a>
        ))}
      </section>

      {/* host CTA */}
      <section style={{padding:'120px 56px 0'}}>
        <div style={{background:'var(--ink-2)', border:'1px solid var(--ink-3)', padding:'56px 56px', display:'grid', gridTemplateColumns:'1fr auto', gap:48, alignItems:'center'}}>
          <div>
            <SectionEyebrow num="↻" label="Host one yourself"/>
            <h2 style={{fontSize:48, letterSpacing:'-0.025em', marginTop:18, lineHeight:1.05}}>
              Any member can post an event.<br/>
              <span style={{fontStyle:'italic', color:'var(--terracotta)'}}>We approve in under an hour.</span>
            </h2>
            <p style={{fontSize:15, color:'var(--paper-dim)', marginTop:14, maxWidth:600, lineHeight:1.55}}>
              Walks, dinners, working sessions, weird crafts. The only rules: no pitches, no paid promotion, no recruiters. Members > 30 days can self-publish.
            </p>
          </div>
          <button style={{padding:'18px 28px', background:'var(--paper)', color:'var(--ink-0)', borderRadius:2, fontSize:14, fontWeight:500, whiteSpace:'nowrap'}}>
            Propose an event →
          </button>
        </div>
      </section>

      <Footer/>
    </div>
  );
};

window.EventsPage = EventsPage;
