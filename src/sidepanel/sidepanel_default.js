

chrome.runtime.sendMessage(
    { action: messageAction, data: articleData },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message to background script:", response);
      }
      if (response?.action === "bias-analysis-result") {
        // TODO: Create UI to display the result
        console.log("Bias analysis result:", response.data);
      } else if (response?.action === "bias-analysis-error") {
        console.error("Bias analysis error:", response.error);
      } else {
        console.warn("Unknown response received:", response);
      }
    },
  );