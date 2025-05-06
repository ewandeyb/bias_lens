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

function parseData(data) {
  const lines = data.split("\n");
  const map = {};

  lines.forEach((line) => {
    const [key, ...value] = line.split(":");
    if (key && value.length > 0) {
      const trimmedKey = key.trim();
      const trimmedValue = value.join(":").trim();
      if (trimmedKey == "Themes") {
        map[trimmedKey] = trimmedValue.split(",").map((item) => item.trim());
      } else {
        map[trimmedKey] = trimmedValue;
      }
    }
  });
  return map;
}
async function handleBiasAnalysis(data, sendResponse) {
  try {
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

    const res = await response.json();
    const result = parseData(res.biasAnalysis);
    // sendResponse({ action: "bias-analysis-result", data: result });
    chrome.runtime.sendMessage({ action: "bias-analysis-result", data: result });
  } catch (error) {
    sendResponse({ action: "bias-analysis-error", error: error.message });
  }
}
