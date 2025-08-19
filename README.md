# Numbered Text (ComfyUI custom node)
Simple node for handling multi-line text with automatic line numbering and extracting a selected line.

Always auto-numbers lines (1., 2., 3., …)

Pick a line via 1-based index and output only that line’s content (without the “n. ” prefix)

Read-only “gutter”-style preview with line numbers on the left, intended for display nodes

<img width="498" height="290" alt="image" src="https://github.com/user-attachments/assets/a2be26e3-df46-440b-87d9-15baea145151" />

---

### Installation
Copy the numbered_text_node folder to ComfyUI/custom_nodes/

Restart ComfyUI.

The node appears under category: text/utils with the name: “Numbered Multiline Text”.

---

### Usage
Add the “Numbered Multiline Text” node.

Type in the text field (multiline). Numbering is applied when the graph runs.

Set selected_line to the line to extract (1-based).

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
