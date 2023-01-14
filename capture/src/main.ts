var streamData: MediaStream | null = null
var recorder: MediaRecorder | null = null

let audioData = [] as Blob[]
let audioExtension = ""

window.addEventListener("load", function () {
  const buttonStopElement = document.getElementById("buttonStop")
  buttonStopElement?.addEventListener("click", stop)
  const buttonDLElement = document.getElementById("buttonDL")
  buttonDLElement?.addEventListener("click", dl)

  function testCapture() {
    console.log("Test with method capture().")
    chrome.tabCapture.capture(
      {
        video: true,
        audio: true,
        videoConstraints: {
          mandatory: {
            minWidth: 16,
            minHeight: 9,
            maxWidth: 854,
            maxHeight: 480,
            maxFrameRate: 60, // Note: Frame rate is variable (0 <= x <= 60).
          },
        },
      },
      (stream: MediaStream | null) => {
        if (!stream) return
        streamData = stream
        recorder = new MediaRecorder(streamData)
        console.log(recorder)
        recorder.addEventListener("dataavailable", (e) => {
          audioData.push(e.data)
          audioExtension = getExtension(e.data.type)
        })
        recorder.start()
      }
    )
  }

  function getExtension(audioType: string) {
    let extension = "wav"
    const matches = audioType.match(/audio\/([^;]+)/)

    if (matches) {
      extension = matches[1]
    }

    return "." + extension
  }

  function start() {
    testCapture()
  }

  function stop(e: any) {
    debugger
    recorder?.stop()
    console.log("stop")
  }

  function dl(e: any) {
    console.log("dl")
    debugger
    const audioBlob = new Blob(audioData)
    const url = URL.createObjectURL(audioBlob)
    let a = document.createElement("a")
    a.href = url
    a.download = Math.floor(Date.now() / 1000) + audioExtension
    document.body.appendChild(a)
    a.click()
  }

  start()
})
