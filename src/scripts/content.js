// Access the DOM (Scraping part)

let { Readability } = require("@mozilla/readability");

let _document = document.cloneNode(true);
let { title, textContent, siteName } = new Readability(_document).parse();
let URL = window.location.href;

let text_output = JSON.stringify(
  { url: URL, title, textContent, siteName },
  null,
  2,
);

console.log(text_output);
