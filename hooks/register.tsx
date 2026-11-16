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

const LOOK: ThemeSetArgs = {
  colors: theme,
  overrideColorScheme: 'dark',
  backdrop: { scene: 'dusk', glass: { blur: 10, tint: '#171433', opacity: 0.55 } },
}

type Pt = [number, number]

// A palm: curved trunk and ten drooping fronds, all one flat silhouette colour.
function palm(x: number, base: number, h: number, lean: number): string {
  const top: Pt = [x + lean, base - h]
  const trunk = `<path d="M${x - 5} ${base} Q${x + lean * 0.2} ${base - h * 0.55} ${top[0] - 2} ${top[1]} L${top[0] + 3} ${top[1]} Q${x + lean * 0.2 + 8} ${base - h * 0.55} ${x + 5} ${base} Z"/>`
  const fronds = [195, 220, 245, 270, 295, 320, 345, 10, 165, 140]
    .map(a => {
      const r = (a * Math.PI) / 180
      const len = h * (0.42 + 0.1 * Math.abs(Math.sin(a)))
      const dx = Math.cos(r)
      const dy = Math.sin(r)
      const end: Pt = [top[0] + dx * len, top[1] + dy * len + len * 0.38]
      const mid: Pt = [top[0] + dx * len * 0.5, top[1] + dy * len * 0.5 - len * 0.22]
      const w = len * 0.1
      const c1: Pt = [mid[0] - dy * w, mid[1] + dx * w]
      const c2: Pt = [mid[0] + dy * w, mid[1] - dx * w]
      return `<path d="M${top[0]} ${top[1]} Q${c1[0].toFixed(0)} ${c1[1].toFixed(0)} ${end[0].toFixed(0)} ${end[1].toFixed(0)} Q${c2[0].toFixed(0)} ${c2[1].toFixed(0)} ${top[0]} ${top[1]} Z"/>`
    })
    .join('')
  return `${trunk}${fronds}`
}

const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#4f45b8"/>
    <stop offset="0.35" stop-color="#8670d0"/>
    <stop offset="0.62" stop-color="#d98ac8"/>
    <stop offset="0.78" stop-color="#ff9fc2"/>
    <stop offset="1" stop-color="#ffc4b0"/>
  </linearGradient>
  <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#a99be6"/>
    <stop offset="0.5" stop-color="#7d73cc"/>
    <stop offset="1" stop-color="#2a2468"/>
  </linearGradient>
  <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffb3cf" stop-opacity="0"/>
    <stop offset="1" stop-color="#ffb3cf" stop-opacity="0.55"/>
  </linearGradient>
  <linearGradient id="neon" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#ff5fa2"/><stop offset="1" stop-color="#5fd4e8"/>
  </linearGradient>
</defs>
<style>
  .cloud { fill: #ffd0e6; opacity: .28; animation: drift 60s linear infinite alternate; }
  .cloud.b { animation-duration: 90s; opacity: .2; }
  @keyframes drift { from { transform: translateX(-40px) } to { transform: translateX(60px) } }
  .palm { fill: #2b2670; transform-box: fill-box; transform-origin: 50% 100%; animation: sway 7s ease-in-out infinite; }
  .palm.far { fill: #5a4fb0; opacity: .85; animation-duration: 9s; animation-delay: -3s; }
  .palm.p2 { animation-delay: -2s; }
  @keyframes sway { 0%,100% { transform: rotate(-1.2deg) } 50% { transform: rotate(1.4deg) } }
  .glow { animation: glow 3.2s ease-in-out infinite; }
  @keyframes glow { 0%,100% { opacity: .65 } 50% { opacity: 1 } }
  .bird { fill: none; stroke: #2b2670; stroke-width: 2; stroke-linecap: round; animation: fly 24s linear infinite; }
  @keyframes fly { from { transform: translateX(-60px) } to { transform: translateX(1700px) } }
</style>
<rect width="1600" height="900" fill="url(#sky)"/>
<ellipse class="cloud" cx="330" cy="150" rx="420" ry="16"/>
<ellipse class="cloud b" cx="1120" cy="230" rx="520" ry="12"/>
<ellipse class="cloud" cx="760" cy="330" rx="360" ry="10"/>
<ellipse class="cloud b" cx="1350" cy="400" rx="300" ry="9"/>
<path class="bird" d="M300 250 q10 -10 20 0 q10 -10 20 0"/>
<path class="bird" style="animation-delay:-8s" d="M300 290 q8 -8 16 0 q8 -8 16 0"/>
<rect y="520" width="1600" height="160" fill="url(#haze)"/>
<path d="M0 640 L0 600 L90 600 L90 575 L170 575 L170 610 L260 610 L260 585 L330 585 L330 640 Z" fill="#8f82d6" opacity=".7"/>
<path d="M1150 640 L1150 590 L1230 590 L1230 560 L1300 560 L1300 605 L1400 605 L1400 580 L1480 580 L1480 625 L1600 625 L1600 640 Z" fill="#8f82d6" opacity=".7"/>
<g class="palm far">${palm(520, 650, 190, 12)}</g>
<g class="palm far">${palm(1090, 650, 210, -14)}</g>
<g>
  <rect x="560" y="610" width="620" height="60" fill="#4a418f"/>
  <rect x="560" y="606" width="620" height="6" fill="#ff9fc2"/>
  <rect x="600" y="628" width="90" height="34" fill="#ffd9a8" class="glow"/>
  <rect x="720" y="628" width="90" height="34" fill="#ffd9a8" class="glow"/>
  <rect x="840" y="628" width="90" height="34" fill="#ffd9a8" class="glow"/>
  <polygon points="470,556 1010,556 1100,586 380,586" fill="#3a3380"/>
  <polygon points="380,586 1100,586 1100,598 380,598" fill="#2b2670"/>
  <rect x="380" y="590" width="720" height="4" fill="url(#neon)" class="glow"/>
  <rect x="520" y="598" width="14" height="76" fill="#2b2670"/>
  <rect x="940" y="598" width="14" height="76" fill="#2b2670"/>
  <rect x="650" y="640" width="26" height="36" fill="#6b5fc4"/>
  <rect x="780" y="640" width="26" height="36" fill="#6b5fc4"/>
</g>
<g>
  <rect x="1180" y="560" width="8" height="120" fill="#2b2670"/>
  <rect x="1150" y="548" width="70" height="26" rx="4" fill="#2b2670"/>
  <rect x="1156" y="554" width="58" height="14" rx="3" fill="url(#neon)" class="glow"/>
</g>
<path d="M60 690 L60 662 Q60 648 84 646 L180 640 Q200 620 250 620 L330 620 Q372 622 390 648 L412 650 Q430 654 430 672 L430 690 Z" fill="#33529a"/>
<rect y="672" width="1600" height="228" fill="url(#road)"/>
<rect y="672" width="1600" height="3" fill="#ffb3cf" opacity=".8"/>
<ellipse cx="800" cy="720" rx="520" ry="22" fill="#ffc4e0" opacity=".25"/>
<rect x="700" y="802" width="200" height="6" rx="3" fill="#ffe3f0" opacity=".35"/>
<g class="palm">${palm(130, 790, 360, 26)}</g>
<g class="palm p2">${palm(1480, 800, 400, -30)}</g>
<g class="palm far">${palm(1330, 700, 170, -10)}</g>
</svg>`

export const register: Register = (on) => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    const set = await $.theme.set(LOOK)

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="A hazy pink-and-violet tropical dusk with palm trees and a roadside gas station" />
  })
}
