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
import java.util.concurrent.Executors
import java.io.ByteArrayOutputStream

class SignLanguageCameraView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : FrameLayout(context, attrs, defStyleAttr) {

    private val previewView: PreviewView = PreviewView(context)
    private val cameraExecutor = Executors.newSingleThreadExecutor()

    init {
        addView(previewView)
    }

    fun startCamera(lifecycleOwner: LifecycleOwner) {
        Log.d("SignLanguageCameraView", "Camera started")
        val cameraProviderFuture = ProcessCameraProvider.getInstance(context)
        cameraProviderFuture.addListener({
            try {
                val cameraProvider = cameraProviderFuture.get()

                val preview = Preview.Builder()
                    .build()
                    .also { it.setSurfaceProvider(previewView.surfaceProvider) }

                val analysis = ImageAnalysis.Builder()
                    .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                    .build()

                analysis.setAnalyzer(cameraExecutor) { imageProxy: ImageProxy ->
                    try {
                        Log.d("SignLanguageCameraView", "Frame received: ${imageProxy.width}x${imageProxy.height}, rotation: ${imageProxy.imageInfo.rotationDegrees}")

                        val bitmap = imageProxy.toBitmap()
                        if (bitmap != null) {
                            // Rotate and mirror
                            val rotationDegrees = imageProxy.imageInfo.rotationDegrees.toFloat()
                            var processedBitmap = bitmap.rotate(rotationDegrees)
                            // Mirror for front camera
                            processedBitmap = processedBitmap.mirror()

                            val timestampMs = SystemClock.uptimeMillis()
                            SignLanguageModule.getInstance()?.processFrame(processedBitmap, timestampMs)
                        }
                    } catch (e: Exception) {
                        Log.e("SignLanguageCameraView", "Frame processing error", e)
                    } finally {
                        imageProxy.close()
                    }
                }

                val cameraSelector = CameraSelector.DEFAULT_FRONT_CAMERA

                cameraProvider.unbindAll()
                cameraProvider.bindToLifecycle(
                    lifecycleOwner,
                    cameraSelector,
                    preview,
                    analysis
                )
            } catch (e: Exception) {
                Log.e("SignLanguageCameraView", "startCamera failed", e)
            }
        }, ContextCompat.getMainExecutor(context))
    }

    fun stopCamera() {
        try {
            val cameraProviderFuture = ProcessCameraProvider.getInstance(context)
            val cameraProvider = cameraProviderFuture.get()
            cameraProvider.unbindAll()
        } catch (e: Exception) {
            Log.e("SignLanguageCameraView", "stopCamera failed", e)
        }
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        cameraExecutor.shutdown()
    }
}

// YUV to Bitmap conversion without RenderScript
private fun ImageProxy.toBitmap(): Bitmap? {
    if (format != ImageFormat.YUV_420_888) {
        Log.e("SignLanguageCameraView", "Unsupported format: $format")
        return null
    }

    try {
        val yBuffer = planes[0].buffer
        val uBuffer = planes[1].buffer
        val vBuffer = planes[2].buffer

        val ySize = yBuffer.remaining()
        val uSize = uBuffer.remaining()
        val vSize = vBuffer.remaining()

        val nv21 = ByteArray(ySize + uSize + vSize)
        yBuffer.get(nv21, 0, ySize)
        vBuffer.get(nv21, ySize, vSize) // NV21: V then U
        uBuffer.get(nv21, ySize + vSize, uSize)

        val yuvImage = YuvImage(nv21, ImageFormat.NV21, width, height, null)
        val out = ByteArrayOutputStream()
        yuvImage.compressToJpeg(Rect(0, 0, width, height), 90, out)
        val imageBytes = out.toByteArray()
        return BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
    } catch (e: Exception) {
        Log.e("SignLanguageCameraView", "toBitmap failed", e)
        return null
    }
}

// Bitmap extensions
private fun Bitmap.rotate(degrees: Float): Bitmap {
    if (degrees == 0f) return this
    val matrix = Matrix().apply { postRotate(degrees) }
    return Bitmap.createBitmap(this, 0, 0, width, height, matrix, true)
}

private fun Bitmap.mirror(): Bitmap {
    val matrix = Matrix().apply { postScale(-1f, 1f, width / 2f, height / 2f) }
    return Bitmap.createBitmap(this, 0, 0, width, height, matrix, true)
}