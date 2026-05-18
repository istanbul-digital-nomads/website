/* First Week Planner - output view */

const PlannerPage = () => {
  const days = [
    { d:'Mon', date:'11', label:'Land softly', items:[
      ['08:30', 'Arrive · SAW airport', '↳ Havaist bus to Kadıköy, ₺140, ~70 min', 'arrive'],
      ['11:00', 'Drop bags · Yeldeğirmeni Airbnb', '↳ host meets at the door, takes ID copy', 'logistics'],
      ['13:00', 'Late lunch · Çiya Sofrası', '↳ lokanta floor. ₺220–260 for three plates', 'food'],
      ['15:30', 'Walk Moda sea wall', '↳ jet lag protocol: sun on the face, no calls', 'walk'],
      ['19:00', 'Soft dinner · simit + cheese + olives', '↳ pazar haul from Migros Jet, eat at home', 'food'],
      ['21:30', 'Sleep early. Set the alarm for 07:30.', '↳ Tuesday is busy', 'rest'],
    ]},
    { d:'Tue', date:'12', label:'Make it real', items:[
      ['08:30', 'Coffee · Walter\u2019s', '↳ window seat. Ask for the Wi-Fi password.', 'work'],
      ['10:00', 'Türk Telekom · Bahariye Cd. 38', '↳ Tourist SIM, ₺550/mo. Bring passport.', 'logistics'],
      ['12:00', 'İş Bankası · open Türk Lirası account', '↳ Need: address proof or hotel letter', 'logistics'],
      ['14:00', 'Salı pazarı · Tuesday market', '↳ Cash, ₺300–400 covers a week of food', 'food'],
      ['17:00', 'Co-work tour · Kolektif House Moda', '↳ Day pass ₺350, member rate ₺6,200/mo', 'work'],
      ['19:30', 'Member dinner · #general meets Çiya', '↳ Table for 8 booked under "Maya"', 'community'],
    ]},
    { d:'Wed', date:'13', label:'Cross the water', items:[
      ['09:30', 'Ferry → Karaköy', '↳ 22 min. Get the upstairs deck.', 'transit'],
      ['10:30', 'Work block · Federal Coffee Galata', '↳ Quiet until noon. Power at the bar.', 'work'],
      ['13:00', 'Lunch · Karaköy Lokantası', '↳ Reserve, even Wednesday', 'food'],
      ['15:00', 'Walk Galata → Beyoğlu', '↳ Up İstiklal. Skip the chains.', 'walk'],
      ['18:30', 'Ferry back · 18:45 departure', '↳ Tea on deck. Watch the sunset.', 'transit'],
    ]},
    { d:'Thu', date:'14', label:'Body day', items:[
      ['10:00', 'Hammam · Çemberlitaş', '↳ Historic, touristed, still good. ₺900', 'wellness'],
      ['13:00', 'Slow lunch · Yeniköy', '↳ Bosphorus side. Take a taxi back.', 'food'],
      ['16:00', 'Optional: doctor check-in', '↳ Acıbadem Kadıköy. Walk-in, English fluent.', 'logistics'],
      ['19:00', 'Quiet dinner · home', '↳ You\u2019ll be wrung out. Save it.', 'rest'],
    ]},
    { d:'Fri', date:'15', label:'Settle in', items:[
      ['09:00', 'Long work block · home', '↳ Hardest call of the week', 'work'],
      ['13:00', 'Lunch · Borsam Taşfırın', '↳ Pide + ayran. ₺180. 8 min walk.', 'food'],
      ['15:00', 'Türkçe başla · 1-on-1 class', '↳ Lingoda or Italki, ₺400/hr', 'learn'],
      ['20:00', 'Drinks · Arkaoda', '↳ Members usually around. Records.', 'community'],
    ]},
    { d:'Sat', date:'16', label:'Find your block', items:[
      ['10:00', 'Apt viewing #1 · Yeldeğirmeni', '↳ Booked via Telegram referral', 'logistics'],
      ['12:00', 'Apt viewing #2 · Moda', '↳ The sea-view premium debate', 'logistics'],
      ['15:00', 'Walk Kuzguncuk → Üsküdar', '↳ Bus 14M back to Kadıköy', 'walk'],
      ['20:00', 'Member potluck · Lina\u2019s flat', '↳ Bring wine or olives. Address in TG.', 'community'],
    ]},
    { d:'Sun', date:'17', label:'Reset', items:[
      ['10:30', 'Slow breakfast · Datlı Maya', '↳ Pide, eggs, coffee. ₺160.', 'food'],
      ['12:30', 'Princes\u2019 Islands ferry · Büyükada', '↳ 90 min on the water, 4hrs on the island', 'walk'],
      ['18:30', 'Back · ferry to Kadıköy', '↳ Sunset on the Marmara', 'transit'],
      ['20:00', 'Plan week 2', '↳ The Matcher, if not done yet', 'rest'],
    ]},
  ];

  const tagColor = (t) => ({
    arrive:'var(--terracotta)', logistics:'var(--terracotta)', food:'var(--moss)',
    walk:'var(--ferry-yellow)', work:'var(--bosphorus)', community:'var(--terracotta-dim)',
    transit:'var(--bosphorus-dim)', wellness:'var(--terracotta-dim)', learn:'var(--moss)',
    rest:'var(--paper-mute)',
  }[t] || 'var(--paper-mute)');

  return (
    <div className="in-artboard tod-dusk" style={{width:1440, minHeight:3600}}>
      <AmbientBar tod="dusk"/>
      <NavBar active="Planner"/>

      {/* header */}
      <section style={{padding:'48px 56px 0'}}>
        <div className="in-mono" style={{color:'var(--paper-mute)', fontSize:11, display:'flex', justifyContent:'space-between'}}>
          <span>First Week Planner / <span style={{color:'var(--paper)'}}>Output</span></span>
          <span style={{color:'var(--paper-faint)'}}>Plan ID 24f-c12a · Generated 11 May 2026, 21:04 UTC+3</span>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:64, marginTop:40, alignItems:'end'}}>
          <h1 style={{fontSize:104, letterSpacing:'-0.04em', lineHeight:0.94, fontWeight:300}}>
            Your first week,<br/>
            <span style={{fontStyle:'italic', color:'var(--terracotta)'}}>plotted out.</span>
          </h1>
          <div style={{display:'flex', flexDirection:'column', gap:12, paddingBottom:24}}>
            <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-mute)'}}>For: Maya · Designer · solo · 3 months</div>
            <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-mute)'}}>Arriving: 11 May, SAW, 08:30 local</div>
            <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-mute)'}}>Base: Kadıköy · Yeldeğirmeni</div>
            <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-mute)'}}>Budget: comfortable · ~₺6,800 / week</div>
          </div>
        </div>

        {/* meta row */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:0, marginTop:64, border:'1px solid var(--ink-3)'}}>
          {[
            ['7', 'days planned', ''],
            ['43', 'stops', 'incl. logistics + meals + work blocks'],
            ['₺6,820', 'estimated week', 'transit + food + activities'],
            ['12', 'addresses ready', 'tap any to copy to clipboard'],
            ['4', 'member intros', 'introductions auto-DMed via Telegram'],
          ].map(([n, l, sub], i) => (
            <div key={l} style={{padding:'22px 20px', borderRight: i<4 ? '1px solid var(--ink-3)' : 'none'}}>
              <div className="in-num" style={{fontSize:32, color:'var(--paper)', letterSpacing:'-0.01em'}}>{n}</div>
              <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-mute)', marginTop:6}}>{l}</div>
              {sub && <div className="in-mono" style={{fontSize:9.5, color:'var(--paper-faint)', marginTop:4}}>{sub}</div>}
            </div>
          ))}
        </div>

        {/* action bar */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:24}}>
          <div style={{display:'flex', gap:10}}>
            <button style={{padding:'10px 16px', border:'1px solid var(--ink-4)', borderRadius:2, fontSize:12.5, color:'var(--paper)'}}>↓ Export to calendar (.ics)</button>
            <button style={{padding:'10px 16px', border:'1px solid var(--ink-4)', borderRadius:2, fontSize:12.5, color:'var(--paper)'}}>↗ Open in Telegram</button>
            <button style={{padding:'10px 16px', border:'1px solid var(--ink-4)', borderRadius:2, fontSize:12.5, color:'var(--paper)'}}>↳ Share read-only link</button>
            <button style={{padding:'10px 16px', border:'1px solid var(--ink-4)', borderRadius:2, fontSize:12.5, color:'var(--paper)'}}>⌥ Edit assumptions</button>
          </div>
          <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-faint)'}}>Auto-saved · v3 of 3</div>
        </div>
      </section>

      {/* week grid */}
      <section style={{padding:'80px 56px 0'}}>
        <SectionEyebrow num="01" label="Week of 11 May" kicker="Mon → Sun"/>
        <div style={{display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:1, background:'var(--ink-4)', border:'1px solid var(--ink-4)', marginTop:32}}>
          {days.map((day, di) => (
            <div key={day.d} style={{background:'var(--ink-1)', padding:'18px 14px 24px', minHeight:560, display:'flex', flexDirection:'column'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-mute)'}}>{day.d.toUpperCase()}</div>
                <div className="in-num" style={{fontSize:22, color: di===0 ? 'var(--terracotta)' : 'var(--paper)'}}>{day.date}</div>
              </div>
              <div style={{fontFamily:'var(--serif)', fontSize:18, marginTop:4, letterSpacing:'-0.01em'}}>{day.label}</div>
              <div className="in-thinrule" style={{margin:'14px 0'}}/>
              <div style={{display:'flex', flexDirection:'column', gap:12, flex:1}}>
                {day.items.map((it, i) => (
                  <div key={i} style={{borderLeft:`2px solid ${tagColor(it[3])}`, paddingLeft:8}}>
                    <div className="in-num" style={{fontSize:11, color:'var(--paper-mute)'}}>{it[0]}</div>
                    <div style={{fontSize:12.5, color:'var(--paper)', lineHeight:1.3, marginTop:2}}>{it[1]}</div>
                    <div className="in-mono" style={{fontSize:9.5, color:'var(--paper-faint)', marginTop:4, lineHeight:1.4}}>{it[2]}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Focus day · Tuesday detail panel */}
      <section style={{padding:'120px 56px 0'}}>
        <SectionEyebrow num="02" label="Focused on Tuesday" kicker="tap any day for this view"/>
        <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:64, marginTop:40}}>
          <div>
            <div style={{display:'flex', alignItems:'baseline', gap:24, marginBottom:32}}>
              <h2 style={{fontSize:88, letterSpacing:'-0.035em', lineHeight:1, color:'var(--paper)'}}>Tue · 12</h2>
              <div style={{fontFamily:'var(--serif)', fontStyle:'italic', fontSize:32, color:'var(--terracotta)'}}>Make it real</div>
            </div>

            {days[1].items.map((it, i) => (
              <div key={i} style={{display:'grid', gridTemplateColumns:'70px 1fr auto', gap:24, padding:'22px 0', borderTop:'1px solid var(--ink-3)', alignItems:'baseline'}}>
                <div className="in-num" style={{fontSize:20, color:'var(--paper)'}}>{it[0]}</div>
                <div>
                  <div style={{fontSize:19, fontFamily:'var(--serif)', letterSpacing:'-0.01em'}}>{it[1]}</div>
                  <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-mute)', marginTop:6}}>{it[2]}</div>
                </div>
                <span className="in-mono" style={{fontSize:10, color:tagColor(it[3]), border:`1px solid ${tagColor(it[3])}`, padding:'4px 10px', borderRadius:999}}>{it[3]}</span>
              </div>
            ))}
          </div>

          {/* sidebar - map + alternatives */}
          <div>
            <div style={{border:'1px solid var(--ink-3)', padding:18, background:'var(--ink-2)', marginBottom:24}}>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <span className="in-mono" style={{color:'var(--paper-mute)'}}>Tuesday route · Kadıköy</span>
                <span className="in-mono" style={{color:'var(--paper-faint)'}}>3.4 km · 47 min walk</span>
              </div>
              <div style={{position:'relative', height:260, marginTop:14, border:'1px dashed var(--ink-4)'}}>
                <svg viewBox="0 0 380 260" style={{position:'absolute', inset:0, width:'100%', height:'100%'}}>
                  <path d="M50,220 L100,180 L160,200 L210,150 L260,100 L310,140 L340,60" stroke="var(--terracotta)" strokeWidth="1.5" strokeDasharray="3 4" fill="none"/>
                </svg>
                {[
                  ['1', 50, 220, 'Walter\u2019s'],
                  ['2', 100, 180, 'Türk T.'],
                  ['3', 160, 200, 'İş Bank.'],
                  ['4', 210, 150, 'Pazar'],
                  ['5', 260, 100, 'Kolektif'],
                  ['6', 340, 60,  'Çiya'],
                ].map(([n,x,y,lbl]) => (
                  <div key={n} style={{position:'absolute', left:x, top:y, transform:'translate(-50%,-50%)', display:'flex', alignItems:'center', gap:6}}>
                    <div className="in-num" style={{width:18, height:18, borderRadius:'50%', background:'var(--terracotta)', color:'var(--ink-0)', fontSize:10, display:'grid', placeItems:'center'}}>{n}</div>
                    <span className="in-mono" style={{fontSize:9.5, color:'var(--paper)'}}>{lbl}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="in-mono" style={{color:'var(--paper-mute)', marginBottom:14}}>Backup options · if any stop is closed</div>
            <div style={{border:'1px solid var(--ink-3)'}}>
              {[
                ['Walter\u2019s closed?', 'Try Walter\u2019s Yeldeğirmeni · 4 min walk'],
                ['SIM elsewhere?', 'Vodafone, same street, ₺50 cheaper'],
                ['Pazar rained out?', 'Goncalves Şarküteri, indoor, 2 blocks south'],
                ['Group dinner full?', 'Reservation pushed to Wed 19:30 same place'],
              ].map(([q,a]) => (
                <div key={q} style={{padding:'14px 18px', borderTop:'1px solid var(--ink-3)'}}>
                  <div style={{fontSize:13.5, fontFamily:'var(--serif)'}}>{q}</div>
                  <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-mute)', marginTop:4}}>↳ {a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* assumptions / replan footer */}
      <section style={{padding:'120px 56px 0'}}>
        <SectionEyebrow num="03" label="What we assumed"/>
        <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:32, marginTop:32, border:'1px solid var(--ink-3)', padding:'28px 32px'}}>
          {[
            ['You said you wanted a soft landing · light Monday', 'Energy', 'Low → high', '→'],
            ['You\u2019re working full-time during the week', 'Schedule', 'Mon–Fri load', '→'],
            ['You eat anything · prefer real over fancy', 'Food', 'Pazar > Michelin', '→'],
            ['You want to meet people but not "network"', 'Social', '2 events / wk', '→'],
            ['You\u2019d rather walk than taxi', 'Movement', 'Foot + ferry', '→'],
          ].map(([sentence, k, v, arrow], i, arr) => (
            <React.Fragment key={i}>
              <div style={{fontSize:14, fontFamily:'var(--serif)', borderTop: i===0 ? 'none' : '1px solid var(--ink-3)', paddingTop: i===0 ? 0 : 20, gridColumn:'1', color:'var(--paper-dim)'}}>{sentence}</div>
              <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-mute)', borderTop: i===0 ? 'none' : '1px solid var(--ink-3)', paddingTop: i===0 ? 0 : 20}}>{k}</div>
              <div style={{fontSize:13.5, color:'var(--paper)', borderTop: i===0 ? 'none' : '1px solid var(--ink-3)', paddingTop: i===0 ? 0 : 20}}>{v}</div>
              <div style={{textAlign:'right', borderTop: i===0 ? 'none' : '1px solid var(--ink-3)', paddingTop: i===0 ? 0 : 20}}>
                <a style={{fontSize:12.5, color:'var(--terracotta)'}}>edit</a>
              </div>
            </React.Fragment>
          ))}
        </div>
        <div style={{textAlign:'center', marginTop:48}}>
          <button style={{padding:'18px 28px', background:'var(--terracotta)', color:'var(--ink-0)', borderRadius:2, fontSize:14, fontWeight:500}}>
            Re-plan with edits →
          </button>
        </div>
      </section>

      <Footer/>
    </div>
  );
};

window.PlannerPage = PlannerPage;
