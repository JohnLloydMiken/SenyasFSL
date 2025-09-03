package com.anonymous.SenyasFSL_Mobile

import androidx.lifecycle.LifecycleOwner
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class SignLanguageCameraViewManager : SimpleViewManager<SignLanguageCameraView>() {

    companion object {
        const val REACT_CLASS = "SignLanguageCameraView"
    }

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext): SignLanguageCameraView {
        return SignLanguageCameraView(reactContext)
    }

    @ReactProp(name = "startCamera", defaultBoolean = false)
    fun setStartCamera(view: SignLanguageCameraView, startCamera: Boolean) {
        if (startCamera) {
            val activity = view.context as? LifecycleOwner
            if (activity != null) {
                view.startCamera(activity)
            } else {
                val reactActivity = (view.context as? ThemedReactContext)?.currentActivity
                if (reactActivity is LifecycleOwner) {
                    view.startCamera(reactActivity)
                }
            }
        } else {
            view.stopCamera()
        }
    }
}