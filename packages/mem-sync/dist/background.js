/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/utils/getHash.ts":
/*!******************************!*\
  !*** ./src/utils/getHash.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getHash: () => (/* binding */ getHash)
/* harmony export */ });
// We need a simple hash function to cache in the browser extension context.
// High security is not the biggest problem, reasonably collision resistant
// should suffice.
/**
 * A fast and simple 53-bit string hash function with decent collision resistance.
 * Largely inspired by MurmurHash2/3, but with a focus on speed/simplicity.
 *
 * https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js
 */
const cyrb53a = function (str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 0x85ebca77);
        h2 = Math.imul(h2 ^ ch, 0xc2b2ae3d);
    }
    h1 ^= Math.imul(h1 ^ (h2 >>> 15), 0x735a2d97);
    h2 ^= Math.imul(h2 ^ (h1 >>> 15), 0xcaf649a9);
    h1 ^= h2 >>> 16;
    h2 ^= h1 >>> 16;
    const hash = 2097152 * (h2 >>> 0) + (h1 >>> 11);
    return hash.toString(16);
};
const getHash = cyrb53a;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
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
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************************!*\
  !*** ./src/background/index.ts ***!
  \*********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getSummary: () => (/* binding */ getSummary),
/* harmony export */   sendPageInfo: () => (/* binding */ sendPageInfo)
/* harmony export */ });
/* harmony import */ var _utils_getHash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/getHash */ "./src/utils/getHash.ts");

const cache = {};
let popupReady = false;
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === "sendDomDetails") {
        sendResponse({ status: "ok" });
        const domDetails = request.data;
        // from this point on, we'll identify the page by the hash of it's contents.
        const id = (0,_utils_getHash__WEBPACK_IMPORTED_MODULE_0__.getHash)(domDetails.innerText);
        const { url, ogImage, title, description } = domDetails;
        const partialPageInfo = {
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
    }
    else if (request.action === "popupRegistration") {
        popupReady = true;
    }
});
/**
 * sends collated pageInfo to popup.js
 */
async function sendPageInfo(pageInfo, id) {
    const _send = () => {
        const message = {
            action: "sendPageInfo",
            id,
            pageInfo,
        };
        return chrome.runtime.sendMessage(message, (response) => {
            // nothing to do here. perhaps delete the data from cache?
        });
    };
    const wait = () => setTimeout(() => {
        if (popupReady) {
            _send();
        }
        else {
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
async function getSummary(text, id) {
    console.log(`getSummary`);
    const body = {
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
            ...prev.pageInfo,
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
    }
    else {
        console.log(`getSummary ERROR`);
    }
}

})();

/******/ })()
;
//# sourceMappingURL=background.js.map