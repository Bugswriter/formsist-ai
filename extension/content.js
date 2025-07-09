// content.js

// Function to find the form and send its HTML
function sendFormHtmlToBackground() {
  const form = document.querySelector('form'); // Selects the first form on the page

  if (form) {
    const cleanedFormHtml = cleanFormHtml(form);
    console.log("Found form. Sending CLEANED HTML to background script.");

    browser.runtime.sendMessage({
      type: "FORM_HTML_TO_BACKEND",
      formHtml: cleanedFormHtml
    });
  } else {
    console.warn("No form found on this page.");
    displayMessage("No form found on this page. Make sure a form exists.", "warning");
  }
}

// Function to execute the received JavaScript
function executeJsOnForm(jsCode) {
  console.log("Executing received JavaScript on form.");
  try {
    const script = document.createElement('script');
    script.textContent = jsCode;
    document.head.appendChild(script);
    script.remove();
    displayMessage("Form filled successfully!", "success");

    // After the main script executes, trigger events on all relevant form elements
    // This is a more general solution if Gemini's output doesn't include event dispatching
    // For a more robust solution, Gemini should ideally generate calls to a helper function
    // that sets value AND dispatches events.
    const formElements = document.querySelectorAll('input:not([type="submit"]):not([type="button"]):not([type="reset"]), textarea, select');
    formElements.forEach(element => {
        // Only dispatch if the element actually has a value (i.e., was filled by Gemini's script)
        if (element.value || element.checked) {
            // Dispatch 'input' event for text-like inputs and textareas
            if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'email' || element.type === 'password' || element.type === 'number' || element.type === 'tel' || element.type === 'url' || element.type === 'date')) {
                element.dispatchEvent(new Event('input', { bubbles: true }));
            }
            // Dispatch 'change' event for all relevant elements (input, select, textarea, checkbox, radio)
            element.dispatchEvent(new Event('change', { bubbles: true }));
            // For some complex frameworks, a blur event might also be necessary
            // element.dispatchEvent(new Event('blur', { bubbles: true }));
        }
    });

  } catch (error) {
    console.error("Error executing received JavaScript:", error);
    displayMessage("Error filling form: " + error.message, "error");
  }
}

// Function to display temporary messages on the page
function displayMessage(msg, type) {
    const messageBoxId = 'form-filler-message-box';
    let messageBox = document.getElementById(messageBoxId);

    if (!messageBox) {
        messageBox = document.createElement('div');
        messageBox.id = messageBoxId;
        Object.assign(messageBox.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '10px 20px',
            borderRadius: '5px',
            zIndex: '99999',
            color: 'white',
            fontWeight: 'bold',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            fontFamily: 'Inter, sans-serif'
        });
        document.body.appendChild(messageBox);
    }

    messageBox.textContent = msg;
    if (type === 'success') {
        messageBox.style.backgroundColor = '#4CAF50'; // Green
    } else if (type === 'error') {
        messageBox.style.backgroundColor = '#f44336'; // Red
    } else if (type === 'warning') {
        messageBox.style.backgroundColor = '#ff9800'; // Orange
    } else {
        messageBox.style.backgroundColor = '#555'; // Default
    }

    messageBox.style.display = 'block';

    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 5000);
}

// Cleaning function (remains the same)
function cleanFormHtml(formElement) {
    const clonedForm = formElement.cloneNode(true);
    const formTagsToKeep = new Set([
        'FORM', 'INPUT', 'SELECT', 'TEXTAREA', 'LABEL', 'BUTTON', 'OPTION',
        'OPTGROUP', 'FIELDSET', 'LEGEND', 'DATALIST'
    ]);
    const attributesToKeep = new Set([
        'name', 'id', 'type', 'value', 'checked', 'selected', 'for', 'placeholder',
        'rows', 'cols', 'min', 'max', 'step', 'pattern', 'title', 'disabled',
        'readonly', 'required', 'multiple', 'autofocus', 'list', 'maxlength',
        'minlength', 'size', 'alt', 'label', 'aria-label', 'role',
        'data-qa', 'data-test', 'data-label', 'data-name'
    ]);

    const allDescendants = clonedForm.querySelectorAll('*');
    for (let i = allDescendants.length - 1; i >= 0; i--) {
        const el = allDescendants[i];

        if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') {
            el.remove();
            continue;
        }

        for (let j = el.childNodes.length - 1; j >= 0; j--) {
            if (el.childNodes[j].nodeType === Node.COMMENT_NODE) {
                el.childNodes[j].remove();
            }
        }

        const attributesToRemove = [];
        for (let j = 0; j < el.attributes.length; j++) {
            const attr = el.attributes[j];
            if (!attributesToKeep.has(attr.name.toLowerCase())) {
                attributesToRemove.push(attr.name);
            }
        }
        attributesToRemove.forEach(attrName => el.removeAttribute(attrName));

        if (!formTagsToKeep.has(el.tagName)) {
            while (el.firstChild) {
                el.parentNode.insertBefore(el.firstChild, el);
            }
            el.remove();
        }
    }

    const finalElements = clonedForm.querySelectorAll('*');
    for (let i = finalElements.length - 1; i >= 0; i--) {
        const el = finalElements[i];
        if (!formTagsToKeep.has(el.tagName) && el.textContent.trim() === '' && el.children.length === 0) {
            el.remove();
        }
    }

    return clonedForm.outerHTML;
}

// Listen for messages from the background script to perform actions
browser.runtime.onMessage.addListener((message) => {
  if (message.type === "EXECUTE_JS_ON_FORM") {
    executeJsOnForm(message.jsCode);
  } else if (message.type === "ERROR_MESSAGE") {
    displayMessage(message.message, "error");
  } else if (message.type === "PERFORM_FILL_ACTION") {
    sendFormHtmlToBackground();
  } else if (message.type === "PERFORM_COPY_ACTION") {
    const form = document.querySelector('form');
    if (form) {
        const cleanedHtml = cleanFormHtml(form);
        browser.runtime.sendMessage({
            type: "CLEANED_HTML_RESULT",
            htmlContent: cleanedHtml
        });
    } else {
        browser.runtime.sendMessage({
            type: "CLEANED_HTML_RESULT",
            htmlContent: null
        });
    }
  }
});
