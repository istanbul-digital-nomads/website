/* Kadıköy detail page - editorial, end-to-end */

const KadikoyPage = () => {
  return (
    <div className="in-artboard tod-dusk" style={{width:1440, minHeight:7360}}>
      <AmbientBar tod="dusk"/>
      <NavBar active="Neighborhoods"/>

      {/* breadcrumb / hero */}
      <section style={{padding:'40px 56px 0'}}>
        <div className="in-mono" style={{color:'var(--paper-mute)', fontSize:11, display:'flex', gap:10}}>
          <span>Neighborhoods</span><span>/</span><span style={{color:'var(--paper)'}}>Kadıköy</span>
          <span style={{marginLeft:'auto', color:'var(--paper-faint)'}}>01 of 08 · Asia side · 41°00′N 29°02′E</span>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr auto', gap:48, marginTop:48, alignItems:'end'}}>
          <h1 style={{fontSize:200, letterSpacing:'-0.05em', lineHeight:0.88, fontWeight:300}}>
            Kadı<span style={{fontStyle:'italic', color:'var(--terracotta)'}}>köy</span>
          </h1>
          <div style={{display:'flex', flexDirection:'column', gap:8, alignItems:'flex-end', paddingBottom:28}}>
            <div className="in-mono" style={{color:'var(--paper-mute)', fontSize:10.5}}>Coordinates 40.9925° N · 29.0282° E</div>
            <div className="in-mono" style={{color:'var(--paper-mute)', fontSize:10.5}}>Population 467,000 · Density 26,400 / km²</div>
            <div className="in-mono" style={{color:'var(--paper-mute)', fontSize:10.5}}>Ferry to Karaköy · 22 minutes · every 20</div>
            <div style={{display:'flex', gap:8, marginTop:6}}>
              {['Ferry-first', 'Walkable', 'Loud', 'Long-stay', 'Best produce'].map(t => <span key={t} className="in-tag">{t}</span>)}
            </div>
          </div>
        </div>

        <div style={{marginTop:48, display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:18}}>
          <PhotoSlot kind="dawn" corner="Lead photo" label="Moda pier - Tuesday, 07:12. Ferry to Karaköy departing." style={{height:580, borderRadius:2}}/>
          <div style={{display:'grid', gridTemplateRows:'1fr 1fr', gap:18}}>
            <PhotoSlot kind="interior" corner="Detail" label="Walter's, Yeldeğirmeni - 14:30" style={{height:281, borderRadius:2}}/>
            <PhotoSlot kind="street" corner="Detail" label="Bahariye Caddesi - 18:00" style={{height:281, borderRadius:2}}/>
          </div>
        </div>

        {/* lede */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1.4fr 0.6fr', gap:64, marginTop:80, paddingTop:48, borderTop:'1px solid var(--ink-4)'}}>
          <div>
            <SectionEyebrow num="01" label="The lede"/>
            <div className="in-mono" style={{color:'var(--paper-faint)', marginTop:18, fontSize:10.5, lineHeight:1.7}}>
              First published Feb 2024<br/>
              Updated 11 May 2026<br/>
              Co-written by 6 members<br/>
              Read time 18 minutes
            </div>
          </div>
          <div>
            <p style={{fontSize:24, fontFamily:'var(--serif)', lineHeight:1.35, letterSpacing:'-0.015em', color:'var(--paper)'}}>
              Kadıköy is the answer most members give after a week of pretending to think about it. It is the Asia-side default: a real neighborhood with a real Tuesday market, more bookshops than is sensible, ferries every twenty minutes, and a coastline you can walk for an hour before you've made a decision about your day.
            </p>
            <p style={{fontSize:16, color:'var(--paper-dim)', lineHeight:1.65, marginTop:24}}>
              Live here if you want to <em style={{fontFamily:'var(--serif)'}}>live</em> here, not visit. Rents are mid-pack, Wi-Fi is good, the produce is the best in the city, and the bars stay open later than is good for any of us. The trade is volume: Bahariye on a Saturday is not for thinking. The upside is that you will, within six weeks, recognise the man at the simit cart and he will recognise you back.
            </p>
          </div>
          <div style={{borderLeft:'1px solid var(--ink-3)', paddingLeft:24}}>
            <div className="in-mono" style={{color:'var(--paper-faint)', marginBottom:14, fontSize:10.5}}>In one sentence</div>
            <p style={{fontFamily:'var(--serif)', fontStyle:'italic', fontSize:19, lineHeight:1.3, color:'var(--terracotta)'}}>
              "The first place that stopped feeling like Istanbul and started feeling like home."
            </p>
            <div className="in-mono" style={{color:'var(--paper-faint)', marginTop:14, fontSize:10.5}}>- Maya K., 9 months here</div>
          </div>
        </div>
      </section>

      {/* at-a-glance - data table */}
      <section style={{padding:'128px 56px 0'}}>
        <SectionEyebrow num="02" label="At a glance" kicker="numbers, no apology"/>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:0, marginTop:40, border:'1px solid var(--ink-3)'}}>
          {[
            ['Rent · 1BR long-stay', '₺28,000', '/ month, median', 'var(--terracotta)'],
            ['Co-working desk', '₺6,500', '/ month, median', 'var(--bosphorus)'],
            ['Wi-Fi reliability', '97', '/ 100, member survey', 'var(--moss)'],
            ['Walkability', '94', '/ 100, member survey', 'var(--ferry-yellow)'],
            ['Quietness at 02:00', '38', '/ 100, lower = louder', 'var(--terracotta-dim)'],
            ['Daily ferry options', '74', 'departures, both ways', 'var(--bosphorus)'],
            ['Members living here', '38', 'active, last 30 days', 'var(--paper)'],
            ['Time to airport · SAW', '34', 'min, off-peak driving', 'var(--paper-mute)'],
          ].map(([k, v, sub, c], i) => (
            <div key={k} style={{
              padding:'28px 24px',
              borderRight: (i%4)!==3 ? '1px solid var(--ink-3)' : 'none',
              borderBottom: i<4 ? '1px solid var(--ink-3)' : 'none',
            }}>
              <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-mute)', marginBottom:14}}>{k}</div>
              <div style={{display:'flex', alignItems:'baseline', gap:8}}>
                <span className="in-num" style={{fontSize:38, color:c, letterSpacing:'-0.01em'}}>{v}</span>
              </div>
              <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', marginTop:8}}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DAY IN THE LIFE - annotated timeline */}
      <section style={{padding:'128px 56px 0'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 2fr', gap:96}}>
          <div>
            <SectionEyebrow num="03" label="Day in the life"/>
            <h2 style={{fontSize:64, lineHeight:0.98, letterSpacing:'-0.03em', marginTop:24}}>
              A <span style={{fontStyle:'italic', color:'var(--terracotta)'}}>Tuesday</span> here, told in twelve stops.
            </h2>
            <p style={{fontSize:15, color:'var(--paper-dim)', marginTop:24, lineHeight:1.6}}>
              The shape of a working day for most members. Composite from 14 member journals, May 2026. We've left in the small awkward parts on purpose.
            </p>
          </div>
          <div style={{position:'relative', paddingLeft:48}}>
            <div style={{position:'absolute', left:18, top:8, bottom:8, width:1, background:'var(--ink-3)'}}/>
            {[
              ['06:48', 'Wake', 'Window open. Gulls on the Marmara side. Coffee black, no Instagram.', 'var(--ferry-yellow)'],
              ['07:30', 'Walk to Moda pier', "Eight minutes. Pick up a simit on the way for ₺15. Don't sit yet.", 'var(--terracotta)'],
              ['08:00', 'First call · the bench', 'The pier benches face the Princes Islands. 4G is fine. Wear a jumper.', 'var(--bosphorus)'],
              ['10:00', 'Walter\'s, Yeldeğirmeni', 'Window seat. Filter ₺85. The wifi password is on the menu.', 'var(--terracotta)'],
              ['13:00', 'Lunch · Çiya', 'Lokanta floor, not the kebab room. Three plates, ₺240, no English required.', 'var(--moss)'],
              ['14:30', 'Tuesday pazar · Salı pazarı', 'Tomatoes, white cheese, the good olives. ₺320 fills the fridge for a week.', 'var(--ferry-yellow)'],
              ['16:00', 'Library hour · Karga', 'Upstairs, away from the bar. Tea is ₺25 and they bring you water.', 'var(--bosphorus)'],
              ['17:35', 'Ferry → Karaköy', 'Tea on deck. Two simits. Watch the city pretend to be on fire.', 'var(--terracotta)'],
              ['19:30', 'Drinks · Mürver, Karaköy', 'Roof. The other side of the water. Friends from #general.', 'var(--bosphorus-dim)'],
              ['22:10', 'Ferry back', "Last good one. The 23:00 is fine but it'll be a quiet ride home.", 'var(--ferry-yellow)'],
              ['23:00', 'Walk Bahariye to bed', "Loud. Cats. The cherry man is still there. Don't talk to anyone.", 'var(--moss)'],
              ['23:40', 'Lights out', "Reading: whatever's open on the Kindle. No phone.", 'var(--paper-mute)'],
            ].map(([t, head, body, c], i) => (
              <div key={i} style={{display:'grid', gridTemplateColumns:'auto 1fr', gap:32, paddingBottom:24, position:'relative'}}>
                <div style={{position:'absolute', left:-30, top:6, width:13, height:13, borderRadius:'50%', background:c, boxShadow:'0 0 0 3px var(--ink-1)'}}/>
                <div className="in-num" style={{fontSize:15, color:'var(--paper-mute)', width:54}}>{t}</div>
                <div>
                  <div style={{fontSize:18, fontFamily:'var(--serif)', letterSpacing:'-0.01em', color:'var(--paper)'}}>{head}</div>
                  <div style={{fontSize:13.5, color:'var(--paper-dim)', marginTop:4, lineHeight:1.55}}>{body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHERE TO WORK */}
      <section style={{padding:'128px 56px 0'}}>
        <SectionEyebrow num="04" label="Where to work" kicker="written by people who actually do"/>
        <h2 style={{fontSize:64, letterSpacing:'-0.03em', marginTop:24, lineHeight:1.02}}>
          Cafés, by what they're <span style={{fontStyle:'italic', color:'var(--terracotta)'}}>actually for.</span>
        </h2>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:24, marginTop:48}}>
          {[
            { n:'Walter\'s Coffee Roastery', for:'Long sessions', wifi:9.4, power:'Every table', noise:'Medium', best:'10:00–14:00, weekdays', closes:'22:00', addr:'Moda Cd. 105/A', note:'The unofficial IN office. Window seats fill by 09:45 - book in the head.', photo:'interior'},
            { n:'Karga Bar (upstairs)', for:'Quiet calls', wifi:8.8, power:'Most tables', noise:'Low until 18', best:'12:00–17:00', closes:'02:00', addr:'Kadife Sk. 16', note:'Ask for the upstairs library. They turn the music down if you ask once.', photo:'mono'},
            { n:'Moda Tea Garden bench', for:'Outdoor calls', wifi:'4G', power:'None', noise:'Low', best:'Morning, calm sea days', closes:'Sunset', addr:'Sea wall, Moda', note:'Bring layers. Free, the best view in the city, has gulls.', photo:'bosphorus'},
          ].map((c,i) => (
            <div key={c.n} style={{border:'1px solid var(--ink-3)', background:'var(--ink-2)'}}>
              <PhotoSlot kind={c.photo} label={c.n} corner={`café · 0${i+1}`} style={{height:200, border:'none', borderBottom:'1px solid var(--ink-3)'}}/>
              <div style={{padding:'24px 24px 28px'}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                  <h4 style={{fontSize:22, letterSpacing:'-0.015em'}}>{c.n}</h4>
                  <span className="in-mono" style={{fontSize:10, color:'var(--terracotta)'}}>For · {c.for}</span>
                </div>
                <p style={{fontSize:13.5, color:'var(--paper-dim)', marginTop:10, lineHeight:1.5}}>{c.note}</p>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4px 16px', marginTop:18, paddingTop:18, borderTop:'1px solid var(--ink-3)'}}>
                  {[['Wi-Fi', c.wifi+'/10'], ['Power', c.power], ['Noise', c.noise], ['Closes', c.closes]].map(([k,v]) => (
                    <div key={k} style={{display:'flex', justifyContent:'space-between'}}>
                      <span className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>{k}</span>
                      <span className="in-num" style={{fontSize:12, color:'var(--paper)'}}>{v}</span>
                    </div>
                  ))}
                </div>
                <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', marginTop:14}}>↳ {c.addr} · Best window {c.best}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{marginTop:24, padding:'18px 24px', border:'1px dashed var(--ink-4)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <span className="in-mono" style={{color:'var(--paper-mute)', fontSize:11}}>Eleven more cafés on the full list · sorted by what they're for, not by rating</span>
          <span style={{color:'var(--terracotta)', fontSize:13, borderBottom:'1px solid var(--terracotta)', paddingBottom:2}}>See all 14 →</span>
        </div>
      </section>

      {/* EAT + DRINK + SUPPLY  long editorial 3-col */}
      <section style={{padding:'128px 56px 0'}}>
        <SectionEyebrow num="05" label="Eat · drink · supply"/>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:48, marginTop:40}}>
          {[
            ['Eat',  'var(--terracotta)', [
              ['Çiya Sofrası', 'The Anatolian canon. Go for the lokanta floor at lunch. No reservations needed.'],
              ['Kadı Nimet Balıkçılık', 'Old-school fish. Order the meze of the day, then whatever they recommend.'],
              ['Borsam Taşfırın', "Pide, all hours. The kıymalı one, with ayran. Don't argue."],
              ['Sushiço Moda', 'Tuesday is fine. Saturday is a war. They deliver until 22:30.'],
              ['Datlı Maya', 'Stone-oven pide and good coffee, near the pier.'],
            ]],
            ['Drink', 'var(--bosphorus)', [
              ['Arkaoda', 'Records, dim light, late. The bar is the right height.'],
              ['Karga Bar', 'Three floors, four moods. We work upstairs, drink down.'],
              ['Bar Bina', "Beşiktaş via Bahariye. Cocktails take 11 minutes and that's correct."],
              ['Viktor Levi', 'Wine bar on Moda Cd., warm in winter.'],
              ['Fahri Konsolos', 'Library bar. Speak quietly.'],
            ]],
            ['Supply', 'var(--moss)', [
              ['Salı pazarı (Tue market)', 'The big one. Get there before 11. Bring small notes.'],
              ['Petek Kuruyemiş', 'Nuts, dried fruit, the kind your grandmother kept on top of the fridge.'],
              ['Bahar Çiçek', 'Florist on Mühürdar Cd. Cheaper than a Brooklyn bodega tulip, prettier too.'],
              ['Mephisto Kitabevi', 'Bookshop. Good English section in the back.'],
              ['Migros Jet (Moda)', '24h. Bread arrives 06:00. Best ATM in the area.'],
            ]],
          ].map(([cat, c, items]) => (
            <div key={cat}>
              <div style={{display:'flex', alignItems:'baseline', gap:10, paddingBottom:16, borderBottom:`1px solid ${c}`, marginBottom:18}}>
                <h3 style={{fontSize:36, letterSpacing:'-0.02em', color:c}}>{cat}</h3>
                <span className="in-mono" style={{color:'var(--paper-faint)', fontSize:10.5}}>{items.length} picks</span>
              </div>
              {items.map(([n, blurb], i) => (
                <div key={n} style={{padding:'14px 0', borderTop: i===0 ? 'none' : '1px solid var(--ink-3)'}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                    <div style={{fontSize:16, fontFamily:'var(--serif)', letterSpacing:'-0.01em'}}>{n}</div>
                    <span className="in-mono" style={{fontSize:9.5, color:'var(--paper-faint)'}}>0{i+1}</span>
                  </div>
                  <p style={{fontSize:13.5, color:'var(--paper-dim)', marginTop:4, lineHeight:1.5}}>{blurb}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* WHO LIVES HERE */}
      <section style={{padding:'128px 56px 0'}}>
        <SectionEyebrow num="06" label="Who lives here" kicker="38 members, last 30 days"/>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1.6fr', gap:64, marginTop:32, alignItems:'start'}}>
          <div>
            <h2 style={{fontSize:48, letterSpacing:'-0.025em', lineHeight:1.02}}>
              Eight neighbors<br/>worth a coffee.
            </h2>
            <p style={{fontSize:15, color:'var(--paper-dim)', marginTop:18, lineHeight:1.55}}>
              Public profiles only. Reach out via Telegram - we don't do DMs through the site. The directory page has the full eighty-something.
            </p>
            <button style={{marginTop:24, padding:'12px 18px', border:'1px solid var(--ink-4)', borderRadius:2, fontSize:13, color:'var(--paper)'}}>All members in Kadıköy →</button>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:14}}>
            {[
              ['Maya K.',  'Writer',    '9mo', 'var(--terracotta)'],
              ['Deniz A.', 'Founder',   '2y',  'var(--bosphorus)'],
              ['Lina M.',  'Designer',  '3mo', 'var(--moss)'],
              ['Onur T.',  'Engineer',  '1y',  'var(--ferry-yellow)'],
              ['Rin H.',   'Researcher','5mo', 'var(--terracotta-dim)'],
              ['Mira V.',  'Producer',  '4mo', 'var(--bosphorus-dim)'],
              ['Eli S.',   'PM',        '1mo', 'var(--moss)'],
              ['Cem K.',   'Director',  '6mo', 'var(--terracotta)'],
            ].map(([name, role, time, c]) => (
              <div key={name} style={{border:'1px solid var(--ink-3)', padding:14, background:'var(--ink-2)'}}>
                <div style={{width:'100%', aspectRatio:'1', background:`linear-gradient(135deg, ${c}, var(--ink-3))`, borderRadius:2, marginBottom:12, position:'relative'}}>
                  <div className="in-mono" style={{position:'absolute', bottom:6, right:8, fontSize:10, color:'rgba(11,14,17,0.55)'}}>↳ avatar</div>
                </div>
                <div style={{fontSize:14, fontFamily:'var(--serif)', letterSpacing:'-0.01em'}}>{name}</div>
                <div className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', marginTop:4}}>{role} · {time}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT TO KNOW pull-quotes / honest section */}
      <section style={{padding:'128px 56px 0'}}>
        <SectionEyebrow num="07" label="What to know" kicker="the part most guides skip"/>
        <h2 style={{fontSize:56, letterSpacing:'-0.03em', marginTop:24}}>
          Honestly - the <span style={{fontStyle:'italic', color:'var(--terracotta)'}}>annoying</span> parts.
        </h2>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:24, marginTop:40}}>
          {[
            ['It gets loud', 'Bahariye on a Friday from 22:00 to 03:00 is not a metaphor. Live one street back if you sleep light.'],
            ['Cats run the place', 'You will negotiate with one within 48 hours. The negotiation is psychological and you will lose.'],
            ['English is patchy', 'More than Üsküdar, less than Cihangir. Learn ten Turkish phrases. Members will help.'],
            ['Pazar parking', 'Tuesday morning - don\'t drive in. Half the streets close for the market.'],
            ['Ferry runs out', 'Last good Karaköy ferry is 23:00. The Marmaray under the strait runs until 00:00.'],
            ['The "view rent" premium', 'A Bosphorus-facing flat costs ~30% more. You\'ll look at it twice a week. Worth or not - your call.'],
          ].map(([h, b]) => (
            <div key={h} style={{borderTop:'1px solid var(--ink-3)', padding:'24px 0'}}>
              <h4 style={{fontSize:22, letterSpacing:'-0.015em'}}>{h}</h4>
              <p style={{fontSize:14.5, color:'var(--paper-dim)', marginTop:10, lineHeight:1.6}}>{b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* compare / similar */}
      <section style={{padding:'128px 56px 0'}}>
        <SectionEyebrow num="08" label="If you like Kadıköy" kicker="you may also like"/>
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:18, marginTop:40}}>
          {[
            ['Moda',    'dawn',  'Same coastline, less volume.', 'Asia'],
            ['Cihangir','dusk',  'Europe-side cousin, more cats.', 'Europe'],
            ['Üsküdar', 'mono',  'Quieter Asia. More tea gardens.', 'Asia'],
            ['Balat',   'interior','Painterly, slower, harder to leave.', 'Europe'],
          ].map(([n,k,b,s]) => (
            <div key={n}>
              <PhotoSlot kind={k} label={n} corner={`Similar · ${s}`} style={{height:220, borderRadius:2}}/>
              <div style={{marginTop:14}}>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <h4 style={{fontSize:22, letterSpacing:'-0.015em'}}>{n}</h4>
                  <span className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>{s}</span>
                </div>
                <p style={{fontSize:13, color:'var(--paper-dim)', marginTop:6, lineHeight:1.5}}>{b}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section style={{padding:'160px 56px 128px'}}>
        <div style={{borderTop:'1px solid var(--ink-3)', borderBottom:'1px solid var(--ink-3)', padding:'80px 0', textAlign:'center'}}>
          <div className="in-mono" style={{color:'var(--paper-faint)', marginBottom:24}}>Read elsewhere</div>
          <h2 style={{fontSize:80, letterSpacing:'-0.035em', lineHeight:0.98}}>
            Take the matcher.<br/>
            <span style={{fontStyle:'italic', color:'var(--terracotta)'}}>Maybe it's not Kadıköy.</span>
          </h2>
          <p style={{fontSize:17, color:'var(--paper-dim)', maxWidth:620, margin:'24px auto 0', lineHeight:1.5}}>
            We're biased - we live here. The matcher isn't. Answer eight questions and see which of the eight neighborhoods scores highest for what you actually need.
          </p>
          <div style={{display:'flex', justifyContent:'center', gap:14, marginTop:40}}>
            <button style={{padding:'18px 28px', background:'var(--terracotta)', color:'var(--ink-0)', borderRadius:2, fontSize:14, fontWeight:500}}>Open the Matcher →</button>
            <button style={{padding:'18px 28px', border:'1px solid var(--ink-4)', color:'var(--paper)', borderRadius:2, fontSize:14}}>Read another neighborhood</button>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
};

window.KadikoyPage = KadikoyPage;
