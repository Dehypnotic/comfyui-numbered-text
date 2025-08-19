# numbered_text_node.py
from __future__ import annotations
import re
from typing import Tuple

def _norm(s: str) -> str:
    return s.replace("\r\n", "\n").replace("\r", "\n")

def _strip_prefix(line: str) -> str:
    # Fjerner "n. " i starten (robust mot mellomrom)
    return re.sub(r'^\s*\d+\.\s*', '', line)

def _renumber(text: str) -> str:
    lines = _norm(text).split("\n")
    out = []
    for i, ln in enumerate(lines, start=1):
        out.append(f"{i}. {_strip_prefix(ln)}")
    return "\n".join(out)

def _get_line_from_numbered(text_numbered: str, idx: int) -> str:
    lines = _norm(text_numbered).split("\n")
    if idx < 1 or idx > len(lines):
        return ""
    return _strip_prefix(lines[idx - 1]).strip()

def _make_numbered_preview(text_numbered: str, max_lines: int = 50) -> str:
    """
    Readonly forhåndsvisning med linjenumre i venstre kolonne (│).
    Forventer allerede nummerert tekst som input.
    """
    lines = _norm(text_numbered).split("\n")[:max_lines]
    width = len(str(len(lines))) if lines else 1
    preview = []
    for i, ln in enumerate(lines, start=1):
        num = str(i).rjust(width)
        content = _strip_prefix(ln)
        preview.append(f"{num}. {content}")
    return "\n".join(preview)

class NumberedText:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "text": ("STRING", {
                    "multiline": True,
                    "default": "1. ",
                    "placeholder": "Write text. Each line is numbered when run.",
                }),
                "selected_line": ("INT", {
                    "default": 1, "min": 1, "max": 1_000_000, "step": 1,
                }),
                "preview_max_lines": ("INT", {
                    "default": 50, "min": 1, "max": 500, "step": 1,
                }),
            }
        }

    RETURN_TYPES = ("STRING", "STRING")
    RETURN_NAMES = ("selected_text", "numbered_preview")
    FUNCTION = "run"
    CATEGORY = "text/utils"

    def run(self, text: str, selected_line: int, preview_max_lines: int) -> Tuple[str, str]:
        numbered = _renumber(text)
        selected = _get_line_from_numbered(numbered, selected_line)
        preview = _make_numbered_preview(numbered, max_lines=preview_max_lines)
        return (selected, preview)

NODE_CLASS_MAPPINGS = {
    "NumberedText": NumberedText,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "NumberedText": "Numbered Text",
}
