# Leonida Dusk — a theme mod for Claude Code

A hazy tropical dusk theme for the Claude Code desktop app: a periwinkle-to-pink sky, drifting clouds, palms, power lines, a roadside gas station with a neon sign, parked cars, and hot-pink accents on blue-violet surfaces. Dark mode only.

All artwork is drawn from scratch as inline SVG; no third-party images, logos or fonts are used.

## Requirements

- Claude Code v2.1.323 or later (tested with v2.1.325)
- The Claude Code desktop or mobile app. The terminal draws no backdrop.

## Try it in one session

Send this prompt in a Claude Code desktop session. The theme loads for that session only, nothing is installed. If the app asks whether to turn on the mods Claude writes in the session, choose **Turn them on**.

```
Clone https://github.com/chatgptonmarketing/Leonida-theme-mod.git to ~/leonida-dusk, check the code is safe, then load it as a mod for this session only (use the plugin-authoring skill, no permanent install).
```

## Install

At the prompt of a terminal session:

```
/plugin install leonida-dusk --marketplace chatgptonmarketing/Leonida-theme-mod
```

From a shell:

```
claude plugin install leonida-dusk --marketplace chatgptonmarketing/Leonida-theme-mod
```

In the desktop app, plugins are under **+** next to the prompt box, then **Add plugins** (or **Plugins**, then **Browse plugins**). See the [desktop docs](https://code.claude.com/docs/en/desktop#install-plugins).

To load it from a local copy for one terminal session:

```
claude --plugin-dir ~/leonida-dusk
```

## Commands

- `/dusk hide` hides the chat so you can see the whole scene; `/dusk show` brings it back
- `/dusk clear`, `/dusk soft`, `/dusk full` set how much frosted veil sits over the scene (`full` is the default)

## Customize

Colors and the scene live in `hooks/register.tsx`. The palette is built with `hooks/make-colors.js`, which checks contrast for you.

## License

MIT, see [LICENSE](LICENSE).
