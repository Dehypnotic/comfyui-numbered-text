import { app } from "../../scripts/app.js";

function parseSerializedText(text) {
    const cleanText = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    
    // Check if the text contains any custom checkbox markup
    if (/\[[ xX]\]/.test(cleanText)) {
        const lines = cleanText.split("\n");
        const items = [];
        let currentItem = null;
        
        for (let line of lines) {
            const match = line.match(/^\[([xX ]?)\]\s*(.*)/);
            if (match) {
                if (currentItem) {
                    items.push(currentItem);
                }
                currentItem = {
                    checked: match[1].toLowerCase() === "x",
                    text: match[2]
                };
            } else {
                if (currentItem) {
                    currentItem.text += "\n" + line;
                } else if (line.trim()) {
                    currentItem = {
                        checked: true,
                        text: line
                    };
                }
            }
        }
        if (currentItem) {
            items.push(currentItem);
        }
        return items;
    } else {
        // Upgrade from standard numbering (e.g. "1. Bla\n2. Bla bla")
        const lines = cleanText.split("\n");
        const items = [];
        let currentItem = null;
        
        for (let line of lines) {
            const match = line.match(/^\s*\d+\.\s*(.*)/);
            if (match) {
                if (currentItem) {
                    items.push(currentItem);
                }
                currentItem = {
                    checked: true,
                    text: match[1]
                };
            } else {
                if (currentItem) {
                    currentItem.text += "\n" + line;
                } else if (line.trim()) {
                    currentItem = {
                        checked: true,
                        text: line
                    };
                }
            }
        }
        if (currentItem) {
            items.push(currentItem);
        }
        if (items.length === 0) {
            items.push({ checked: false, text: "" });
        }
        return items;
    }
}

function serializeItems(items) {
    return items.map(item => {
        const prefix = item.checked ? "[x]" : "[ ]";
        return `${prefix} ${item.text}`;
    }).join("\n");
}

function formatRenumber(text) {
    const items = parseSerializedText(text);
    for (let item of items) {
        // Strip any leading standard numbers inside the text area input
        item.text = item.text.replace(/^\s*\d+\.\s*/, "").trim();
    }
    return serializeItems(items);
}

function renderList(container, textWidget, node) {
    // Clean up old resize observers to prevent memory leaks
    if (container.observers) {
        container.observers.forEach(obs => obs.disconnect());
    }
    container.observers = [];

    container.innerHTML = "";
    
    const textValue = textWidget.value || "[x] ";
    container.renderedValue = textValue;
    const items = parseSerializedText(textValue);
    
    items.forEach((item, index) => {
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.alignItems = "stretch";
        row.style.width = "100%";
        row.style.backgroundColor = index % 2 === 0 ? "#1e1e1e" : "#2d2d2d";
        row.style.borderBottom = "1px solid #222";
        
        // Margin container (checkmark & index label) - reduced padding
        const margin = document.createElement("div");
        margin.style.display = "flex";
        margin.style.alignItems = "center";
        margin.style.padding = "4px 8px";
        margin.style.userSelect = "none";
        margin.style.borderRight = "1px solid #252525";
        margin.style.backgroundColor = "rgba(0, 0, 0, 0.15)";
        margin.style.minWidth = "55px";
        margin.style.justifyContent = "space-between";
        
        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = item.checked;
        checkbox.style.cursor = "pointer";
        checkbox.style.accentColor = "#4a90e2";
        checkbox.style.margin = "0";
        checkbox.style.width = "13px";
        checkbox.style.height = "13px";
        
        checkbox.addEventListener("change", () => {
            item.checked = checkbox.checked;
            updateWidgetValue();
        });
        
        // Index Label - reduced font size
        const label = document.createElement("span");
        label.textContent = `${index + 1}.`;
        label.style.color = "#888";
        label.style.fontFamily = "monospace";
        label.style.fontSize = "10px";
        label.style.fontWeight = "bold";
        label.style.marginLeft = "4px";
        
        margin.appendChild(checkbox);
        margin.appendChild(label);
        
        // Textarea container
        const textContainer = document.createElement("div");
        textContainer.style.flex = "1";
        textContainer.style.display = "flex";
        textContainer.style.alignItems = "center";
        
        // Textarea - reduced padding, font size, and line-height
        const textarea = document.createElement("textarea");
        textarea.value = item.text;
        textarea.rows = 1;
        textarea.style.width = "100%";
        textarea.style.background = "transparent";
        textarea.style.border = "none";
        textarea.style.color = "#eee";
        textarea.style.fontFamily = "monospace";
        textarea.style.fontSize = "11px";
        textarea.style.padding = "4px 8px";
        textarea.style.outline = "none";
        textarea.style.resize = "none";
        textarea.style.boxSizing = "border-box";
        textarea.style.lineHeight = "1.3";
        textarea.style.overflow = "hidden";
        
        // Auto-resize height function
        const resizeTextarea = () => {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
            // Request canvas redraw without changing the node window size
            node.setDirtyCanvas(true, true);
        };
        
        // Trigger resize on input and load
        textarea.addEventListener("input", () => {
            item.text = textarea.value;
            updateWidgetValue();
            resizeTextarea();
        });
        
        // Keydown handlers
        textarea.addEventListener("keydown", (event) => {
            event.stopPropagation(); // Stop propagation to prevent LiteGraph canvas hotkeys (like minimize)
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                
                // Add new item below this one (default to unchecked/false)
                items.splice(index + 1, 0, { checked: false, text: "" });
                textWidget.value = serializeItems(items);
                renderList(container, textWidget, node);
                
                // Focus the newly created textarea
                setTimeout(() => {
                    const nextRow = container.children[index + 1];
                    if (nextRow) {
                        const nextTextarea = nextRow.querySelector("textarea");
                        if (nextTextarea) {
                            nextTextarea.focus();
                        }
                    }
                }, 10);
            } else if (event.key === "Backspace" && textarea.selectionStart === 0 && textarea.selectionEnd === 0) {
                // Delete current item if empty (or join with previous item)
                if (textarea.value === "" && items.length > 1) {
                    event.preventDefault();
                    
                    items.splice(index, 1);
                    textWidget.value = serializeItems(items);
                    renderList(container, textWidget, node);
                    
                    // Focus the previous textarea
                    setTimeout(() => {
                        const prevRow = container.children[index - 1];
                        if (prevRow) {
                            const prevTextarea = prevRow.querySelector("textarea");
                            if (prevTextarea) {
                                prevTextarea.focus();
                                // Position caret at the end
                                const len = prevTextarea.value.length;
                                prevTextarea.setSelectionRange(len, len);
                            }
                        }
                    }, 10);
                }
            }
        });

        textarea.addEventListener("keyup", (event) => {
            event.stopPropagation();
        });

        textarea.addEventListener("keypress", (event) => {
            event.stopPropagation();
        });
        
        textContainer.appendChild(textarea);
        row.appendChild(margin);
        row.appendChild(textContainer);
        container.appendChild(row);
        
        // Run initial resize
        setTimeout(resizeTextarea, 0);

        // Observe textarea resizing (like when user resizes node width) to auto-adjust height
        try {
            const ro = new ResizeObserver(() => {
                resizeTextarea();
            });
            ro.observe(textarea);
            container.observers.push(ro);
        } catch (e) {
            console.warn("ResizeObserver not supported or failed", e);
        }
    });

    container.itemsCount = items.length;
    
    function updateWidgetValue() {
        textWidget.value = serializeItems(items);
        if (textWidget.callback) {
            textWidget.callback(textWidget.value);
        }
        node.trigger("change");
    }
}

app.registerExtension({
    name: "dehypnotic.NumberedText",
    async nodeCreated(node) {
        if (node.comfyClass === "NumberedText" || node.comfyClass === "dehypnotic_NumberedText") {
            const textWidget = node.widgets.find(w => w.name === "text");
            if (textWidget) {
                textWidget.type = "hidden";
                
                // Completely hide the original textarea to avoid duplicates
                const hideInput = () => {
                    if (textWidget.inputEl) {
                        textWidget.inputEl.style.display = "none";
                        textWidget.inputEl.style.width = "0px";
                        textWidget.inputEl.style.height = "0px";
                        textWidget.inputEl.style.position = "absolute";
                        textWidget.inputEl.style.opacity = "0";
                        textWidget.inputEl.style.pointerEvents = "none";
                    }
                };
                hideInput();
                
                // Fallback shown listener to ensure it gets hidden
                const origOnShown = node.onShown;
                node.onShown = function() {
                    origOnShown?.apply(this, arguments);
                    hideInput();
                };
                
                  // Create parent container (flexbox to hold list and buttons)
                  const parentContainer = document.createElement("div");
                  parentContainer.style.display = "flex";
                  parentContainer.style.flexDirection = "column";
                  parentContainer.style.width = "100%";
                  parentContainer.style.backgroundColor = "#151515";
                  parentContainer.style.border = "1px solid #333";
                  parentContainer.style.borderRadius = "4px";
                  parentContainer.style.marginTop = "5px";
                  parentContainer.style.marginBottom = "5px";
                  
                  // Create custom list container
                  const listContainer = document.createElement("div");
                  listContainer.style.display = "flex";
                  listContainer.style.flexDirection = "column";
                  listContainer.style.width = "100%";
                  listContainer.style.overflowY = "auto";
                  listContainer.style.height = "300px";
                  listContainer.style.maxHeight = "300px";
                  
                  // Create horizontal button container
                  const buttonContainer = document.createElement("div");
                  buttonContainer.style.display = "flex";
                  buttonContainer.style.flexDirection = "row";
                  buttonContainer.style.flexWrap = "wrap";
                  buttonContainer.style.justifyContent = "space-between";
                  buttonContainer.style.padding = "5px";
                  buttonContainer.style.gap = "4px";
                  buttonContainer.style.borderTop = "1px solid #333";
                  buttonContainer.style.backgroundColor = "#202020";
 
                  // Stop mouse/pointer/keyboard event propagation to prevent canvas interactions/collapsing
                  const blockEvents = ["mousedown", "mouseup", "click", "dblclick", "contextmenu", "pointerdown", "pointerup", "pointermove", "keydown", "keyup", "keypress"];
                  blockEvents.forEach(evt => {
                      parentContainer.addEventListener(evt, (e) => {
                          e.stopPropagation();
                      });
                  });
                  
                  parentContainer.appendChild(listContainer);
                  parentContainer.appendChild(buttonContainer);
                  
                  const domWidget = node.addDOMWidget("custom_numbered_text", "custom_ui", parentContainer);
                  domWidget.computeSize = function() {
                      // Keep widget size stable based on node's current width, dynamic height based on button wrap
                      const width = node.size ? Math.max(350, node.size[0]) : 400;
                      const btnHeight = buttonContainer.clientHeight || 32;
                      return [width, 305 + btnHeight + 10]; // Fixed list height (300px) + dynamic buttons height + padding
                  };
                  
                  // Set initial size of the node window
                  if (!node.size || node.size[1] < 100) {
                      node.size = [400, 450];
                  }
                  
                  // Button helper function
                  const createButton = (text, onClick) => {
                      const btn = document.createElement("button");
                      btn.textContent = text;
                      btn.style.flex = "1";
                      btn.style.backgroundColor = "#353535";
                      btn.style.border = "1px solid #555";
                      btn.style.borderRadius = "3px";
                      btn.style.color = "#ddd";
                      btn.style.padding = "4px 2px";
                      btn.style.fontSize = "9.5px";
                      btn.style.fontFamily = "sans-serif";
                      btn.style.cursor = "pointer";
                      btn.style.whiteSpace = "nowrap";
                      btn.style.textAlign = "center";
                      
                      btn.addEventListener("mouseover", () => {
                          btn.style.backgroundColor = "#454545";
                          btn.style.color = "#fff";
                      });
                      btn.addEventListener("mouseout", () => {
                          btn.style.backgroundColor = "#353535";
                          btn.style.color = "#ddd";
                      });
                      btn.addEventListener("click", onClick);
                      return btn;
                  };
 
                  // Helper to unescape delimiter characters
                  const unescapeString = (str) => {
                      return str.replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\r/g, "\r");
                  };

                  const cleanBtn = createButton("Clean List", () => {
                      const currentText = textWidget.value || "";
                      const newText = formatRenumber(currentText);
                      textWidget.value = newText;
                      renderList(listContainer, textWidget, node);
                  });
                  
                  const deleteBtn = createButton("Delete Checked", () => {
                      const currentText = textWidget.value || "";
                      let items = parseSerializedText(currentText);
                      items = items.filter(item => !item.checked);
                      if (items.length === 0) {
                          items.push({ checked: false, text: "" });
                      }
                      textWidget.value = serializeItems(items);
                      renderList(listContainer, textWidget, node);
                  });

                  const copyBtn = createButton("Copy Checked", () => {
                      const currentText = textWidget.value || "";
                      const items = parseSerializedText(currentText);
                      const selectedTexts = items.filter(item => item.checked).map(item => item.text.trim()).filter(Boolean);
                      
                      const separatorWidget = node.widgets.find(w => w.name === "separator");
                      const rawSeparator = separatorWidget ? separatorWidget.value : ", ";
                      const unescapedSeparator = unescapeString(rawSeparator);
                      
                      const textToCopy = selectedTexts.join(unescapedSeparator);
                      
                      const origText = "Copy Checked";
                      copyBtn.textContent = "Copied!";
                      copyBtn.style.backgroundColor = "#2b5e2b";
                      
                      navigator.clipboard.writeText(textToCopy).then(() => {
                          setTimeout(() => {
                              copyBtn.textContent = origText;
                              copyBtn.style.backgroundColor = "#353535";
                          }, 1500);
                      }).catch(err => {
                          console.error("Failed to copy text: ", err);
                          copyBtn.textContent = "Error!";
                          setTimeout(() => {
                              copyBtn.textContent = origText;
                              copyBtn.style.backgroundColor = "#353535";
                          }, 1500);
                      });
                  });
 
                  const checkAllBtn = createButton("Check All", () => {
                      const currentText = textWidget.value || "";
                      const items = parseSerializedText(currentText);
                      items.forEach(item => item.checked = true);
                      textWidget.value = serializeItems(items);
                      renderList(listContainer, textWidget, node);
                  });
 
                  const uncheckAllBtn = createButton("Uncheck All", () => {
                      const currentText = textWidget.value || "";
                      const items = parseSerializedText(currentText);
                      items.forEach(item => item.checked = false);
                      textWidget.value = serializeItems(items);
                      renderList(listContainer, textWidget, node);
                  });
 
                  buttonContainer.appendChild(cleanBtn);
                  buttonContainer.appendChild(deleteBtn);
                  buttonContainer.appendChild(copyBtn);
                  buttonContainer.appendChild(checkAllBtn);
                  buttonContainer.appendChild(uncheckAllBtn);
                  
                  renderList(listContainer, textWidget, node);

                  // Override onConfigure to catch when ComfyUI restores node state (workflow load/refresh/copy-paste/undo-redo)
                  const origOnConfigure = node.onConfigure;
                  node.onConfigure = function(info) {
                      origOnConfigure?.apply(this, arguments);
                      renderList(listContainer, textWidget, node);
                  };
            }
        }
    }
});
