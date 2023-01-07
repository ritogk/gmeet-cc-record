/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/content/core/ccOveserver.ts":
/*!*****************************************!*\
  !*** ./src/content/core/ccOveserver.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CcOveserver": () => (/* binding */ CcOveserver)
/* harmony export */ });
/* harmony import */ var _content_elements_ccAreaElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/content/elements/ccAreaElement */ "./src/content/elements/ccAreaElement.ts");

const config = { childList: true, subtree: true };
/**
 * 字幕の変更監視クラス
 */
class CcOveserver {
    constructor(callbackFunc) {
        this.observer = null;
        this.run = () => {
            const mutationCallback = (mutations, observer) => {
                var _a, _b, _c, _d;
                for (const mutation of mutations) {
                    if (mutation.type === "childList") {
                        if (mutation.target.nodeName === "SPAN") {
                            const speechAreaNode = mutation.target;
                            const userAreaNode = (_b = (_a = speechAreaNode.parentNode) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.parentNode;
                            if (!userAreaNode)
                                return;
                            const userAreaNodeList = Array.from(userAreaNode.children);
                            if (userAreaNodeList.length !== 3)
                                return;
                            this.callbackFuncObserver((_c = userAreaNodeList[1].textContent) !== null && _c !== void 0 ? _c : "", userAreaNodeList[0].src, (_d = userAreaNodeList[2].textContent) !== null && _d !== void 0 ? _d : "");
                        }
                    }
                }
            };
            this.observer = new MutationObserver(mutationCallback);
            const oveserverNode = new _content_elements_ccAreaElement__WEBPACK_IMPORTED_MODULE_0__.CcAreaElement().getCcElement();
            this.observer.observe(oveserverNode, config);
        };
        this.stop = () => {
            var _a;
            (_a = this.observer) === null || _a === void 0 ? void 0 : _a.disconnect();
        };
        this.callbackFuncObserver = callbackFunc;
    }
}


/***/ }),

/***/ "./src/content/core/selector.ts":
/*!**************************************!*\
  !*** ./src/content/core/selector.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "selector": () => (/* binding */ selector)
/* harmony export */ });
/**
 * GoogleMeetのElementのセレクター
 */
const controlCcButton = "#ow3 > div.T4LgNb > div > div:nth-child(13) > div.crqnQb > div.UnvNgf.Sdwpn.P9KVBf.IYIJAc.BIBiNe > div.Tmb7Fd > div > div.juFBl";
const ccMainArea = ".a4cQT";
const ccArea = "#ow3 > div.T4LgNb > div > div:nth-child(13) > div.crqnQb > div.a4cQT > div:nth-child(1) > div:nth-child(1)";
const usersArea = "#ow3 > div.T4LgNb > div > div:nth-child(13) > div.crqnQb > div:nth-child(2) > div.axUSnc.P9KVBf";
const controlArea = "#ow3 > div.T4LgNb > div > div:nth-child(13) > div.crqnQb > div.UnvNgf.Sdwpn.P9KVBf.IYIJAc.BIBiNe";
const selector = {
    controlArea: controlArea,
    controlCcButton: controlCcButton,
    ccMainArea: ccMainArea,
    ccArea: ccArea,
    usersArea: usersArea,
};



/***/ }),

/***/ "./src/content/elements/ccAreaElement.ts":
/*!***********************************************!*\
  !*** ./src/content/elements/ccAreaElement.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CcAreaElement": () => (/* binding */ CcAreaElement)
/* harmony export */ });
/* harmony import */ var _content_core_selector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/content/core/selector */ "./src/content/core/selector.ts");

/**
 * 字幕エリアのElementに関するクラス
 */
class CcAreaElement {
    constructor() {
        this.opacate = false;
        this.hideElement = () => {
            const element = this.getElement();
            if (element === null)
                return;
            element.style.opacity = "0";
            this.opacate = true;
        };
        this.showElement = () => {
            const element = this.getElement();
            if (element === null)
                return;
            element.style.opacity = "1";
            this.opacate = false;
        };
        this.getElement = () => {
            return document.querySelector(_content_core_selector__WEBPACK_IMPORTED_MODULE_0__.selector.ccMainArea);
        };
        this.getCcElement = () => {
            return document.querySelector(_content_core_selector__WEBPACK_IMPORTED_MODULE_0__.selector.ccArea);
        };
    }
}


/***/ }),

/***/ "./src/content/elements/controlAreaElement.ts":
/*!****************************************************!*\
  !*** ./src/content/elements/controlAreaElement.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ControlAreaElement": () => (/* binding */ ControlAreaElement)
/* harmony export */ });
/* harmony import */ var _content_core_selector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/content/core/selector */ "./src/content/core/selector.ts");

/**
 * コントロールエリアElementに関するクラス
 */
class ControlAreaElement {
    constructor() {
        this.getElement = () => {
            return document.querySelector(_content_core_selector__WEBPACK_IMPORTED_MODULE_0__.selector.controlArea);
        };
        this.getCcBottomElement = () => {
            const element = this.getElement();
            if (element === null)
                return null;
            return element.querySelector("div.Tmb7Fd > div > div.juFBl");
        };
    }
}


/***/ }),

/***/ "./src/content/elements/switchingButtonElement.ts":
/*!********************************************************!*\
  !*** ./src/content/elements/switchingButtonElement.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SwitchingButtonElement": () => (/* binding */ SwitchingButtonElement)
/* harmony export */ });
/* harmony import */ var _content_elements_controlAreaElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/content/elements/controlAreaElement */ "./src/content/elements/controlAreaElement.ts");

/**
 * システムのスイッチングボタンに関するクラス
 */
class SwitchingButtonElement {
    constructor(callback) {
        this.drawed = false;
        this.mouseOver = false;
        this.clicked = false;
        this.createElement = () => {
            const element = document.createElement("div");
            element.id = SwitchingButtonElement.ELEMENT_ID;
            element.addEventListener("mouseover", this.callbackFuncMouseOver);
            element.addEventListener("mouseleave", this.callbackFuncMouseLeave);
            element.addEventListener("click", this.callbackFuncClick);
            const ccButtonElement = new _content_elements_controlAreaElement__WEBPACK_IMPORTED_MODULE_0__.ControlAreaElement().getCcBottomElement();
            if (ccButtonElement !== null && ccButtonElement.parentNode != null) {
                ccButtonElement.parentNode.insertBefore(element, ccButtonElement.nextElementSibling);
                this.changeStyle();
                this.drawed = true;
            }
        };
        this.deleteElement = () => {
            var _a;
            (_a = document.getElementById(SwitchingButtonElement.ELEMENT_ID)) === null || _a === void 0 ? void 0 : _a.remove();
            this.drawed = false;
            this.mouseOver = false;
            this.clicked = false;
        };
        this.getElement = () => {
            return document.getElementById(SwitchingButtonElement.ELEMENT_ID);
        };
        this.callbackFuncMouseOver = (e) => {
            this.mouseOver = true;
            this.changeStyle();
        };
        this.callbackFuncMouseLeave = (e) => {
            this.mouseOver = false;
            this.changeStyle();
        };
        this.callbackFuncClick = (e) => {
            this.clicked = !this.clicked;
            this.changeStyle();
            this.clickCallback(this.clicked);
        };
        this.changeStyle = () => {
            const element = this.getElement();
            if (element === null)
                return;
            element.style.width = "40px";
            element.style.height = "40px";
            element.style.backgroundColor = "rgb(60, 64, 67)";
            element.style.borderRadius = "20px";
            element.style.paddingTop = "12px";
            element.style.paddingBottom = "12px";
            element.style.display = "inline-block";
            element.style.boxSizing = "border-box";
            element.style.filter = "brightness(1)";
            element.innerText = "ON";
            element.style.color = "#FFF";
            if (this.mouseOver) {
                element.style.filter = "brightness(1.15)";
            }
            if (this.clicked) {
                element.style.color = "#000";
                element.innerText = "OFF";
                element.style.backgroundColor = "rgb(138,180,248)";
            }
        };
        this.clickCallback = callback;
    }
}
SwitchingButtonElement.ELEMENT_ID = "controlButton";


/***/ }),

/***/ "./src/core/ccLog.ts":
/*!***************************!*\
  !*** ./src/core/ccLog.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CcLog": () => (/* binding */ CcLog)
/* harmony export */ });
/* harmony import */ var _core_googleStorage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/googleStorage */ "./src/core/googleStorage.ts");

/**
 * ポップアップ内で入力した設定情報
 */
class CcLog {
    constructor(callbackFunc) {
        this.logs = {
            ccLogs: [],
        };
        this.getCcLog = (date) => {
            return this.logs.ccLogs.find((x) => x.date === date);
        };
        this.getCcLogs = () => {
            return this.logs.ccLogs;
        };
        this.setCcLogs = (ccLogs) => {
            this.logs.ccLogs = ccLogs;
            this.callbackFuncChange(this.logs.ccLogs);
        };
        this.addCcLog = (ccLog) => {
            this.logs.ccLogs.push(ccLog);
            this.callbackFuncChange(this.logs.ccLogs);
        };
        this.deleteCcLog = (date) => {
            this.logs.ccLogs = this.logs.ccLogs.filter((x) => x.date !== date);
            this.callbackFuncChange(this.logs.ccLogs);
        };
        this.saveCcLogs = () => {
            (0,_core_googleStorage__WEBPACK_IMPORTED_MODULE_0__.setStorage)("ccLogs", this.logs.ccLogs);
        };
        this.loadCcLogs = async () => {
            var _a;
            this.setCcLogs((_a = (await (0,_core_googleStorage__WEBPACK_IMPORTED_MODULE_0__.getStorage)("ccLogs"))) !== null && _a !== void 0 ? _a : []);
        };
        this.observeGoogleStorage = () => {
            (0,_core_googleStorage__WEBPACK_IMPORTED_MODULE_0__.addListener)((message) => {
                const data = JSON.parse(message);
                const logs = this.logs;
                if ("ccLogs" in data) {
                    logs.ccLogs = data.ccLogs;
                }
                this.setCcLogs(logs.ccLogs);
            });
        };
        this.callbackFuncChange = callbackFunc;
    }
}


/***/ }),

/***/ "./src/core/googleStorage.ts":
/*!***********************************!*\
  !*** ./src/core/googleStorage.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addListener": () => (/* binding */ addListener),
/* harmony export */   "getStorage": () => (/* binding */ getStorage),
/* harmony export */   "sendContents": () => (/* binding */ sendContents),
/* harmony export */   "setStorage": () => (/* binding */ setStorage)
/* harmony export */ });
const getStorage = async (key) => {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (data) => {
            if (key in data)
                resolve(data[key]);
            resolve(null);
        });
    });
};
const setStorage = (key, value) => {
    chrome.storage.local.set({ [key]: value });
};
const sendContents = (config) => {
    console.log(`send active tab: ${config}`);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, JSON.stringify(config), function (response) { });
    });
};
const addListener = (callbackFunc) => {
    chrome.runtime.onMessage.addListener(callbackFunc);
};


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
/*!*****************************!*\
  !*** ./src/content/main.ts ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "main": () => (/* binding */ main)
/* harmony export */ });
/* harmony import */ var _content_elements_switchingButtonElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/content/elements/switchingButtonElement */ "./src/content/elements/switchingButtonElement.ts");
/* harmony import */ var _content_core_ccOveserver__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/content/core/ccOveserver */ "./src/content/core/ccOveserver.ts");
/* harmony import */ var _core_ccLog__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/core/ccLog */ "./src/core/ccLog.ts");



const main = async () => {
    console.log("start: application");
    const callbackFuncChangeCcLogs = (ccLogs) => {
        console.log("mutate: ccLogs");
    };
    const ccLog = new _core_ccLog__WEBPACK_IMPORTED_MODULE_2__.CcLog(callbackFuncChangeCcLogs);
    await ccLog.loadCcLogs();
    const log = {
        ccLog: {
            date: 0,
            speeches: [],
        },
        recordedAt: null,
        recorded: false,
    };
    /**
     * コントロールボタン押下後のコールバック関数
     * @param clicked
     */
    const callbackFuncClick = (clicked) => {
        console.log("click: controlButton");
        if (clicked) {
            ccOveserver.run();
            console.log("start: observer");
            log.ccLog.date = new Date().getTime();
            log.recordedAt = new Date().getTime();
        }
        else {
            ccOveserver.stop();
            console.log("stop: observer");
            log.recordedAt = null;
            log.ccLog.date = 0;
            log.ccLog.speeches = [];
        }
    };
    const controlButtonElement = new _content_elements_switchingButtonElement__WEBPACK_IMPORTED_MODULE_0__.SwitchingButtonElement(callbackFuncClick);
    controlButtonElement.createElement();
    /**
     * 字幕変更検知後のコールバック関数
     * @param name
     * @param imagePath
     * @param speach
     */
    const callbackFuncObserver = (name, imagePath, speach) => {
        console.log("mutate: cc");
        console.log(`name: ${name}`);
        console.log(`imagePath: ${imagePath}`);
        console.log(`speach: ${speach}`);
        if (log.recordedAt !== null) {
            log.ccLog.date = new Date().getTime();
            log.ccLog.speeches.push({
                date: new Date().getTime(),
                name: name,
                speach: speach,
            });
        }
    };
    const ccOveserver = new _content_core_ccOveserver__WEBPACK_IMPORTED_MODULE_1__.CcOveserver(callbackFuncObserver);
};
// 動作確認用の入口
document.addEventListener("runScript", (e) => {
    main();
});
// // // script呼び出し用イベント
// const event = new Event("runScript", { bubbles: true })
// document.dispatchEvent(event)

})();

/******/ })()
;
//# sourceMappingURL=main.bundle.js.map