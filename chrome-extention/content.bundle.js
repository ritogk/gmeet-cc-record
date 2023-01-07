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

/***/ "./src/content/elements/UsersAreaElement.ts":
/*!**************************************************!*\
  !*** ./src/content/elements/UsersAreaElement.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UsersAreaElement": () => (/* binding */ UsersAreaElement)
/* harmony export */ });
/* harmony import */ var _content_core_selector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/content/core/selector */ "./src/content/core/selector.ts");
/* harmony import */ var _core_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/core/dom */ "./src/core/dom.ts");


const userCcClassName = "user-cc-class-name";
/**
 * ユーザーエリアのElementに関するクラス
 */
class UsersAreaElement {
    constructor() {
        this.getElement = () => {
            return document.querySelector(_content_core_selector__WEBPACK_IMPORTED_MODULE_0__.selector.usersArea);
        };
        // ユーザーエリアの要素を取得
        this.findUserAreaElement = (name) => {
            const usersAreaElement = this.getElement();
            if (!usersAreaElement)
                return undefined;
            const userAreaList = Array.from(usersAreaElement.children);
            return userAreaList.find((element) => {
                var _a;
                // 画面共有ようのエリアはinnerTextが取得できないのでその対応
                const userNameArea = element.querySelector("[data-self-name]");
                if (!userNameArea)
                    return false;
                if ((_a = userNameArea.textContent) === null || _a === void 0 ? void 0 : _a.startsWith(name)) {
                    return true;
                }
                return false;
            });
        };
        // ユーザーのvideo要素を取得
        this.findUserVideoElement = (name) => {
            const userAreaElement = this.findUserAreaElement(name);
            if (!userAreaElement)
                return undefined;
            // 非表示のVideoタグが紛れる事があるのでその対応。
            const videoAreaElements = userAreaElement.querySelectorAll("video");
            let userVideoElement = null;
            if (videoAreaElements.length >= 2) {
                videoAreaElements.forEach((element) => {
                    if (element.style.display == "none")
                        return;
                    userVideoElement = element;
                });
            }
            else {
                userVideoElement = videoAreaElements[0];
            }
            return userVideoElement !== null ? userVideoElement : undefined;
        };
        // ユーザー字幕の取得
        this.findUserCcElement = (name) => {
            const userAreaElement = this.findUserAreaElement(name);
            if (!userAreaElement)
                return undefined;
            const userCcElement = userAreaElement.querySelector("." + userCcClassName);
            return userCcElement !== null ? userCcElement : undefined;
        };
        // 字幕 追加
        this.appendUserCcElement = (name, speach) => {
            var _a;
            const userAreaElement = this.findUserAreaElement(name);
            if (!userAreaElement)
                return;
            const userVideoElement = this.findUserVideoElement(name);
            if (!userVideoElement)
                return;
            const userCcElement = document.createElement("div");
            userCcElement.style.color = "white";
            userCcElement.style.position = "absolute";
            userCcElement.style.bottom = "0";
            userCcElement.style.backgroundColor = "rgba(0,0,0,0.25)";
            userCcElement.style.margin = "0";
            userCcElement.style.zIndex = "1000000";
            userCcElement.textContent = speach;
            userCcElement.className = userCcClassName;
            userCcElement.style.opacity = this.userCcOpacityRate.toString();
            userCcElement.style.fontWeight = "700";
            userCcElement.style.textAlign = "center";
            userCcElement.style.pointerEvents = "none";
            const fontSize = Math.floor(userVideoElement.clientWidth / 35);
            fontSize < 18
                ? (userCcElement.style.fontSize = "15px")
                : (userCcElement.style.fontSize = `${fontSize}px`);
            fontSize < 27
                ? (userCcElement.style.webkitTextStroke = "1px #000")
                : (userCcElement.style.webkitTextStroke = "2px #000");
            (_a = userVideoElement.parentElement) === null || _a === void 0 ? void 0 : _a.after(userCcElement);
            if (fontSize >= 18) {
                userCcElement.style.height = `${userVideoElement.clientHeight / 4.3}px`;
            }
            userCcElement.style.width = "100%";
            // ログに追加
            const userCcEmenet = this.findUserCcElement(name);
            if (!userCcEmenet)
                return;
            this.appendDisplayUserCc(name, userCcEmenet);
        };
        // 字幕 更新
        this.updateUserCcElement = (name, speach) => {
            const userAreraElement = this.findUserAreaElement(name);
            if (!userAreraElement)
                return;
            const userVideoElement = this.findUserVideoElement(name);
            if (!userVideoElement)
                return;
            const userCcElement = this.findUserCcElement(name);
            if (!userCcElement)
                return;
            userCcElement.textContent = speach;
            const fontSize = Math.floor(userVideoElement.clientWidth / 35);
            fontSize < 18
                ? (userCcElement.style.fontSize = "15px")
                : (userCcElement.style.fontSize = `${fontSize}px`);
            fontSize < 27
                ? (userCcElement.style.webkitTextStroke = "1px #000")
                : (userCcElement.style.webkitTextStroke = "2px #000");
            if (fontSize >= 18) {
                userCcElement.style.height = `${userVideoElement.clientHeight / 4.3}px`;
            }
            // ログに追加
            this.appendDisplayUserCc(name, userCcElement);
        };
        // 字幕 削除
        this.deleteUserCcElement = (name) => {
            const displaySpeach = this.displayUserCcList.find((x) => x.name === name);
            if (!displaySpeach)
                return;
            (0,_core_dom__WEBPACK_IMPORTED_MODULE_1__.removeElement)(displaySpeach.element, 2000);
        };
        // 全字幕 削除
        this.deleteUserCcElements = () => {
            this.displayUserCcList.forEach((x) => {
                (0,_core_dom__WEBPACK_IMPORTED_MODULE_1__.removeElement)(x.element, 2000);
            });
        };
        // 字幕の透明度を変える
        this.userCcOpacityRate = 0.5;
        this.setUserCcOpacityRate = (opacityRate) => {
            this.userCcOpacityRate = opacityRate;
            this.displayUserCcList.forEach((x) => {
                x.element.style.opacity = this.userCcOpacityRate.toString();
            });
        };
        this.displayUserCcList = [];
        this.appendDisplayUserCc = (name, element) => {
            this.displayUserCcList = this.displayUserCcList.filter((displayUserSpeash) => displayUserSpeash.name !== name);
            this.displayUserCcList.push({
                name: name,
                time: new Date().getTime(),
                element: element,
            });
        };
        this.cclimitSecond = 7;
        this.intervalId = 0;
        this.runInterval = () => {
            // 一定時間表示した字幕は消す
            this.intervalId = window.setInterval(() => {
                const oldDisplayUserCcList = this.displayUserCcList.filter((x) => (new Date().getTime() - x.time) / 1000 > this.cclimitSecond);
                oldDisplayUserCcList.forEach((x) => {
                    (0,_core_dom__WEBPACK_IMPORTED_MODULE_1__.removeElement)(x.element, 2000);
                });
                this.displayUserCcList = this.displayUserCcList.filter((x) => (new Date().getTime() - x.time) / 1000 < this.cclimitSecond);
            }, 3000);
        };
        this.stopInterval = () => {
            clearInterval(this.intervalId);
        };
    }
}


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

/***/ "./src/content/main.ts":
/*!*****************************!*\
  !*** ./src/content/main.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "main": () => (/* binding */ main)
/* harmony export */ });
/* harmony import */ var _core_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/core/config */ "./src/core/config.ts");
/* harmony import */ var _content_elements_UsersAreaElement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/content/elements/UsersAreaElement */ "./src/content/elements/UsersAreaElement.ts");
/* harmony import */ var _content_elements_switchingButtonElement__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/content/elements/switchingButtonElement */ "./src/content/elements/switchingButtonElement.ts");
/* harmony import */ var _content_elements_ccAreaElement__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/content/elements/ccAreaElement */ "./src/content/elements/ccAreaElement.ts");
/* harmony import */ var _content_core_ccOveserver__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/content/core/ccOveserver */ "./src/content/core/ccOveserver.ts");





const main = async () => {
    console.log("start: application");
    const usersAreaElement = new _content_elements_UsersAreaElement__WEBPACK_IMPORTED_MODULE_1__.UsersAreaElement();
    const ccAreaElement = new _content_elements_ccAreaElement__WEBPACK_IMPORTED_MODULE_3__.CcAreaElement();
    /**
     * 設定ファイル変更時のコールバック関数
     * @param config
     */
    const callbackFuncChangeConfig = (config) => {
        console.log(JSON.stringify(config));
        // 字幕の透明度
        usersAreaElement.setUserCcOpacityRate(config.opacityRate);
        // 字幕の表示非表示制御
        if (config.displayOriginalCc == _core_config__WEBPACK_IMPORTED_MODULE_0__.DisplayOriginalCc.OK) {
            ccAreaElement.showElement();
        }
        else {
            ccAreaElement.hideElement();
        }
    };
    const config = new _core_config__WEBPACK_IMPORTED_MODULE_0__.Config(callbackFuncChangeConfig);
    await config.loadConfig();
    console.log(`load config: ${JSON.stringify(config.getConfig())}`);
    config.observeGoogleStorage();
    /**
     * コントロールボタン押下後のコールバック関数
     * @param clicked
     */
    const callbackFuncClick = (clicked) => {
        console.log("click: controlButton");
        if (clicked) {
            ccOveserver.run();
            console.log("start: observer");
            usersAreaElement.runInterval();
            console.log("run: interval");
        }
        else {
            ccOveserver.stop();
            console.log("stop: observer");
            usersAreaElement.stopInterval();
            console.log("stop: interval");
            usersAreaElement.deleteUserCcElements();
            console.log("delete: cc elements");
        }
    };
    const controlButtonElement = new _content_elements_switchingButtonElement__WEBPACK_IMPORTED_MODULE_2__.SwitchingButtonElement(callbackFuncClick);
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
        if (!usersAreaElement.findUserCcElement(name)) {
            usersAreaElement.appendUserCcElement(name, speach);
        }
        else {
            usersAreaElement.updateUserCcElement(name, speach);
        }
    };
    const ccOveserver = new _content_core_ccOveserver__WEBPACK_IMPORTED_MODULE_4__.CcOveserver(callbackFuncObserver);
};
// 動作確認用の入口
document.addEventListener("runScript", (e) => {
    main();
});
// // script呼び出し用イベント
// const event = new Event("runScript", { bubbles: true })
// document.dispatchEvent(event)


/***/ }),

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

/***/ "./src/core/dom.ts":
/*!*************************!*\
  !*** ./src/core/dom.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "removeElement": () => (/* binding */ removeElement)
/* harmony export */ });
/**
 * Elementの削除を行います。
 * @param el
 * @param speed
 */
const removeElement = (el, speed) => {
    var seconds = speed / 1000;
    el.style.transition = "opacity " + seconds + "s ease";
    el.style.opacity = "0";
    setTimeout(function () {
        var _a;
        (_a = el.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(el);
    }, speed);
};



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
/*!****************************!*\
  !*** ./src/content/run.ts ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _content_elements_ccAreaElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/content/elements/ccAreaElement */ "./src/content/elements/ccAreaElement.ts");
/* harmony import */ var _content_main__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/content/main */ "./src/content/main.ts");


const run = () => {
    const ccAreaElement = new _content_elements_ccAreaElement__WEBPACK_IMPORTED_MODULE_0__.CcAreaElement();
    const jsLoaded = () => {
        if (ccAreaElement.getElement()) {
            clearInterval(jsInitCheckTimer);
            (0,_content_main__WEBPACK_IMPORTED_MODULE_1__.main)();
        }
    };
    const jsInitCheckTimer = setInterval(jsLoaded, 1000);
};
window.addEventListener("load", run, false);

})();

/******/ })()
;
//# sourceMappingURL=content.bundle.js.map