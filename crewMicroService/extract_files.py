#!/usr/bin/env python3
"""
Extract file blocks from a CrewAI agent's markdown output into real files on disk.

Handles TWO different file-marker conventions, since different agents in the
same crew don't always follow the same format:

  Format A (used by frontendTask output):
      ### FILE: some/path.ext
      ```lang
      <content>
      ```

  Format B (used by backendTask output):
      **File: `some/path.ext`**

      ```lang
      <content>
      ```

Usage:
    python3 extract_files.py response.json ./output_dir

Expects response.json shaped like:
{
  "success": true,
  "result": {
    "architechture :": "...markdown...",
    "frontend :": "...markdown with FILE blocks...",
    "backend : ": "...markdown with FILE blocks..."
  }
}
"""

import json
import re
import sys
from pathlib import Path

# Format A: ### FILE: path\n```lang\n<content>\n```
FILE_BLOCK_RE_A = re.compile(
    r"###\s*FILE:\s*(?P<path>\S.*?)\s*\n"
    r"```[a-zA-Z0-9_+-]*\n"
    r"(?P<content>.*?)"
    r"\n```",
    re.DOTALL,
)

# Format B: **File: `path`**\n\n```lang\n<content>\n```
# (also tolerates "File:" without leading **, and path with or without backticks)
FILE_BLOCK_RE_B = re.compile(
    r"\*{0,2}File:\*{0,2}\s*`?(?P<path>[^`\n*]+?)`?\*{0,2}\s*\n+"
    r"```[a-zA-Z0-9_+-]*\n"
    r"(?P<content>.*?)"
    r"\n```",
    re.DOTALL,
)


def extract_blocks(text: str):
    """Yield (relative_path, content) tuples found in text, trying both formats."""
    seen_spans = []

    for pattern in (FILE_BLOCK_RE_A, FILE_BLOCK_RE_B):
        for m in pattern.finditer(text):
            # Skip overlapping matches already captured by the other pattern
            span = m.span()
            if any(s[0] <= span[0] < s[1] for s in seen_spans):
                continue
            seen_spans.append(span)
            path = m.group("path").strip()
            content = m.group("content")
            yield path, content


def write_files(text: str, out_dir: Path, subdir: str = ""):
    count = 0
    for rel_path, content in extract_blocks(text):
        rel_path = rel_path.lstrip("/\\")
        # Avoid double-nesting when the extracted path already starts with
        # the subdir name (e.g. path "backend/src/app.ts" going into subdir "backend"
        # would otherwise become backend/backend/src/app.ts)
        if subdir and (rel_path == subdir or rel_path.startswith(subdir + "/")):
            rel_path = rel_path[len(subdir):].lstrip("/\\")
        target = out_dir / subdir / rel_path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content, encoding="utf-8")
        print(f"  wrote {target}")
        count += 1
    return count


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    src_path = Path(sys.argv[1])
    out_dir = Path(sys.argv[2])
    out_dir.mkdir(parents=True, exist_ok=True)

    raw_mode = "--raw" in sys.argv

    if raw_mode:
        text = src_path.read_text(encoding="utf-8")
        n = write_files(text, out_dir)
        print(f"\nExtracted {n} file(s) into {out_dir}")
        return

    data = json.loads(src_path.read_text(encoding="utf-8"))
    result = data.get("result", data)

    total = 0

    for key in result:
        norm_key = key.strip().rstrip(":").strip().lower()
        value = result[key]
        if not isinstance(value, str):
            continue

        if norm_key in ("architechture", "architecture"):
            arch_path = out_dir / "ARCHITECTURE.md"
            arch_path.write_text(value, encoding="utf-8")
            print(f"  wrote {arch_path}")
            total += 1
        elif norm_key in ("frontend", "backend"):
            n = write_files(value, out_dir, subdir=norm_key)
            if n == 0:
                # No FILE blocks matched at all -> dump raw so nothing is silently lost
                fallback = out_dir / f"{norm_key}_RAW.md"
                fallback.write_text(value, encoding="utf-8")
                print(f"  WARNING: no file blocks matched for '{norm_key}', dumped raw to {fallback}")
                total += 1
            else:
                print(f"  ({n} {norm_key} file(s) extracted)")
                total += n
        else:
            n = write_files(value, out_dir, subdir=norm_key or "misc")
            if n == 0:
                fallback = out_dir / f"{norm_key or 'output'}.md"
                fallback.write_text(value, encoding="utf-8")
                print(f"  wrote {fallback} (no FILE blocks found, dumped raw)")
                total += 1
            else:
                total += n

    print(f"\nExtracted {total} file(s)/doc(s) into {out_dir}")


if __name__ == "__main__":
    main()