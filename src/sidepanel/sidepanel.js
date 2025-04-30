// Sample placeholder data
let result ; // This will store the data received from background.js

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "bias-analysis-result") {
    result = message.data;
    console.log("Received result:", result);

    // Update the DOM with the new data
    updateDOM(result);
  }
});

const updateDOM = (result) => {
  let { biasStrength, explanation, phrases } = result;
  biasStrength = parseFloat(biasStrength);
  let keyPhrases = phrases.split(",").map((phrase) => phrase.trim());

  const scoreEl = document.querySelector("#bias-score");
  const positionEl = document.querySelector("#position");
  const explanationEl = document.querySelector("#explanation");
  const phrasesEl = document.querySelector("#key-phrases");

  if (scoreEl) scoreEl.innerText = `${biasStrength * 100}`; // Convert to percentage

  if (positionEl) {
    positionEl.innerText =
      biasStrength > 0.33 ? "right" : biasStrength > -0.33 ? "center" : "left";
  }

  if (explanationEl) explanationEl.innerText = explanation;

  // KEY PHRASES
  if (phrasesEl) {
    phrasesEl.innerHTML = ""; // Clear previous phrases
    keyPhrases.forEach((phrase) => {
      const phraseEl = document.createElement("div");
      phraseEl.className = "key-phrase";
      phraseEl.innerText = phrase;
      phrasesEl.appendChild(phraseEl);
    });
  }

  // POINTER POSITION
  const pointer = document.querySelector("#pointer");

  // Calculate the position of the pointer based on the bias score
  const percentage = ((biasStrength + 1) / 2) * 100;

  // Update the pointer's position (this will be between 0% and 100%)
  pointer.style.left = `${percentage}%`;
};

// Optionally, you can also call updateDOM after DOMContentLoaded if result is initially available
document.addEventListener("DOMContentLoaded", () => {
  if (result) {
    updateDOM(result); // Ensure DOM is updated if the result is already available
  }
});

const serverUrl = "https://bias-lens-server-9feb0545fef6.herokuapp.com";

// Function to fetch balancing articles

async function fetchBalancingArticles() {
  if (!result) {
    console.error("No result available to fetch balancing articles.");
    return;
  }

  try {
    const response = await fetch(`${serverUrl}/balance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: JSON.stringify(result) })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const res = await response.json();
    // const data = parseData(res.biasAnalysis);
    return res;
  } catch (error) {
    return { action: "bias-analysis-error", error: error.message };
  }
}

// onclick button, fetch balancing articles and update the DOM
const fetchButton = document.querySelector("#fetch-button");
if (fetchButton) {
  fetchButton.addEventListener("click", async () => {
    const articles = await fetchBalancingArticles();
    console.log("Fetched balancing articles:", articles);

    // Update the DOM with the new data
    // updateDOM(articles);
  });
}