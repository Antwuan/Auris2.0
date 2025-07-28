import AVFoundation
import ExpoModulesCore

let BUF_PER_SEC = 15

public class MicrophoneStreamModule: Module {

  private let audioSession = AVAudioSession.sharedInstance()
  private let audioEngine = AVAudioEngine()
  private var audioBufferHandler: (([Float]) -> Void)?
  private var isRecording = false

  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('MicrophoneStream')` in JavaScript.
    Name("MicrophoneStream")

    // Defines event names that the module can send to JavaScript.
    Events("onAudioBuffer")

    Constants([
      "BUF_PER_SEC": BUF_PER_SEC
    ])

    Function("startRecording") {
      if self.isRecording {
        print("Recording already in progress")
        return
      }

      // Request microphone permission
      self.audioSession.requestRecordPermission { granted in
          guard granted else {
              print("Microphone permission not granted.")
              return
          }

          print("Configuring audioSession")
          DispatchQueue.main.async {
              do {
                  try self.audioSession.setCategory(.record, mode: .measurement, options: [])
                  try self.audioSession.setActive(true)

                  let inputNode = self.audioEngine.inputNode
                  let hwFormat = inputNode.inputFormat(forBus: 0)
                  let bufferSize = AVAudioFrameCount(self.audioSession.sampleRate / Double(BUF_PER_SEC))

                  inputNode.installTap(onBus: 0, bufferSize: bufferSize, format: hwFormat) { buffer, _ in
                      guard let channelData = buffer.floatChannelData else { return }
                      let frameLength = Int(buffer.frameLength)
                      let samples = Array(UnsafeBufferPointer(start: channelData[0], count: frameLength))
                      self.sendEvent("onAudioBuffer", [
                        "samples": samples
                      ])
                  }

                  try self.audioEngine.start()
                  self.isRecording = true
                  print("Audio recording started successfully")
              } catch {
                  print("Error configuring audio engine: \(error.localizedDescription)")
                  self.isRecording = false
              }
          }
      }
    }

    Function("stopRecording") {
      self.stopRecording()
    }

    Function("getSampleRate") { () -> Double in
      // Requires initializing inputNode before retrieving sampleRate
      return self.audioEngine.inputNode.inputFormat(forBus: 0).sampleRate
    }
  }

  private func stopRecording() {
    guard isRecording else {
      print("No recording in progress")
      return
    }
    
    isRecording = false
    
    do {
      audioEngine.inputNode.removeTap(onBus: 0)
      audioEngine.stop()
      try AVAudioSession.sharedInstance().setActive(false)
      audioBufferHandler = nil
      print("Audio recording stopped successfully")
    } catch {
      print("Error stopping audio recording: \(error.localizedDescription)")
    }
  }
}
