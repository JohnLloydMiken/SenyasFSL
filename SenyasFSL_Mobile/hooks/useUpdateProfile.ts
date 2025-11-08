// hooks/useUpdateProfile.ts
import { useState } from 'react';
import { reauthenticateUser, updateUserProfile } from '@/services/AuthService';
import { UpdateUserProfileData } from '@/shared/types/auth'; // Make sure this path is correct
import { useAuthStore } from '@/utils/store/useAuthStore'; // Or however you get the auth user

export const useUpdateProfile = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<Error | null>(null);
  const { user } = useAuthStore(); // Get the Firebase user object

  const updateProfile = async (
    newUsername: string,
    defaultUsername: string,
    currentPassword: string
  ) => {
    setIsSaving(true);
    setSaveError(null);

    try {
      // 1. Re-authenticate the user
      // This is critical for security
      await reauthenticateUser(currentPassword);

      // 2. Check if username actually changed
      const dataToUpdate: UpdateUserProfileData = {};
      if (newUsername !== defaultUsername) {
        dataToUpdate.newUsername = newUsername;
      }

      // 3. If there are changes, call the update function
      if (Object.keys(dataToUpdate).length > 0) {
        await updateUserProfile(dataToUpdate);
        
        // 4. Refresh the user's token to get new claims (like new username)
        // This logic is from the web hook and is important
        if (user) {
          await user.getIdToken(true);
        }
      } else {
        console.log("No profile changes detected, skipping update call.");
      }

      setIsSaving(false);
      return true; // Success
    } catch (error) {
      console.error("Profile update failed:", error);
      setIsSaving(false);
      setSaveError(error as Error);
      throw error; // Re-throw for the component to catch
    }
  };

  return { updateProfile, isSaving, saveError };
};