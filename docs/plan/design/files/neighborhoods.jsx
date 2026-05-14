/* Neighborhoods Index */

const NeighborhoodsPage = () => {
  const hoods = [
    { num:'01', name:'Kadıköy',  side:'Asia',    rent:'$480–800',  wifi:'97', walk:'94', vibe:'Lived-in', here:38, blurb:'The Asia-side default. Ferry-first life, real Tuesday market, more bookshops than is sensible.', photo:'dawn', accent:'var(--terracotta)' },
    { num:'02', name:'Cihangir', side:'Europe',  rent:'$640–1280', wifi:'92', walk:'91', vibe:'Faded cool', here:22, blurb:'Galata-side. Cats, expats, very good bookshops, slightly tired. Walk to everything.', photo:'dusk', accent:'var(--bosphorus)' },
    { num:'03', name:'Beşiktaş', side:'Europe',  rent:'$640–1120', wifi:'89', walk:'82', vibe:'Working city', here:31, blurb:'Where work happens. Loud, transit-connected, has every grocery you could need.', photo:'street', accent:'var(--bosphorus-dim)' },
    { num:'04', name:'Karaköy',  side:'Europe',  rent:'$800–1440', wifi:'95', walk:'88', vibe:'Postcard', here:11, blurb:'Bosphorus at your feet. Better for visits than seasons. Beautiful, slightly empty.', photo:'bosphorus', accent:'var(--ferry-yellow)' },
    { num:'05', name:'Balat',    side:'Europe',  rent:'$400–800',  wifi:'81', walk:'78', vibe:'Painterly', here:9,  blurb:'Slow, colorful, harder to leave once you stay. Coffee scene catching up.', photo:'interior', accent:'var(--moss)' },
    { num:'06', name:'Üsküdar',  side:'Asia',    rent:'$480–880',  wifi:'85', walk:'76', vibe:'Quieter Asia', here:14, blurb:'The quieter Asia. Tea gardens, mosques, less English. Great for second-time stays.', photo:'mono', accent:'var(--paper-mute)' },
    { num:'07', name:'Galata',   side:'Europe',  rent:'$800–1440', wifi:'93', walk:'90', vibe:'Tourist edge', here:18, blurb:'Tower-side. Pretty, touristed, full of cafés. Live one street back from the main run.', photo:'dusk', accent:'var(--terracotta-dim)' },
    { num:'08', name:'Moda',     side:'Asia',    rent:'$575–960',  wifi:'94', walk:'95', vibe:'Quiet Kadıköy', here:21, blurb:'Kadıköy with the volume lower. Sea walk, slow cafés, families with dogs.', photo:'dawn', accent:'var(--bosphorus)' },
    { num:'09', name:'Nişantaşı',side:'Europe',  rent:'$800–1600', wifi:'91', walk:'84', vibe:'Polished', here:6,  blurb:'Polished, central, cafe-rich. For nomads who want comfort, boutiques, gyms, easy Şişli access.', photo:'street', accent:'var(--terracotta-dim)' },
    { num:'10', name:'Levent',   side:'Europe',  rent:'$720–1440', wifi:'96', walk:'68', vibe:'Business corridor', here:8,  blurb:'Metro, malls, the best paid co-working density in the city. For founder-mode stays.', photo:'mono', accent:'var(--bosphorus-dim)' },
  ];

  return (
    <div className="in-artboard tod-dusk" style={{width:1440, minHeight:4740}}>
      <AmbientBar tod="dusk"/>
      <NavBar active="Neighborhoods"/>

      {/* Header */}
      <section style={{padding:'56px 56px 0'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
          <div style={{maxWidth:840}}>
            <SectionEyebrow num="N° 02" label="Neighborhoods · eight worth a season"/>
            <h1 style={{fontSize:108, lineHeight:0.94, letterSpacing:'-0.04em', marginTop:32}}>
              Eight neighborhoods,<br/>
              <span style={{fontStyle:'italic', color:'var(--terracotta)'}}>opinionated</span> on purpose.
            </h1>
            <p style={{fontSize:19, color:'var(--paper-dim)', marginTop:32, maxWidth:680, lineHeight:1.55}}>
              We don't list every postcode. We list the eight places a remote worker can actually live for one to six months - and we tell you what they're like at 07:00 and 22:30, not just on Saturday afternoon.
            </p>
          </div>

          {/* mini map  */}
          <div style={{width:380, border:'1px solid var(--ink-3)', padding:18, background:'var(--ink-2)'}}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <span className="in-mono" style={{color:'var(--paper-mute)'}}>Bosphorus · schematic</span>
              <span className="in-mono" style={{color:'var(--paper-faint)'}}>not to scale</span>
            </div>
            <div style={{position:'relative', height:280, marginTop:14, border:'1px dashed var(--ink-4)'}}>
              {/* bosphorus path */}
              <svg viewBox="0 0 380 280" style={{position:'absolute', inset:0, width:'100%', height:'100%'}}>
                <path d="M180,0 C170,60 220,110 200,160 C180,210 230,250 220,280" stroke="var(--bosphorus)" strokeWidth="14" fill="none" opacity="0.4"/>
                <path d="M180,0 C170,60 220,110 200,160 C180,210 230,250 220,280" stroke="var(--bosphorus)" strokeWidth="1" strokeDasharray="3 4" fill="none"/>
              </svg>
              {/* europe label */}
              <div className="in-mono" style={{position:'absolute', top:18, left:18, color:'var(--paper-faint)', fontSize:9.5}}>EUROPE ←</div>
              <div className="in-mono" style={{position:'absolute', top:18, right:18, color:'var(--paper-faint)', fontSize:9.5}}>→ ASIA</div>
              {/* dots */}
              {[
                ['Beşiktaş', 60, 70, 'var(--bosphorus-dim)'],
                ['Cihangir', 90, 130, 'var(--bosphorus)'],
                ['Karaköy',  130, 160, 'var(--ferry-yellow)'],
                ['Galata',   100, 175, 'var(--terracotta-dim)'],
                ['Balat',    40, 230, 'var(--moss)'],
                ['Üsküdar',  290, 90, 'var(--paper-mute)'],
                ['Kadıköy',  300, 200, 'var(--terracotta)'],
                ['Moda',     320, 240, 'var(--bosphorus)'],
              ].map(([n,x,y,c]) => (
                <div key={n} style={{position:'absolute', left:x, top:y, display:'flex', alignItems:'center', gap:6}}>
                  <span style={{width:8, height:8, background:c, borderRadius:'50%', boxShadow:'0 0 0 3px var(--ink-2)'}}/>
                  <span className="in-mono" style={{fontSize:9.5, color:'var(--paper)'}}>{n}</span>
                </div>
              ))}
            </div>
            <div style={{display:'flex', justifyContent:'space-between', marginTop:14}}>
              <span className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>↳ tap a node to filter the list</span>
              <span className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>view full map →</span>
            </div>
          </div>
        </div>

        {/* filter row */}
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'24px 0', marginTop:72, borderTop:'1px solid var(--ink-4)', borderBottom:'1px solid var(--ink-4)'}}>
          <div style={{display:'flex', gap:10, alignItems:'center'}}>
            <span className="in-mono" style={{color:'var(--paper-mute)', marginRight:8}}>Filter</span>
            {['All', 'Asia side', 'European side', 'Long-stay rent', 'Walkable', 'Quiet', 'Loud'].map((f, i) => (
              <button key={f} style={{
                padding:'7px 14px', borderRadius:999,
                border:'1px solid ' + (i===0 ? 'var(--paper)' : 'var(--ink-4)'),
                fontSize:12.5, color: i===0 ? 'var(--paper)' : 'var(--paper-mute)',
                background: i===0 ? 'rgba(244,234,215,0.08)' : 'transparent',
              }}>{f}</button>
            ))}
          </div>
          <div style={{display:'flex', alignItems:'center', gap:18}}>
            <span className="in-mono" style={{color:'var(--paper-mute)'}}>Sort</span>
            <span className="in-mono" style={{color:'var(--paper)'}}>By relevance · 10 of 10</span>
          </div>
        </div>
      </section>

      {/* big editorial list */}
      <section style={{padding:'48px 56px 0'}}>
        {hoods.map((h, idx) => (
          <a key={h.num} style={{
            display:'grid',
            gridTemplateColumns:'auto 1.4fr 2fr 1fr',
            gap:48,
            padding:'40px 0',
            borderBottom:'1px solid var(--ink-3)',
            alignItems:'center',
          }}>
            <div className="in-num" style={{fontSize:48, color:'var(--paper-faint)', fontFamily:'var(--mono)', minWidth:64}}>
              {h.num}
            </div>
            <div style={{position:'relative'}}>
              <PhotoSlot kind={h.photo} corner={h.name} label={`${h.name} - ${h.side} side`} style={{height:200, borderRadius:2}}/>
            </div>
            <div>
              <div style={{display:'flex', alignItems:'baseline', gap:14, marginBottom:8}}>
                <h3 style={{fontSize:48, letterSpacing:'-0.025em', lineHeight:1}}>{h.name}</h3>
                <span style={{width:6, height:6, borderRadius:'50%', background:h.accent}}/>
                <span className="in-mono" style={{color:'var(--paper-mute)'}}>{h.side} side · {h.vibe}</span>
              </div>
              <p style={{fontSize:15, color:'var(--paper-dim)', marginTop:10, lineHeight:1.55, maxWidth:540}}>{h.blurb}</p>
              <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-faint)', marginTop:18}}>
                {h.here} members here · Read time 8 min · Last updated 09 May
              </div>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4px 16px'}}>
              {[
                ['1BR range', h.rent],
                ['Wi-Fi score', h.wifi],
                ['Walkable', h.walk],
                ['Members', h.here],
              ].map(([k,v]) => (
                <div key={k} style={{borderTop:'1px solid var(--ink-3)', padding:'10px 0'}}>
                  <div className="in-mono" style={{fontSize:9.5, color:'var(--paper-faint)', marginBottom:4}}>{k}</div>
                  <div className="in-num" style={{fontSize: k==='1BR range' ? 14 : 18, color:'var(--paper)'}}>{v}</div>
                </div>
              ))}
              <div style={{gridColumn:'1 / -1', marginTop:14}}>
                <span style={{fontSize:13, color:'var(--terracotta)', borderBottom:'1px solid var(--terracotta)', paddingBottom:2}}>Open {h.name} →</span>
              </div>
            </div>
          </a>
        ))}
      </section>

      {/* compare strip */}
      <section style={{padding:'120px 56px 0'}}>
        <SectionEyebrow num="N° 09" label="Compare" kicker="pick three"/>
        <h2 style={{fontSize:56, letterSpacing:'-0.03em', marginTop:24, lineHeight:1.02}}>
          Or stack them <span style={{fontStyle:'italic', color:'var(--terracotta)'}}>side by side.</span>
        </h2>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:18, marginTop:40}}>
          {['Kadıköy', 'Cihangir', 'Beşiktaş'].map((n, i) => (
            <div key={n} style={{border:'1px solid var(--ink-3)', padding:24, background:'var(--ink-2)'}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:18}}>
                <h4 style={{fontSize:22, letterSpacing:'-0.015em'}}>{n}</h4>
                <span className="in-mono" style={{color:'var(--paper-faint)'}}>0{i+1}/03</span>
              </div>
              {[
                ['Median 1BR', ['₺28,000','₺34,000','₺26,000'][i], '/ month'],
                ['Best café score', ['9.2','8.6','7.9'][i], '/ 10'],
                ['Loud at night', ['Yes','No','Yes'][i], ''],
                ['Ferry stop', ['Yes','No','Yes'][i], ''],
                ['Walkable score', ['94','91','82'][i], ''],
              ].map(([k, v, u]) => (
                <div key={k} style={{display:'flex', justifyContent:'space-between', padding:'12px 0', borderTop:'1px solid var(--ink-3)'}}>
                  <span style={{fontSize:13, color:'var(--paper-mute)'}}>{k}</span>
                  <span style={{display:'flex', alignItems:'baseline', gap:6}}>
                    <span className="in-num" style={{fontSize:15, color:'var(--paper)'}}>{v}</span>
                    {u && <span className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>{u}</span>}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{textAlign:'center', marginTop:32}}>
          <button style={{padding:'14px 24px', border:'1px solid var(--ink-4)', borderRadius:2, fontSize:13, color:'var(--paper)'}}>
            + Add a fourth to compare
          </button>
        </div>
      </section>

      <Footer/>
    </div>
  );
};

window.NeighborhoodsPage = NeighborhoodsPage;
