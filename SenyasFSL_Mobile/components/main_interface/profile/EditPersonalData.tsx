// components/main_interface/profile/EditPersonalData.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useUsernameValidation } from '@/hooks/useUsernameValidation';
import { useUpdateProfile } from '@/hooks/useUpdateProfile';
import { useAuthStore } from '@/utils/store/useAuthStore';
import { useBottomSheet } from '@/modules/contextProvider';

const EditPersonalData = () => {
  const { closeSheet } = useBottomSheet(); 
  const { user } = useAuthStore();

  const defaultUsername = user?.displayName || ''; 
  // Get the current email notification preference with default value of true
  const defaultEmailNotifications = user?.preferences?.emailNotifications ?? true;

  const [currentPassword, setCurrentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [emailNotifications, setEmailNotifications] = useState<boolean>(defaultEmailNotifications);

  const {
    username,
    setUsername,
    status: usernameStatus,
    isValidFormat,
  } = useUsernameValidation(defaultUsername);

  const { updateProfile, isSaving, saveError } = useUpdateProfile();

  const isUnchanged = 
    username === defaultUsername && 
    emailNotifications === defaultEmailNotifications;

  useEffect(() => {
    if (saveError) {
      setLocalError(saveError.message);
      setCurrentPassword('');
    }
  }, [saveError]);

  const handleSubmit = async () => {
    setLocalError('');

    if (!isValidFormat) {
      setLocalError("Invalid username. Use 3–20 lowercase letters, numbers, underscores, or hyphens.");
      return;
    }
    if (!isUnchanged && usernameStatus === 'taken') {
      setLocalError("This username is already taken.");
      return;
    }
    if (currentPassword.trim() === '') {
      setLocalError('Please fill out your current password to save changes.');
      return;
    }

    try {
      await updateProfile(
        username.trim(), 
        defaultUsername, 
        currentPassword,
        emailNotifications
      );
      Alert.alert('Success', 'Profile updated successfully!');
      closeSheet(); 
    } catch (error) {
      // Error is handled by the useEffect above
    }
  };

  const renderUsernameFeedback = () => {
    if (username === defaultUsername) return null;
    switch (usernameStatus) {
      case 'checking':
        return <Text style={styles.feedbackText}>Checking availability…</Text>;
      case 'available':
        return <Text style={[styles.feedbackText, { color: '#28a745' }]}>Username is available!</Text>;
      case 'taken':
        return <Text style={[styles.feedbackText, { color: '#dc3545' }]}>This username is already taken.</Text>;
      case 'invalid':
        return <Text style={[styles.feedbackText, { color: '#dc3545' }]}>Invalid username format.</Text>;
      default:
        return null;
    }
  };

  const isButtonDisabled =
    isSaving ||
    isUnchanged ||
    (username !== defaultUsername &&
      (usernameStatus === 'checking' || usernameStatus === 'taken' || !isValidFormat));

  return (
    <View style={styles.contentContainer}>
      <Text style={styles.headerText}>Edit personal data</Text>

      {localError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{localError}</Text>
        </View>
      ) : null}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter username"
          autoCapitalize="none"
        />
        {renderUsernameFeedback()}
      </View>

      {/* Email Notifications Toggle */}
      <View style={styles.notificationContainer}>
        <View style={styles.notificationTextContainer}>
          <Text style={styles.notificationLabel}>Daily Email Reminders</Text>
          <Text style={styles.notificationHelper}>Get notified about your streak</Text>
        </View>
        <TouchableOpacity
          onPress={() => setEmailNotifications(!emailNotifications)}
          style={styles.checkboxContainer}
          activeOpacity={0.7}
        >
          <View style={[
            styles.checkbox,
            emailNotifications && styles.checkboxChecked
          ]}>
            {emailNotifications && (
              <Ionicons name="checkmark" size={16} color="#fff" />
            )}
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Current password</Text>
        <Text style={styles.helperText}>Type in your password to confirm changes</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="••••••••"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color="#777" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, isButtonDisabled && styles.saveButtonDisabled]}
        onPress={handleSubmit}
        disabled={isButtonDisabled}
      >
        {isSaving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save changes</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorBanner: {
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  errorBannerText: {
    color: '#dc3545',
    fontSize: 14,
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  helperText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D5DDE5',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  feedbackText: {
    fontSize: 13,
    color: '#666',
    marginTop: 6,
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(251, 153, 15, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(251, 153, 15, 0.2)',
    marginBottom: 20,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  notificationHelper: {
    fontSize: 12,
    color: '#666',
  },
  checkboxContainer: {
    padding: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#D5DDE5',
    borderRadius: 4,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#FB990F',
    borderColor: '#FB990F',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D5DDE5',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
  },
  eyeIcon: {
    marginLeft: 10,
    padding: 5,
  },
  saveButton: {
    backgroundColor: '#FB990F',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default EditPersonalData;