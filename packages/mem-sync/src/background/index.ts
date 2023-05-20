import {
  DomDetails,
  GetSummary,
  PageInfo,
  PageSummary,
  SendPageInfo,
  SendPageInfoResponse,
} from "../types";
import { getHash } from "../utils/getHash";

export type PageCache = {
  domDetails: DomDetails;
  pageSummary?: PageSummary;
  pageInfo?: PageInfo;
  id: string;
};

const cache: Record<string, PageCache> = {};

let popupReady = false;
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === "sendDomDetails") {
    sendResponse({ status: "ok" });
    const domDetails: DomDetails = request.data;
    // from this point on, we'll identify the page by the hash of it's contents.
    const id = getHash(domDetails.innerText);
    const { url, ogImage, title, description } = domDetails;
    const partialPageInfo: PageInfo = {
      url,
      ogImage,
      title,
      description,
      tags: [],
      tldr: "",
      synopsis: "",
    };
    cache[id] = {
      id,
      domDetails,
      pageInfo: partialPageInfo,
    };
    const response = await sendPageInfo(partialPageInfo, id);
    const summary = await getSummary(domDetails.innerText, id);
    console.log(summary);
  } else if (request.action === "popupRegistration") {
    popupReady = true;
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    await chrome.tabs.sendMessage(tabs[0].id!, { action: "getDomDetails" });
    sendResponse({ status: "ok" });
  }
});

/**
 * sends collated pageInfo to popup.js
 */
export async function sendPageInfo(pageInfo: PageInfo, id: string) {
  const _send = () => {
    const message: SendPageInfo = {
      action: "sendPageInfo",
      id,
      pageInfo,
    };
    return chrome.runtime.sendMessage(
      message,
      (response: SendPageInfoResponse) => {
        // nothing to do here. perhaps delete the data from cache?
      }
    );
  };
  const wait = () =>
    setTimeout(() => {
      if (popupReady) {
        _send();
      } else {
        wait();
      }
    }, 100);
  wait();
}

// This is a total hack. We should send this from the settings.
// An open question to ask here is should it be configurable?
const SERVER_URL = "http://localhost:3000";

/**
 * Asks server to summarize text via openAI
 */
export async function getSummary(text: string, id: string) {
  console.log(`getSummary`);
  const body: GetSummary = {
    id,
    text,
  };
  const response = await fetch(`${SERVER_URL}/get_summary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (response.ok) {
    console.log(`getSummary SUCCESS`);
    const { id, ...pageSummary } = await response.json();
    // we should now have the pageSummary from LLM.
    const prev = cache[id];
    const { tags, tldr, synopsis } = pageSummary;
    const fullPageInfo = {
      ...prev.pageInfo!,
      tags,
      tldr,
      synopsis,
    };
    cache[id] = {
      ...prev,
      pageSummary,
      pageInfo: fullPageInfo,
    };
    // and the final call to sendPageInfo
    await sendPageInfo(fullPageInfo, id);
  } else {
    console.log(`getSummary ERROR`);
  }
}

/**
 * We need this to trigger the backgrou
 */
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "triggerMemSave") {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log(`triggerMemSave:`, tabs);
    sendResponse({ status: "ok" });
  }
});
