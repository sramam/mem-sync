/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!*************************************!*\
  !*** ./src/content_script/index.ts ***!
  \*************************************/
__webpack_require__.r(__webpack_exports__);
let loaded = false;
addEventListener("load", () => (loaded = true));
function getDomDetails() {
    // in addition to title and url, we extract the description & og:image when provided. 
    const ogImageElem = document.querySelectorAll('meta[property="og:image"]')?.[0];
    const descriptionElem = document.querySelectorAll('meta[name="description"]')?.[0];
    const ogImage = ogImageElem ? ogImageElem.content : undefined;
    const description = descriptionElem ? descriptionElem.content : undefined;
    return {
        url: location.href,
        title: document.title,
        description,
        ogImage,
        innerHTML: document.body.innerHTML ?? "",
        innerText: document.body.innerText,
    };
}
function sendMessage(action, data) {
    chrome.runtime.sendMessage({ action, data }, (response) => {
        if (response.status === 'ok') {
            console.log("Page Details sent to background.");
        }
        else {
            console.error("Failed to send page content to background.");
        }
    });
}
let time = 0;
const delta = 100;
function main() {
    // wait for the page to load before collecing DomInfo
    if (!loaded) {
        time += delta;
        setTimeout(main, delta);
    }
    else {
        console.log(`waited for ${time}ms before being ready`);
        sendMessage("sendDomDetails", getDomDetails());
    }
}
main();


/******/ })()
;
//# sourceMappingURL=content_script.js.map