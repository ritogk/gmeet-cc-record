import { CcAreaElement } from "@/content/elements/ccAreaElement"
export interface ccOveserverInterface {
  run: () => void
  stop: () => void
}

const config = { childList: true, subtree: true }

/**
 * 字幕の変更監視クラス
 */
export class CcOveserver implements ccOveserverInterface {
  private observer: MutationObserver | null = null
  private callbackFuncObserver: (
    name: string,
    imagePath: string,
    speach: string
  ) => void

  constructor(
    callbackFunc: (name: string, imagePath: string, speach: string) => void
  ) {
    this.callbackFuncObserver = callbackFunc
  }
  run = (): void => {
    const mutationCallback: MutationCallback = (
      mutations: MutationRecord[],
      observer: MutationObserver
    ) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          if (mutation.target.nodeName === "SPAN") {
            const speechAreaNode = mutation.target
            const userAreaNode =
              speechAreaNode.parentNode?.parentNode?.parentNode
            if (!userAreaNode) return
            const userAreaNodeList = Array.from(userAreaNode.children)
            if (userAreaNodeList.length !== 3) return
            this.callbackFuncObserver(
              userAreaNodeList[1].textContent ?? "",
              (userAreaNodeList[0] as HTMLImageElement).src,
              userAreaNodeList[2].textContent ?? ""
            )
          }
        }
      }
    }

    this.observer = new MutationObserver(mutationCallback)
    const oveserverNode = new CcAreaElement().getCcElement()
    this.observer.observe(<Node>oveserverNode, config)
  }
  stop = (): void => {
    this.observer?.disconnect()
  }
}
