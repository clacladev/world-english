#!/bin/sh
# World English Agent Skill installer.
#
# Downloads skills/world-english-translator/ from the repo and installs it to a neutral,
# agent-agnostic home so any coding agent that can read files can use it. Claude Code is wired up
# automatically via a symlink; other agents get printed a path to point at.
#
#   curl -fsSL https://worldenglish.tugulab.org/install.sh | sh
#
# Options:
#   --claude       force-install the Claude Code symlink, even if ~/.claude doesn't exist yet
#   --no-claude    skip the Claude Code symlink
#   --cron         install a weekly (Monday 09:00) cron job that re-runs this installer
#
# Env:
#   AGENTS_HOME    neutral skills home (default: ~/.agents)
#
# Safe to re-run: it re-downloads the skill and refreshes the symlink in place.

set -eu

REPO="clacladev/world-english"
BRANCH="dev"
SKILL_NAME="world-english-translator"
AGENTS_HOME="${AGENTS_HOME:-$HOME/.agents}"
SKILL_DEST="$AGENTS_HOME/skills/$SKILL_NAME"
ONE_LINER="curl -fsSL https://worldenglish.tugulab.org/install.sh | sh"
CRON_MARKER="# world-english-translator weekly update"

want_claude="auto"
want_cron=0

usage() {
  cat <<'EOF'
Usage: install.sh [--claude|--no-claude] [--cron]

  --claude       force-install the Claude Code symlink
  --no-claude    skip the Claude Code symlink
  --cron         install a weekly auto-update cron job
EOF
}

for arg in "$@"; do
  case "$arg" in
    --claude) want_claude="yes" ;;
    --no-claude) want_claude="no" ;;
    --cron) want_cron=1 ;;
    -h | --help)
      usage
      exit 0
      ;;
    *)
      echo "install.sh: unknown option: $arg" >&2
      usage >&2
      exit 1
      ;;
  esac
done

case "$SKILL_DEST" in
  "" | "/" | "$HOME")
    echo "install.sh: refusing to install to '$SKILL_DEST' — check \$AGENTS_HOME" >&2
    exit 1
    ;;
esac

if ! command -v curl >/dev/null 2>&1; then
  echo "install.sh: curl is required" >&2
  exit 1
fi
if ! command -v tar >/dev/null 2>&1; then
  echo "install.sh: tar is required" >&2
  exit 1
fi

tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT
tarball="$tmp_dir/world-english.tar.gz"

echo "install.sh: downloading $REPO@$BRANCH ..."
curl -fsSL "https://github.com/$REPO/archive/refs/heads/$BRANCH.tar.gz" -o "$tarball"

rm -rf "$SKILL_DEST"
mkdir -p "$SKILL_DEST"
tar -xzf "$tarball" -C "$SKILL_DEST" --strip-components=3 "world-english-$BRANCH/skills/$SKILL_NAME"

if [ ! -f "$SKILL_DEST/SKILL.md" ]; then
  echo "install.sh: extraction failed — $SKILL_DEST/SKILL.md not found" >&2
  exit 1
fi
echo "install.sh: installed to $SKILL_DEST"

should_wire_claude() {
  case "$want_claude" in
    yes) return 0 ;;
    no) return 1 ;;
    auto) [ -d "$HOME/.claude" ] ;;
  esac
}

if should_wire_claude; then
  claude_skills_dir="$HOME/.claude/skills"
  link_path="$claude_skills_dir/$SKILL_NAME"
  mkdir -p "$claude_skills_dir"
  if [ -L "$link_path" ]; then
    rm -f "$link_path"
    ln -s "$SKILL_DEST" "$link_path"
    echo "install.sh: refreshed Claude Code symlink at $link_path"
  elif [ -e "$link_path" ]; then
    echo "install.sh: $link_path already exists and is not a symlink — leaving it alone." >&2
    echo "install.sh: link it manually if you want Claude Code to use this copy:" >&2
    echo "  ln -s \"$SKILL_DEST\" \"$link_path\"" >&2
  else
    ln -s "$SKILL_DEST" "$link_path"
    echo "install.sh: linked Claude Code at $link_path"
  fi
fi

echo "install.sh: for any other agent, point it at:"
echo "  $SKILL_DEST/SKILL.md"

install_cron() {
  if ! command -v crontab >/dev/null 2>&1; then
    echo "install.sh: crontab not found — skipping --cron. On Windows, use Task Scheduler; see the /skills page." >&2
    return 0
  fi
  existing="$(crontab -l 2>/dev/null || true)"
  filtered="$(printf '%s\n' "$existing" | grep -v "$CRON_MARKER" || true)"
  new_line="0 9 * * 1 $ONE_LINER $CRON_MARKER"
  printf '%s\n%s\n' "$filtered" "$new_line" | grep -v '^$' | crontab -
  echo "install.sh: weekly auto-update installed (Mondays 09:00)."
}

if [ "$want_cron" -eq 0 ] && [ -r /dev/tty ]; then
  printf "install.sh: install a weekly auto-update via cron? [y/N] " >/dev/tty
  reply=""
  read -r reply </dev/tty 2>/dev/null || reply=""
  case "$reply" in
    y | Y | yes | Yes) want_cron=1 ;;
  esac
fi
[ "$want_cron" -eq 1 ] && install_cron

echo "install.sh: done."
