import React, { useEffect, useState } from 'react';
import { 
    Platform, 
    StyleSheet, 
    Text, 
    View,
    NativeModules, 
    NativeEventEmitter,
    Alert 
} from 'react-native';
import {
    Camera,
    Frame,
    useCameraDevice,
    useCameraPermission,
    useSkiaFrameProcessor,
    VisionCameraProxy,
} from 'react-native-vision-camera';

const { HandLandmarks } = NativeModules;
const handLandmarksEmitter = new NativeEventEmitter(HandLandmarks);

// Initialize the frame processor plugin 'handLandmarks'
const handLandMarkPlugin = VisionCameraProxy.initFrameProcessorPlugin(
    'handLandmarks',
    {},
);

// Create a worklet function 'handLandmarks' that will call the plugin function
function handLandmarks(frame: Frame) {
    'worklet';
    if (handLandMarkPlugin == null) {
        throw new Error('Failed to load Frame Processor Plugin!');
    }
    return handLandMarkPlugin.call(frame);
}

function FSLTest() {
    const [detectedSign, setDetectedSign] = useState('No sign detected');
    const [isModelReady, setIsModelReady] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const device = useCameraDevice('front');
    const { hasPermission, requestPermission } = useCameraPermission();

    useEffect(() => {
        // Request camera permission on component mount
        requestPermission().catch(error => {
            console.log('Camera permission error:', error);
            setErrorMessage('Camera permission denied');
        });
    }, [requestPermission]);

    useEffect(() => {
        // Set up event listeners for HandLandmarks native module
        
        // Listen for FSL predictions
        const signDetectionSubscription = handLandmarksEmitter.addListener(
            'onSignLanguageDetected',
            event => {
                console.log("Detected FSL sign:", event.prediction);
                setDetectedSign(event.prediction);
                // You can add more handling here like:
                // - Show visual feedback
                // - Play sound
                // - Save to history
                // - Send to server
            }
        );

        // Listen for model status updates
        const statusSubscription = handLandmarksEmitter.addListener(
            'onHandLandmarksStatus',
            event => {
                console.log("HandLandmarks Status:", event.status);
                if (event.status.includes('initialized')) {
                    setIsModelReady(true);
                }
            }
        );

        // Listen for errors
        const errorSubscription = handLandmarksEmitter.addListener(
            'onHandLandmarksError',
            event => {
                console.log("HandLandmarks Error:", event.error);
                setErrorMessage(event.error);
                Alert.alert('Error', event.error);
            }
        );

        // Optional: Listen for landmark data (if you want to use it)
        const landmarkSubscription = handLandmarksEmitter.addListener(
            'onHandLandmarksDetected',
            event => {
                // This gives you the raw landmark data if needed
                // console.log("Landmarks:", event.landmarks);
                // console.log("Hand:", event.hand);
            }
        );

        // Clean up event listeners when component is unmounted
        return () => {
            signDetectionSubscription.remove();
            statusSubscription.remove();
            errorSubscription.remove();
            landmarkSubscription.remove();
        };
    }, []);

    const frameProcessor = useSkiaFrameProcessor(frame => {
        'worklet';
        frame.render();
        
        // Process the frame using the 'handLandmarks' function
        try {
            handLandmarks(frame);
        } catch (error) {
            console.log('Frame processing error:', error);
        }
    }, []);

    // Show loading if no permission
    if (!hasPermission) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>
                    Camera permission required for FSL recognition
                </Text>
            </View>
        );
    }

    // Show loading if no camera device
    if (device == null) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>
                    No camera device available
                </Text>
            </View>
        );
    }

    const pixelFormat = Platform.OS === 'ios' ? 'rgb' : 'yuv';

    return (
        <View style={styles.container}>
            {/* Camera View */}
            <Camera
                style={styles.camera}
                device={device}
                isActive={true}
                frameProcessor={frameProcessor}
                pixelFormat={pixelFormat}
            />
            
            {/* Overlay UI */}
            <View style={styles.overlay}>
                {/* Status Indicator */}
                <View style={styles.statusContainer}>
                    <View style={[
                        styles.statusIndicator, 
                        { backgroundColor: isModelReady ? '#4CAF50' : '#FF9800' }
                    ]} />
                    <Text style={styles.statusText}>
                        {isModelReady ? 'Model Ready' : 'Loading Model...'}
                    </Text>
                </View>

                {/* Error Message */}
                {errorMessage ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    </View>
                ) : null}

                {/* Sign Detection Result */}
                <View style={styles.resultContainer}>
                    <Text style={styles.resultLabel}>Detected Sign:</Text>
                    <Text style={styles.resultText}>{detectedSign}</Text>
                </View>

                {/* Instructions */}
                <View style={styles.instructionsContainer}>
                    <Text style={styles.instructionsText}>
                        Hold your hand steady in front of the camera
                    </Text>
                    <Text style={styles.instructionsSubtext}>
                        Model will continuously analyze hand gestures
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    message: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'white',
        fontSize: 16,
        paddingHorizontal: 20,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 12,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    statusText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    errorContainer: {
        backgroundColor: 'rgba(244, 67, 54, 0.9)',
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
    },
    errorText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
    },
    resultContainer: {
        position: 'absolute',
        bottom: 120,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    resultLabel: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    resultText: {
        color: '#4CAF50',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    instructionsContainer: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        alignItems: 'center',
    },
    instructionsText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 4,
    },
    instructionsSubtext: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
        textAlign: 'center',
    },
});

export default FSLTest;