// background.js
const serverUrl = "https://bias-lens-server-9feb0545fef6.herokuapp.com";
console.log("Background script running.");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background script received:", message);

  if (message.action === "bias-analysis") {
    handleBiasAnalysis(message.data, sendResponse);
    return true;
  }

  console.warn("Unknown action received:", message.action);
  return false;
});

async function handleBiasAnalysis(data, sendResponse) {
  try {
    console.log("Processing bias analysis for data:", data);

    const response = await fetch(`${serverUrl}/analyze-bias`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: data.textContent }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Bias analysis result:", result);
    sendResponse({ action: "bias-analysis-result", data: result });
  } catch (error) {
    console.error("Error during bias analysis:", error);
    sendResponse({ action: "bias-analysis-error", error: error.message });
  }
}
