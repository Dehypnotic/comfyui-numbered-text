# Numbered Text (ComfyUI custom node)
Simple node for handling multi-line text with automatic line numbering and extracting a selected line.

Always auto-numbers lines (1., 2., 3., …)

Pick a line via 1-based index and output only that line’s content (without the “n. ” prefix)

Read-only “gutter”-style preview with line numbers on the left, intended for display nodes

---

### Contents
numbered_text_node/

numbered_text_node.py

init.py

README.md

---

### Installation
Copy the numbered_text_node folder to:

ComfyUI/custom_nodes/numbered_text_node/

Restart ComfyUI.

The node appears under category: text/utils with the name: “Numbered Multiline Text”.

---

### Usage
Add the “Numbered Multiline Text” node.

Type in the text field (multiline). Numbering is applied when the graph runs.

Set selected_line to the line to extract (1-based).

---

### Connect:

selected_text to downstream nodes that expect a plain string.

numbered_preview to a display node (e.g., “Show Text”/“Print Text”) to see numbered lines in a left column.

Tip: Place the display node visually next to this node for a “gutter” feel.

---

### Inputs
text (STRING, multiline)

The text itself. No numbers needed; the node numbers on execution.

selected_line (INT)

1-based line index to extract. Out-of-range values return an empty string.

preview_max_lines (INT)

How many lines to show in the preview (default 50).

---

### Outputs
selected_text (STRING)

Only the content of the selected line, without the “n. ” prefix and trimmed.

numbered_preview (STRING)

Read-only preview with a left line-number column: “ 1│text”, “ 2│text”, …

---

### Example
text:

Hello

There

This is a test

selected_line: 2

### Outputs:

selected_text: “There”

numbered_preview:

“1│Hello”

“2│There”

“3│This is a test”

(Render this nicely with a text display node.)

---

### Design choices and limitations
Numbering happens server-side when the graph evaluates, not live inside the input field. ComfyUI custom nodes can’t modify frontend behavior without a small JS extension.

numbered_preview is meant for display nodes and updates on run. For true live line numbers inside the input, a frontend module (JS/CSS) is required.

---

### Customization
Change default text: set the input default to “” if you don’t want to start with “1. ”.

Skip blank lines in numbering: adjust _renumber to filter empty lines before numbering.

Also return the line index: add an extra INT output passing through selected_line.

---

### License
MIT License. Feel free to modify; please keep attribution.
