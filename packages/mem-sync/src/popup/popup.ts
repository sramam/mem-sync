import { SendPageInfo } from "../types";
import { $pageInfo } from "./stores";

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const { action } = request;
  if (action === "sendPageInfo") {
    const { id, pageInfo } = request as SendPageInfo;
    // we have pageInfo, which we can now transfer to nanostore and react-land
    $pageInfo.set(pageInfo);
    sendResponse({ id });
  }
});

/**
 * It seems the popup takes much longer than background.js to initialize
 * We'll create an explicit signal that informs background.js that we are ready.
 */
chrome.runtime.sendMessage({ action: "popupRegistration" });
