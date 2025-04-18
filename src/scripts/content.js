// Access the DOM (Scraping part)

let { Readability } = require("@mozilla/readability");

// we get the data is relevant to our API
let { title, textContent, siteName } = new Readability(document).parse();
let URL = window.location.href;
let data = { url: URL, title, textContent, siteName };

// we stringify the JSON for portability
let text_output = JSON.stringify(data, null, 2);

console.log(text_output);
