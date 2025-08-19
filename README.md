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

<img width="877" height="488" alt="image" src="https://github.com/user-attachments/assets/5145db71-27b8-4357-836f-64819606f69b" />

---

### Customization
Change default text: set the input default to “” if you don’t want to start with “1. ”.

Skip blank lines in numbering: adjust _renumber to filter empty lines before numbering.

Also return the line index: add an extra INT output passing through selected_line.

---

### License
MIT License. Feel free to modify; please keep attribution.
