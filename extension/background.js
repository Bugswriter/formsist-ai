// background.js

// Listen for messages from the popup script
browser.runtime.onMessage.addListener(async (message, sender) => {
  if (message.type === "TRIGGER_FILL_PROCESS") {
    console.log("Received trigger from popup. Injecting content script for filling.");
    try {
      let tabs = await browser.tabs.query({ active: true, currentWindow: true });
      if (tabs.length > 0) {
        const activeTabId = tabs[0].id;
        // Inject content.js and then send a message to it to perform the fill action
        await browser.tabs.executeScript(activeTabId, { file: "/content.js" });
        browser.tabs.sendMessage(activeTabId, { type: "PERFORM_FILL_ACTION" });
        console.log("content.js injected and message sent for fill process.");
      } else {
        console.warn("No active tab found to inject content script for filling.");
      }
    } catch (error) {
      console.error("Failed to inject content script for filling:", error);
    }
  } else if (message.type === "TRIGGER_COPY_OPTIMIZED_HTML") {
    console.log("Received trigger from popup. Injecting content script for copying.");
    try {
      let tabs = await browser.tabs.query({ active: true, currentWindow: true });
      if (tabs.length > 0) {
        const activeTabId = tabs[0].id;
        // Inject content.js and then send a message to it to perform the copy action
        await browser.tabs.executeScript(activeTabId, { file: "/content.js" });
        browser.tabs.sendMessage(activeTabId, { type: "PERFORM_COPY_ACTION" });
        console.log("content.js injected and message sent for copy process.");
      } else {
        console.warn("No active tab found to inject content script for copying.");
      }
    } catch (error) {
      console.error("Failed to inject content script for copying:", error);
      browser.runtime.sendMessage({
          type: "OPTIMIZED_HTML_FOR_COPY",
          htmlContent: null // Indicate failure
      });
    }
  }
  else if (message.type === "FORM_HTML_TO_BACKEND") {
    console.log("Received form HTML from content script. Sending to backend...");
    const formHtml = message.formHtml;

    try {
      // Use localhost:8000 for the main fillit API, or 8001 for the test backend
      const backendUrl = 'http://localhost:8000/fillit'; // Change to 8001/receive_html for testing
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ formHtml: formHtml })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.text();
      console.log("Received JavaScript from backend:", data);

      // Send the received JavaScript back to the content script for execution
      browser.tabs.sendMessage(sender.tab.id, {
        type: "EXECUTE_JS_ON_FORM",
        jsCode: data
      });
      console.log("Sent JavaScript to content script for execution.");

    } catch (error) {
      console.error("Error sending HTML to backend or receiving JS:", error);
      browser.tabs.sendMessage(sender.tab.id, {
        type: "ERROR_MESSAGE",
        message: "Failed to get form-filling script from backend."
      });
    }
  } else if (message.type === "CLEANED_HTML_RESULT") {
      // This message comes from content.js after it cleans the HTML for copying
      console.log("Received cleaned HTML from content script for copying to popup.");
      browser.runtime.sendMessage({
          type: "OPTIMIZED_HTML_FOR_COPY",
          htmlContent: message.htmlContent
      });
  }
});
