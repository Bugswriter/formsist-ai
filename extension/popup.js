// popup.js

document.addEventListener('DOMContentLoaded', () => {
    const fillButton = document.getElementById('fillButton');
    const copyButton = document.getElementById('copyButton');

    fillButton.addEventListener('click', () => {
        // Send a message to the background script to trigger the form fill process
        browser.runtime.sendMessage({ type: "TRIGGER_FILL_PROCESS" });
        window.close(); // Close the popup after clicking
    });

    copyButton.addEventListener('click', () => {
        // Send a message to the background script to trigger the HTML copy process
        browser.runtime.sendMessage({ type: "TRIGGER_COPY_OPTIMIZED_HTML" });
        // Do NOT close the popup immediately, wait for feedback from background script
    });

    // Listen for messages from the background script (e.g., optimized HTML for copying)
    browser.runtime.onMessage.addListener((message) => {
        if (message.type === "OPTIMIZED_HTML_FOR_COPY") {
            if (message.htmlContent) {
                navigator.clipboard.writeText(message.htmlContent).then(() => {
                    alert("Optimized HTML copied to clipboard!");
                    window.close(); // Close after successful copy
                }).catch(err => {
                    console.error("Failed to copy HTML: ", err);
                    alert("Failed to copy HTML. See console for details.");
                });
            } else {
                alert("No form found or HTML could not be optimized.");
                window.close();
            }
        }
    });
});