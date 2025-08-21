# Numbered Text (ComfyUI custom node)
Simple node for handling multi-line text with automatic numbering and extracting a selected text.

A new text division is created for every Return (CR).

Pick a text divison via the index and output only that text’s content (without the optional “n. ” prefix). Alternatively select several text divisions, seperated by the separator.



<img width="604" height="454" alt="image" src="https://github.com/user-attachments/assets/8bbd5670-3355-4150-89e3-5320e45b5bbd" />

---

### Inputs
- String of the whole text.
- Integer of selected text.
- String of comma separated text divisions.
- String of optional separator.
- Integer of max text divisions for the numbered text output.

### Outputs

- String of selected text division(s).
- String of the whole text, numbered and limited by the max value

---

### Installation
Copy the node folder to ComfyUI/custom_nodes/

Restart ComfyUI.

The node appears under category: text/utils with the name: “Numbered Text”.

---

### Example

<img width="998" height="434" alt="image" src="https://github.com/user-attachments/assets/2e075ca1-e887-47ac-8558-c7e2f4e87553" />

<img width="1010" height="429" alt="image" src="https://github.com/user-attachments/assets/d0a75868-f6d1-4fb6-b6f0-0bd8764370ce" />



---

### License
MIT License. Feel free to modify; please keep attribution.
