---
name: record-demo
description: Record or regenerate the mcpc demo GIFs (the README hero docs/images/mcpc-demo.gif and the focused tapes in docs/vhs/) with VHS. Use whenever asked to create, refresh, restyle, shorten, or fix a terminal demo/animation/GIF of mcpc. The tapes drive real mcpc commands; for the authenticated step this skill ALWAYS prompts for a short-lived, low-permission TEST token first (never production). Captures the VHS + mcpc gotchas learned the hard way — read it fully before editing a tape.
allowed-tools: Bash, Read, Write, Edit, AskUserQuestion
---

# record-demo: VHS demo GIFs for mcpc

The tapes in `docs/vhs/*.tape` are [VHS](https://github.com/charmbracelet/vhs)
scripts that drive a **real** shell session — VHS types each command, runs it
against a live MCP server, captures the terminal, and renders a GIF. The README
hero is `docs/images/mcpc-demo.gif`, built from `docs/vhs/mcpc-demo.tape`.

**Read all of it before touching a tape** — most rules below were discovered by
hitting the wall, and skipping them wastes whole render cycles (~1–2 min each).

## The hero flow (`mcpc-demo.tape`)

A basic-use story across both transports:

1. `mcpc` — empty state (no sessions, no profiles)
2. `mcpc connect mcp.json:filesystem` — local **stdio** server (auto-names `@filesystem`)
3. `mcpc` — session list (now shows the live session)
4. `mcpc @filesystem tools-list`
5. `mcpc @filesystem tools-list --json` — JSON output, syntax-highlighted, no jq
6. `mcpc connect mcp.apify.com -H "Authorization: ******"` — remote **HTTP** server (auto-names `@apify`)
7. `mcpc @apify tools-list`
8. `mcpc @apify tools-get search-actors` — inspect one tool's input schema
9. `mcpc @apify tools-call search-actors keywords:="web scraper" limit:=3`
10. `mcpc @apify close`

Ten commands run ~45s; there is no hard 30s cap for this flow.

## Style conventions

- **No `# comments`** in the visible script.
- **No `| head`, no `2>/dev/null`** on visible commands. Show real output even if long.
- **Continuous session — never `clear` between steps.** Put a single blank-line
  `Enter` before each command so it's separated from the previous output.
- **Colored prompt + bold-white typed commands.** In the hidden setup block:
  ```
  Type 'export PS1="\[\e[1;38;2;25;230;77m\]$\[\e[0m\] \[\e[1;97m\]"'
  Enter
  Type "trap 'tput sgr0' DEBUG"
  Enter
  ```
- **Empty state** needs a clean home — hidden: `Type 'export MCPC_HOME_DIR="$(mktemp -d)"'`
  so `mcpc` shows "No active MCP sessions / No OAuth profiles".

## VHS gotchas (these will bite you)

- **ASCII prompt symbols only.** Multibyte glyphs (`❯`, `»`, `▶`) break bash prompt
  rendering under VHS and show up as garbage. Use `$` (or `>`), styled with color + bold.
- **`Type` quoting:** use **single quotes** around any command containing double
  quotes. A `\"` inside a double-quoted `Type` breaks VHS's parser.
- **Output/Screenshot paths:** must not start with a digit and must not be long absolute
  paths. Use short, letter-leading, **relative** names and run `vhs` from `docs/vhs/`.
- **`Screenshot` is unreliable** (frequently exits 2 even though the GIF rendered
  fine). Don't depend on it — pull frames from the finished GIF instead:
  `ffmpeg -y -ss <seconds> -i x.gif -vframes 1 frame.png`, then Read the PNG.
- **Renders are slow** (~1–2 min each). Render tapes **one at a time**.
- **Hidden connects leak into the recording if bash falls behind.** Pattern that
  works: type the connect(s), then **one generous `Sleep` (7–8s)**, then `clear`,
  then **another `Sleep` (~1.5s) before `Show`**.

## Stdio servers in a headless / proxied box

- **`npx`-launched stdio servers are too slow here.** Use pre-installed binaries
  (e.g., `npm i -g @modelcontextprotocol/server-filesystem`, starts in ~0.3s).
- **Puppeteer does NOT work for headless recording.** Use
  `@modelcontextprotocol/server-filesystem` instead.

## Auth token (the authenticated step)

- **Always prompt for the token first.** Insist on a **short-lived,
  low-permission token from a TEST / throwaway account — never production.**
- Pass it inline, for the render only: `APIFY_TOKEN=… vhs mcpc-demo.tape`. The
  tape references `$APIFY_TOKEN` (never the literal), typed inside **single quotes**.
  The value is **never on screen, never in the GIF, never committed**.
- **Revoke the token as soon as the recording is done.**

## Prerequisites

```bash
mcpc --version            # the CLI being demoed
vhs --version             # brew install vhs (needs ttyd + ffmpeg on PATH)
mcp-server-filesystem     # npm i -g @modelcontextprotocol/server-filesystem
```

## Render and verify

```bash
cd docs/vhs
APIFY_TOKEN=…   vhs mcpc-demo.tape
ffprobe -v error -show_entries format=duration -of csv=p=0 mcpc-demo.gif   # check length
ffmpeg -y -ss 12 -i mcpc-demo.gif -vframes 1 /tmp/f.png             # spot-check a frame
cp mcpc-demo.gif ../images/mcpc-demo.gif                            # update the README hero
```

## Optimize the GIF size (do this before committing)

```bash
for f in docs/images/mcpc-demo.gif docs/vhs/*.gif; do
  [ "$f" = docs/vhs/mcpc-demo.gif ] && continue
  gifsicle -O3 --lossy=200 -b "$f"
done
```

After optimizing, bump the README cache-buster (`mcpc-demo.gif?v=N` → `?v=N+1`).

## The tapes

| Tape | Records |
| ---- | ------- |
| `mcpc-demo.tape` | Hero basic-use flow (stdio + remote) → `docs/images/mcpc-demo.gif` |
| `quickstart.tape` | Minimal connect → list → call |
| `tools.tape` | `tools-list` / `tools-get` / `tools-call`, inline JSON, stdin |
| `scripting.tape` | `--json` piped through `jq` (code mode) |
| `grep.tape` | Dynamic tool discovery with `mcpc grep` across two sessions |
| `proxy.tape` | MCP proxy / AI sandboxing (keeps a bearer token on purpose) |
