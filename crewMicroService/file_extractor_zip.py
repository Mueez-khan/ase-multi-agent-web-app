#!/usr/bin/env python3
"""
file_extractor_zip.py

Same extraction logic as file_extractor.py, but instead of writing loose
files to disk, it builds a ZIP archive entirely in memory (io.BytesIO) and
returns the raw zip bytes — ready to send straight to a client as a
downloadable file, with nothing left behind on the server's disk.

Usage:

    from file_extractor_zip import extract_to_zip_bytes

    result = {
        "architecture": "...",
        "frontend": "...",
        "backend": "...",
    }
    zip_bytes = extract_to_zip_bytes(result)

    # zip_bytes is a `bytes` object - write it, return it in an HTTP
    # response, whatever you need.
"""

import io
import re
import zipfile

FILE_BLOCK_RE_A = re.compile(
    r"###\s*FILE:\s*(?P<path>\S.*?)\s*\n"
    r"```[a-zA-Z0-9_+-]*\n"
    r"(?P<content>.*?)"
    r"\n```",
    re.DOTALL,
)

FILE_BLOCK_RE_B = re.compile(
    r"\*{0,2}File:\*{0,2}\s*`?(?P<path>[^`\n*]+?)`?\*{0,2}\s*\n+"
    r"```[a-zA-Z0-9_+-]*\n"
    r"(?P<content>.*?)"
    r"\n```",
    re.DOTALL,
)


def _extract_blocks(text: str):
    seen_spans = []
    for pattern in (FILE_BLOCK_RE_A, FILE_BLOCK_RE_B):
        for m in pattern.finditer(text):
            span = m.span()
            if any(s[0] <= span[0] < s[1] for s in seen_spans):
                continue
            seen_spans.append(span)
            yield m.group("path").strip(), m.group("content")


def _zip_write_files(zf: zipfile.ZipFile, text: str, subdir: str = ""):
    count = 0
    for rel_path, content in _extract_blocks(text):
        rel_path = rel_path.lstrip("/\\")
        if subdir and (rel_path == subdir or rel_path.startswith(subdir + "/")):
            rel_path = rel_path[len(subdir):].lstrip("/\\")
        arcname = f"{subdir}/{rel_path}" if subdir else rel_path
        zf.writestr(arcname, content)
        count += 1
    return count


def extract_to_zip_bytes(result: dict) -> bytes:
    """
    Extract a crew result dict into an in-memory ZIP archive.

    result: dict like {"architecture": "...", "frontend": "...", "backend": "..."}
            (also tolerates messier key names like "architechture :", "backend : ")

    Returns: raw zip file content as bytes (nothing written to disk).
    """
    buffer = io.BytesIO()

    with zipfile.ZipFile(buffer, mode="w", compression=zipfile.ZIP_DEFLATED) as zf:
        for key, value in result.items():
            if not isinstance(value, str):
                continue
            norm_key = key.strip().rstrip(":").strip().lower()

            if norm_key in ("architechture", "architecture"):
                zf.writestr("ARCHITECTURE.md", value)

            elif norm_key in ("frontend", "backend"):
                n = _zip_write_files(zf, value, subdir=norm_key)
                if n == 0:
                    zf.writestr(f"{norm_key}_RAW.md", value)

            else:
                n = _zip_write_files(zf, value, subdir=norm_key or "misc")
                if n == 0:
                    zf.writestr(f"{norm_key or 'output'}.md", value)

    buffer.seek(0)
    return buffer.getvalue()
