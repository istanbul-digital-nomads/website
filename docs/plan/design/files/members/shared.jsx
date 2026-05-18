/* shared atoms used across IN artboards */

const NavBar = ({active = 'Home', lang = 'EN'}) => {
  const items = ['Guides', 'Neighborhoods', 'Planner', 'Events', 'Members', 'Perks', 'Circles'];
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'20px 56px', borderBottom:'1px solid var(--ink-3)',
      background:'rgba(6,16,31,0.7)', backdropFilter:'blur(10px)',
      position:'sticky', top:0, zIndex:5,
    }}>
      <div style={{display:'flex', alignItems:'center', gap:10}}>
        <div style={{
          width:32, height:32, borderRadius:8,
          background:'linear-gradient(135deg, var(--terracotta), var(--bosphorus))',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontFamily:'var(--serif)', fontSize:18, fontStyle:'italic',
          color:'var(--ink-1)', letterSpacing:'-0.04em',
        }}>iN</div>
        <div style={{fontSize:14, fontWeight:500, letterSpacing:'-0.01em', color:'var(--paper)'}}>
          istanbulnomads
        </div>
      </div>
      <nav style={{display:'flex', alignItems:'center', gap:28}}>
        {items.map(it => (
          <a key={it} style={{
            fontSize:13.5,
            color: it===active ? 'var(--paper)' : 'var(--paper-mute)',
            position:'relative',
          }}>
            {it}
            {it===active && <span style={{
              position:'absolute', left:'50%', bottom:-22, transform:'translateX(-50%)',
              width:5, height:5, borderRadius:'50%', background:'var(--terracotta)',
            }}/>}
          </a>
        ))}
      </nav>
      <div style={{display:'flex', alignItems:'center', gap:18}}>
        <button style={{
          padding:'7px 12px', borderRadius:999,
          border:'0.5px solid rgba(246,236,217,0.18)',
          fontSize:12, color:'var(--paper-mute)', fontFamily:'var(--sans)',
          display:'flex', alignItems:'center', gap:8,
        }}>
          <span style={{color:'var(--paper-faint)'}}>Search</span>
          <span style={{padding:'1px 6px', borderRadius:4, fontSize:10, color:'var(--paper-mute)', border:'0.5px solid rgba(246,236,217,0.12)'}}>⌘K</span>
        </button>
        <div style={{fontSize:11, color:'var(--paper-mute)', display:'flex', gap:10, letterSpacing:'0.04em'}}>
          <span style={{color:'var(--paper)'}}>{lang}</span>
          <span>TR</span><span>FA</span><span>AR</span><span>RU</span>
        </div>
        <button style={{
          padding:'8px 14px', borderRadius:999,
          border:'0.5px solid rgba(134,239,172,0.35)',
          background:'rgba(134,239,172,0.08)',
          fontSize:12, color:'#86efac', fontWeight:500,
          display:'flex', alignItems:'center', gap:8,
        }}>
          <span style={{width:6, height:6, background:'#86efac', borderRadius:'50%', boxShadow:'0 0 8px #86efac'}}/>
          Telegram
        </button>
        <button style={{padding:'9px 18px', background:'var(--terracotta)', color:'var(--ink-1)', borderRadius:999, fontSize:13, fontWeight:600}}>
          Sign in
        </button>
      </div>
    </div>
  );
};

const Footer = () => (
  <div style={{
    padding:'80px 56px 48px', borderTop:'0.5px solid rgba(246,236,217,0.10)',
    background:'var(--ink-2)',
  }}>
    <div style={{display:'grid', gridTemplateColumns:'2.2fr 1fr 1fr 1fr 1fr', gap:48, marginBottom:80}}>
      <div>
        <div style={{
          display:'flex', alignItems:'center', gap:10,
        }}>
          <div style={{
            width:36, height:36, borderRadius:10,
            background:'linear-gradient(135deg, var(--terracotta), var(--bosphorus))',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:'var(--serif)', fontSize:22, fontStyle:'italic',
            color:'var(--ink-1)', letterSpacing:'-0.04em',
          }}>iN</div>
          <div style={{fontFamily:'var(--sans)', fontSize:15, fontWeight:500, letterSpacing:'-0.01em', color:'var(--paper)'}}>
            istanbulnomads
          </div>
        </div>
        <div style={{fontFamily:'var(--serif)', fontSize:36, lineHeight:1.1, letterSpacing:'-0.02em', maxWidth:380, marginTop:18}}>
          Built on the Asia side. <em style={{color:'var(--terracotta)'}}>Read on every side.</em>
        </div>
        <div className="in-mono" style={{fontSize:10, color:'var(--terracotta)', marginTop:20, lineHeight:1.7, opacity:0.7}}>
          41°00′N 28°58′E · UTC+3<br/>
          TRY ₺ · EN / TR / FA / AR / RU
        </div>
      </div>
      {[
        ['Get oriented', ['First Week Planner', 'Neighborhood Matcher', 'Cost of Living', 'Visa & Stay Length']],
        ['Neighborhoods', ['Kadıköy', 'Beşiktaş', 'Cihangir', 'Karaköy', 'Balat', 'Üsküdar']],
        ['Community', ['Telegram (1,847)', 'Weekly Events', 'Member Directory', 'Field Notes']],
        ['The site', ['Why this exists', 'Contribute a guide', 'llms.txt', 'OpenAPI', 'RSS']],
      ].map(([h, items]) => (
        <div key={h}>
          <div className="in-mono" style={{fontSize:10, color:'var(--terracotta)', marginBottom:18, opacity:0.9}}>{h}</div>
          <div style={{display:'flex', flexDirection:'column', gap:11}}>
            {items.map(i => <a key={i} style={{fontSize:13.5, color:'var(--paper-dim)'}}>{i}</a>)}
          </div>
        </div>
      ))}
    </div>
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', paddingTop:32, borderTop:'0.5px solid rgba(246,236,217,0.10)'}}>
      <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-faint)'}}>
        © 2026 ISTANBUL NOMADS · NOT AFFILIATED WITH ANY AGENCY · WRITTEN BY HUMANS · INDEXED BY MACHINES
      </div>
      <div className="in-mono" style={{fontSize:10.5, color:'var(--paper-faint)'}}>
        ferry: 07:15 → 22:40 · weather: 19° / clear · ☾ 23:04
      </div>
    </div>
  </div>
);

const PhotoSlot = ({label, kind='dawn', corner, style, children}) => (
  <div className={`in-photo in-photo--${kind}`} style={style}>
    {corner && <div className="in-photo__corner">{corner}</div>}
    {children}
    <div className="in-photo__label">
      <span>{label}</span>
      <span>↳ photo slot</span>
    </div>
  </div>
);

const SectionEyebrow = ({num, label, kicker}) => (
  <div style={{display:'flex', alignItems:'center', gap:14, color:'var(--paper-mute)'}}>
    <span className="in-mono" style={{color:'var(--terracotta)'}}>{num}</span>
    <span className="in-mark"/>
    <span className="in-mono">{label}</span>
    {kicker && <span className="in-mono" style={{color:'var(--paper-faint)'}}>· {kicker}</span>}
  </div>
);

/* AmbientBar - the living signals across the top of every page.
   Small, monospace, peripheral - like the timestamp on a film camera. */
const AmbientBar = ({tod = 'dusk'}) => {
  // tod: dawn | midday | dusk | night
  const todMeta = {
    dawn:    {label:'DAWN', color:'var(--ferry-yellow)', detail:'light climbing E', sun:'05:48 ↗'},
    midday:  {label:'MIDDAY', color:'#f4ead7', detail:'clear, 28% humidity', sun:'13:08 ↑'},
    dusk:    {label:'DUSK', color:'var(--terracotta)', detail:'light fading W', sun:'20:12 ↘'},
    night:   {label:'NIGHT', color:'var(--bosphorus)', detail:'low moon, calm Marmara', sun:'00:24 ↓'},
  }[tod];
  return (
    <div style={{
      borderBottom:'1px solid var(--ink-3)',
      background:'var(--ink-0)',
      display:'grid',
      gridTemplateColumns:'auto auto auto auto auto 1fr auto',
      gap:0,
      alignItems:'stretch',
      fontFamily:'var(--mono)',
      fontSize:11,
      letterSpacing:'0.06em',
      textTransform:'uppercase',
      color:'var(--paper-mute)',
    }}>
      {/* LIVE indicator */}
      <div style={{display:'flex', alignItems:'center', gap:8, padding:'10px 18px', borderRight:'1px solid var(--ink-3)'}}>
        <span style={{width:6, height:6, borderRadius:'50%', background:'#7ab880', boxShadow:'0 0 8px #7ab880'}}/>
        <span style={{color:'var(--paper)'}}>LIVE FROM KADIKÖY</span>
      </div>
      {/* time */}
      <div style={{display:'flex', alignItems:'center', gap:8, padding:'10px 18px', borderRight:'1px solid var(--ink-3)'}}>
        <span style={{color:'var(--paper)', fontVariantNumeric:'tabular-nums'}}>18:32</span>
        <span style={{color:'var(--paper-faint)'}}>UTC+3</span>
      </div>
      {/* weather + tod */}
      <div style={{display:'flex', alignItems:'center', gap:10, padding:'10px 18px', borderRight:'1px solid var(--ink-3)'}}>
        <span style={{color:'var(--paper)', fontVariantNumeric:'tabular-nums'}}>19°</span>
        <span style={{width:6, height:6, borderRadius:'50%', background:todMeta.color, boxShadow:`0 0 8px ${todMeta.color}`}}/>
        <span style={{color:todMeta.color}}>{todMeta.label}</span>
        <span style={{color:'var(--paper-faint)'}}>· {todMeta.detail}</span>
      </div>
      {/* ferry */}
      <div style={{display:'flex', alignItems:'center', gap:10, padding:'10px 18px', borderRight:'1px solid var(--ink-3)'}}>
        <span style={{color:'var(--paper-faint)'}}>FERRY</span>
        <span style={{color:'var(--paper)'}}>Kadıköy → Karaköy</span>
        <span style={{color:'var(--ferry-yellow)'}}>↗ 18:45</span>
        <span style={{color:'var(--paper-faint)'}}>· running</span>
      </div>
      {/* FX */}
      <div style={{display:'flex', alignItems:'center', gap:10, padding:'10px 18px', borderRight:'1px solid var(--ink-3)'}}>
        <span style={{color:'var(--paper-faint)'}}>1 USD</span>
        <span style={{color:'var(--paper)', fontVariantNumeric:'tabular-nums'}}>₺34.20</span>
        <span style={{color:'#d99464', fontVariantNumeric:'tabular-nums'}}>+0.12</span>
      </div>
      {/* spacer */}
      <div/>
      {/* online */}
      <div style={{display:'flex', alignItems:'center', gap:10, padding:'10px 18px', borderLeft:'1px solid var(--ink-3)'}}>
        <span style={{width:6, height:6, borderRadius:'50%', background:'#7ab880'}}/>
        <span style={{color:'var(--paper)', fontVariantNumeric:'tabular-nums'}}>12 online</span>
        <span style={{color:'var(--paper-faint)'}}>· 38 here this month</span>
      </div>
    </div>
  );
};

/* CommandK - visible, static rendering of the global menu for design comp */
const CommandK = ({style}) => (
  <div style={{
    position:'absolute',
    width:680,
    background:'rgba(11,14,17,0.96)',
    border:'1px solid var(--ink-4)',
    borderRadius:6,
    boxShadow:'0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(244,234,215,0.04)',
    backdropFilter:'blur(20px)',
    fontFamily:'var(--sans)',
    color:'var(--paper)',
    ...style,
  }}>
    {/* search row */}
    <div style={{display:'flex', alignItems:'center', gap:14, padding:'18px 20px', borderBottom:'1px solid var(--ink-3)'}}>
      <span className="in-mono" style={{color:'var(--paper-faint)', fontSize:11}}>⌘K</span>
      <input
        defaultValue="kadiköy ferry"
        style={{
          flex:1, background:'transparent', border:0, outline:0,
          fontSize:18, fontFamily:'var(--serif)', letterSpacing:'-0.01em',
          color:'var(--paper)',
        }}
      />
      <span className="in-mono" style={{fontSize:10, color:'var(--paper-faint)'}}>↵ open · ⇥ tab · esc</span>
    </div>
    {/* sections */}
    {[
      ['Pages', [
        ['Kadıköy · Neighborhood', '/n/kadikoy', 'page', 'K'],
        ['Ferry schedules · /transport/ferries', '/transport/ferries', 'guide', null],
      ]],
      ['Events · this week', [
        ['Wednesday dinner · Çiya', '15 May · 19:30 · 1 spot left', 'event', null],
        ['Bosphorus slow office', '16 May · 08:00 · 4 spots', 'event', null],
      ]],
      ['Members', [
        ['Maya Karadağ · Writer · Kadıköy', 'open to coffee', 'member', null],
        ['Yuki F. · Engineer · Moda', '10 mo here', 'member', null],
      ]],
      ['Quick actions', [
        ['Open Telegram', 't.me/istanbulnomads', 'action', 'T'],
        ['Plan my first week', '/planner', 'action', 'P'],
        ['Take the Matcher', '/matcher', 'action', 'M'],
      ]],
    ].map(([title, rows]) => (
      <div key={title}>
        <div className="in-mono" style={{padding:'14px 20px 8px', fontSize:10, color:'var(--paper-faint)'}}>{title}</div>
        {rows.map(([head, sub, kind, key], i) => (
          <div key={head} style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'10px 20px',
            background: (title==='Pages' && i===0) ? 'rgba(196,99,58,0.10)' : 'transparent',
            borderLeft:(title==='Pages' && i===0) ? '2px solid var(--terracotta)' : '2px solid transparent',
          }}>
            <div style={{display:'flex', alignItems:'center', gap:12}}>
              <span className="in-mono" style={{
                fontSize:9.5, padding:'3px 7px', borderRadius:2,
                color: kind==='event' ? 'var(--terracotta)' : kind==='member' ? 'var(--bosphorus)' : kind==='action' ? 'var(--ferry-yellow)' : 'var(--paper-mute)',
                border:'1px solid currentColor',
                opacity:0.75,
              }}>{kind}</span>
              <span style={{fontSize:14, color:'var(--paper)'}}>{head}</span>
              <span className="in-mono" style={{fontSize:10.5, color:'var(--paper-faint)'}}>{sub}</span>
            </div>
            {key && <span className="in-mono" style={{fontSize:10, color:'var(--paper-faint)', padding:'3px 7px', border:'1px solid var(--ink-4)', borderRadius:3}}>⌘{key}</span>}
          </div>
        ))}
      </div>
    ))}
    <div style={{padding:'12px 20px', borderTop:'1px solid var(--ink-3)', display:'flex', justifyContent:'space-between'}} className="in-mono">
      <span style={{fontSize:10, color:'var(--paper-faint)'}}>27 results · indexed 11 May 21:04</span>
      <span style={{fontSize:10, color:'var(--paper-faint)'}}>Search the whole site, members, events, perks</span>
    </div>
  </div>
);

Object.assign(window, { NavBar, Footer, PhotoSlot, SectionEyebrow, AmbientBar, CommandK });
