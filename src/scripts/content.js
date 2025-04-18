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

  return data;
}

/**
 * ============================================================================
 * SITE SPECIFIC PARSING
 * ============================================================================
 */

/**
 * ============================================================================
 * DEBUGGING CODE
 * ============================================================================
 */

let data = scrapeArticle();

// we stringify the JSON for portability
let text_output = JSON.stringify(data, null, 2);

/* TODO: Remove this line for production */
console.log(text_output);
