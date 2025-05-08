// Access the DOM (Scraping part)

let { Readability } = require("@mozilla/readability");

/**
 * ============================================================================
 * SCRAPING LOGIC
 * ============================================================================
 */

// we get the data is relevant to our API
function scrapeArticle() {
  let _document = document.cloneNode(true);
  let { title, textContent, siteName } = new Readability(_document).parse();
  let url = window.location.href;

  // Clean new line and tab line from the textContent
  textContent = textContent.replace(/[\n\t]+/g, " ").trim();

  let data = { url, title, textContent, siteName };

  switch (data.siteName) {
    case "RAPPLER":
      data.textContent = parseRappler(data.textContent);
      break;
    case "INQUIRER.net":
      data.textContent = parseInquirer(data.textContent);
      break;
    default:
      data.textContent = undefined;
      break;
  }

  return data;
}

/**
 * ============================================================================
 * SITE SPECIFIC PARSING
 * ============================================================================
 */
function parseRappler(textContent) {
  // Remove "AI rappler generated message"
  let pattern = /.*? – (.*) –.*/s;
  return textContent.replace(pattern, "$1");
}
function parseInquirer(textContent) {
  // Remove subscription-related messages
  return textContent
    .replace(/Your subscription could not be saved\. Please try again\./g, "")
    .replace(/Your subscription has been successful\./g, "")
    .trim();
}
/**
 * ============================================================================
 * DEBUGGING CODE
 * ============================================================================
 */

let articleData = scrapeArticle();

let messageAction =
  articleData.textContent != undefined ? "bias-analysis" : "default";

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
