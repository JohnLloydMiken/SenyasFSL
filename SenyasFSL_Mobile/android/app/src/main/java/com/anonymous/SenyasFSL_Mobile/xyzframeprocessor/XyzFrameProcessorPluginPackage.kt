package com.anonymous.SenyasFSL_Mobile.xyzframeprocessor

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin

class XyzFrameProcessorPluginPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> = emptyList()

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> = emptyList()

    override fun createFrameProcessorPlugins(): List<FrameProcessorPlugin> {
        return listOf(
            object : FrameProcessorPlugin {
                override fun callback(frame: com.mrousavy.camera.frameprocessors.Frame, arguments: Map<String, Any>?): Any? {
                    return XyzFrameProcessorPlugin(VisionCameraProxy(), arguments).callback(frame, arguments)
                }
            }
        )
    }
}