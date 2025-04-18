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
  let URL = window.location.href;
  let data = { url: URL, title, textContent, siteName };

  // add future site specific parsing here
  switch (data.siteName) {
    case "RAPPLER":
      data.textContent = parseRappler(data.textContent);
      break;
    default:
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
  let pattern = /.*? – (.*) –.*/s;
  return textContent.replace(pattern, "$1");
}

/**
 * ============================================================================
 * DEBUGGING CODE
 * ============================================================================
 */

// we stringify the JSON for portability
let text_output = JSON.stringify(data, null, 2);

/* TODO: Remove this line for production */
console.log(text_output);
