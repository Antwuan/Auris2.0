package expo.modules.microphonestream

import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise
import kotlin.concurrent.thread
import java.util.concurrent.atomic.AtomicBoolean

val BUF_PER_SEC = 10 // Reduced from 15 to 10 for better performance

class MicrophoneStreamModule : Module() {

    private var audioRecord: AudioRecord? = null
    private val isRecording = AtomicBoolean(false)
    private var recordingThread: Thread? = null
    private val sampleRate = 44100 // Default sample rate
    private val bufferSize = maxOf(
        sampleRate / BUF_PER_SEC,
        AudioRecord.getMinBufferSize(
            sampleRate,
            AudioFormat.CHANNEL_IN_MONO,
            AudioFormat.ENCODING_PCM_16BIT
        )
    )

    override fun definition() = ModuleDefinition {
        Name("MicrophoneStream")

        Events("onAudioBuffer")

        Constants(
            "BUF_PER_SEC" to BUF_PER_SEC
        )

        Function("startRecording") {
            startRecording()
        }

        Function("stopRecording") {
            stopRecording()
        }

        Function("getSampleRate") { -> 
            sampleRate.toDouble()
        }
    }

    private fun startRecording() {
        if (isRecording.get()) return

        try {
            audioRecord = AudioRecord(
                MediaRecorder.AudioSource.MIC,
                sampleRate,
                AudioFormat.CHANNEL_IN_MONO,
                AudioFormat.ENCODING_PCM_16BIT,
                bufferSize
            )

            if (audioRecord?.state != AudioRecord.STATE_INITIALIZED) {
                throw IllegalStateException("AudioRecord failed to initialize")
            }

            isRecording.set(true)
            audioRecord?.startRecording()

            recordingThread = thread(name = "AudioRecordingThread") {
                val buffer = ShortArray(bufferSize)
                try {
                    while (isRecording.get()) {
                        val read = audioRecord?.read(buffer, 0, buffer.size) ?: 0
                        if (read > 0) {
                            val floatBuffer = FloatArray(read)
                            for (i in 0 until read) {
                                floatBuffer[i] = buffer[i] / 32768.0f
                            }
                            sendEvent("onAudioBuffer", mapOf("samples" to floatBuffer.toList()))
                        }
                    }
                } catch (e: Exception) {
                    println("Error in recording thread: ${e.message}")
                }
            }
        } catch (e: Exception) {
            println("Error starting recording: ${e.message}")
            stopRecording()
            throw e
        }
    }

    private fun stopRecording() {
        isRecording.set(false)
        
        try {
            recordingThread?.join(1000) // Wait up to 1 second for thread to finish
        } catch (e: InterruptedException) {
            println("Interrupted while waiting for recording thread: ${e.message}")
        }
        
        try {
            audioRecord?.stop()
        } catch (e: Exception) {
            println("Error stopping AudioRecord: ${e.message}")
        }
        
        try {
            audioRecord?.release()
        } catch (e: Exception) {
            println("Error releasing AudioRecord: ${e.message}")
        }
        
        audioRecord = null
        recordingThread = null
    }
}