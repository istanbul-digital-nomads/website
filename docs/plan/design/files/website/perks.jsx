/* Perks vault - filterable partner offers, real photos, partner stories */

const PerksPage = () => {
  const perks = [
    { brand:'Walter\u2019s Coffee Roastery', kind:'Coffee', offer:'Free filter, daily', cap:'Once / day for Nomad+', city:'Kadıköy', expires:'rolling', value:'₺85 / visit', photo:'interior', accent:'var(--terracotta)', n:412, claimed:38, story:'Walter\u2019s has hosted the IN co-work day since 2024. They reserve four window seats for members weekdays before noon.' },
    { brand:'Kolektif House',                kind:'Co-work', offer:'30% off all locations', cap:'Yearly billing only', city:'Moda · Şişli · Levent', expires:'30 Jun 2026', value:'≈ ₺2,000 / mo', photo:'interior', accent:'var(--bosphorus)', n:284, claimed:62, story:'The largest co-working network on both sides of the city. Day passes, monthly desks, a phone booth on every floor.' },
    { brand:'Çemberlitaş Hammam',            kind:'Hammam', offer:'50% off self-service', cap:'2 visits / member', city:'Sultanahmet', expires:'31 Jul 2026', value:'₺900 / visit', photo:'mono', accent:'var(--ferry-yellow)', n:188, claimed:71, story:'The historic Mimar Sinan-designed hammam, two minutes from the Grand Bazaar. Members get the locals\u2019 entrance.' },
    { brand:'Trip.com',                      kind:'Travel', offer:'18% off Türkiye hotels', cap:'Up to ₺2,000 / booking', city:'Worldwide via TR', expires:'rolling', value:'≈ ₺1,500 / trip', photo:'bosphorus', accent:'var(--moss)', n:644, claimed:127, story:'Sponsored partner. Members pricing on hotels in İstanbul, Cappadocia, Antalya, İzmir. One tasteful slot, never multiple.' },
    { brand:'Türkçe Başla',                  kind:'Language', offer:'Free first 1-on-1', cap:'New students only', city:'Online · or Kadıköy', expires:'rolling', value:'₺400 / hr', photo:'street', accent:'var(--terracotta-dim)', n:74, claimed:23, story:'Boutique school run by Onur (member), focused on functional Turkish for stay-a-while remote workers.' },
    { brand:'Vodafone Turkey',               kind:'SIM', offer:'25% off 30-day tourist SIM', cap:'1 / passport', city:'All TR', expires:'rolling', value:'₺500 / mo', photo:'street', accent:'var(--bosphorus-dim)', n:512, claimed:204, story:'30 GB + unlimited TR calls on the tourist line. Members get the in-store activation queue skipped.' },
    { brand:'Acıbadem Healthcare',           kind:'Health', offer:'Free first GP consult', cap:'English-speaking only', city:'Kadıköy · Maslak', expires:'31 Dec 2026', value:'₺800 / visit', photo:'mono', accent:'var(--bosphorus)', n:96, claimed:18, story:'A private hospital network. Members get a coordinator (English / Arabic / Russian) who books your first three appointments.' },
    { brand:'Çiya Sofrası',                  kind:'Food', offer:'15% off the lokanta', cap:'Tue / Wed only', city:'Kadıköy · Güneşli Bahçe', expires:'rolling', value:'₺240 / meal', photo:'interior', accent:'var(--terracotta)', n:301, claimed:88, story:'Musa Dağdeviren\u2019s Anatolian canon, around the corner from the IN office. The lokanta floor only, the kebap room next door is full price.' },
    { brand:'Federal Coffee Galata',         kind:'Coffee', offer:'2 for 1 filter, weekdays', cap:'Before noon',  city:'Karaköy · Galata', expires:'30 Sep 2026', value:'₺85 / visit', photo:'dusk', accent:'var(--terracotta)', n:218, claimed:46, story:'The cross-river morning meeting spot for IN ferry commuters. Members get the window seats.' },
    { brand:'Kaktüs Yelken',                 kind:'Sailing', offer:'₺400 off any half-day', cap:'Stackable with circle events', city:'Bostancı marina', expires:'31 Oct 2026', value:'₺2,400 / trip', photo:'bosphorus', accent:'var(--bosphorus)', n:42, claimed:14, story:'The captain who runs our Sailing circle charters. Members can book the same boat any day there\u2019s no group trip.' },
    { brand:'Mephisto Kitabevi',             kind:'Books', offer:'10% off + a stamp', cap:'On English / FR / DE titles', city:'Kadıköy · Bahariye', expires:'rolling', value:'₺120 / book', photo:'street', accent:'var(--terracotta-dim)', n:88, claimed:31, story:'The Kadıköy bookshop. The "stamp" is a hand-pressed IN crest on the colophon page, design by Aram P.' },
    { brand:'Cappadocia Cave Suites',        kind:'Travel', offer:'2 nights, pay for 1', cap:'Sun–Thu, low season', city:'Göreme', expires:'31 Mar 2027', value:'₺3,800 / night', photo:'dusk', accent:'var(--ferry-yellow)', n:34, claimed:8, story:'Family-run cave property, 3 km from Göreme square. Members get the suite with the south-facing window.' },
  ];

  const cats = ['All', 'Coffee', 'Co-work', 'Food', 'Travel', 'Hammam', 'Health', 'Language', 'SIM', 'Sailing', 'Books'];

  return (
    <div className="in-artboard tod-dusk" style={{width:1440, minHeight:4400}}>
      <AmbientBar tod="dusk"/>
      <NavBar active="Perks"/>

      {/* header */}
      <section style={{padding:'56px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:64, alignItems:'end'}}>
          <div>
            <div style={{display:'grid', gridTemplateColumns:'auto 1fr', gap:24, alignItems:'center'}}>
              <span className="in-mono" style={{color:'var(--terracotta)'}}>N° 07 · PERKS VAULT</span>
              <span className="in-thinrule"/>
            </div>
            <h1 style={{fontSize:120, lineHeight:0.92, letterSpacing:'-0.04em', marginTop:32, fontWeight:300}}>
              Forty-one perks,<br/>
              <span style={{fontStyle:'italic', color:'var(--terracotta)'}}>none of them ads.</span>
            </h1>
          </div>
          <div style={{paddingBottom:28}}>
            <p style={{fontSize:17, color:'var(--paper-dim)', lineHeight:1.6, maxWidth:480}}>
              Partners we use ourselves. Cafés, hammams, co-work, hotels, the dentist. We negotiated the discount; you claim it from this page. No affiliate funnel, no email handoff.
            </p>
            <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:0, marginTop:32, border:'1px solid var(--ink-3)'}}>
              {[
                ['41', 'active perks'],
                ['12', 'cities + online'],
                ['₺18,400', 'avg member saves / yr'],
                ['0', 'sponsored slots disguised'],
              ].map(([n, l], i) => (
                <div key={l} style={{padding:'14px 16px', borderRight: i<3 ? '1px solid var(--ink-3)' : 'none'}}>
                  <div className="in-num" style={{fontSize:20, color:'var(--paper)'}}>{n}</div>
                  <div className="in-mono" style={{fontSize:9.5, color:'var(--paper-mute)', marginTop:4}}>{l.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* filters + search */}
        <div style={{padding:'24px 0', marginTop:56, borderTop:'1px solid var(--ink-4)', borderBottom:'1px solid var(--ink-4)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
            <span className="in-mono" style={{color:'var(--paper-mute)', marginRight:8}}>FILTER</span>
            {cats.map((c, i) => (
              <button key={c} style={{
                padding:'7px 14px', borderRadius:999,
                border:'1px solid ' + (i===0 ? 'var(--paper)' : 'var(--ink-4)'),
                fontSize:12.5, color: i===0 ? 'var(--paper)' : 'var(--paper-mute)',
                background: i===0 ? 'rgba(244,234,215,0.08)' : 'transparent',
              }}>{c}</button>
            ))}
          </div>
          <div style={{display:'flex', alignItems:'center', gap:16}}>
            <input placeholder="Search 41 perks…" style={{
              background:'transparent', border:'1px solid var(--ink-4)', borderRadius:2,
              padding:'8px 12px', fontSize:12.5, color:'var(--paper)', width:240, fontFamily:'var(--mono)',
            }}/>
            <span className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>SORT · MOST CLAIMED</span>
          </div>
        </div>
      </section>

      {/* FEATURED - first one as full editorial */}
      <section style={{padding:'48px 56px 0'}}>
        <div className="in-mono" style={{color:'var(--paper-faint)', fontSize:10.5, marginBottom:14}}>FEATURED · NEW THIS WEEK</div>
        <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:32, border:'1px solid var(--ink-3)'}}>
          <PhotoSlot kind="interior" corner="01 · NEW" label={`${perks[0].brand} · ${perks[0].city}`} style={{height:420, borderRadius:0, border:'none'}}/>
          <div style={{padding:'40px 36px', display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
            <div>
              <div className="in-mono" style={{color:perks[0].accent, fontSize:10.5}}>COFFEE · KADIKÖY</div>
              <h2 style={{fontSize:42, letterSpacing:'-0.025em', marginTop:14, lineHeight:1.0}}>{perks[0].brand}</h2>
              <div style={{fontFamily:'var(--serif)', fontStyle:'italic', fontSize:24, color:'var(--terracotta)', marginTop:14, lineHeight:1.2}}>
                "Free filter, daily."
              </div>
              <p style={{fontSize:14.5, color:'var(--paper-dim)', marginTop:16, lineHeight:1.6}}>{perks[0].story}</p>
            </div>
            <div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:0, border:'1px solid var(--ink-3)', marginTop:32}}>
                {[
                  ['Value','₺85','/ visit'],
                  ['Claimed','38','this month'],
                  ['Cap','1','/ day'],
                ].map(([k,v,sub], i) => (
                  <div key={k} style={{padding:'14px 16px', borderRight: i<2 ? '1px solid var(--ink-3)' : 'none'}}>
                    <div className="in-mono" style={{fontSize:9.5, color:'var(--paper-faint)'}}>{k.toUpperCase()}</div>
                    <div style={{display:'flex', alignItems:'baseline', gap:6, marginTop:6}}>
                      <span className="in-num" style={{fontSize:18, color:'var(--paper)'}}>{v}</span>
                      <span className="in-mono" style={{fontSize:9.5, color:'var(--paper-faint)'}}>{sub}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{display:'flex', gap:10, marginTop:24}}>
                <button style={{padding:'14px 22px', background:'var(--terracotta)', color:'var(--ink-0)', borderRadius:2, fontSize:13, fontWeight:500}}>Claim · show member code →</button>
                <button style={{padding:'14px 22px', border:'1px solid var(--ink-4)', color:'var(--paper)', borderRadius:2, fontSize:13}}>Save</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* grid */}
      <section style={{padding:'80px 56px 0'}}>
        <div className="in-mono" style={{color:'var(--paper-faint)', fontSize:10.5, marginBottom:18}}>FORTY MORE · SORTED BY MOST CLAIMED</div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:18}}>
          {perks.slice(1).map((p, i) => (
            <a key={p.brand} style={{border:'1px solid var(--ink-3)', background:'var(--ink-2)', display:'flex', flexDirection:'column'}}>
              <PhotoSlot kind={p.photo} corner={p.kind.toUpperCase()} label={p.brand} style={{height:160, borderRadius:0, border:'none', borderBottom:'1px solid var(--ink-3)'}}/>
              <div style={{padding:'18px 20px 20px', display:'flex', flexDirection:'column', flex:1}}>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                  <span className="in-mono" style={{fontSize:9.5, color:p.accent}}>{p.kind.toUpperCase()}</span>
                  <span className="in-mono" style={{fontSize:9.5, color:'var(--paper-faint)'}}>{p.city}</span>
                </div>
                <h3 style={{fontSize:19, letterSpacing:'-0.015em', marginTop:12, lineHeight:1.1}}>{p.brand}</h3>
                <div style={{fontFamily:'var(--serif)', fontStyle:'italic', fontSize:16, color:p.accent, marginTop:8, lineHeight:1.2}}>{p.offer}</div>
                <p style={{fontSize:12.5, color:'var(--paper-dim)', marginTop:10, lineHeight:1.5, flex:1}}>{p.story}</p>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginTop:16, paddingTop:14, borderTop:'1px solid var(--ink-3)'}}>
                  <div className="in-mono" style={{fontSize:9.5, color:'var(--paper-faint)', lineHeight:1.5}}>
                    {p.cap.toUpperCase()}<br/>
                    EXPIRES {p.expires.toUpperCase()}
                  </div>
                  <span className="in-num" style={{fontSize:14, color:'var(--paper)'}}>{p.value}</span>
                </div>
                <button style={{marginTop:14, padding:'10px 14px', background:'transparent', color:p.accent, border:`1px solid ${p.accent}`, borderRadius:2, fontSize:12, alignSelf:'flex-start'}}>Claim →</button>
              </div>
            </a>
          ))}
        </div>

        <div style={{display:'flex', justifyContent:'center', marginTop:48}}>
          <button style={{padding:'14px 24px', border:'1px solid var(--ink-4)', borderRadius:2, fontSize:13, color:'var(--paper)'}}>
            Show 30 more →
          </button>
        </div>
      </section>

      {/* propose a perk */}
      <section style={{padding:'120px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, padding:'72px 0', borderTop:'1px solid var(--ink-3)', borderBottom:'1px solid var(--ink-3)'}}>
          <div>
            <span className="in-mono" style={{color:'var(--terracotta)'}}>N° 10 · OPEN A PERK</span>
            <h2 style={{fontSize:56, letterSpacing:'-0.03em', marginTop:24, lineHeight:1.02}}>
              Are you a business in Istanbul?<br/>
              <span style={{fontStyle:'italic', color:'var(--terracotta)'}}>List a perk here.</span>
            </h2>
          </div>
          <div>
            <p style={{fontSize:15, color:'var(--paper-dim)', lineHeight:1.6, maxWidth:520}}>
              We list partners we\u2019d send a friend to. No payment to be listed - instead, a real discount or freebie for members. Each perk gets a real photo, a story, and tracked claims. We can pull a perk in a week if it stops being good.
            </p>
            <div style={{display:'flex', gap:10, marginTop:24}}>
              <button style={{padding:'14px 22px', background:'var(--terracotta)', color:'var(--ink-0)', borderRadius:2, fontSize:13, fontWeight:500}}>Propose a perk →</button>
              <button style={{padding:'14px 22px', border:'1px solid var(--ink-4)', color:'var(--paper)', borderRadius:2, fontSize:13}}>Read our terms</button>
            </div>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
};

window.PerksPage = PerksPage;
