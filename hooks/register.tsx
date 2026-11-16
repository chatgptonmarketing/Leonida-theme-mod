import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Hazy tropical dusk: blue-violet surfaces, hot-pink accent.
const { theme, problems } = makeColors({
  label: 'Leonida Dusk',
  only: 'dark',
  roles: { accent: '#ff5fa2', danger: '#ff6b6b', success: '#4fe0b0', warning: '#ffb86b', pro: '#5fd4e8' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#171433',
        'surface-1': '#1b1740',
        'surface-2': '#211c4c',
        'surface-3': '#241f50',
        'text-primary': '#fff3fa',
        'text-secondary': '#e1d4f5',
        'text-muted': '#bdaee0',
      },
    },
    git: { added: '#4fe0b0', removed: '#ff6b6b', modified: '#ffb86b', merged: '#cfa8ff', closed: '#ff8aa0', draft: '#bdaee0' },
  },
})

// How much veil sits between the scene and the conversation. `/dusk` switches between them.
const VEILS = {
  full: { blur: 10, tint: '#171433', opacity: 0.55 },
  soft: { blur: 4, tint: '#171433', opacity: 0.3 },
  clear: { blur: 0, tint: '#171433', opacity: 0.1 },
} as const

type Veil = keyof typeof VEILS

function lookFor(veil: Veil): ThemeSetArgs {
  return {
    colors: theme,
    overrideColorScheme: 'dark',
    backdrop: { scene: 'dusk', glass: VEILS[veil] },
  }
}

type Pt = [number, number]

const f = (n: number) => n.toFixed(0)

// A palm: a curved trunk and a crown of drooping fronds, in one flat silhouette colour.
function palm(x: number, base: number, h: number, lean: number): string {
  const top: Pt = [x + lean, base - h]
  const w = Math.max(4, h * 0.022)
  const trunk = `<path d="M${f(x - w * 1.4)} ${base} Q${f(x + lean * 0.15 - w)} ${f(base - h * 0.55)} ${f(top[0] - w * 0.6)} ${f(top[1])} L${f(top[0] + w * 0.6)} ${f(top[1])} Q${f(x + lean * 0.15 + w)} ${f(base - h * 0.55)} ${f(x + w * 1.4)} ${base} Z"/>`
  const fronds = [182, 200, 218, 236, 254, 272, 290, 308, 326, 344, 2, 20, 160, 140]
    .map((a, i) => {
      const r = (a * Math.PI) / 180
      const len = h * (0.34 + 0.08 * ((i * 7) % 5) / 4)
      const dx = Math.cos(r)
      const dy = Math.sin(r)
      const end: Pt = [top[0] + dx * len, top[1] + dy * len * 0.6 + len * 0.42]
      const mid: Pt = [top[0] + dx * len * 0.55, top[1] + dy * len * 0.4 - len * 0.12]
      const width = len * 0.12
      const c1: Pt = [mid[0] - dy * width, mid[1] + dx * width]
      const c2: Pt = [mid[0] + dy * width, mid[1] - dx * width]
      return `<path d="M${f(top[0])} ${f(top[1])} Q${f(c1[0])} ${f(c1[1])} ${f(end[0])} ${f(end[1])} Q${f(c2[0])} ${f(c2[1])} ${f(top[0])} ${f(top[1])} Z"/>`
    })
    .join('')
  const nuts = `<circle cx="${f(top[0] - 4)}" cy="${f(top[1] + 6)}" r="${f(w * 1.1)}"/><circle cx="${f(top[0] + 5)}" cy="${f(top[1] + 8)}" r="${f(w)}"/>`
  return `${trunk}${fronds}${nuts}`
}

// A row of buildings along a baseline, the same every time for a given seed.
function skyline(seed: number, baseY: number, minH: number, maxH: number): string {
  let s = seed
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
  let x = -10
  let d = `M-10 ${baseY}`
  while (x < 1610) {
    const width = 30 + rnd() * 70
    const top = baseY - (minH + rnd() * (maxH - minH))
    d += ` L${f(x)} ${f(top)} L${f(x + width)} ${f(top)}`
    x += width
  }
  return `${d} L1610 ${baseY} Z`
}

// Lit windows scattered over the near skyline.
function windows(seed: number, x0: number, x1: number, y0: number, y1: number, n: number): string {
  let s = seed
  const rnd = () => {
    s = (s * 22695477 + 1) % 4294967296
    return s / 4294967296
  }
  return Array.from({ length: n }, () => {
    const x = x0 + rnd() * (x1 - x0)
    const y = y0 + rnd() * (y1 - y0)
    return `<rect x="${f(x)}" y="${f(y)}" width="3" height="4"/>`
  }).join('')
}

const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#3b3aa6"/>
    <stop offset="0.3" stop-color="#5d55c4"/>
    <stop offset="0.52" stop-color="#9468cc"/>
    <stop offset="0.7" stop-color="#d77fc6"/>
    <stop offset="0.86" stop-color="#ff9cbf"/>
    <stop offset="1" stop-color="#ffbfa8"/>
  </linearGradient>
  <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#fff2dc" stop-opacity="0.95"/>
    <stop offset="0.25" stop-color="#ffd0c8" stop-opacity="0.6"/>
    <stop offset="1" stop-color="#ff9cbf" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="streak" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#ffe0f0" stop-opacity="0"/>
    <stop offset="0.45" stop-color="#ffd3ea" stop-opacity="0.75"/>
    <stop offset="1" stop-color="#ffe0f0" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="trail" x1="0" y1="1" x2="1" y2="0">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity="0.7"/>
  </linearGradient>
  <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffb8d2" stop-opacity="0"/>
    <stop offset="1" stop-color="#ffb8d2" stop-opacity="0.6"/>
  </linearGradient>
  <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#b9a8ee"/>
    <stop offset="0.35" stop-color="#8b7fd6"/>
    <stop offset="1" stop-color="#231d5c"/>
  </linearGradient>
  <linearGradient id="under" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fff1d6"/>
    <stop offset="1" stop-color="#ffc6c8"/>
  </linearGradient>
  <linearGradient id="pool" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffe6c4" stop-opacity="0.55"/>
    <stop offset="1" stop-color="#ffe6c4" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="neon" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#ff5fa2"/>
    <stop offset="1" stop-color="#5fd4e8"/>
  </linearGradient>
  <linearGradient id="reflect" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ff7fb8" stop-opacity="0.5"/>
    <stop offset="1" stop-color="#ff7fb8" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="vignette" cx="0.5" cy="0.45" r="0.75">
    <stop offset="0.55" stop-color="#120d33" stop-opacity="0"/>
    <stop offset="1" stop-color="#120d33" stop-opacity="0.6"/>
  </radialGradient>
  <filter id="soft4" x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>
  <filter id="soft2" x="-5%" y="-20%" width="110%" height="140%"><feGaussianBlur stdDeviation="2"/></filter>
  <filter id="soft1"><feGaussianBlur stdDeviation="0.8"/></filter>
  <filter id="bloom" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="18"/></filter>
  <filter id="glow" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 0.9  0 0 0 0 1  0 0 0 0.55 0"/></filter>
  <linearGradient id="palmNear" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#33297c"/><stop offset="1" stop-color="#120e38"/></linearGradient>
  <linearGradient id="palmMid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3d9a"/><stop offset="1" stop-color="#28215f"/></linearGradient>
  <linearGradient id="bldg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8a6dc"/><stop offset="1" stop-color="#b58fd4"/></linearGradient>
  <linearGradient id="bldg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a98ad8"/><stop offset="1" stop-color="#8a72c6"/></linearGradient>
  <linearGradient id="roof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4c43a0"/><stop offset="1" stop-color="#2f2972"/></linearGradient>
  <linearGradient id="carBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a43a6"/><stop offset="0.5" stop-color="#2c2a7a"/><stop offset="1" stop-color="#1b1850"/></linearGradient>
  <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0d4" stop-opacity="0.5"/><stop offset="1" stop-color="#fff0d4" stop-opacity="0"/></linearGradient>
</defs>
<style>
  .streak { animation: drift 80s ease-in-out infinite alternate; }
  .streak.b { animation-duration: 110s; animation-delay: -30s; }
  @keyframes drift { from { transform: translateX(-50px) } to { transform: translateX(70px) } }
  .palm { transform-box: fill-box; transform-origin: 50% 100%; animation: sway 8s ease-in-out infinite; }
  .palm.b { animation-duration: 10s; animation-delay: -4s; }
  @keyframes sway { 0%,100% { transform: rotate(-0.9deg) } 50% { transform: rotate(1.1deg) } }
  .glow { animation: glow 4s ease-in-out infinite; }
  @keyframes glow { 0%,100% { opacity: .8 } 50% { opacity: 1 } }
  .flicker { animation: flicker 7s steps(1) infinite; }
  @keyframes flicker { 0%,100% { opacity: 1 } 61% { opacity: .55 } 62% { opacity: 1 } 64% { opacity: .6 } 65% { opacity: 1 } }
  .bird { fill: none; stroke: #2a2468; stroke-width: 2.2; stroke-linecap: round; animation: fly 40s linear infinite; }
  .bird.b { animation-delay: -15s; animation-duration: 48s; }
  @keyframes fly { from { transform: translateX(-120px) } to { transform: translateX(1750px) } }
  .plane { animation: plane 90s linear infinite; }
  @keyframes plane { from { transform: translate(0,0) } to { transform: translate(260px,-90px) } }
  @media (prefers-reduced-motion: reduce) { * { animation: none !important } }
</style>

<rect width="1600" height="700" fill="url(#sky)"/>
<circle cx="1020" cy="610" r="560" fill="url(#sun)"/>
<circle cx="1020" cy="612" r="120" fill="#ffe3d0" opacity=".55" filter="url(#bloom)"/>
<circle cx="1020" cy="612" r="58" fill="#fff4e0" opacity="0.85" filter="url(#soft2)"/>

<g class="streak" filter="url(#soft4)"><ellipse cx="420" cy="118" rx="480" ry="9" fill="url(#streak)"/><ellipse cx="1180" cy="168" rx="560" ry="7" fill="url(#streak)" opacity=".8"/></g>
<g class="streak b" filter="url(#soft4)"><ellipse cx="760" cy="262" rx="620" ry="11" fill="url(#streak)" opacity=".7"/><ellipse cx="260" cy="338" rx="380" ry="6" fill="url(#streak)" opacity=".6"/><ellipse cx="1320" cy="372" rx="420" ry="8" fill="url(#streak)" opacity=".65"/></g>
<g class="streak" filter="url(#soft4)"><ellipse cx="900" cy="470" rx="520" ry="6" fill="url(#streak)" opacity=".55"/><ellipse cx="300" cy="512" rx="300" ry="5" fill="url(#streak)" opacity=".5"/></g>

<path d="M90 330 L330 205" stroke="url(#trail)" stroke-width="3" stroke-linecap="round"/>
<g class="plane"><path d="M332 203 l14 -5 l-3 4 l7 1 l-8 3 l-2 5 l-3 -4 z" fill="#3a3282"/></g>
<path class="bird" d="M200 260 q9 -9 18 0 q9 -9 18 0"/>
<path class="bird b" d="M260 300 q7 -7 14 0 q7 -7 14 0"/>
<path class="bird" style="animation-delay:-28s" d="M120 220 q6 -6 12 0 q6 -6 12 0"/>

<path d="${skyline(7, 650, 20, 90)}" fill="url(#bldg)" opacity=".55" filter="url(#soft2)"/>
<path d="${skyline(42, 660, 10, 55)}" fill="url(#bldg2)" opacity=".75" filter="url(#soft1)"/>
<g fill="#ffe3b5" opacity=".8" filter="url(#glow)">${windows(3, 40, 1560, 615, 650, 40)}</g>
<rect y="560" width="1600" height="130" fill="url(#haze)"/>
<ellipse cx="800" cy="660" rx="900" ry="40" fill="#ffc6dc" opacity=".35" filter="url(#soft4)"/>

<g fill="#6a5bbd" opacity=".85" filter="url(#soft2)">${palm(560, 652, 170, 10)}</g>
<g fill="#6a5bbd" opacity=".85" filter="url(#soft2)">${palm(1180, 652, 190, -12)}</g>
<g fill="#6a5bbd" opacity=".8" filter="url(#soft2)">${palm(1290, 655, 150, 8)}</g>

<g stroke="#2a2468" stroke-width="1.6" fill="none" opacity=".7" filter="url(#soft1)">
  <path d="M-40 420 Q130 470 300 405 Q580 478 860 405 Q1140 478 1420 405 Q1530 440 1640 420"/>
  <path d="M-40 440 Q130 488 300 425 Q580 496 860 425 Q1140 496 1420 425 Q1530 458 1640 440"/>
</g>
<g fill="#2a2468">
  <rect x="297" y="395" width="6" height="300"/><rect x="270" y="400" width="60" height="5"/>
  <rect x="857" y="395" width="6" height="200"/><rect x="830" y="400" width="60" height="5"/>
  <rect x="1417" y="395" width="6" height="300"/><rect x="1390" y="400" width="60" height="5"/>
</g>

<g>
  <rect x="440" y="604" width="400" height="86" fill="url(#roof)"/>
  <rect x="440" y="598" width="400" height="9" fill="#ffb3cf"/>
  <g class="glow" fill="#ffe2b8" filter="url(#glow)"><rect x="462" y="626" width="80" height="42"/><rect x="556" y="626" width="80" height="42"/><rect x="650" y="626" width="80" height="42"/></g>
  <rect x="750" y="630" width="34" height="60" fill="#ffd0a0"/>
  <g fill="#7a6cc8"><rect x="470" y="650" width="20" height="18"/><rect x="590" y="652" width="14" height="16"/><rect x="680" y="648" width="22" height="20"/></g>
</g>

<g>
  <polygon points="380,548 920,548 980,572 330,572" fill="url(#roof)"/>
  <rect x="330" y="572" width="650" height="14" fill="url(#under)" class="glow" filter="url(#glow)"/>
  <rect x="330" y="570" width="650" height="3" fill="url(#neon)" filter="url(#glow)"/>
  <rect x="330" y="568" width="650" height="7" fill="url(#neon)" opacity=".25"/>
  <polygon points="345,586 965,586 1015,690 295,690" fill="url(#beam)" opacity=".7" filter="url(#soft4)"/>
  <g fill="#2b2670"><rect x="392" y="586" width="12" height="104"/><rect x="906" y="586" width="12" height="104"/></g>
  <g><rect x="560" y="640" width="26" height="50" rx="3" fill="#5d52b0"/><rect x="564" y="646" width="18" height="10" fill="#ffe2b8"/>
     <rect x="720" y="640" width="26" height="50" rx="3" fill="#5d52b0"/><rect x="724" y="646" width="18" height="10" fill="#ffe2b8"/></g>
</g>

<g>
  <rect x="1046" y="520" width="8" height="170" fill="#2b2670"/>
  <rect x="1000" y="482" width="100" height="56" rx="6" fill="#2b2670"/>
  <rect x="996" y="478" width="108" height="64" rx="8" fill="none" stroke="url(#neon)" stroke-width="6" opacity=".25"/>
  <g class="flicker" filter="url(#glow)"><rect x="998" y="480" width="104" height="60" rx="7" fill="none" stroke="url(#neon)" stroke-width="2.5"/>
  <rect x="1012" y="494" width="76" height="10" rx="3" fill="#ff7fb8"/><rect x="1012" y="512" width="50" height="10" rx="3" fill="#7fe0f0"/></g>
</g>

<g>
  <g filter="url(#soft1)"><rect x="40" y="610" width="150" height="66" rx="4" fill="#5b55a8"/>
  <path d="M190 632 L238 632 Q254 634 260 652 L262 676 L190 676 Z" fill="#4a4496"/>
  <path d="M204 638 L236 638 Q246 640 250 654 L204 654 Z" fill="#a9a2e6" opacity=".8"/>
  <g fill="#211c56"><circle cx="78" cy="682" r="13"/><circle cx="112" cy="682" r="13"/><circle cx="226" cy="682" r="13"/></g>
</g></g>

<rect y="688" width="1600" height="212" fill="url(#road)"/>
<rect y="688" width="1600" height="3" fill="#ffc4dc" opacity=".9"/>
<rect x="1032" y="692" width="36" height="170" fill="url(#reflect)" filter="url(#soft4)"/>
<ellipse cx="655" cy="702" rx="400" ry="26" fill="#ffe6c4" opacity=".3" filter="url(#soft4)"/>
<g fill="#ffe8f3" opacity=".35" filter="url(#soft1)"><polygon points="730,770 870,770 880,778 720,778"/><polygon points="660,840 900,840 916,852 644,852"/></g>

<g>
  <path d="M1110 704 L1110 684 Q1110 670 1132 668 L1196 662 Q1222 638 1266 636 L1334 636 Q1366 640 1384 664 L1414 668 Q1436 672 1436 690 L1436 704 Z" fill="url(#carBody)"/>
  <path d="M1206 662 Q1228 646 1264 644 L1290 644 L1290 662 Z M1300 644 L1330 644 Q1352 648 1366 662 L1300 662 Z" fill="#8f86d8" opacity=".85"/>
  <rect x="1110" y="682" width="326" height="3" fill="#ffb3cf" opacity=".6" filter="url(#soft1)"/>
  <ellipse cx="1272" cy="726" rx="170" ry="8" fill="#120e38" opacity=".35" filter="url(#soft2)"/>
  <rect x="1428" y="676" width="8" height="6" fill="#ff5470" class="glow" filter="url(#glow)"/>
  <g fill="#171345"><circle cx="1170" cy="704" r="20"/><circle cx="1376" cy="704" r="20"/></g>
  <g fill="#6f66c4"><circle cx="1170" cy="704" r="8"/><circle cx="1376" cy="704" r="8"/></g>
</g>

<g class="palm" fill="url(#palmMid)">${palm(250, 700, 280, -16)}</g>
<g class="palm b" fill="url(#palmNear)">${palm(120, 920, 560, 34)}</g>
<g class="palm" fill="url(#palmNear)">${palm(1510, 920, 600, -40)}</g>

<rect width="1600" height="900" fill="url(#vignette)"/>
<rect width="1600" height="900" filter="url(#grain)" opacity=".06"/>
</svg>`

const HIDEABLE = [
  'UserMessage',
  'AssistantMessage',
  'ToolUse',
  'ToolResult',
  'ToolGroup',
  'CommandOutput',
  'InfoNotice',
  'TurnDuration',
  'ToolProgress',
] as const

export const register: Register = (on) => {
  let isTextHidden = false

  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    await $.command.register({
      name: 'dusk',
      description: 'Show the dusk scene: /dusk hide or show (the chat), /dusk clear, soft or full (the veil)',
    })
    const set = await $.theme.set(lookFor('full'))

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })

  on('command.run', { command: 'dusk' }, async ($, e) => {
    // Only the first word counts, so `/dusk clear please` works too.
    const arg = e.args.trim().toLowerCase().split(/\s+/)[0]

    if (arg === 'hide' || arg === 'show') {
      isTextHidden = arg === 'hide'
      await $.theme.set(lookFor(isTextHidden ? 'clear' : 'full'))
      $.ui.invalidate('ui.render')
      const message = isTextHidden
        ? 'Chat hidden: the scene is all yours. Type /dusk show to bring it back.'
        : 'Chat is back.'
      $.ui.toast(message)

      return { text: message }
    }

    if (arg !== 'clear' && arg !== 'soft' && arg !== 'full') {
      return {
        text: 'Usage: /dusk hide (hide the chat), /dusk show, or /dusk clear, soft, full (how much veil sits over the scene).',
      }
    }
    await $.theme.set(lookFor(arg))

    return { text: `Backdrop set to ${arg}.` }
  })

  // While hidden, every transcript row draws as an empty box. The conversation is untouched.
  for (const component of HIDEABLE) {
    on('ui.render', { component }, ($, e, next) => {
      if (!isTextHidden) {
        return next(e)
      }

      const { Box } = $.ui.resolve(e)

      return <Box />
    })
  }

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    // This hook hears every mod's backdrop: draw only our own scene, and only where scenes draw.
    if (e.props.plugin !== $.plugin.name || e.props.scene !== 'dusk') {
      return next(e)
    }

    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="A hazy pink-and-violet tropical dusk with palm trees and a roadside gas station" />
  })
}
