import { CcAreaElement } from "@/content/elements/ccAreaElement"
import { main } from "@/content/main"
const run = (): void => {
  const ccAreaElement = new CcAreaElement()
  const jsLoaded = (): void => {
    if (ccAreaElement.getElement()) {
      clearInterval(jsInitCheckTimer)
      main()
    }
  }
  const jsInitCheckTimer = setInterval(jsLoaded, 1000)
}

window.addEventListener("load", run, false)
