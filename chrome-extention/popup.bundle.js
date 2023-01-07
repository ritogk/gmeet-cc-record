/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/core/config.ts":
/*!****************************!*\
  !*** ./src/core/config.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Config": () => (/* binding */ Config),
/* harmony export */   "DisplayOriginalCc": () => (/* binding */ DisplayOriginalCc)
/* harmony export */ });
/* harmony import */ var _core_googleStorage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/googleStorage */ "./src/core/googleStorage.ts");

var DisplayOriginalCc;
(function (DisplayOriginalCc) {
    DisplayOriginalCc["OK"] = "1";
    DisplayOriginalCc["NG"] = "2";
})(DisplayOriginalCc || (DisplayOriginalCc = {}));
/**
 * ポップアップ内で入力した設定情報
 */
class Config {
    constructor(callbackFunc) {
        this.config = {
            opacityRate: 0.5,
            displayOriginalCc: DisplayOriginalCc.OK,
        };
        this.getConfig = () => {
            return this.config;
        };
        this.setConfig = (config) => {
            this.config = config;
            this.callbackFuncChangeConfig(this.config);
        };
        this.loadConfig = async () => {
            var _a, _b;
            this.config.opacityRate =
                (_a = (await (0,_core_googleStorage__WEBPACK_IMPORTED_MODULE_0__.getStorage)("opacityRate"))) !== null && _a !== void 0 ? _a : this.config.opacityRate;
            this.config.displayOriginalCc =
                (_b = (await (0,_core_googleStorage__WEBPACK_IMPORTED_MODULE_0__.getStorage)("displayOriginalCc"))) !== null && _b !== void 0 ? _b : this.config.displayOriginalCc;
        };
        this.observeGoogleStorage = () => {
            (0,_core_googleStorage__WEBPACK_IMPORTED_MODULE_0__.addListener)((message) => {
                console.log("receive: popup → content_scripts");
                const data = JSON.parse(message);
                const config = this.getConfig();
                if ("opacityRate" in data) {
                    config.opacityRate = data.opacityRate;
                }
                if ("displayOriginalCc" in data) {
                    config.opacityRate = data.displayOriginalCc;
                }
                this.setConfig(config);
            });
        };
        this.callbackFuncChangeConfig = callbackFunc;
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
    constructor(opacityRate, displayOriginalCc, callbackFuncChange) {
        this.elemets = {
            opacityRate: null,
            displayOriginalCc: null,
        };
        this.getElements = () => {
            return this.elemets;
        };
        this.getOpacityRateElement = () => {
            return this.elemets.opacityRate;
        };
        this.setOpacityRateElementValue = (opacityRate) => {
            if (!this.elemets.opacityRate)
                return;
            this.elemets.opacityRate.value = opacityRate.toString();
        };
        this.getDisplayOriginalCcElement = () => {
            return this.elemets.displayOriginalCc;
        };
        this.setDisplayOriginalCcElementChecked = (displayOriginalCc) => {
            if (!this.elemets.displayOriginalCc)
                return;
            if (displayOriginalCc === _core_config__WEBPACK_IMPORTED_MODULE_0__.DisplayOriginalCc.OK) {
                this.elemets.displayOriginalCc[0].checked = true;
            }
            if (displayOriginalCc === _core_config__WEBPACK_IMPORTED_MODULE_0__.DisplayOriginalCc.NG) {
                this.elemets.displayOriginalCc[1].checked = true;
            }
        };
        this.getDisplayOriginalCcElementChecked = () => {
            if (!this.elemets.displayOriginalCc)
                return null;
            if (this.elemets.displayOriginalCc[0].checked) {
                return this.elemets.displayOriginalCc[0];
            }
            else {
                return this.elemets.displayOriginalCc[1];
            }
        };
        this.callbackFuncChange = callbackFuncChange;
        this.elemets.opacityRate = (document.getElementsByName("opacityRate")[0]);
        this.elemets.displayOriginalCc = (document.getElementsByName("displayOriginalCc"));
        this.elemets.displayOriginalCc[0].value = _core_config__WEBPACK_IMPORTED_MODULE_0__.DisplayOriginalCc.OK;
        this.elemets.displayOriginalCc[1].value = _core_config__WEBPACK_IMPORTED_MODULE_0__.DisplayOriginalCc.NG;
        // 初期値
        this.elemets.opacityRate.value = opacityRate.toString();
        if (displayOriginalCc === _core_config__WEBPACK_IMPORTED_MODULE_0__.DisplayOriginalCc.OK) {
            this.elemets.displayOriginalCc[0].checked = true;
        }
        else {
            this.elemets.displayOriginalCc[1].checked = true;
        }
        this.elemets.opacityRate.addEventListener("change", (event) => {
            console.log("change opacityRate");
            if (event.target instanceof HTMLInputElement) {
                console.log(event.target.value);
                this.callbackFuncChange(Number(event.target.value), this.getDisplayOriginalCcElementChecked()
                    .value);
            }
        });
        this.elemets.displayOriginalCc[0].addEventListener("change", (event) => {
            var _a, _b;
            console.log("change displayOriginalCcElements");
            if (event.target instanceof HTMLInputElement) {
                if (!event.target.checked)
                    return;
                console.log(event.target.value);
                this.callbackFuncChange(Number((_b = (_a = this.getOpacityRateElement()) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "0"), event.target.value);
            }
        });
        this.elemets.displayOriginalCc[1].addEventListener("change", (event) => {
            var _a, _b;
            console.log("change displayOriginalCcElements");
            if (event.target instanceof HTMLInputElement) {
                if (!event.target.checked)
                    return;
                console.log(event.target.value);
                this.callbackFuncChange(Number((_b = (_a = this.getOpacityRateElement()) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "0"), event.target.value);
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
/* harmony import */ var _core_googleStorage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/core/googleStorage */ "./src/core/googleStorage.ts");



const run = async () => {
    console.log("start: popup");
    // config読み込み
    const config = new _core_config__WEBPACK_IMPORTED_MODULE_0__.Config((config) => { });
    await config.loadConfig();
    const configData = config.getConfig();
    console.log(`load config: ${JSON.stringify(configData)}`);
    // elementsの変更後のコールバック関数
    const callbackFuncChangeElement = (opacityRate, displayOriginalCc) => {
        // configとストレージを更新
        console.log("changeElement");
        configData.opacityRate = opacityRate;
        configData.displayOriginalCc = displayOriginalCc;
        (0,_core_googleStorage__WEBPACK_IMPORTED_MODULE_2__.setStorage)("opacityRate", opacityRate);
        (0,_core_googleStorage__WEBPACK_IMPORTED_MODULE_2__.setStorage)("displayOriginalCc", displayOriginalCc);
        (0,_core_googleStorage__WEBPACK_IMPORTED_MODULE_2__.sendContents)(configData);
    };
    const elements = new _popup_elements__WEBPACK_IMPORTED_MODULE_1__.Elements(configData.opacityRate, configData.displayOriginalCc, callbackFuncChangeElement);
};
window.addEventListener("load", run, false);

})();

/******/ })()
;
//# sourceMappingURL=popup.bundle.js.map