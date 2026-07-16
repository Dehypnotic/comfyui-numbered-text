import { app } from "../../scripts/app.js";

function formatRenumber(text) {
    const lines = text.split("\n");
    let count = 1;
    const result = [];
    for (let line of lines) {
        const clean = line.replace(/^\s*\d+\.\s*/, "").trim();
        if (clean === "") {
            continue;
        }
        result.push(`${count}. ${clean}`);
        count++;
    }
    return result.join("\n");
}

function formatStrip(text) {
    const lines = text.split("\n");
    const result = [];
    for (let line of lines) {
        const clean = line.replace(/^\s*\d+\.\s*/, "").trim();
        if (clean !== "") {
            result.push(clean);
        }
    }
    return result.join("\n");
}

function renumberSubsequentLines(textarea, fromPos) {
    const value = textarea.value;
    const beforePart = value.substring(0, fromPos);
    const afterPart = value.substring(fromPos);
    
    const lines = afterPart.split("\n");
    if (lines.length === 0 || !lines[0]) return;
    
    const beforeLines = beforePart.split("\n");
    const lastLineBefore = beforeLines[beforeLines.length - 1] || "";
    const lastLineMatch = lastLineBefore.match(/^\s*(\d+)\./);
    if (!lastLineMatch) return;
    
    let expectedNum = parseInt(lastLineMatch[1], 10) + 1;
    let modified = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(/^(\s*)(\d+)\.\s*(.*)/);
        if (match) {
            const indent = match[1] || "";
            const content = match[3];
            lines[i] = `${indent}${expectedNum}. ${content}`;
            expectedNum++;
            modified = true;
        } else {
            break;
        }
    }
    
    if (modified) {
        textarea.value = beforePart + lines.join("\n");
        textarea.selectionStart = textarea.selectionEnd = fromPos;
    }
}

function attachAutoNumbering(textarea, node) {
    if (textarea.dataset.numberedTextAttached) return;
    textarea.dataset.numberedTextAttached = "true";

    textarea.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const value = textarea.value;

            const beforeText = value.substring(0, start);
            const lastNewline = beforeText.lastIndexOf("\n");
            const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;

            const afterText = value.substring(end);
            const nextNewline = afterText.indexOf("\n");
            const lineEnd = nextNewline === -1 ? value.length : end + nextNewline;

            const currentLine = value.substring(lineStart, lineEnd);

            const match = currentLine.match(/^(\s*)(\d+)\.\s*(.*)/);
            if (match) {
                event.preventDefault();
                const indent = match[1] || "";
                const num = parseInt(match[2], 10);
                const content = match[3].trim();

                if (content === "") {
                    // Current line is just empty number prefix (e.g. "3. ")
                    const newText = value.substring(0, lineStart) + indent + value.substring(lineEnd);
                    textarea.value = newText;
                    textarea.selectionStart = textarea.selectionEnd = lineStart + indent.length;
                } else {
                    // Line has content, insert newline and next number
                    const nextNum = num + 1;
                    const insertText = `\n${indent}${nextNum}. `;
                    const newText = value.substring(0, start) + insertText + value.substring(end);
                    textarea.value = newText;
                    textarea.selectionStart = textarea.selectionEnd = start + insertText.length;
                    
                    renumberSubsequentLines(textarea, start + insertText.length);
                }
                
                textarea.dispatchEvent(new Event("input", { bubbles: true }));
                if (node) {
                    node.trigger("change");
                }
            }
        } else if (event.key === "Backspace") {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            if (start === end) {
                const value = textarea.value;
                const lastNewline = value.substring(0, start).lastIndexOf("\n");
                const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;
                const currentLine = value.substring(lineStart, start);
                
                const match = currentLine.match(/^(\s*)(\d+)\.\s*$/);
                if (match) {
                    event.preventDefault();
                    const newText = value.substring(0, lineStart) + value.substring(start);
                    textarea.value = newText;
                    textarea.selectionStart = textarea.selectionEnd = lineStart;
                    
                    textarea.dispatchEvent(new Event("input", { bubbles: true }));
                    if (node) {
                        node.trigger("change");
                    }
                }
            }
        }
    });
}

app.registerExtension({
    name: "dehypnotic.NumberedText",
    async nodeCreated(node) {
        if (node.comfyClass === "NumberedText" || node.comfyClass === "dehypnotic_NumberedText") {
            // Immediate attachment check
            const textWidget = node.widgets.find(w => w.name === "text");
            if (textWidget && textWidget.inputEl) {
                attachAutoNumbering(textWidget.inputEl, node);
            }

            // Fallback lifecycle check
            const origOnShown = node.onShown;
            node.onShown = function() {
                origOnShown?.apply(this, arguments);
                const textWidget = this.widgets.find(w => w.name === "text");
                if (textWidget && textWidget.inputEl) {
                    attachAutoNumbering(textWidget.inputEl, this);
                }
            };

            // Add Renumber helper button
            node.addWidget("button", "Renumber List", null, () => {
                const textWidget = node.widgets.find(w => w.name === "text");
                if (textWidget) {
                    const currentText = textWidget.value || "";
                    const newText = formatRenumber(currentText);
                    textWidget.value = newText;
                    if (textWidget.inputEl) {
                        textWidget.inputEl.value = newText;
                    }
                    node.trigger("change");
                }
            }, { serialize: false });

            // Add Strip helper button
            node.addWidget("button", "Strip Numbers", null, () => {
                const textWidget = node.widgets.find(w => w.name === "text");
                if (textWidget) {
                    const currentText = textWidget.value || "";
                    const newText = formatStrip(currentText);
                    textWidget.value = newText;
                    if (textWidget.inputEl) {
                        textWidget.inputEl.value = newText;
                    }
                    node.trigger("change");
                }
            }, { serialize: false });
        }
    }
});
