function exec(id, action) {
    let textStart = getSelectionIndex(0);
    let textEnd = getSelectionIndex(1);
    document.getElementById(id).innerHTML = processHTML(update(textStart, textEnd, action, id), document.getElementById(id).textContent);
}

function processHTML(template, content) {
    let updatedContent = "";

    for (let index = 0; index < template.length; index++) {
        if (index == 0) {
            template[index].forEach(element => {
                updatedContent += `<${element}>`;
            });
        }

        if (index > 0 && template[index - 1].toString() != template[index].toString()) {
            template[index - 1].forEach(element => {
                updatedContent += `</${element}>`;
            });

            template[index].forEach(element => {
                updatedContent += `<${element}>`;
            });
        }
        updatedContent += content[index];
        
        if (index == template.length - 1) {
            template[index].forEach(element => {
                updatedContent += `</${element}>`;
            });
        }
    }

    return updatedContent;
}

function getSelectionIndex(type) {
    let selection = window.getSelection();
    let offset; let node;
    
    if (selection.rangeCount > 0) {
        if (type === 0) {
            offset = selection.getRangeAt(0).startOffset;
            node = selection.getRangeAt(0).startContainer;
        } else if (type === 1) {
            offset = selection.getRangeAt(0).endOffset;
            node = selection.getRangeAt(0).endContainer;
        } else {
            return -1;
        }

        while (node.tagName !== "DIV") {
            if (node.previousSibling) {
                node = node.previousSibling;
                if (node.textContent) {
                    offset += node.textContent.length;
                } else {
                    return -1;
                }
            } else {
                node = node.parentNode;
            }            
        }

        return offset;
    }
}

function update(start, end, action, id) {
    let content = document.getElementById(id).innerHTML;
    let contentObject = [];

    let currentTagName = "", inTag = false, styling = [];
    for (let index = 0; index < content.length; index++) {
        if (!inTag && content[index] == "<") {
            inTag = true;
        } else if (inTag && content[index] == ">") {
            inTag = false;
            
            if (currentTagName.startsWith("/")) {
                styling.splice(styling.indexOf(currentTagName.substring(1)), 1);
            } else {
                styling.push(currentTagName);
            }
            currentTagName = "";
        } else if (inTag) {
            currentTagName += content[index];
        } else if (!inTag) {
            contentObject[contentObject.length] = styling.slice(0);
        }
    }

    let isFull = true;
    for (let index = start; index < end; index++) {
        if (contentObject[index] != undefined && !contentObject[index].includes(action)) {
            isFull = false;
            break;
        }
    }

    for (let index = start; index < end; index++) {
        if (contentObject[index] == undefined) { continue; }

        if (isFull) {
            contentObject[index].splice(contentObject[index].indexOf(action), 1);
        } else if (!isFull && !contentObject[index].includes(action)) {
            contentObject[index].push(action);
        }
    }

    return contentObject;
}