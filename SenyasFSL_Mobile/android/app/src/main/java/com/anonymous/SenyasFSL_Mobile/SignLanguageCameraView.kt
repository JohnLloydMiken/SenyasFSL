package com.anonymous.SenyasFSL_Mobile

import android.content.Context
import android.graphics.*
import android.os.SystemClock
import android.util.AttributeSet
import android.util.Log
import android.widget.FrameLayout
import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.core.content.ContextCompat
import androidx.lifecycle.LifecycleOwner
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.events.RCTEventEmitter
import java.util.concurrent.Executors
import java.io.ByteArrayOutputStream

class SignLanguageCameraView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : FrameLayout(context, attrs, defStyleAttr) {

    private val cameraExecutor = Executors.newSingleThreadExecutor()
    private var cameraProvider: ProcessCameraProvider? = null
    private var isInitialized = false

    init {
        // ⛔ No PreviewView added, we skip rendering
        Log.d("SignLanguageCameraView", "Camera view initialized ✅ (headless)")
    }

    fun startCamera(lifecycleOwner: LifecycleOwner) {
        Log.d("SignLanguageCameraView", "Camera start requested")
        if (isInitialized) return

        val cameraProviderFuture = ProcessCameraProvider.getInstance(context)
        cameraProviderFuture.addListener({
            try {
                cameraProvider = cameraProviderFuture.get()

                // ❌ Removed Preview
                val imageAnalyzer = ImageAnalysis.Builder()
                    .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                    .setTargetResolution(android.util.Size(640, 480))
                    .build()
                    .also {
                        it.setAnalyzer(cameraExecutor) { imageProxy ->
                            processImageProxy(imageProxy)
                        }
                    }

                val cameraSelector = CameraSelector.DEFAULT_FRONT_CAMERA

                cameraProvider?.unbindAll()
                cameraProvider?.bindToLifecycle(
                    lifecycleOwner, cameraSelector, imageAnalyzer
                )

                isInitialized = true
                Log.d("SignLanguageCameraView", "Camera bound successfully 🎥 (headless)")

                // ✅ Tell JS camera is ready
                if (context is ThemedReactContext) {
                    val reactContext = context as ThemedReactContext
                    reactContext
                        .getJSModule(RCTEventEmitter::class.java)
                        .receiveEvent(id, "onCameraReady", null)
                }

            } catch (exc: Exception) {
                Log.e("SignLanguageCameraView", "Use case binding failed", exc)
            }
        }, ContextCompat.getMainExecutor(context))
    }

    private fun processImageProxy(imageProxy: ImageProxy) {
        try {
            val bitmap = imageProxy.toBitmap()
            if (bitmap != null) {
                val timestamp = SystemClock.uptimeMillis()
                val rotationDegrees = imageProxy.imageInfo.rotationDegrees
                SignLanguageModule.getInstance()?.processFrame(bitmap, rotationDegrees, timestamp)
            }
        } catch (e: Exception) {
            Log.e("SignLanguageCameraView", "Frame processing error", e)
        } finally {
            imageProxy.close()
        }
    }

    fun stopCamera() {
        try {
            cameraProvider?.unbindAll()
            isInitialized = false
            Log.d("SignLanguageCameraView", "Camera stopped")
        } catch (e: Exception) {
            Log.e("SignLanguageCameraView", "stopCamera failed", e)
        }
    }
}

