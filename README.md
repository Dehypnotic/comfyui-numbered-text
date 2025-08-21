# Numbered Text (ComfyUI custom node)
Node for handling text with automatic numbering of divisions and extraction of selected division(s).

A new text division is created for every Return (CR).

Pick a text divison via the index and output only that text’s content (without the optional “n. ” prefix). Alternatively select several text divisions and an optional separator string.

Lightweight, no additional dependencies

---

<img width="604" height="454" alt="image" src="https://github.com/user-attachments/assets/8bbd5670-3355-4150-89e3-5320e45b5bbd" />

---

## Usage ideas
I find it useful for prompts. You get a new idea, hit enter and start anew without discarding the old; select, go back, combine; or you can load/paste a list of frequently used prompts and save/copy them for later. May also be useful in combination with a save node for several disk locations, etc.

---

## Installation
### 1. Copy the folder to ComfyUI/custom_nodes/

```bashcd
git clone https://github.com/dehypnotic/comfyui-numbered-text.git
```

Restart ComfyUI.

Double-click and search for “Numbered Text”.

### 2. Installation via ComfyUI Manager
> ⚠ Note: Installing via Manager requires that your `security_level` in `config.ini` is set to `weak` (default is `high`), due to external URL restrictions.

1. Set `security_level = weak` in `ComfyUI\user\default\ComfyUI-Manager\config.ini`
2. Open ComfyUI Manager → Install from URL
3. Paste the repository URL:  
   `https://github.com/Dehypnotic/comfyui-range-to-string.git`
4. Press **Install** and restart ComfyUI if necessary.

---

### Examples

<img width="1010" height="429" alt="image" src="https://github.com/user-attachments/assets/d0a75868-f6d1-4fb6-b6f0-0bd8764370ce" />
<img width="998" height="434" alt="image" src="https://github.com/user-attachments/assets/2e075ca1-e887-47ac-8558-c7e2f4e87553" />

---

### Inputs
- String of the whole text.
- Integer of selected text division.
- String of comma separated text divisions.
- String of optional separator.
- Integer of max text divisions for the numbered text output.

### Outputs

- String of selected text division(s).
- String of the whole text, numbered and limited by the max value.

---

### License
MIT License. Feel free to modify; please keep attribution.
