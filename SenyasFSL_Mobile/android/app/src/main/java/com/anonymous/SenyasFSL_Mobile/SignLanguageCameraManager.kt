package com.anonymous.SenyasFSL_Mobile

import android.util.Log
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import androidx.lifecycle.LifecycleOwner

class SignLanguageCameraViewManager : SimpleViewManager<SignLanguageCameraView>() {

    override fun getName(): String = "SignLanguageCameraView"

    override fun createViewInstance(reactContext: ThemedReactContext): SignLanguageCameraView {
        return SignLanguageCameraView(reactContext)
    }

    @ReactProp(name = "startCamera", defaultBoolean = false)
    fun setStartCamera(view: SignLanguageCameraView, startCamera: Boolean) {
        if (startCamera) {
            val activity = view.context as? ThemedReactContext
            activity?.currentActivity?.let { act ->
                if (act is LifecycleOwner) {
                    view.startCamera(act)
                } else {
                    Log.e("SignLanguageCameraView", "Current activity is not a LifecycleOwner")
                }
            } ?: Log.e("SignLanguageCameraView", "No currentActivity available")
        } else {
            view.stopCamera()
        }
    }

    // ✅ Register custom events for RN
    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> {
        return mutableMapOf(
            "onCameraReady" to mutableMapOf("registrationName" to "onCameraReady"),
            "onCameraError" to mutableMapOf("registrationName" to "onCameraError")
        )
    }
}
