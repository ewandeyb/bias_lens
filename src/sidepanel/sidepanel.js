// Sample placeholder data
let result = {
  biasCategory: "Right",
  biasStrength: "0.70",
  explanation:
    'The article emphasizes the deployment of advanced military hardware and the strengthening of defense capabilities, which aligns with right-leaning perspectives on national security and military preparedness. It frames the presence of U.S. military assets in the Philippines as a deterrent against external threats, particularly from China, and highlights the strong alliance between the U.S. and the Philippines. The language used, such as "bolster the latter’s deterrence capability" and "security anxiety," reflects a focus on military strength and preparedness.',
  themes:
    "Military deployment, national security, U.S.-Philippines alliance, defense capabilities, geopolitical tensions",
  phrases:
    "deterrence capability, security anxiety, military transformation, interoperability, Mutual Defense Treaty, geopolitical confrontation, advanced military hardware, defense capabilities",
}; // This will store the data received from background.js

let balanceAnalysis = [
  {
    url: "https://www.rappler.com/nation/philippines-us-military-alliance",
    themes: [
      "Military deployment",
      "National security",
      "U.S.-Philippines alliance",
      "Defense capabilities",
      "Geopolitical tensions",
    ],
    biasCategory: "Center",
    biasStrength: 0.1,
    source: "Rappler",
    title: "Philippines, US military alliance: A balancing act",
  },
  {
    url: "https://www.inquirer.net/opinion/philippines-us-alliance",
    themes: [
      "Military deployment",
      "National security",
      "U.S.-Philippines alliance",
      "Defense capabilities",
      "Geopolitical tensions",
    ],
    biasCategory: "Left",
    biasStrength: -0.6,
    source: "Inquirer",
    title: "The Philippines and the US: A critical look at the alliance",
  },
  {
    url: "https://www.philstar.com/headlines/2023/10/01/231001/philippines-us-military-exercises",
    themes: [
      "Military deployment",
      "National security",
      "U.S.-Philippines alliance",
      "Defense capabilities",
      "Geopolitical tensions",
    ],
    biasCategory: "Center",
    biasStrength: 0.2,
    source: "Philippine Star",
    title:
      "Philippines, US military exercises: A necessary step for national security",
  },
];

// chrome.runtime.onMessage.addListener((message) => {
//   if (message.action === "bias-analysis-result") {
//     result = message.data;
//     console.log("Received result:", result);

//     // Update the DOM with the new data
//     updateDOM(result);
//   }
// });

const updateDOM = (result) => {
  let { biasStrength, explanation, phrases } = result;
  biasStrength = parseFloat(biasStrength);
  let keyPhrases = phrases.split(",").map((phrase) => phrase.trim());

  const scoreEl = document.querySelector("#bias-score");
  const heroEl = document.querySelector("#hero");
  const positionEl = document.querySelector("#position");
  const explanationEl = document.querySelector("#explanation");
  const phrasesEl = document.querySelector("#key-phrases");

  if (scoreEl) scoreEl.innerText = `${biasStrength * 100}`; // Convert to percentage

  if (positionEl) {
    const alignment =
      biasStrength > 0.33 ? "right" : biasStrength > -0.33 ? "center" : "left";

    positionEl.innerText = alignment;
    heroEl.className = `hero-${alignment}`;
  }

  if (explanationEl) explanationEl.innerText = explanation;

  // KEY PHRASES
  if (phrasesEl) {
    phrasesEl.innerHTML = ""; // Clear previous phrases

    // remove duplicates
    keyPhrases = [...new Set(keyPhrases)];

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
      body: JSON.stringify({ text: JSON.stringify(result) }),
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

// Function to show balancing articles in the DOM
const showBalanceArticles = (articles) => {
  const balancingArticlesEl = document.querySelector("#balancing-articles");
  if (balancingArticlesEl) {
    // visibility
    balancingArticlesEl.style.visibility = "visible";
  }

  const articlesContainer = document.querySelector("#articles-container");

  articlesContainer.innerHTML = ""; // Clear previous articles

  articles.forEach((article) => {
    const biasStrength = parseFloat(article.biasStrength);
    const alignment =
      biasStrength > 0.33 ? "right" : biasStrength > -0.33 ? "center" : "left";
    const color = biasStrength > 0.33 ? "red" : biasStrength > -0.33 ? "green" : "blue";

    const wrapperEl = document.createElement("div");
    wrapperEl.className = "article-wrapper";
    wrapperEl.style.borderColor = "var(--color-" + color + ")";
    const articleEl = document.createElement("a");
    articleEl.className = "article";
    articleEl.href = article.url;
    articleEl.target = "_blank";

    const titleEl = document.createElement("h3");
    titleEl.innerText = article.title || "Untitled Article";
    articleEl.appendChild(titleEl);

    // div flex row space-between; left: bias strength, right: source
    const infoEl = document.createElement("div");
    infoEl.className = "article-info";

    const biasStrengthEl = document.createElement("span");
    biasStrengthEl.className = "bias-strength";
    biasStrengthEl.innerText = `${Math.abs(biasStrength * 100)} ${alignment}`;
    infoEl.appendChild(biasStrengthEl);

    const sourceEl = document.createElement("span");
    sourceEl.className = "source";
    sourceEl.innerText = article.source || "Unknown Source";
    infoEl.appendChild(sourceEl);

    articleEl.appendChild(infoEl);

    wrapperEl.appendChild(articleEl);
    articlesContainer.appendChild(wrapperEl);
  });
};

// onclick button, fetch balancing articles and update the DOM
const fetchButton = document.querySelector("#fetch-button");
if (fetchButton) {
  fetchButton.addEventListener("click", async () => {
    // const articles = await fetchBalancingArticles();
    const articles = balanceAnalysis; // Placeholder for testing
    console.log("Fetched balancing articles:", articles);

    // Update the DOM with the new data
    showBalanceArticles(articles);
  });
}
