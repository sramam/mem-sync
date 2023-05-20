import { DomDetails } from "../types";

let loaded = false;
addEventListener("load", () => (loaded = true));

function getDomDetails(): DomDetails {
  // in addition to title and url, we extract the description & og:image when provided.
  const ogImageElem = document.querySelectorAll(
    'meta[property="og:image"]'
  )?.[0];
  const descriptionElem = document.querySelectorAll(
    'meta[name="description"]'
  )?.[0];
  const ogImage = ogImageElem ? (ogImageElem as any).content : undefined;
  const description = descriptionElem
    ? (descriptionElem as any).content
    : undefined;

  return {
    url: location.href,
    title: document.title,
    description,
    ogImage,
    innerHTML: document.body.innerHTML ?? "",
    innerText: document.body.innerText,
  };
}

function sendDomDetails() {
  const action = "sendDomDetails";
  const data = getDomDetails();
  chrome.runtime.sendMessage({ action, data }, (response) => {
    if (response.status === "ok") {
      console.log("Page Details sent to background.");
    } else {
      console.error("Failed to send page content to background.");
    }
  });
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "getDomDetails") {
    sendDomDetails();
    sendResponse({ status: "ok" });
  }
});

let time = 0;
const delta = 100;
function main() {
  // wait for the page to load before collecing DomInfo
  if (!loaded) {
    time += delta;
    setTimeout(main, delta);
  } else {
    console.log(`waited for ${time}ms before being ready`);
    sendDomDetails();
  }
}

main();
