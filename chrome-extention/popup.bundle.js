/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/core/chromeStorage.ts":
/*!***********************************!*\
  !*** ./src/core/chromeStorage.ts ***!
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


/***/ }),

/***/ "./src/core/config.ts":
/*!****************************!*\
  !*** ./src/core/config.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Config": () => (/* binding */ Config),
/* harmony export */   "FormatType": () => (/* binding */ FormatType)
/* harmony export */ });
/* harmony import */ var _core_chromeStorage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/chromeStorage */ "./src/core/chromeStorage.ts");

var FormatType;
(function (FormatType) {
    FormatType["TEXT"] = "1";
    FormatType["MARKDOWN"] = "2";
})(FormatType || (FormatType = {}));
/**
 * ポップアップ内で入力した設定情報
 */
class Config {
    constructor(callbackFunc) {
        this.config = {
            formatType: FormatType.TEXT,
        };
        this.getConfig = () => {
            return this.config;
        };
        this.setConfig = (config) => {
            this.config = config;
            this.callbackFuncChangeConfig(this.config);
        };
        this.loadConfig = async () => {
            var _a;
            this.config.formatType =
                (_a = (await (0,_core_chromeStorage__WEBPACK_IMPORTED_MODULE_0__.getStorage)("formatType"))) !== null && _a !== void 0 ? _a : this.config.formatType;
        };
        this.observeGoogleStorage = () => {
            (0,_core_chromeStorage__WEBPACK_IMPORTED_MODULE_0__.addListener)((message) => {
                console.log("receive: popup → content_scripts");
                const data = JSON.parse(message);
                const config = this.getConfig();
                if ("formatType" in data) {
                    config.formatType = data.formatType;
                }
                this.setConfig(config);
            });
        };
        this.callbackFuncChangeConfig = callbackFunc;
    }
}


/***/ }),

/***/ "./src/popup/elements.ts":
/*!*******************************!*\
  !*** ./src/popup/elements.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Elements": () => (/* binding */ Elements)
/* harmony export */ });
/* harmony import */ var _core_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/config */ "./src/core/config.ts");

class Elements {
    constructor(formatType, callbackFuncChange) {
        this.elemets = {
            formatType: null,
        };
        this.getElements = () => {
            return this.elemets;
        };
        this.getFormatTypeElement = () => {
            return this.elemets.formatType;
        };
        this.setFormatTypeElementChecked = (formatType) => {
            if (!this.elemets.formatType)
                return;
            if (formatType === _core_config__WEBPACK_IMPORTED_MODULE_0__.FormatType.TEXT) {
                this.elemets.formatType[0].checked = true;
            }
            if (formatType === _core_config__WEBPACK_IMPORTED_MODULE_0__.FormatType.MARKDOWN) {
                this.elemets.formatType[1].checked = true;
            }
        };
        this.getFormatTypeElementChecked = () => {
            if (!this.elemets.formatType)
                return null;
            if (this.elemets.formatType[0].checked) {
                return this.elemets.formatType[0];
            }
            else {
                return this.elemets.formatType[1];
            }
        };
        this.callbackFuncChange = callbackFuncChange;
        this.elemets.formatType = (document.getElementsByName("formatType"));
        this.elemets.formatType[0].value = _core_config__WEBPACK_IMPORTED_MODULE_0__.FormatType.TEXT;
        this.elemets.formatType[1].value = _core_config__WEBPACK_IMPORTED_MODULE_0__.FormatType.MARKDOWN;
        // 初期値
        if (formatType === _core_config__WEBPACK_IMPORTED_MODULE_0__.FormatType.TEXT) {
            this.elemets.formatType[0].checked = true;
        }
        else {
            this.elemets.formatType[1].checked = true;
        }
        // 変更を検知してcallbackを実行
        this.elemets.formatType[0].addEventListener("change", (event) => {
            console.log("change formatTypeElements");
            if (event.target instanceof HTMLInputElement) {
                if (!event.target.checked)
                    return;
                console.log(event.target.value);
                this.callbackFuncChange(event.target.value);
            }
        });
        // 変更を検知してcallbackを実行
        this.elemets.formatType[1].addEventListener("change", (event) => {
            console.log("change formatTypeElements");
            if (event.target instanceof HTMLInputElement) {
                if (!event.target.checked)
                    return;
                console.log(event.target.value);
                this.callbackFuncChange(event.target.value);
            }
        });
    }
}


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
/*!**************************!*\
  !*** ./src/popup/run.ts ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "run": () => (/* binding */ run)
/* harmony export */ });
/* harmony import */ var _core_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/config */ "./src/core/config.ts");
/* harmony import */ var _popup_elements__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/popup/elements */ "./src/popup/elements.ts");
/* harmony import */ var _core_chromeStorage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/core/chromeStorage */ "./src/core/chromeStorage.ts");



const run = async () => {
    console.log("start: popup");
    // config読み込み
    const config = new _core_config__WEBPACK_IMPORTED_MODULE_0__.Config((config) => { });
    await config.loadConfig();
    const configData = config.getConfig();
    console.log(`load config: ${JSON.stringify(configData)}`);
    // elementsの変更後のコールバック関数
    const callbackFuncChangeElement = (formatType) => {
        // configとストレージを更新
        console.log("changeElement");
        configData.formatType = formatType;
        (0,_core_chromeStorage__WEBPACK_IMPORTED_MODULE_2__.setStorage)("formatType", formatType);
        (0,_core_chromeStorage__WEBPACK_IMPORTED_MODULE_2__.sendContents)(configData);
    };
    const elements = new _popup_elements__WEBPACK_IMPORTED_MODULE_1__.Elements(configData.formatType, callbackFuncChangeElement);
};
window.addEventListener("load", run, false);

})();

/******/ })()
;
//# sourceMappingURL=popup.bundle.js.map