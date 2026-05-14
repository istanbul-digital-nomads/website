/* Member directory + Member profile */

const members = [
  { name:'Maya K.',  role:'Writer · ex-Wired',           hood:'Kadıköy',    since:'Aug 2025', mo:'9mo',  langs:['EN','TR','FR'], from:'London',     open:true,  tags:['Field Notes','Hosts dinners','Long-form'],        avatar:'var(--terracotta)' },
  { name:'Deniz A.', role:'Founder · climate SaaS',      hood:'Beşiktaş',   since:'May 2024', mo:'2y',   langs:['TR','EN'],      from:'İzmir',      open:true,  tags:['Office hours','Hiring','Climate'],                 avatar:'var(--bosphorus)' },
  { name:'Lina M.',  role:'Designer · independent',      hood:'Kadıköy',    since:'Feb 2026', mo:'3mo',  langs:['DE','EN','TR'], from:'Berlin',     open:true,  tags:['Brand','Type','Available Jun'],                    avatar:'var(--moss)' },
  { name:'Onur T.',  role:'Engineer · Stripe',           hood:'Üsküdar',    since:'May 2025', mo:'1y',   langs:['TR','EN'],      from:'Ankara',     open:false, tags:['Türkçe başla host','Cycling','Pasta'],             avatar:'var(--ferry-yellow)' },
  { name:'Rin H.',   role:'Researcher · DeepMind',       hood:'Kadıköy',    since:'Dec 2025', mo:'5mo',  langs:['JP','EN'],      from:'Tokyo',      open:true,  tags:['ML','Quiet ferries','Reads at lunch'],             avatar:'var(--terracotta-dim)' },
  { name:'Mira V.',  role:'Producer · documentary',      hood:'Karaköy',    since:'Jan 2026', mo:'4mo',  langs:['BG','EN'],      from:'Sofia',     open:true,  tags:['Film','Bosphorus walks','Sourcing fixers'],        avatar:'var(--bosphorus-dim)' },
  { name:'Eli S.',   role:'PM · Notion',                 hood:'Cihangir',   since:'Apr 2026', mo:'1mo',  langs:['EN'],           from:'NYC',        open:true,  tags:['New here','PM coffee','Looking for a flat'],       avatar:'var(--moss)' },
  { name:'Cem K.',   role:'Director · ad agency',        hood:'Kadıköy',    since:'Nov 2025', mo:'6mo',  langs:['TR','EN','DE'], from:'Istanbul',  open:false, tags:['Native','Office hours','Local producers'],         avatar:'var(--terracotta)' },
  { name:'Aram P.',  role:'Ill. · Sunday Times',         hood:'Balat',      since:'Oct 2025', mo:'7mo',  langs:['EN','TR'],      from:'Yerevan',   open:true,  tags:['Drawing club host','Risograph','Daily walks'],     avatar:'var(--ferry-yellow)' },
  { name:'Yuki F.',  role:'Engineer · indie game',       hood:'Moda',       since:'Jul 2025', mo:'10mo', langs:['JP','EN','TR'], from:'Osaka',     open:true,  tags:['Gamedev','Long stays','Tea over coffee'],          avatar:'var(--bosphorus)' },
  { name:'Sara T.',  role:'Therapist · in private',      hood:'Cihangir',   since:'Mar 2025', mo:'1y 2mo', langs:['EN','TR'],    from:'Boston',    open:false, tags:['Mental health','Booked','Long-stay'],              avatar:'var(--moss)' },
  { name:'Karim B.', role:'Founder · marketplace',       hood:'Beşiktaş',   since:'Sep 2025', mo:'8mo',  langs:['AR','EN','TR'], from:'Cairo',     open:true,  tags:['Arabic-speaking','Hiring','Fintech'],              avatar:'var(--terracotta-dim)' },
];

const MembersPage = () => {
  return (
    <div className="in-artboard tod-dusk" style={{width:1440, minHeight:3400}}>
      <AmbientBar tod="dusk"/>
      <NavBar active="Members"/>

      {/* header */}
      <section style={{padding:'56px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:64, alignItems:'end'}}>
          <div>
            <SectionEyebrow num="N° 06" label="Members · public directory"/>
            <h1 style={{fontSize:120, lineHeight:0.92, letterSpacing:'-0.04em', marginTop:32, fontWeight:300}}>
              People here,<br/>
              <span style={{fontStyle:'italic', color:'var(--terracotta)'}}>introducing themselves.</span>
            </h1>
          </div>
          <div style={{paddingBottom:28}}>
            <p style={{fontSize:17, color:'var(--paper-dim)', lineHeight:1.6, maxWidth:480}}>
              An opt-in member directory. Public profiles only. Reach out via Telegram - we don\u2019t do DMs through the site. The other 1,704 members chose to stay private; that\u2019s fine too.
            </p>
            <div style={{display:'flex', gap:18, marginTop:32, flexWrap:'wrap'}}>
              <div style={{padding:'14px 18px', border:'1px solid var(--ink-3)', background:'var(--ink-2)'}}>
                <div className="in-num" style={{fontSize:28, color:'var(--paper)'}}>143</div>
                <div className="in-mono" style={{fontSize:10, color:'var(--paper-mute)', marginTop:4}}>Public profiles</div>
              </div>
              <div style={{padding:'14px 18px', border:'1px solid var(--ink-3)', background:'var(--ink-2)'}}>
                <div className="in-num" style={{fontSize:28, color:'var(--terracotta)'}}>38</div>
                <div className="in-mono" style={{fontSize:10, color:'var(--paper-mute)', marginTop:4}}>Open to coffee</div>
              </div>
              <div style={{padding:'14px 18px', border:'1px solid var(--ink-3)', background:'var(--ink-2)'}}>
                <div className="in-num" style={{fontSize:28, color:'var(--paper)'}}>8</div>
                <div className="in-mono" style={{fontSize:10, color:'var(--paper-mute)', marginTop:4}}>Neighborhoods</div>
              </div>
              <div style={{padding:'14px 18px', border:'1px solid var(--ink-3)', background:'var(--ink-2)'}}>
                <div className="in-num" style={{fontSize:28, color:'var(--paper)'}}>22</div>
                <div className="in-mono" style={{fontSize:10, color:'var(--paper-mute)', marginTop:4}}>Languages</div>
              </div>
            </div>
          </div>
        </div>

        {/* filter row */}
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'24px 0', marginTop:64, borderTop:'1px solid var(--ink-4)', borderBottom:'1px solid var(--ink-4)'}}>
          <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
            <span className="in-mono" style={{color:'var(--paper-mute)', marginRight:8}}>Filter</span>
            {['All', 'Open to coffee', 'Hiring', 'Designers', 'Engineers', 'Founders', 'Writers', 'Kadıköy', 'Cihangir', 'New (<3mo)'].map((f, i) => (
              <button key={f} style={{
                padding:'7px 14px', borderRadius:999,
                border:'1px solid ' + (i===1 ? 'var(--terracotta)' : 'var(--ink-4)'),
                fontSize:12.5, color: i===1 ? 'var(--terracotta)' : 'var(--paper-mute)',
                background: i===1 ? 'rgba(196,99,58,0.08)' : 'transparent',
              }}>{f}</button>
            ))}
          </div>
          <div style={{display:'flex', alignItems:'center', gap:14}}>
            <input placeholder="Find by name, language, what they do…" style={{
              background:'transparent', border:'1px solid var(--ink-4)', borderRadius:2,
              padding:'8px 12px', fontSize:12.5, color:'var(--paper)', width:300, fontFamily:'var(--mono)',
            }}/>
            <span className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>⌘K</span>
          </div>
        </div>
      </section>

      {/* grid */}
      <section style={{padding:'40px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:18}}>
          {members.map((m, i) => (
            <a key={i} style={{border:'1px solid var(--ink-3)', background:'var(--ink-2)', padding:20, position:'relative'}}>
              {m.open && (
                <span style={{position:'absolute', top:14, right:14, display:'flex', alignItems:'center', gap:6}}>
                  <span style={{width:6, height:6, borderRadius:'50%', background:'#7ab880', boxShadow:'0 0 8px #7ab880'}}/>
                  <span className="in-mono" style={{fontSize:9.5, color:'#7ab880'}}>open</span>
                </span>
              )}
              {/* avatar */}
              <div style={{
                width:64, height:64, borderRadius:'50%',
                background:`linear-gradient(135deg, ${m.avatar}, var(--ink-3))`,
                marginBottom:18,
                display:'grid', placeItems:'center',
              }}>
                <div className="in-mono" style={{fontSize:10, color:'rgba(11,14,17,0.6)'}}>↳ photo</div>
              </div>
              <div style={{fontSize:21, fontFamily:'var(--serif)', letterSpacing:'-0.015em', lineHeight:1.1}}>{m.name}</div>
              <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-mute)', marginTop:6}}>{m.role}</div>

              <div style={{display:'flex', justifyContent:'space-between', marginTop:18, paddingTop:14, borderTop:'1px solid var(--ink-3)'}}>
                <span className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>{m.hood}</span>
                <span className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>{m.mo} here</span>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', marginTop:8}}>
                <span className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>From {m.from}</span>
                <span className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>{m.langs.join(' · ')}</span>
              </div>
              <div style={{display:'flex', gap:6, flexWrap:'wrap', marginTop:16}}>
                {m.tags.slice(0,2).map(t => (
                  <span key={t} className="in-mono" style={{fontSize:9.5, color:'var(--paper-mute)', padding:'4px 8px', border:'1px solid var(--ink-4)', borderRadius:999}}>{t}</span>
                ))}
                {m.tags.length > 2 && <span className="in-mono" style={{fontSize:9.5, color:'var(--paper-faint)', padding:'4px 0'}}>+ {m.tags.length-2}</span>}
              </div>
            </a>
          ))}
        </div>

        <div style={{textAlign:'center', marginTop:48}}>
          <button style={{padding:'14px 24px', border:'1px solid var(--ink-4)', borderRadius:2, fontSize:13, color:'var(--paper)'}}>
            Show 131 more →
          </button>
        </div>
      </section>

      {/* CTA - join the directory */}
      <section style={{padding:'120px 56px 0'}}>
        <div style={{borderTop:'1px solid var(--ink-3)', borderBottom:'1px solid var(--ink-3)', padding:'72px 0', display:'grid', gridTemplateColumns:'1fr 1fr', gap:48}}>
          <div>
            <SectionEyebrow num="↳" label="Member · you"/>
            <h2 style={{fontSize:56, letterSpacing:'-0.03em', marginTop:24, lineHeight:1.02}}>
              Add yourself.<br/>
              <span style={{fontStyle:'italic', color:'var(--terracotta)'}}>Or don\u2019t.</span>
            </h2>
          </div>
          <div>
            <p style={{fontSize:16, color:'var(--paper-dim)', lineHeight:1.6, maxWidth:540}}>
              Public profiles are opt-in. We don\u2019t harvest your data, sell ads, or rank you. You write your own description, pick three tags, and decide whether you\u2019re "open to coffee." Edit or delete it any time.
            </p>
            <div style={{display:'flex', gap:10, marginTop:24}}>
              <button style={{padding:'14px 22px', background:'var(--terracotta)', color:'var(--ink-0)', borderRadius:2, fontSize:13, fontWeight:500}}>Create my profile →</button>
              <button style={{padding:'14px 22px', border:'1px solid var(--ink-4)', color:'var(--paper)', borderRadius:2, fontSize:13}}>What\u2019s public, what isn\u2019t</button>
            </div>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
};

const ProfilePage = () => {
  return (
    <div className="in-artboard tod-dusk" style={{width:1440, minHeight:2800}}>
      <AmbientBar tod="dusk"/>
      <NavBar active="Members"/>

      <section style={{padding:'40px 56px 0'}}>
        <div className="in-mono" style={{color:'var(--paper-mute)', fontSize:11, display:'flex', justifyContent:'space-between'}}>
          <span>Members / <span style={{color:'var(--paper)'}}>Maya K.</span></span>
          <span style={{color:'var(--paper-faint)'}}>Public profile · 04 of 143 · maya-k</span>
        </div>

        {/* hero - split */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:48, marginTop:48}}>
          <div style={{position:'relative'}}>
            <div style={{
              aspectRatio:'4/5',
              background:'linear-gradient(135deg, var(--terracotta), var(--terracotta-deep) 60%, var(--ink-2))',
              border:'1px solid var(--ink-3)',
              position:'relative', overflow:'hidden',
            }}>
              <div style={{position:'absolute', top:14, left:14}} className="in-mono"><span style={{fontSize:10, color:'rgba(11,14,17,0.7)'}}>↳ portrait · 4:5</span></div>
              <div style={{position:'absolute', bottom:14, left:14, right:14, display:'flex', justifyContent:'space-between'}}>
                <span className="in-mono" style={{fontSize:10, color:'rgba(11,14,17,0.7)'}}>Shot by Aram P.</span>
                <span className="in-mono" style={{fontSize:10, color:'rgba(11,14,17,0.7)'}}>Apr 2026</span>
              </div>
            </div>

            {/* small status block */}
            <div style={{marginTop:24, border:'1px solid var(--ink-3)', padding:'18px 22px'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div style={{display:'flex', alignItems:'center', gap:10}}>
                  <span style={{width:8, height:8, borderRadius:'50%', background:'#7ab880', boxShadow:'0 0 8px #7ab880'}}/>
                  <span style={{fontSize:14, color:'var(--paper)'}}>Open to coffee</span>
                </div>
                <span className="in-mono" style={{fontSize:10, color:'var(--paper-mute)'}}>Reply ~2h</span>
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:10, marginTop:18}}>
                <button style={{padding:'13px 16px', background:'var(--terracotta)', color:'var(--ink-0)', borderRadius:2, fontSize:13, fontWeight:500, textAlign:'left'}}>
                  ↗ Reach out · Telegram @maya-k
                </button>
                <button style={{padding:'13px 16px', border:'1px solid var(--ink-4)', color:'var(--paper)', borderRadius:2, fontSize:13, textAlign:'left'}}>
                  ↳ Read her four field notes
                </button>
              </div>
            </div>
          </div>

          <div>
            <SectionEyebrow num="01" label="Profile"/>
            <h1 style={{fontSize:96, lineHeight:0.94, letterSpacing:'-0.04em', marginTop:18, fontWeight:300}}>
              Maya<br/><span style={{fontStyle:'italic', color:'var(--terracotta)'}}>Karadağ</span>
            </h1>
            <div className="in-mono" style={{color:'var(--paper-mute)', fontSize:12, marginTop:18, display:'flex', gap:14, flexWrap:'wrap'}}>
              <span>Writer</span>
              <span style={{color:'var(--paper-faint)'}}>·</span>
              <span>Ex-Wired · Ex-Wired UK</span>
              <span style={{color:'var(--paper-faint)'}}>·</span>
              <span>9 months in Kadıköy</span>
              <span style={{color:'var(--paper-faint)'}}>·</span>
              <span>From London via Berlin</span>
            </div>

            <p style={{fontSize:22, fontFamily:'var(--serif)', lineHeight:1.4, letterSpacing:'-0.01em', marginTop:36, color:'var(--paper)'}}>
              Long-form features writer, working on a book about how cities decide what they sound like at 03:00. Came for a month, stayed because the ferry kept saving the writing.
            </p>
            <p style={{fontSize:15, color:'var(--paper-dim)', lineHeight:1.65, marginTop:18}}>
              I run the Wednesday dinners and the occasional <em style={{fontFamily:'var(--serif)'}}>Field Notes live reading</em>. Happy to read a draft, walk you to the simit man, or tell you why the Kadıköy library is the best free workspace in the city. Slow to reply on Mondays; fast on the ferry.
            </p>

            {/* tags */}
            <div style={{display:'flex', gap:8, flexWrap:'wrap', marginTop:32}}>
              {['Field Notes', 'Hosts dinners', 'Long-form', 'EN / TR / FR', 'Open to coffee', 'Walks at sunset', 'Reads on the ferry'].map(t => <span key={t} className="in-tag">{t}</span>)}
            </div>

            {/* quick stats */}
            <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:0, marginTop:48, border:'1px solid var(--ink-3)'}}>
              {[
                ['Field notes', '4'],
                ['Events hosted', '11'],
                ['Member since', "Aug '25"],
                ['Languages', '3'],
              ].map(([k,v], i) => (
                <div key={k} style={{padding:'18px 20px', borderRight: i<3 ? '1px solid var(--ink-3)' : 'none'}}>
                  <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', marginBottom:8}}>{k}</div>
                  <div className="in-num" style={{fontSize:26, color:'var(--paper)', letterSpacing:'-0.01em'}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* writing */}
      <section style={{padding:'120px 56px 0'}}>
        <SectionEyebrow num="02" label="Field notes by Maya"/>
        <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr', gap:32, marginTop:32}}>
          {[
            ['On the ferry as a third place', 'Four months of taking the 17:35 to Karaköy with a laptop and no agenda. Why the Bosphorus is a better office than any rooftop in the city.', 'bosphorus', '14 min', '07 May'],
            ['The library and the dentist', 'Two soft-landing pieces of infrastructure that quietly decide whether you stay or leave.', 'mono', '8 min', '22 Apr'],
            ['Tuesday, written down', 'A diary of a market day from 06:00 to 22:00 in Yeldeğirmeni.', 'street', '11 min', '03 Apr'],
          ].map(([title, blurb, ph, time, date], i) => (
            <article key={title} style={{borderTop:'1px solid var(--ink-3)', paddingTop:24}}>
              <PhotoSlot kind={ph} corner={`Note · 0${i+1}`} label={['Ferry crossing','Library / dentist','Tuesday pazar'][i]} style={{height: i===0 ? 320 : 200, borderRadius:2, marginBottom:18}}/>
              <div className="in-mono" style={{color:'var(--paper-faint)', fontSize:10.5, marginBottom:12}}>{date} · {time}</div>
              <h3 style={{fontSize: i===0 ? 28 : 22, letterSpacing:'-0.015em', lineHeight:1.1}}>{title}</h3>
              <p style={{fontSize:14, color:'var(--paper-dim)', marginTop:10, lineHeight:1.55}}>{blurb}</p>
            </article>
          ))}
        </div>
      </section>

      {/* upcoming + endorsements */}
      <section style={{padding:'120px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:64}}>
          <div>
            <SectionEyebrow num="03" label="Hosting next" kicker="2 upcoming"/>
            <div style={{marginTop:32, border:'1px solid var(--ink-3)'}}>
              {[
                ['THU 15', '19:30', 'Wednesday dinner · Çiya', 'Kadıköy', '23/24'],
                ['TUE 27', '20:00', 'Field Notes · live reading', 'Mephisto', '34/40'],
              ].map((r, i) => (
                <div key={i} style={{display:'grid', gridTemplateColumns:'80px 70px 1fr auto auto', gap:18, alignItems:'center', padding:'20px 22px', borderTop: i===0 ? 'none' : '1px solid var(--ink-3)'}}>
                  <div className="in-mono" style={{color:'var(--terracotta)'}}>{r[0]}</div>
                  <div className="in-num" style={{fontSize:16}}>{r[1]}</div>
                  <div style={{fontSize:15, fontFamily:'var(--serif)'}}>{r[2]}</div>
                  <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>{r[3]}</div>
                  <div className="in-num" style={{fontSize:12, color:'var(--paper-mute)'}}>{r[4]}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <SectionEyebrow num="04" label="In other members' words"/>
            <div style={{marginTop:32, display:'flex', flexDirection:'column', gap:16}}>
              {[
                ['Took me to the right hammam on day 3 of my stay. The whole city felt easier after that.', 'Eli S.'],
                ['Her edit notes are surgical. The book will be good because of her.', 'Cem K.'],
                ['Wednesday dinners are the most reliably good evenings of my month.', 'Rin H.'],
              ].map(([q, a], i) => (
                <div key={i} style={{padding:'18px 22px', border:'1px solid var(--ink-3)', background:'var(--ink-2)'}}>
                  <p style={{fontSize:15, fontFamily:'var(--serif)', lineHeight:1.4, letterSpacing:'-0.005em'}}>&ldquo;{q}&rdquo;</p>
                  <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-faint)', marginTop:12}}>- {a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
};

window.MembersPage = MembersPage;
window.ProfilePage = ProfilePage;
