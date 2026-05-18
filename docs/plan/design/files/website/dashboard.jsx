/* Member dashboard - personalized but composed, not a Notion sidebar */

const DashboardPage = () => {
  return (
    <div className="in-artboard tod-dusk" style={{width:1440, minHeight:4200}}>
      <AmbientBar tod="dusk"/>
      <NavBar active="Members"/>

      {/* personal masthead */}
      <section style={{padding:'56px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr auto', gap:48, alignItems:'end'}}>
          <div>
            <div className="in-mono" style={{color:'var(--paper-mute)', fontSize:11, display:'flex', gap:14, alignItems:'baseline'}}>
              <span style={{color:'var(--paper)'}}>YOUR HOME</span>
              <span style={{color:'var(--paper-faint)'}}>· LOGGED IN AS @maya-k</span>
              <span style={{color:'var(--paper-faint)'}}>· NOMAD+ · SINCE AUG 2025</span>
              <span style={{display:'flex', alignItems:'center', gap:6}}>
                <span style={{width:6, height:6, borderRadius:'50%', background:'#7ab880', boxShadow:'0 0 6px #7ab880'}}/>
                <span style={{color:'#7ab880'}}>SYNCED 2 MIN AGO</span>
              </span>
            </div>
            <h1 style={{fontSize:104, lineHeight:0.94, letterSpacing:'-0.04em', marginTop:24, fontWeight:300}}>
              Good evening,<br/>
              <span style={{fontStyle:'italic', color:'var(--terracotta)'}}>Maya.</span>
            </h1>
            <p style={{fontSize:19, color:'var(--paper-dim)', fontFamily:'var(--serif)', marginTop:24, maxWidth:760, lineHeight:1.45}}>
              Three things on your plate this week, two perks waiting in the vault, and the Sunday letter is in the editor - you mentioned wanting to read it early.
            </p>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:12, alignItems:'flex-end', paddingBottom:14}}>
            <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-faint)'}}>9 MO IN KADIKÖY · 38 OF 1,847</div>
            <button style={{padding:'10px 16px', border:'1px solid var(--ink-4)', borderRadius:2, fontSize:12.5, color:'var(--paper)', display:'flex', alignItems:'center', gap:10}}>
              <span className="in-mono" style={{fontSize:10, color:'var(--paper-mute)'}}>⌘K</span>
              <span>Jump to anywhere</span>
            </button>
            <button style={{padding:'10px 16px', border:'1px solid var(--ink-4)', borderRadius:2, fontSize:12.5, color:'var(--paper-mute)'}}>
              Edit my profile →
            </button>
          </div>
        </div>

        {/* meta strip */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:0, marginTop:72, border:'1px solid var(--ink-3)'}}>
          {[
            ['Days here',  '276',  'arrived 09 Aug 2025'],
            ['Events RSVP\u2019d', '11', '8 attended · 3 upcoming'],
            ['Perks claimed', '4', '₺1,840 saved this month'],
            ['Sunday letter', '048', '64% open this week'],
            ['Field Notes',    '4',   '7,200 reads total'],
            ['Members met',    '23',  '+3 this fortnight'],
          ].map(([k, v, sub], i) => (
            <div key={k} style={{padding:'20px 22px', borderRight: i<5 ? '1px solid var(--ink-3)' : 'none'}}>
              <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>{k.toUpperCase()}</div>
              <div className="in-num" style={{fontSize:28, color:'var(--paper)', marginTop:8, letterSpacing:'-0.01em'}}>{v}</div>
              <div className="in-mono" style={{fontSize:9.5, color:'var(--paper-faint)', marginTop:6}}>↳ {sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* main grid */}
      <section style={{padding:'80px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'1.8fr 1fr', gap:32}}>
          {/* LEFT - your week */}
          <div>
            <div style={{display:'grid', gridTemplateColumns:'auto 1fr auto', gap:18, alignItems:'center', marginBottom:24}}>
              <span className="in-mono" style={{color:'var(--terracotta)'}}>N° 01 · YOUR WEEK</span>
              <span className="in-thinrule"/>
              <span className="in-mono" style={{color:'var(--paper-faint)'}}>MON 11 → SUN 17 MAY</span>
            </div>

            {/* week strip */}
            <div style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:1, background:'var(--ink-4)', border:'1px solid var(--ink-4)'}}>
              {[
                ['Mon', '11', 'today', [], true],
                ['Tue', '12', '', [['10:00', 'Walter\u2019s', 'var(--bosphorus)']], false],
                ['Wed', '13', '', [['09:30', 'Ferry → Karaköy', 'var(--bosphorus)'], ['19:30', 'Çiya dinner · host', 'var(--terracotta)']], false],
                ['Thu', '14', '', [['18:00', 'Office hours · ed.', 'var(--moss)']], false],
                ['Fri', '15', '', [['20:00', 'Drinks · Arkaoda', 'var(--ferry-yellow)']], false],
                ['Sat', '16', '', [['07:00', 'Princes\u2019 Islands run', 'var(--moss)']], false],
                ['Sun', '17', '', [['09:00', 'Letter drops', 'var(--terracotta-dim)']], false],
              ].map(([d, date, badge, items, today]) => (
                <div key={d} style={{
                  background: today ? 'rgba(196,99,58,0.06)' : 'var(--ink-1)',
                  padding:'16px 14px 18px',
                  minHeight:200,
                  borderTop: today ? '2px solid var(--terracotta)' : '2px solid transparent',
                }}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                    <span className="in-mono" style={{fontSize:10, color:'var(--paper-mute)'}}>{d.toUpperCase()}</span>
                    <span className="in-num" style={{fontSize:20, color: today ? 'var(--terracotta)' : 'var(--paper)'}}>{date}</span>
                  </div>
                  {badge && <div className="in-mono" style={{fontSize:9.5, color:'var(--terracotta)', marginTop:4}}>TODAY · 18:32</div>}
                  <div className="in-thinrule" style={{margin:'14px 0 10px'}}/>
                  <div style={{display:'flex', flexDirection:'column', gap:8}}>
                    {items.map((it, i) => (
                      <div key={i} style={{borderLeft:`2px solid ${it[2]}`, paddingLeft:8}}>
                        <div className="in-num" style={{fontSize:10, color:'var(--paper-mute)'}}>{it[0]}</div>
                        <div style={{fontSize:11.5, color:'var(--paper)', lineHeight:1.3, marginTop:2}}>{it[1]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* today block */}
            <div style={{marginTop:32, border:'1px solid var(--ink-3)', background:'var(--ink-2)', padding:'28px 32px'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingBottom:18, borderBottom:'1px solid var(--ink-3)'}}>
                <div style={{display:'flex', alignItems:'baseline', gap:14}}>
                  <span className="in-mono" style={{color:'var(--terracotta)', fontSize:10.5}}>TODAY · 11 MAY</span>
                  <span style={{fontFamily:'var(--serif)', fontSize:22, letterSpacing:'-0.01em'}}>A quiet Monday</span>
                </div>
                <span className="in-mono" style={{color:'var(--paper-faint)', fontSize:10.5}}>NEXT EVENT · WED IN 2 DAYS</span>
              </div>

              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:24, marginTop:24}}>
                {[
                  ['↳ Open the Planner', 'Re-plan if your week shifted', 'var(--terracotta)'],
                  ['↳ Reply to 2 DMs in TG', 'Eli S. asked about a flat', 'var(--bosphorus)'],
                  ['↳ Pick up the Walter\u2019s perk', 'Free filter, expires Sat', 'var(--ferry-yellow)'],
                ].map(([h, sub, c]) => (
                  <a key={h} style={{borderLeft:`2px solid ${c}`, paddingLeft:14}}>
                    <div style={{fontSize:14, color:'var(--paper)'}}>{h}</div>
                    <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', marginTop:6}}>{sub}</div>
                  </a>
                ))}
              </div>
            </div>

            {/* recommended guides */}
            <div style={{display:'grid', gridTemplateColumns:'auto 1fr auto', gap:18, alignItems:'center', marginTop:80, marginBottom:24}}>
              <span className="in-mono" style={{color:'var(--terracotta)'}}>N° 02 · RECOMMENDED FOR YOU</span>
              <span className="in-thinrule"/>
              <span className="in-mono" style={{color:'var(--paper-faint)'}}>BASED ON THE LAST 12 GUIDES YOU READ</span>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr', gap:24}}>
              {[
                ['Sunday markets, ranked', 'Five member-tested pazars across Asia + Europe.', 'street', '11 min', 'Long-stay'],
                ['Visa runs without leaving the EU', 'Practical edge cases for the 90/180.', 'mono', '8 min', 'Visa'],
                ['Why your Wi-Fi drops at 19:00', 'A short physics explainer.', 'interior', '4 min', 'Internet'],
              ].map(([t, b, ph, time, section], i) => (
                <a key={t} style={{display:'flex', flexDirection:'column'}}>
                  <PhotoSlot kind={ph} corner={section.toUpperCase()} label={t} style={{height: i===0 ? 220 : 160, borderRadius:0}}/>
                  <h4 style={{fontSize: i===0 ? 22 : 17, letterSpacing:'-0.015em', marginTop:14, lineHeight:1.1}}>{t}</h4>
                  <p style={{fontSize:13, color:'var(--paper-dim)', marginTop:8, lineHeight:1.5}}>{b}</p>
                  <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', marginTop:12}}>{time} · saved 03 May</div>
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT - sidebar */}
          <div>
            {/* perks */}
            <div style={{border:'1px solid var(--ink-3)', background:'var(--ink-2)', marginBottom:24}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', padding:'18px 22px', borderBottom:'1px solid var(--ink-3)'}}>
                <span className="in-mono" style={{color:'var(--terracotta)', fontSize:10.5}}>PERKS · 41 ACTIVE</span>
                <a style={{fontSize:12, color:'var(--paper-mute)'}}>vault →</a>
              </div>
              {[
                ['Walter\u2019s · free filter', 'expires SAT 16 MAY', '01 left', 'var(--terracotta)'],
                ['Kolektif House · 30% co-work', 'expires 30 JUN', 'unlimited', 'var(--bosphorus)'],
                ['Çemberlitaş hammam', '50% off · expires JUL', '02 left', 'var(--ferry-yellow)'],
                ['Trip.com · Cappadocia 18%', 'expires SUN 17 MAY', '01 left', 'var(--moss)'],
              ].map(([title, expiry, left, c], i, arr) => (
                <div key={title} style={{display:'grid', gridTemplateColumns:'auto 1fr auto', gap:14, alignItems:'center', padding:'14px 22px', borderTop: i===0 ? 'none' : '1px solid var(--ink-3)'}}>
                  <span style={{width:8, height:8, borderRadius:'50%', background:c}}/>
                  <div>
                    <div style={{fontSize:13, color:'var(--paper)'}}>{title}</div>
                    <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', marginTop:3}}>{expiry}</div>
                  </div>
                  <span className="in-mono" style={{fontSize:10.5, color:c}}>{left}</span>
                </div>
              ))}
              <div style={{padding:'16px 22px', borderTop:'1px solid var(--ink-3)'}}>
                <a style={{fontSize:13, color:'var(--terracotta)', borderBottom:'1px solid var(--terracotta)', paddingBottom:2}}>Browse all 41 perks →</a>
              </div>
            </div>

            {/* sunday letter status */}
            <div style={{border:'1px solid var(--ink-3)', background:'var(--ink-2)', marginBottom:24}}>
              <div style={{padding:'18px 22px', borderBottom:'1px solid var(--ink-3)'}}>
                <span className="in-mono" style={{color:'var(--terracotta)', fontSize:10.5}}>SUNDAY LETTER · 049</span>
              </div>
              <div style={{padding:'18px 22px'}}>
                <div style={{display:'flex', alignItems:'center', gap:10}}>
                  <span style={{width:6, height:6, borderRadius:'50%', background:'var(--ferry-yellow)', boxShadow:'0 0 8px var(--ferry-yellow)'}}/>
                  <span className="in-mono" style={{fontSize:10, color:'var(--ferry-yellow)'}}>IN THE EDITOR · NOMAD+ EARLY READ</span>
                </div>
                <h3 style={{fontSize:22, fontStyle:'italic', letterSpacing:'-0.015em', marginTop:14, lineHeight:1.15}}>
                  "Where the city goes to lunch."
                </h3>
                <p style={{fontSize:13, color:'var(--paper-dim)', marginTop:10, lineHeight:1.55}}>
                  An issue on lokantas. Three picks, one map, an interview with the man at Çiya.
                </p>
                <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', marginTop:14}}>SHIPS SUN 17 MAY · 09:00 LOCAL</div>
                <a style={{fontSize:13, color:'var(--terracotta)', borderBottom:'1px solid var(--terracotta)', paddingBottom:2, marginTop:14, display:'inline-block'}}>Read draft early →</a>
              </div>
            </div>

            {/* saved itineraries */}
            <div style={{border:'1px solid var(--ink-3)', background:'var(--ink-2)', marginBottom:24}}>
              <div style={{padding:'18px 22px', borderBottom:'1px solid var(--ink-3)', display:'flex', justifyContent:'space-between'}}>
                <span className="in-mono" style={{color:'var(--terracotta)', fontSize:10.5}}>SAVED PLANS · 3</span>
                <a style={{fontSize:12, color:'var(--paper-mute)'}}>new plan →</a>
              </div>
              {[
                ['First week · me', 'v3 · 11–17 May', 'var(--terracotta)'],
                ['Lina visiting · weekend', 'v1 · 24–25 May', 'var(--bosphorus)'],
                ['Mom comes for a week', 'v2 · 12–18 Jun', 'var(--moss)'],
              ].map(([t, sub, c], i) => (
                <div key={t} style={{display:'grid', gridTemplateColumns:'auto 1fr auto', gap:14, alignItems:'center', padding:'14px 22px', borderTop: i===0 ? 'none' : '1px solid var(--ink-3)'}}>
                  <span style={{width:6, height:6, borderRadius:'50%', background:c}}/>
                  <div>
                    <div style={{fontSize:13, color:'var(--paper)'}}>{t}</div>
                    <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', marginTop:3}}>{sub}</div>
                  </div>
                  <a style={{fontSize:12, color:'var(--paper-mute)'}}>open</a>
                </div>
              ))}
            </div>

            {/* circles */}
            <div style={{border:'1px solid var(--ink-3)', background:'var(--ink-2)'}}>
              <div style={{padding:'18px 22px', borderBottom:'1px solid var(--ink-3)'}}>
                <span className="in-mono" style={{color:'var(--terracotta)', fontSize:10.5}}>YOUR CIRCLES · 3 OF 6</span>
              </div>
              {[
                ['Photography', '128 members', '2 unread', 'var(--ferry-yellow)'],
                ['Wine', '71 members', '7 unread', 'var(--terracotta-dim)'],
                ['Founders', '64 members', '0 unread', 'var(--bosphorus-dim)'],
              ].map(([n, m, u, c], i) => (
                <div key={n} style={{display:'grid', gridTemplateColumns:'auto 1fr auto', gap:14, alignItems:'center', padding:'14px 22px', borderTop: i===0 ? 'none' : '1px solid var(--ink-3)'}}>
                  <span style={{width:10, height:10, border:`2px solid ${c}`, borderRadius:'50%'}}/>
                  <div>
                    <div style={{fontSize:13, color:'var(--paper)'}}>{n}</div>
                    <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', marginTop:3}}>{m}</div>
                  </div>
                  <span className="in-mono" style={{fontSize:10, color: u==='0 unread' ? 'var(--paper-faint)' : c}}>{u}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* recent activity ledger */}
      <section style={{padding:'120px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'auto 1fr auto', gap:18, alignItems:'center', marginBottom:32}}>
          <span className="in-mono" style={{color:'var(--terracotta)'}}>N° 03 · ACTIVITY LEDGER</span>
          <span className="in-thinrule"/>
          <span className="in-mono" style={{color:'var(--paper-faint)'}}>LAST 14 DAYS · 18 ROWS · ONLY YOU CAN SEE THIS</span>
        </div>

        <div style={{border:'1px solid var(--ink-3)', fontFamily:'var(--mono)', fontSize:12}}>
          {[
            ['11 MAY 18:32', 'OPENED', 'dashboard',                        '·',                           ''],
            ['11 MAY 16:08', 'EDITED', 'plan / "First week · me"',         'v2 → v3',                     'var(--terracotta)'],
            ['11 MAY 11:14', 'RSVP\u2019D', 'event / Wednesday dinner',       'seat 23 of 24',               'var(--bosphorus)'],
            ['10 MAY 09:00', 'READ',   'sunday letter · issue 048',        '4 min',                       'var(--moss)'],
            ['10 MAY 08:42', 'CLAIMED', 'perk / Walter\u2019s · free filter','expires 16 MAY',              'var(--ferry-yellow)'],
            ['09 MAY 21:18', 'POSTED', 'field notes / "Ferry as a 3rd place"', 'public · 412 reads',       'var(--terracotta-dim)'],
            ['09 MAY 14:50', 'JOINED', 'circle / Photography',             '128 members',                 'var(--ferry-yellow)'],
            ['08 MAY 20:01', 'INTRO\u2019D', 'member / Eli S.',                 'via /m/eli-s contact card',   'var(--bosphorus)'],
            ['07 MAY 09:30', 'EXPORTED', 'plan / "First week" → .ics',     'gcal',                        '·'],
            ['06 MAY 12:14', 'EDITED',  'profile / "open to coffee"',     'true',                        'var(--moss)'],
          ].map(([t, a, target, sub, c], i, arr) => (
            <div key={i} style={{
              display:'grid', gridTemplateColumns:'160px 100px 1fr 220px',
              gap:18, padding:'12px 22px',
              borderTop: i===0 ? 'none' : '1px solid var(--ink-3)',
              alignItems:'center',
            }}>
              <span style={{color:'var(--paper-faint)'}}>{t}</span>
              <span style={{color: c==='·' ? 'var(--paper-mute)' : c}}>{a}</span>
              <span style={{color:'var(--paper)'}}>{target}</span>
              <span style={{color:'var(--paper-faint)', textAlign:'right'}}>{sub}</span>
            </div>
          ))}
        </div>
        <div style={{display:'flex', justifyContent:'space-between', marginTop:16}}>
          <span className="in-mono" style={{fontSize:10.5, color:'var(--paper-faint)'}}>↳ NEVER SHARED · NEVER USED FOR ADS · EXPORT ANY TIME</span>
          <a style={{fontSize:13, color:'var(--paper-mute)', borderBottom:'1px solid var(--ink-4)', paddingBottom:2}}>Full history (276 rows) →</a>
        </div>
      </section>

      <Footer/>
    </div>
  );
};

window.DashboardPage = DashboardPage;
