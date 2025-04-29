// Sample placeholder data
let result; // This will store the data received from background.js

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "bias-analysis-result") {
    result = message.data;
    console.log("Received result:", result);

    // Update the DOM with the new data
    updateDOM(result);
  }
});

function updateDOM(result) {
  let { biasStrength, explanation, keyPhrases } = result;
  biasStrength = parseFloat(biasStrength);

  const scoreEl = document.querySelector("#bias-score");
  const positionEl = document.querySelector("#position");
  const explanationEl = document.querySelector("#explanation");
  const phrasesEl = document.querySelector("#key-phrases");

  if (scoreEl) scoreEl.innerText = `${biasStrength * 100}`; // Convert to percentage

  if (positionEl) {
    positionEl.innerText = biasStrength > 0.33 ? "right" : biasStrength > -0.33 ? "center" : "left";
  }

  if (explanationEl) explanationEl.innerText = explanation;

  // KEY PHRASES
  if (phrasesEl) {
    phrasesEl.innerHTML = ""; // Clear existing content
    keyPhrases.forEach((phrase) => {
      const div = document.createElement("div");
      div.innerText = phrase;
      phrasesEl.appendChild(div);
    });
  }

  // POINTER POSITION
  const pointer = document.querySelector("#pointer");

  // Calculate the position of the pointer based on the bias score
    const percentage = ((biasStrength + 1) / 2) * 100;

  // Update the pointer's position (this will be between 0% and 100%)
  pointer.style.left = `${percentage}%`;

}

// Optionally, you can also call updateDOM after DOMContentLoaded if result is initially available
document.addEventListener("DOMContentLoaded", () => {
  if (result) {
    updateDOM(result); // Ensure DOM is updated if the result is already available
  }
});
