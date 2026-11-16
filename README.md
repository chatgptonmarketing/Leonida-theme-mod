# Miami Dusk — a theme mod for Claude Code

A hazy tropical dusk theme for the Claude desktop app: a periwinkle-to-pink sky, drifting clouds, swaying palms, a retro roadside gas station with a neon sign, and hot-pink accents on blue-violet surfaces. Dark mode only.

All artwork is drawn from scratch as inline SVG; no third-party images, logos or fonts are used.

## Install

At the prompt of a terminal session:

```
/plugin install miami-dusk --marketplace chatgptonmarketing/Leonida-theme-mod
```

From a shell:

```
claude plugin install miami-dusk --marketplace chatgptonmarketing/Leonida-theme-mod
```

In the desktop app, where `/plugin` does not run: click **+** next to the prompt box, then **Plugins**, **Add marketplace** with `chatgptonmarketing/Leonida-theme-mod`, then **Add plugin**.

## Customize

Colors and the scene live in `hooks/register.tsx`. The palette is built with `hooks/make-colors.js`, which checks contrast for you.

The theme only draws in the desktop and mobile apps, not in a terminal.
